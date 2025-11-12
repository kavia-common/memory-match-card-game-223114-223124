import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Card from './Card';
import Header from './Header';
import WinModal from './WinModal';
import './gameboard.css';

/**
 * PUBLIC_INTERFACE
 * GameBoard
 * Manages memory match game state, layout, timer, moves, and win modal.
 */
export default function GameBoard() {
  // Pair values (16 cards = 8 pairs)
  const values = useMemo(
    () => ['🐙', '🦀', '🐳', '🐠', '🐬', '🐚', '🦑', '🧭'],
    []
  );

  // Helper to create a shuffled deck of pairs
  const makeDeck = useCallback(() => {
    const pairValues = [...values, ...values];
    for (let i = pairValues.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairValues[i], pairValues[j]] = [pairValues[j], pairValues[i]];
    }
    return pairValues;
  }, [values]);

  const [deck, setDeck] = useState(makeDeck);
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
    }
  }, [matchedIndices.length, deck.length]);

  const resetGame = useCallback(() => {
    setDeck(makeDeck());
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
          }, 350);
        } else {
          // Flip back after short delay
          setTimeout(() => {
            setFlippedIndices([]);
            setLockBoard(false);
          }, 750);
        }
      }
    },
    [deck, flippedIndices, lockBoard, matchedIndices]
  );

  return (
    <div className="container">
      <Header
        moves={moves}
        seconds={seconds}
        onReset={resetGame}
        isDisabled={lockBoard}
      />

      <main className="mm-game" role="main" aria-label="Memory match game area">
        <div
          className="mm-grid"
          role="grid"
          aria-label="Cards grid"
          aria-rowcount={4}
          aria-colcount={4}
        >
          {deck.map((val, idx) => {
            const isFlipped = flippedIndices.includes(idx);
            const isMatched = matchedIndices.includes(idx);
            const row = Math.floor(idx / 4) + 1;
            const col = (idx % 4) + 1;

            return (
              <div
                key={`${val}-${idx}`}
                role="gridcell"
                aria-rowindex={row}
                aria-colindex={col}
                className="mm-grid-cell"
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
    </div>
  );
}
