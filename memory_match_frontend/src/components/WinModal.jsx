import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './winmodal.css';

/**
 * PUBLIC_INTERFACE
 * WinModal
 * Accessible modal dialog displayed when the game is won.
 */
export default function WinModal({ open, moves, seconds, onPlayAgain }) {
  const dialogRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    if (open) {
      // Focus the button when modal opens for accessibility
      btnRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="mm-modal-overlay" role="presentation" aria-hidden={!open}>
      <div
        className="mm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="win-title"
        aria-describedby="win-desc"
        ref={dialogRef}
      >
        <div className="mm-modal-header">
          <h2 id="win-title">You matched all pairs! 🎉</h2>
        </div>
        <p id="win-desc" className="mm-modal-desc">
          Great job! Here are your stats for this round.
        </p>
        <div className="mm-modal-stats">
          <div className="mm-modal-stat">
            <span className="label">Moves</span>
            <span className="value">{moves}</span>
          </div>
          <div className="mm-modal-stat">
            <span className="label">Time</span>
            <span className="value">{timeStr}</span>
          </div>
        </div>
        <div className="mm-modal-actions">
          <button
            type="button"
            className="btn"
            onClick={onPlayAgain}
            aria-label="Play again"
            ref={btnRef}
          >
            ▶ Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

WinModal.propTypes = {
  open: PropTypes.bool.isRequired,
  moves: PropTypes.number.isRequired,
  seconds: PropTypes.number.isRequired,
  onPlayAgain: PropTypes.func.isRequired,
};
