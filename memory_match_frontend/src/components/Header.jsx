import React from 'react';
import PropTypes from 'prop-types';
import './header.css';

/**
 * PUBLIC_INTERFACE
 * Header
 * Displays game title, moves, time, difficulty selector, mute toggle, and reset control.
 */
export default function Header({
  moves,
  seconds,
  onReset,
  isDisabled,
  difficulty,
  onChangeDifficulty,
  isMuted,
  onToggleMute,
}) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="mm-header" role="region" aria-label="Game status bar">
      <div className="mm-title-group">
        <h1 className="mm-title">Memory Match</h1>
        <p className="mm-subtitle">Find all the pairs with the least moves</p>
      </div>
      <div className="mm-stats">
        <div className="mm-pill" aria-label={`Moves: ${moves}`}>
          <span className="mm-pill-label">Moves</span>
          <span className="mm-pill-value">{moves}</span>
        </div>
        <div className="mm-pill" aria-label={`Time: ${timeStr}`}>
          <span className="mm-pill-label">Time</span>
          <span className="mm-pill-value">{timeStr}</span>
        </div>

        <label className="mm-select" aria-label="Select difficulty">
          <span className="sr-only">Difficulty</span>
          <select
            value={difficulty}
            onChange={(e) => onChangeDifficulty(e.target.value)}
            disabled={isDisabled}
            aria-disabled={isDisabled}
          >
            <option value="easy">Easy 4x4</option>
            <option value="medium">Medium 4x5</option>
            <option value="hard">Hard 6x6</option>
          </select>
        </label>

        <button
          type="button"
          className="btn transparent"
          onClick={onToggleMute}
          aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          aria-pressed={isMuted}
        >
          {isMuted ? '🔇 Mute' : '🔊 Sound'}
        </button>

        <button
          type="button"
          className="btn"
          onClick={onReset}
          aria-label="Reset game"
          disabled={isDisabled}
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}

Header.propTypes = {
  moves: PropTypes.number.isRequired,
  seconds: PropTypes.number.isRequired,
  onReset: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  difficulty: PropTypes.oneOf(['easy', 'medium', 'hard']).isRequired,
  onChangeDifficulty: PropTypes.func.isRequired,
  isMuted: PropTypes.bool.isRequired,
  onToggleMute: PropTypes.func.isRequired,
};

Header.defaultProps = {
  isDisabled: false,
};
