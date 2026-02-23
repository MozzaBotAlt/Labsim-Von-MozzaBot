import { useState, useEffect, FC } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Battery, Zap, ArrowRight, Info } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
}

export const BatteryLevel: FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [energy, setEnergy] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const targetEnergy = 100;

  // Spawn particles
  useEffect(() => {
    if (energy >= targetEnergy) {
      setParticles([]);
      return;
    }

    const interval = setInterval(() => {
      if (particles.length < 5) {
        setParticles(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 80 + 10, // 10% to 90%
          y: 100 // Start at bottom
        }]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [particles.length, energy]);

  const collectParticle = (id: number) => {
    setParticles(prev => prev.filter(p => p.id !== id));
    setEnergy(prev => Math.min(prev + 15, targetEnergy));
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
          <Battery className="w-6 h-6 text-green-600" />
          Inside the Battery
        </h2>
        <div className="bg-green-100 text-green-800 px-4 py-1.5 rounded-full font-mono text-sm font-medium">
          Stage 1: EMF
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-center w-full">
        {/* Left Panel: Instructions & Stats */}
        <div className="space-y-6 order-2 lg:order-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-3 text-slate-900">Gain Chemical Energy</h3>
            <p className="text-slate-600 mb-4 leading-relaxed">
              In a battery, chemical energy is converted into electrical potential energy. 
              This "push" given to the charge is the <strong>Electromotive Force (EMF)</strong>.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
              <div className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Key Formula</div>
              <div className="font-mono text-lg text-blue-900">
                EMF (ε) = <span className="text-green-600">Energy (W)</span> / <span className="text-yellow-600">Charge (Q)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
              <Info className="w-4 h-4" />
              <span>Tap the floating green orbs to collect chemical energy!</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Interactive Visualization */}
        <div className="relative bg-slate-800 rounded-3xl h-[500px] w-full flex flex-col items-center justify-end overflow-hidden border-4 border-slate-700 shadow-2xl order-1 lg:order-2">
          <div className="absolute top-4 left-4 text-slate-500 font-mono text-xs tracking-widest">ZINC-CARBON CELL</div>
          
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-10" 
               style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>

          {/* Floating Particles */}
          <AnimatePresence>
            {particles.map(particle => (
              <motion.button
                key={particle.id}
                initial={{ y: 500, x: `${particle.x}%`, opacity: 0 }}
                animate={{ y: [400, 100], opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 4, ease: "linear" }}
                onClick={() => collectParticle(particle.id)}
                className="absolute w-12 h-12 bg-green-400 rounded-full blur-sm hover:blur-none hover:scale-110 transition-all cursor-pointer flex items-center justify-center group z-20"
                style={{ left: `${particle.x}%` }}
              >
                <Zap className="w-6 h-6 text-white group-hover:animate-pulse" />
              </motion.button>
            ))}
          </AnimatePresence>

          {/* Energy Level Indicator */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 h-64 w-8 bg-slate-900 rounded-full border border-slate-600 overflow-hidden">
             <motion.div 
               className="w-full bg-gradient-to-t from-green-600 to-green-400 absolute bottom-0"
               initial={{ height: '0%' }}
               animate={{ height: `${energy}%` }}
             />
          </div>
          <div className="absolute right-16 top-1/2 -translate-y-1/2 text-white font-mono text-sm">
            {(energy / 100 * 12).toFixed(1)}V
          </div>

          {/* Player Character */}
          <motion.div 
            className="absolute bottom-10 z-30"
            animate={{ 
              scale: 1 + (energy / 200),
              filter: `drop-shadow(0 0 ${energy/5}px #EAB308)`
            }}
          >
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg relative">
              <span className="font-bold text-yellow-900 text-2xl">Q</span>
              {/* Charge Aura */}
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-yellow-200"
                animate={{ scale: [1, 1.2], opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            </div>
          </motion.div>

          {/* Success Overlay */}
          {energy >= targetEnergy && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center"
            >
              <div className="text-center p-6">
                <h3 className="text-3xl font-bold text-white mb-2">Fully Charged!</h3>
                <p className="text-slate-300 mb-6">12 Volts of EMF acquired.</p>
                <button 
                  onClick={onComplete}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg flex items-center gap-2 mx-auto transition-transform hover:scale-105"
                >
                  Enter Circuit
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
