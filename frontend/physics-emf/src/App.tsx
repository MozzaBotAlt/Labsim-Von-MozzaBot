import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { GameState } from './types';
import { WelcomeScreen } from './components/WelcomeScreen';
import { BatteryLevel } from './components/BatteryLevel';
import { CircuitLevel } from './components/CircuitLevel';
import { QuizLevel } from './components/QuizLevel';
import { SummaryScreen } from './components/SummaryScreen';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 overflow-hidden">
      <AnimatePresence mode="wait">
        {gameState === 'welcome' && (
          <WelcomeScreen key="welcome" onStart={() => setGameState('battery')} />
        )}
        {gameState === 'battery' && (
          <BatteryLevel key="battery" onComplete={() => setGameState('circuit')} />
        )}
        {gameState === 'circuit' && (
          <CircuitLevel key="circuit" onComplete={() => setGameState('quiz')} />
        )}
        {gameState === 'quiz' && (
          <QuizLevel key="quiz" onComplete={(finalScore) => {
            setScore(finalScore);
            setGameState('summary');
          }} />
        )}
        {gameState === 'summary' && (
          <SummaryScreen key="summary" score={score} onRestart={() => setGameState('welcome')} />
        )}
      </AnimatePresence>
    </div>
  );
}
