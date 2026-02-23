import { useState, FC } from 'react';
import { motion } from 'motion/react';
import { Lightbulb, ArrowRight, Info, ZapOff } from 'lucide-react';

export const CircuitLevel: FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [energy, setEnergy] = useState(100);
  const [clicks, setClicks] = useState(0);
  
  const transferEnergy = () => {
    if (energy > 0) {
      setEnergy(prev => Math.max(prev - 10, 0));
      setClicks(prev => prev + 1);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-4 max-w-5xl mx-auto"
    >
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-600" />
          The Load (Bulb)
        </h2>
        <div className="bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full font-mono text-sm font-medium">
          Stage 2: Potential Difference
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-center w-full">
        {/* Left Panel: Instructions */}
        <div className="space-y-6 order-2 lg:order-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-3 text-slate-900">Transfer Energy</h3>
            <p className="text-slate-600 mb-4 leading-relaxed">
              You are now passing through a component. You must do work to get through, converting your electrical energy into light and heat.
            </p>
            <p className="text-slate-600 mb-4 leading-relaxed">
              This loss of energy per unit charge is the <strong>Potential Difference (p.d.)</strong>.
            </p>
            
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mb-4">
              <div className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-1">Key Formula</div>
              <div className="font-mono text-lg text-yellow-900">
                p.d. (V) = <span className="text-green-600">Energy Transferred (W)</span> / <span className="text-yellow-600">Charge (Q)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
              <Info className="w-4 h-4" />
              <span>Tap the button repeatedly to power the bulb!</span>
            </div>
          </div>

          <button
            onClick={transferEnergy}
            disabled={energy === 0}
            className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {energy === 0 ? 'Energy Depleted' : 'Transfer Energy to Bulb'}
            <ZapOff className={`w-5 h-5 ${energy > 0 ? '' : 'opacity-50'}`} />
          </button>
        </div>

        {/* Right Panel: Visualization */}
        <div className="relative bg-slate-900 rounded-3xl h-[500px] w-full flex flex-col items-center justify-center overflow-hidden border-4 border-slate-700 shadow-2xl order-1 lg:order-2">
          
          {/* Filament */}
          <svg className="absolute w-full h-full pointer-events-none" viewBox="0 0 400 400">
             <path d="M 100 400 Q 100 200 200 200 Q 300 200 300 400" fill="none" stroke="#334155" strokeWidth="4" />
          </svg>

          {/* Bulb Glow Effect */}
          <motion.div 
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-yellow-400 blur-[60px]"
            animate={{ 
              opacity: (100 - energy) / 100,
              scale: 0.5 + ((100 - energy) / 100)
            }}
          />

          {/* The Bulb Itself */}
          <div className="relative z-10">
             <Lightbulb 
                className="w-48 h-48 text-slate-700 transition-colors duration-300" 
                style={{ 
                    color: energy < 100 ? `rgba(250, 204, 21, ${(100-energy)/100})` : undefined,
                    filter: `drop-shadow(0 0 ${(100-energy)/2}px rgba(250, 204, 21, 0.8))`
                }}
             />
          </div>

          {/* Player Character */}
          <motion.div 
            className="absolute bottom-10 z-30"
            animate={{ 
              x: (100 - energy) * 2 - 100, // Move across
              scale: 1 + (energy / 200), // Shrink
              filter: `grayscale(${(100-energy)}%)` // Lose color
            }}
          >
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg relative transition-colors duration-500"
                 style={{ backgroundColor: `hsl(48, ${energy}%, 50%)` }}>
              <span className="font-bold text-yellow-900 text-xl">Q</span>
            </div>
          </motion.div>

          {/* Voltage Text */}
          <div className="absolute top-8 right-8 text-right">
            <div className="text-slate-400 text-xs font-mono mb-1">POTENTIAL</div>
            <div className="font-mono text-3xl font-bold text-white">
              {(energy / 100 * 12).toFixed(1)}V
            </div>
          </div>

          {/* Success Overlay */}
          {energy === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center"
            >
              <div className="text-center p-6">
                <h3 className="text-3xl font-bold text-white mb-2">Work Done!</h3>
                <p className="text-slate-300 mb-6">You have transferred all your energy.</p>
                <button 
                  onClick={onComplete}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg flex items-center gap-2 mx-auto transition-transform hover:scale-105"
                >
                  Take Quiz
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
