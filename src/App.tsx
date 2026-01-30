import { GameLayout } from './components/GameLayout';
import { useGameLoop, useSaveOnUnload } from './hooks/useGameLoop';
import { useGameStore } from './store/gameStore';
import { useEffect } from 'react';

function App() {
  // Start the game loop
  useGameLoop();
  
  // Save on page unload
  useSaveOnUnload();
  
  // Load saved game on mount
  const loadGame = useGameStore(state => state.loadGame);
  
  useEffect(() => {
    const loaded = loadGame();
    if (loaded) {
      console.log('Game loaded successfully');
    } else {
      console.log('No save found, starting new game');
    }
  }, [loadGame]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <GameLayout />
    </div>
  );
}

export default App;