import { motion } from 'motion/react';
import { RotateCcw, Zap, Trophy } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../types';
import { FC } from 'react';

export const SummaryScreen: FC<{ onRestart: () => void, score: number }> = ({ onRestart, score }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center min-h-screen p-6 text-center max-w-2xl mx-auto"
  >
    <div className="bg-yellow-100 p-8 rounded-full mb-8 shadow-inner relative">
      <Trophy className="w-20 h-20 text-yellow-600" />
      <motion.div 
        className="absolute -top-2 -right-2 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        {Math.round((score / QUIZ_QUESTIONS.length) * 100)}%
      </motion.div>
    </div>
    
    <h1 className="text-4xl font-bold text-slate-900 mb-2">Mission Complete!</h1>
    <p className="text-xl text-slate-600 mb-8">
      You scored <span className="font-bold text-slate-900">{score}</span> out of <span className="font-bold text-slate-900">{QUIZ_QUESTIONS.length}</span> on the quiz.
    </p>
    
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 w-full mb-10 text-left">
      <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Quick Recap</h3>
      <ul className="space-y-3 text-slate-600">
        <li className="flex items-start gap-2">
          <span className="text-green-500 font-bold">✓</span>
          <span>EMF is energy supplied TO the charge (in the battery).</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-500 font-bold">✓</span>
          <span>P.D. is energy transferred FROM the charge (in components).</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-500 font-bold">✓</span>
          <span>Both are measured in Volts (Joules per Coulomb).</span>
        </li>
      </ul>
    </div>

    <button 
      onClick={onRestart}
      className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
    >
      <RotateCcw className="w-5 h-5" />
      Play Again
    </button>
  </motion.div>
);
