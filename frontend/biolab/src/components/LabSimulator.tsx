import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Beaker, Flame, Thermometer, AlertTriangle, CheckCircle, XCircle, Droplets, RotateCw, RefreshCcw, Info, Trash2 } from 'lucide-react';
import { EXPERIMENTS } from '../data/experiments';
import { LabState, ReagentType, LogMessage } from '../types';

// --- Components ---

const Button = ({ onClick, disabled, children, className = '', variant = 'primary' }: any) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 justify-center shadow-sm active:scale-95";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:bg-slate-50 disabled:text-slate-400",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
    outline: "border-2 border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50"
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {children}
    </button>
  );
};

const ReagentBottle = ({ type, label, color, onClick, disabled }: { type: ReagentType, label: string, color: string, onClick: () => void, disabled: boolean }) => (
  <motion.button
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${disabled ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:bg-slate-100 cursor-pointer'}`}
  >
    <div className={`w-12 h-16 ${color} rounded-t-xl rounded-b-md border-2 border-slate-300 shadow-md relative overflow-hidden group`}>
      <div className="absolute top-0 left-0 w-full h-4 bg-slate-200 border-b border-slate-300" />
      <div className="absolute top-6 left-1 right-1 h-auto py-1 bg-white/90 flex items-center justify-center border border-slate-200 shadow-sm">
        <span className="text-[9px] font-bold text-center leading-tight text-slate-800 uppercase tracking-tighter">{label}</span>
      </div>
      {/* Liquid shine */}
      <div className="absolute top-0 right-1 w-1 h-full bg-white/30 blur-[1px]" />
    </div>
  </motion.button>
);

const TestTube = ({ color, contents, isHeated, isShaken, status }: { color: string | string[], contents: ReagentType[], isHeated: boolean, isShaken: boolean, status: string }) => {
  const fillHeight = Math.min(contents.length * 20, 85); // Max 85%
  
  // If color is an array, we want a longer duration for the transition
  const isColorArray = Array.isArray(color);
  
  return (
    <div className="relative w-20 h-64 mx-auto flex flex-col justify-end">
      {/* Tube Body */}
      <div className="w-full h-full rounded-b-full border-x-[3px] border-b-[4px] border-slate-300/80 bg-gradient-to-r from-white/20 to-white/5 backdrop-blur-sm overflow-hidden relative shadow-xl ring-1 ring-white/50">
        
        {/* Liquid */}
        <motion.div 
          initial={{ height: 0 }}
          animate={{ 
            height: `${fillHeight}%`, 
            backgroundColor: color,
            filter: status === 'success' && (color === '#ffffff' || (Array.isArray(color) && color.includes('#ffffff'))) ? 'blur(2px)' : 'none'
          }}
          transition={{
            backgroundColor: { 
              duration: isColorArray ? 5 : 1, // 5 seconds for Benedict's sequence
              ease: "easeInOut",
              times: isColorArray ? [0, 0.2, 0.5, 0.8, 1] : undefined // Control timing of color shifts
            },
            height: { duration: 0.5 }
          }}
          className={`absolute bottom-0 left-0 w-full transition-all ${isShaken ? 'animate-pulse' : ''}`}
        >
          {/* Bubbles if heated */}
          {isHeated && (
            <div className="absolute inset-0 w-full h-full overflow-hidden">
               {[...Array(8)].map((_, i) => (
                 <motion.div
                   key={i}
                   className="absolute bg-white/60 rounded-full w-2 h-2"
                   initial={{ bottom: 0, left: `${Math.random() * 80 + 10}%`, opacity: 0 }}
                   animate={{ bottom: '100%', opacity: [0, 1, 0], scale: [0.5, 1.5] }}
                   transition={{ duration: 1 + Math.random(), repeat: Infinity, ease: "linear", delay: Math.random() }}
                 />
               ))}
            </div>
          )}
          
          {/* Surface Meniscus */}
          <div className="absolute top-0 left-0 w-full h-2 bg-white/20 rounded-[100%]" />
        </motion.div>
        
        {/* Glass Reflections */}
        <div className="absolute top-0 left-2 w-1 h-full bg-white/40 blur-[2px] rounded-full" />
        <div className="absolute top-0 right-3 w-2 h-full bg-white/20 blur-[3px] rounded-full" />
      </div>
      
      {/* Rim */}
      <div className="absolute top-[-4px] left-[-4px] right-[-4px] h-4 border-2 border-slate-300 rounded-full bg-slate-100/80 shadow-sm z-10" />
    </div>
  );
};

export default function LabSimulator() {
  const [state, setState] = useState<LabState>({
    selectedTest: null,
    tubeContents: [],
    tubeColor: 'transparent',
    tubeOpacity: 0,
    isHeated: false,
    isShaken: false,
    hasGoggles: false,
    temperature: 20,
    messages: [],
    status: 'idle'
  });

  const [showWelcome, setShowWelcome] = useState(true);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages]);

  const addLog = (text: string, type: LogMessage['type'] = 'info') => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, { id: Date.now().toString(), text, type }]
    }));
  };

  const resetLab = () => {
    setState(prev => ({
      ...prev,
      tubeContents: [],
      tubeColor: 'transparent',
      tubeOpacity: 0,
      isHeated: false,
      isShaken: false,
      temperature: 20,
      status: 'idle',
      failureReason: undefined,
      messages: [...prev.messages, { id: Date.now().toString(), text: "--- Lab Reset ---", type: 'info' }]
    }));
  };

  const selectTest = (testId: LabState['selectedTest']) => {
    resetLab();
    setState(prev => ({ 
      ...prev, 
      selectedTest: testId,
      messages: [{ id: Date.now().toString(), text: `Selected ${EXPERIMENTS[testId!].name}.`, type: 'info' }]
    }));
  };

  const toggleGoggles = () => {
    setState(prev => {
      const newState = !prev.hasGoggles;
      const msg = newState ? "Safety goggles put on." : "Safety goggles removed. Warning: Eye hazard!";
      return { 
        ...prev, 
        hasGoggles: newState,
        messages: [...prev.messages, { id: Date.now().toString(), text: msg, type: newState ? 'success' : 'warning' }]
      };
    });
  };

  const addReagent = (reagent: ReagentType) => {
    if (state.status === 'failed') return;

    if (!state.hasGoggles) {
      addLog("Warning: Handling chemicals without safety goggles!", 'warning');
    }

    setState(prev => {
      const newContents = [...prev.tubeContents, reagent];
      let newColor = prev.tubeColor;
      
      // Basic color mixing logic
      if (prev.tubeContents.length === 0) {
          if (reagent === 'benedicts') newColor = '#3b82f6'; // Blue
          else if (reagent === 'iodine') newColor = '#d97706'; // Orange/Brown
          else if (reagent === 'biuretA') newColor = '#bfdbfe'; // Light Blue
          else if (reagent === 'biuretB') newColor = '#3b82f6'; // Blue
          else if (reagent === 'ethanol') newColor = 'transparent';
          else if (reagent.startsWith('sample_')) newColor = '#f1f5f9'; // Generic sample
      } else {
          // Mixing logic
          if (reagent === 'benedicts') newColor = '#60a5fa'; // Lighter blue mix
          else if (reagent === 'iodine') newColor = '#d97706'; // Stays orange until reaction
          else if (reagent === 'biuretB') newColor = '#60a5fa'; // Blue mix
      }

      return {
        ...prev,
        tubeContents: newContents,
        tubeColor: newColor,
        messages: [...prev.messages, { id: Date.now().toString(), text: `Added ${reagent.replace('sample_', 'Sample: ')}`, type: 'info' }]
      };
    });
    
    // Defer reaction check to allow state update
    setTimeout(() => checkReaction(reagent), 100);
  };

  const heatTube = (method: 'burner' | 'bath') => {
    if (state.status === 'failed') return;

    if (!state.hasGoggles) {
      failExperiment("Safety Violation: Heating substances without eye protection is dangerous!");
      return;
    }

    // Critical Safety: Ethanol + Flame = Fire
    if (state.tubeContents.includes('ethanol') && method === 'burner') {
      failExperiment("DANGER: Ethanol is highly flammable! Never heat it directly over a Bunsen burner. Use a water bath.");
      return;
    }

    setState(prev => ({ ...prev, isHeated: true, temperature: method === 'burner' ? 100 : 80 }));
    addLog(`Heating tube using ${method === 'burner' ? 'Bunsen Burner' : 'Water Bath'}...`, 'info');
    
    setTimeout(() => checkReaction('heat'), 1500);
  };

  const shakeTube = () => {
    if (state.status === 'failed') return;
    
    setState(prev => ({ ...prev, isShaken: true }));
    addLog("Shaking test tube to mix contents...", 'info');
    setTimeout(() => checkReaction('shake'), 1000);
  };

  const checkReaction = (trigger: string) => {
    setState(prev => {
      const { selectedTest, tubeContents, isHeated, isShaken } = prev;
      let newColor = prev.tubeColor;
      let newStatus = prev.status;
      let newMessages = [...prev.messages];

      const addResult = (text: string, type: LogMessage['type'], color: string | string[]) => {
          if (newStatus !== 'success') {
              newMessages.push({ id: Date.now().toString(), text, type });
              newStatus = 'success';
              newColor = color;
          }
      };

      // Benedict's
      if (selectedTest === 'benedicts') {
        const hasSample = tubeContents.some(c => c.startsWith('sample_'));
        const hasReagent = tubeContents.includes('benedicts');
        const isGlucoseHigh = tubeContents.includes('sample_glucose');
        const isGlucoseLow = tubeContents.includes('sample_glucose_low');
        
        if (hasSample && hasReagent) {
            if (prev.isHeated || trigger === 'heat') {
                 if (isGlucoseHigh) {
                    // Blue -> Green -> Yellow -> Orange -> Brick Red
                    const benedictsSequence = ['#3b82f6', '#22c55e', '#eab308', '#f97316', '#ef4444'];
                    addResult("Result: Solution turned brick-red. High concentration of reducing sugar!", 'success', benedictsSequence);
                 } else if (isGlucoseLow) {
                    // Blue -> Green -> Yellow
                    const benedictsLowSequence = ['#3b82f6', '#22c55e', '#eab308'];
                    addResult("Result: Solution turned yellow/green. Low concentration of reducing sugar.", 'success', benedictsLowSequence);
                 } else {
                    if (trigger === 'heat') {
                        addResult("Result: Solution remained blue. No reducing sugar.", 'info', '#3b82f6');
                    }
                 }
            }
        }
      }

      // Iodine
      if (selectedTest === 'iodine') {
        const hasSample = tubeContents.some(c => c.startsWith('sample_'));
        const hasReagent = tubeContents.includes('iodine');
        const isStarch = tubeContents.includes('sample_starch');

        if (hasSample && hasReagent) {
            if (isStarch) {
                addResult("Result: Solution turned blue-black. Starch present!", 'success', '#0f172a');
            } else {
                addResult("Result: Solution remained orange-brown. No starch.", 'info', '#d97706');
            }
        }
      }

      // Biuret
      if (selectedTest === 'biuret') {
        const hasSample = tubeContents.some(c => c.startsWith('sample_'));
        const hasA = tubeContents.includes('biuretA');
        const hasB = tubeContents.includes('biuretB');
        const isProtein = tubeContents.includes('sample_protein');

        if (hasSample && hasA && hasB) {
            // Require shaking to mix the reagents
            if (prev.isShaken || trigger === 'shake') {
                if (isProtein) {
                    addResult("Result: Solution turned purple. Protein present!", 'success', '#9333ea');
                } else {
                    addResult("Result: Solution remained blue. No protein.", 'info', '#3b82f6');
                }
            } else if (!newMessages.some(m => m.text.includes("Shake"))) {
                 // Hint to shake if reagents are added but no reaction yet
                 newMessages.push({ id: Date.now().toString(), text: "Hint: Shake the tube to mix the reagents.", type: 'info' });
            }
        }
      }

      // Ethanol
      if (selectedTest === 'ethanol') {
        const hasSample = tubeContents.some(c => c.startsWith('sample_'));
        const hasEthanol = tubeContents.includes('ethanol');
        const hasWater = tubeContents.includes('water');
        const isLipid = tubeContents.includes('sample_lipid');
        
        const ethanolIndex = tubeContents.indexOf('ethanol');
        const waterIndex = tubeContents.indexOf('water');
        
        if (hasSample && hasEthanol && hasWater) {
            if (waterIndex > ethanolIndex && (prev.isShaken || trigger === 'shake')) {
                 if (isLipid) {
                    addResult("Result: White emulsion formed. Lipids present!", 'success', '#ffffff');
                 } else {
                    addResult("Result: Solution remained clear. No lipids.", 'info', 'transparent');
                 }
            } else if (waterIndex < ethanolIndex) {
                 if (!newMessages.some(m => m.text.includes("Nothing happened"))) {
                    newMessages.push({ id: Date.now().toString(), text: "Observation: Nothing happened. Did you add water before ethanol?", type: 'warning' });
                 }
            }
        }
      }

      return {
        ...prev,
        tubeColor: newColor,
        status: newStatus,
        messages: newMessages
      };
    });
  };

  const failExperiment = (reason: string) => {
    setState(prev => ({
      ...prev,
      status: 'failed',
      failureReason: reason,
      messages: [...prev.messages, { id: Date.now().toString(), text: reason, type: 'error' }]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      
      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="bg-white max-w-lg w-full rounded-2xl p-8 shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-4 rounded-full mb-6">
                  <Beaker className="w-12 h-12 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome to BioLab Simulator</h1>
                <p className="text-slate-600 mb-8">
                  Perform standard food tests (Benedict's, Iodine, Biuret, Ethanol) in a safe, virtual environment.
                  Follow the IGCSE procedures carefully—mistakes have consequences!
                </p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 w-full text-left flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <p className="font-bold mb-1">Safety First</p>
                    <p>Always wear safety goggles. Be careful with heat sources and flammable liquids.</p>
                  </div>
                </div>

                <Button onClick={() => { setShowWelcome(false); toggleGoggles(); }} className="w-full py-3 text-lg">
                  Put on Goggles & Enter Lab
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
            <Beaker className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">BioLab Simulator</h1>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">IGCSE Biology 2026</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={toggleGoggles}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-sm font-medium ${state.hasGoggles ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700 animate-pulse'}`}
           >
             {state.hasGoggles ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
             <span>{state.hasGoggles ? "Goggles ON" : "Goggles OFF"}</span>
           </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar - Test Selection */}
        <aside className="w-72 bg-white border-r border-slate-200 overflow-y-auto flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
          <div className="p-5">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Info className="w-3 h-3" /> Experiments
            </h2>
            <div className="space-y-2">
              {Object.values(EXPERIMENTS).map(exp => (
                <button
                  key={exp.id}
                  onClick={() => selectTest(exp.id as any)}
                  className={`w-full text-left p-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    state.selectedTest === exp.id 
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm ring-1 ring-blue-100' 
                    : 'text-slate-600 border-transparent hover:bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span>{exp.name}</span>
                    {state.selectedTest === exp.id && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                  </div>
                  <p className="text-xs text-slate-400 font-normal line-clamp-1">{exp.description}</p>
                </button>
              ))}
            </div>
          </div>

          {state.selectedTest && (
            <div className="p-5 border-t border-slate-100 flex-1 bg-slate-50/50">
               <h3 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider">Procedure</h3>
               <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                 <ol className="list-decimal list-inside text-xs text-slate-600 space-y-3">
                   {EXPERIMENTS[state.selectedTest].steps.map((step, i) => (
                     <li key={i} className="leading-relaxed pl-1 marker:text-slate-400 marker:font-medium">{step}</li>
                   ))}
                 </ol>
               </div>
            </div>
          )}
        </aside>

        {/* Main Lab Bench */}
        <div className="flex-1 bg-slate-100/50 relative flex flex-col">
          
          {/* Failure Overlay */}
          <AnimatePresence>
            {state.status === 'failed' && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-8"
              >
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="bg-white max-w-md w-full rounded-2xl p-8 shadow-2xl border-t-4 border-red-500"
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="bg-red-100 p-4 rounded-full">
                      <Flame className="w-10 h-10 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Experiment Failed</h2>
                      <p className="text-slate-600 mb-8 leading-relaxed">{state.failureReason}</p>
                      <Button onClick={resetLab} variant="danger" className="w-full py-3">
                        <RefreshCcw className="w-4 h-4" /> Clean Up & Restart
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Workspace */}
          <div className="flex-1 p-6 flex flex-col relative overflow-hidden">
            
            {!state.selectedTest ? (
               <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                 <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6 opacity-50">
                    <Beaker className="w-10 h-10 text-slate-400" />
                 </div>
                 <p className="text-lg font-medium text-slate-500">Select an experiment to begin</p>
                 <p className="text-sm">Choose from the list on the left</p>
               </div>
            ) : (
              <div className="flex-1 grid grid-cols-12 gap-6 h-full">
                
                {/* Left: Reagents Shelf */}
                <div className="col-span-3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center flex items-center justify-center gap-2">
                      <Droplets className="w-3 h-3" /> Samples
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <ReagentBottle type="sample_glucose" label="Glucose (High)" color="bg-transparent" onClick={() => addReagent('sample_glucose')} disabled={state.status === 'failed'} />
                      <ReagentBottle type="sample_glucose_low" label="Glucose (Low)" color="bg-transparent" onClick={() => addReagent('sample_glucose_low')} disabled={state.status === 'failed'} />
                      <ReagentBottle type="sample_starch" label="Starch" color="bg-yellow-50" onClick={() => addReagent('sample_starch')} disabled={state.status === 'failed'} />
                      <ReagentBottle type="sample_protein" label="Protein" color="bg-yellow-100" onClick={() => addReagent('sample_protein')} disabled={state.status === 'failed'} />
                      <ReagentBottle type="sample_lipid" label="Lipid" color="bg-yellow-200" onClick={() => addReagent('sample_lipid')} disabled={state.status === 'failed'} />
                      <ReagentBottle type="sample_water" label="Water" color="bg-blue-50/30" onClick={() => addReagent('sample_water')} disabled={state.status === 'failed'} />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4 flex-1">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Reagents</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {state.selectedTest === 'benedicts' && (
                        <ReagentBottle type="benedicts" label="Benedict's" color="bg-blue-500" onClick={() => addReagent('benedicts')} disabled={state.status === 'failed'} />
                      )}
                      {state.selectedTest === 'iodine' && (
                        <ReagentBottle type="iodine" label="Iodine" color="bg-amber-700" onClick={() => addReagent('iodine')} disabled={state.status === 'failed'} />
                      )}
                      {state.selectedTest === 'biuret' && (
                        <>
                          <ReagentBottle type="biuretA" label="Biuret A" color="bg-slate-100" onClick={() => addReagent('biuretA')} disabled={state.status === 'failed'} />
                          <ReagentBottle type="biuretB" label="Biuret B" color="bg-blue-400" onClick={() => addReagent('biuretB')} disabled={state.status === 'failed'} />
                        </>
                      )}
                      {state.selectedTest === 'ethanol' && (
                        <>
                          <ReagentBottle type="ethanol" label="Ethanol" color="bg-slate-50" onClick={() => addReagent('ethanol')} disabled={state.status === 'failed'} />
                          <ReagentBottle type="water" label="Water" color="bg-blue-50" onClick={() => addReagent('water')} disabled={state.status === 'failed'} />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Center: The Bench */}
                <div className="col-span-6 flex flex-col relative bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                  {/* Background Grid */}
                  <div className="absolute inset-0 opacity-[0.03]" 
                       style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
                  />

                  {/* Top Controls */}
                  <div className="p-4 flex justify-end gap-2 z-10">
                     <Button variant="secondary" onClick={shakeTube} className="text-xs h-8">
                        <RotateCw className="w-3 h-3" /> Shake
                     </Button>
                     <Button variant="secondary" onClick={() => heatTube('bath')} className="text-xs h-8">
                        <Thermometer className="w-3 h-3" /> Water Bath
                     </Button>
                     <Button variant="secondary" onClick={() => heatTube('burner')} className="text-xs h-8 text-red-600 hover:text-red-700 border-red-100 hover:bg-red-50">
                        <Flame className="w-3 h-3" /> Burner
                     </Button>
                  </div>

                  {/* Main Stage */}
                  <div className="flex-1 flex items-end justify-center pb-16 relative">
                     {/* The Test Tube */}
                     <div className="relative z-10 transform scale-125 origin-bottom">
                        <TestTube 
                           color={state.tubeColor} 
                           contents={state.tubeContents} 
                           isHeated={state.isHeated}
                           isShaken={state.isShaken}
                           status={state.status}
                        />
                        {/* Stand */}
                        <div className="w-32 h-4 bg-slate-300 rounded-sm mx-auto mt-1 shadow-md flex items-center justify-center gap-8">
                           <div className="w-1 h-3 bg-slate-400/50 rounded-full" />
                           <div className="w-1 h-3 bg-slate-400/50 rounded-full" />
                        </div>
                        <div className="w-40 h-2 bg-slate-400 rounded-full mx-auto shadow-xl opacity-50 blur-[2px] mt-1" />
                     </div>
                  </div>

                  {/* Bottom Controls */}
                  <div className="absolute bottom-6 left-0 w-full flex justify-center">
                     <Button variant="outline" onClick={resetLab} className="text-xs opacity-60 hover:opacity-100">
                        <Trash2 className="w-3 h-3" /> Empty Tube
                     </Button>
                  </div>
                </div>

                {/* Right: Log / Notebook */}
                <div className="col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-full">
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lab Notebook</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs bg-slate-50/30">
                    {state.messages.length === 0 && (
                      <div className="text-center mt-10 opacity-50">
                        <Info className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-slate-400">Actions will be recorded here.</p>
                      </div>
                    )}
                    {state.messages.map((msg, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        key={msg.id + i} 
                        className={`p-3 rounded-lg border-l-2 shadow-sm ${
                          msg.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
                          msg.type === 'warning' ? 'bg-amber-50 border-amber-500 text-amber-800' :
                          msg.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
                          'bg-white border-slate-300 text-slate-600'
                        }`}
                      >
                        {msg.text}
                      </motion.div>
                    ))}
                    <div ref={logEndRef} />
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
