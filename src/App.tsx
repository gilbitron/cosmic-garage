import { useEffect, useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { GameLayout } from './components/GameLayout';
import { LoadingScreen } from './components/LoadingScreen';
import { ToastProvider, useToast } from './components/Toast';
import { useGameLoop, useSaveOnUnload } from './hooks/useGameLoop';
import { useAchievements } from './hooks/useAchievements';
import { useGameStore } from './store/gameStore';
import { formatNumber, formatTime } from './utils/formatters';

function GameInner() {
  const [ready, setReady] = useState(false);

  useGameLoop();
  useSaveOnUnload();
  useAchievements();

  const loadGame = useGameStore((s) => s.loadGame);
  const { showToast } = useToast();
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const savedRaw = localStorage.getItem('cosmic-garage-save');
    let prevCredits = 0;
    let timestamp = 0;
    if (savedRaw) {
      try {
        const parsed = JSON.parse(savedRaw);
        prevCredits = parsed.state?.resources?.credits || 0;
        timestamp = parsed.timestamp || 0;
      } catch { /* ignore */ }
    }

    const success = loadGame();

    if (success && timestamp) {
      const offlineSecs = (Date.now() - timestamp) / 1000;
      if (offlineSecs > 60) {
        const state = useGameStore.getState();
        const gained = state.resources.credits - prevCredits;
        if (gained > 1) {
          showToast(
            `Welcome back! You earned ₡${formatNumber(gained)} while away (${formatTime(Math.min(offlineSecs, 86400))})`,
            '🌙',
            6000
          );
        }
      }
    }

    // Brief loading screen so layout doesn't flash
    setTimeout(() => setReady(true), 300);
  }, [loadGame, showToast]);

  if (!ready) return <LoadingScreen />;
  return <GameLayout />;
}

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <GameInner />
        <Analytics />
      </div>
    </ToastProvider>
  );
}

export default App;
