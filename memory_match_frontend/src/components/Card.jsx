import React from 'react';
import PropTypes from 'prop-types';
import './card.css';

/**
 * PUBLIC_INTERFACE
 * Card
 * A flippable card with front/back faces, 3D flip animation, and accessibility.
 */
export default function Card({ value, isFlipped, isMatched, disabled, onClick, index }) {
  const handleClick = () => {
    if (!disabled && !isMatched) {
      onClick(index);
    }
  };

  return (
    <button
      type="button"
      className={`mm-card ${isFlipped || isMatched ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
      onClick={handleClick}
      aria-pressed={isFlipped || isMatched}
      aria-label={isMatched ? `Card ${index + 1} matched` : `Flip card ${index + 1}`}
      disabled={disabled || isMatched}
      tabIndex={disabled ? -1 : 0}
    >
      <div className="mm-card-inner">
        <div className="mm-card-face mm-card-back" aria-hidden={isFlipped || isMatched ? 'true' : 'false'}>
          <span className="mm-card-backmark" aria-hidden="true">◆</span>
        </div>
        <div className="mm-card-face mm-card-front" aria-hidden={isFlipped || isMatched ? 'false' : 'true'}>
          <span className="mm-card-value" role="img" aria-label="card symbol">
            {value}
          </span>
        </div>
      </div>
    </button>
  );
}

Card.propTypes = {
  value: PropTypes.string.isRequired,
  isFlipped: PropTypes.bool.isRequired,
  isMatched: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

Card.defaultProps = {
  disabled: false,
};
