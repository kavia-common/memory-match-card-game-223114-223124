import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Card from './Card';
import Header from './Header';
import WinModal from './WinModal';
import './gameboard.css';

/**
 * PUBLIC_INTERFACE
 * GameBoard
 * Manages memory match game state, layout, timer, moves, sounds, difficulty, animations, and win modal.
 */
export default function GameBoard() {
  // Base symbol pool (expandable)
  const symbolPool = useMemo(
    () => ['🐙','🦀','🐳','🐠','🐬','🐚','🦑','🧭','🦈','🪸','⚓','🌊','🧜','🐡','🦞','🚢','🪼','🐋'],
    []
  );

  // Difficulty config
  const [difficulty, setDifficulty] = useState('easy'); // easy:4x4, medium:4x5, hard:6x6
  const difficultyMap = useMemo(() => ({
    easy: { cols: 4, rows: 4, pairs: 8 },
    medium: { cols: 4, rows: 5, pairs: 10 },
    hard: { cols: 6, rows: 6, pairs: 18 },
  }), []);

  // Sounds with mute toggle (no external services; simple oscillator or Audio API with data URIs)
  const [isMuted, setIsMuted] = useState(false);
  const flipAudioRef = useRef(null);
  const matchAudioRef = useRef(null);
  const winAudioRef = useRef(null);

  // Light-weight synthesized tones using WebAudio API
  const audioCtxRef = useRef(null);
  const playTone = useCallback((freq = 440, duration = 0.08, type = 'sine', volume = 0.03) => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new Ctx();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = volume;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // ignore audio errors silently to preserve UX
    }
  }, [isMuted]);

  const playFlip = useCallback(() => playTone(380, 0.06, 'sine', 0.035), [playTone]);
  const playMatch = useCallback(() => {
    playTone(520, 0.08, 'triangle', 0.04);
    setTimeout(() => playTone(660, 0.08, 'triangle', 0.04), 70);
  }, [playTone]);
  const playWin = useCallback(() => {
    // small arpeggio
    [660, 880, 990].forEach((f, i) => setTimeout(() => playTone(f, 0.1, 'square', 0.045), i * 120));
  }, [playTone]);

  // Helper to create a shuffled deck of pairs given difficulty
  const makeDeck = useCallback((diffKey) => {
    const { pairs } = difficultyMap[diffKey];
    const chosen = symbolPool.slice(0, pairs);
    const pairValues = [...chosen, ...chosen];
    for (let i = pairValues.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairValues[i], pairValues[j]] = [pairValues[j], pairValues[i]];
    }
    return pairValues;
  }, [difficultyMap, symbolPool]);

  const [deck, setDeck] = useState(() => makeDeck('easy'));
  const [flippedIndices, setFlippedIndices] = useState([]); // currently flipped (max 2)
  const [matchedIndices, setMatchedIndices] = useState([]); // indices that are matched
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [lockBoard, setLockBoard] = useState(false);
  const [win, setWin] = useState(false);

  // Timer
  const intervalRef = useRef(null);
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  // Start timer on first flip
  useEffect(() => {
    if (!running && (flippedIndices.length > 0 || matchedIndices.length > 0)) {
      setRunning(true);
    }
  }, [flippedIndices.length, matchedIndices.length, running]);

  // Check win condition
  useEffect(() => {
    if (matchedIndices.length === deck.length && deck.length > 0) {
      setRunning(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setWin(true);
      playWin();
    }
  }, [matchedIndices.length, deck.length, playWin]);

  const resetGame = useCallback(() => {
    setDeck(makeDeck(difficulty));
    setFlippedIndices([]);
    setMatchedIndices([]);
    setMoves(0);
    setSeconds(0);
    setRunning(false);
    setWin(false);
    setLockBoard(false);
  }, [difficulty, makeDeck]);

  const changeDifficulty = useCallback((newDiff) => {
    setDifficulty(newDiff);
    // Reset with new deck immediately
    setDeck(makeDeck(newDiff));
    setFlippedIndices([]);
    setMatchedIndices([]);
    setMoves(0);
    setSeconds(0);
    setRunning(false);
    setWin(false);
    setLockBoard(false);
  }, [makeDeck]);

  const onCardClick = useCallback(
    (index) => {
      if (lockBoard) return;
      if (flippedIndices.includes(index)) return;
      if (matchedIndices.includes(index)) return;

      // play flip for each card flip
      playFlip();

      const nextFlipped = [...flippedIndices, index];
      setFlippedIndices(nextFlipped);

      if (nextFlipped.length === 2) {
        setLockBoard(true);
        setMoves((m) => m + 1);
        const [a, b] = nextFlipped;
        const isMatch = deck[a] === deck[b];

        if (isMatch) {
          // Keep flipped and mark matched
          setTimeout(() => {
            setMatchedIndices((prev) => [...prev, a, b]);
            setFlippedIndices([]);
            setLockBoard(false);
            playMatch();
          }, 320);
        } else {
          // Flip back after short delay
          setTimeout(() => {
            setFlippedIndices([]);
            setLockBoard(false);
          }, 720);
        }
      }
    },
    [deck, flippedIndices, lockBoard, matchedIndices, playFlip, playMatch]
  );

  const { cols, rows } = difficultyMap[difficulty];

  return (
    <div className="container">
      <Header
        moves={moves}
        seconds={seconds}
        onReset={resetGame}
        isDisabled={lockBoard}
        difficulty={difficulty}
        onChangeDifficulty={changeDifficulty}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((m) => !m)}
      />

      <main className="mm-game" role="main" aria-label="Memory match game area">
        <div
          className={`mm-grid mm-grid-${cols}x${rows}`}
          role="grid"
          aria-label="Cards grid"
          aria-rowcount={rows}
          aria-colcount={cols}
        >
          {deck.map((val, idx) => {
            const isFlipped = flippedIndices.includes(idx);
            const isMatched = matchedIndices.includes(idx);
            const row = Math.floor(idx / cols) + 1;
            const col = (idx % cols) + 1;

            return (
              <div
                key={`${val}-${idx}`}
                role="gridcell"
                aria-rowindex={row}
                aria-colindex={col}
                className="mm-grid-cell"
                style={{ animationDelay: `${(idx % cols) * 40 + Math.floor(idx / cols) * 30}ms` }}
              >
                <Card
                  value={val}
                  isFlipped={isFlipped}
                  isMatched={isMatched}
                  disabled={lockBoard}
                  onClick={onCardClick}
                  index={idx}
                />
              </div>
            );
          })}
        </div>
      </main>

      <WinModal
        open={win}
        moves={moves}
        seconds={seconds}
        onPlayAgain={resetGame}
      />

      {/* Confetti overlay (pure CSS dots) shown on win */}
      {win && (
        <div aria-hidden="true" className="mm-confetti" />
      )}
    </div>
  );
}
