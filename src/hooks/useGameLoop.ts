import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

/**
 * Game loop hook that runs at 60 FPS and updates the game state
 * Includes auto-save every 30 seconds
 */
export const useGameLoop = () => {
  const tick = useGameStore(state => state.tick);
  const saveGame = useGameStore(state => state.saveGame);
  const lastSaveTime = useRef(Date.now());
  
  useEffect(() => {
    let animationFrameId: number;
    
    const gameLoop = () => {
      // Update game state
      tick();
      
      // Auto-save every 30 seconds
      const now = Date.now();
      if (now - lastSaveTime.current > 30000) {
        saveGame();
        lastSaveTime.current = now;
      }
      
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    // Start the game loop
    animationFrameId = requestAnimationFrame(gameLoop);
    
    // Cleanup on unmount
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [tick, saveGame]);
};

/**
 * Save game hook to persist state on page unload
 */
export const useSaveOnUnload = () => {
  const saveGame = useGameStore(state => state.saveGame);
  
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveGame();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveGame]);
};