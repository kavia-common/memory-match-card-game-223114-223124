import React, { useEffect } from 'react';
import './styles/theme.css';
import './index.css';
import GameBoard from './components/GameBoard';

/**
 * PUBLIC_INTERFACE
 * App
 * Root of the Memory Match game. Applies base theming and renders GameBoard.
 */
function App() {
  useEffect(() => {
    // Set light theme defaults on mount (Ocean Professional palette)
    document.documentElement.style.setProperty('color-scheme', 'light');
  }, []);

  return (
    <div aria-label="Memory Match App">
      <GameBoard />
    </div>
  );
}

export default App;
