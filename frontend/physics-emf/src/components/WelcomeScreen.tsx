import { motion } from 'motion/react';
import { Zap, ArrowRight } from 'lucide-react';
import { FC } from 'react';

export const WelcomeScreen: FC<{ onStart: () => void }> = ({ onStart }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex flex-col items-center justify-center min-h-screen p-6 text-center max-w-2xl mx-auto"
  >
    <div className="bg-blue-100 p-6 rounded-full mb-8 relative">
      <Zap className="w-16 h-16 text-blue-600 relative z-10" />
      <motion.div 
        className="absolute inset-0 bg-blue-400 rounded-full opacity-20"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
    <h1 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight">EMF Explorer</h1>
    <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
      Master the concepts of <span className="text-blue-600 font-bold">Electromotive Force</span> and <span className="text-yellow-600 font-bold">Potential Difference</span> by becoming a charge in a circuit.
    </p>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 w-full max-w-lg text-left">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="font-bold text-slate-800 mb-1">1. The Battery</div>
        <div className="text-sm text-slate-500">Gain energy (EMF)</div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="font-bold text-slate-800 mb-1">2. The Circuit</div>
        <div className="text-sm text-slate-500">Spend energy (p.d.)</div>
      </div>
    </div>

    <button 
      onClick={onStart}
      className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95"
    >
      Start Journey
      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
    </button>
  </motion.div>
);
