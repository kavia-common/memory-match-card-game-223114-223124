# Memory Match - Ocean Professional

A minimal, responsive memory match card game built with React and vanilla CSS, following the Ocean Professional theme.

## Features
- Flippable cards with smooth 3D animations and subtle hover/press states
- Move counter and game timer (starts on first flip, stops on win)
- Reset button and win modal with stats and confetti celebration
- Difficulty levels: Easy (4x4), Medium (4x5), Hard (6x6)
- Optional sound effects (flip, match, win) with a mute toggle
- Accessible controls (aria labels, focus styles, keyboard navigable)
- Responsive layout with subtle shadows and rounded corners

## Scripts
- `npm start` - run locally at http://localhost:3000
- `npm test` - run tests
- `npm run build` - production build

## Notes
- No backend calls or external services (sound uses WebAudio API; no remote assets)
- Respects existing REACT_APP_* environment variables (none required)
- Theme variables: see `src/styles/theme.css`
