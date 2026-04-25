/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FlaskConical, 
  Flame, 
  Rocket, 
  RotateCcw, 
  Play, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  Wind,
  Thermometer,
  Scale,
  ShieldAlert,
  Settings2,
  ChevronRight,
  ChevronLeft,
  Activity,
  Timer,
  TrendingUp,
  Eye,
  ShieldCheck
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// --- Constants & Types ---
const PERFECT_KNO3_RATIO = 0.65;
const PERFECT_SUGAR_RATIO = 0.35;
const TOLERANCE = 0.05;

type Step = 'SAFETY' | 'DESIGN' | 'MIXING' | 'HEATING' | 'PACKING' | 'LAUNCH' | 'ANALYSIS';

type FinType = 'DELTA' | 'SWEPT' | 'TRAPEZOIDAL';
type NoseType = 'CONICAL' | 'OGIVE' | 'PARABOLIC';
type BodySize = 'SHORT' | 'MEDIUM' | 'LONG';

type Kno3State = 'POWDER' | 'GRANULES' | 'CHIPS';
type SugarState = 'POWDER' | 'GRANULES' | 'LIQUID' | 'GAS';

interface RocketDesign {
  bodyLength: BodySize;
  bodyDiameter: 'THIN' | 'STANDARD' | 'WIDE';
  finType: FinType;
  noseType: NoseType;
}

interface TelemetryPoint {
  time: number;
  altitude: number;
  velocity: number;
  acceleration: number;
}

export default function App() {
  const [step, setStep] = useState<Step>('SAFETY');
  const [design, setDesign] = useState<RocketDesign>({
    bodyLength: 'MEDIUM',
    bodyDiameter: 'STANDARD',
    finType: 'DELTA',
    noseType: 'OGIVE'
  });
  
  const [kno3Amount, setKno3Amount] = useState(0);
  const [sugarAmount, setSugarAmount] = useState(0);
  const [kno3State, setKno3State] = useState<Kno3State>('POWDER');
  const [sugarState, setSugarState] = useState<SugarState>('GRANULES');
  const [stirProgress, setStirProgress] = useState(0);
  const [heatLevel, setHeatLevel] = useState(0);
  const [packProgress, setPackProgress] = useState(0);
  
  const [isStirring, setIsStirring] = useState(false);
  const [isHeating, setIsHeating] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([]);
  const [launchResult, setLaunchResult] = useState<{ success: boolean; message: string; stats: any } | null>(null);

  // --- Simulation Logic ---

  const totalAmount = kno3Amount + sugarAmount;
  const currentKno3Ratio = totalAmount > 0 ? kno3Amount / totalAmount : 0;

  const handleAddKno3 = () => {
    if (step === 'MIXING' && totalAmount < 100) {
      setKno3Amount(prev => Math.min(prev + 5, 100 - sugarAmount));
      setStirProgress(0);
    }
  };

  const handleAddSugar = () => {
    if (step === 'MIXING' && totalAmount < 100) {
      setSugarAmount(prev => Math.min(prev + 5, 100 - kno3Amount));
      setStirProgress(0);
    }
  };

  const handleStir = () => {
    if (step === 'MIXING' && totalAmount > 0) {
      setIsStirring(true);
      setTimeout(() => setIsStirring(false), 500);
      setStirProgress(prev => Math.min(prev + 10, 100));
    }
  };

  const handleHeat = () => {
    if (step === 'HEATING') {
      setIsHeating(true);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isHeating && heatLevel < 100) {
      interval = setInterval(() => {
        setHeatLevel(prev => Math.min(prev + 1, 100));
      }, 50);
    } else {
      setIsHeating(false);
    }
    return () => clearInterval(interval);
  }, [isHeating, heatLevel]);

  const handlePack = () => {
    if (step === 'PACKING') {
      setPackProgress(prev => Math.min(prev + 10, 100));
    }
  };

  const runFlightSimulation = () => {
    setIsLaunching(true);
    setTelemetry([]);
    
    const totalAmount = kno3Amount + sugarAmount;
    const currentKno3Ratio = totalAmount > 0 ? kno3Amount / totalAmount : 0;
    const ratioError = Math.abs(currentKno3Ratio - PERFECT_KNO3_RATIO);
    const stirError = 100 - stirProgress;
    const packError = 100 - packProgress;
    const heatError = Math.abs(heatLevel - 80);

    // Physics parameters based on design
    const mass = (design.bodyLength === 'LONG' ? 1.5 : design.bodyLength === 'SHORT' ? 0.7 : 1.0) * 0.5;
    const dragCoeff = (design.noseType === 'CONICAL' ? 0.5 : 0.3) * (design.bodyDiameter === 'WIDE' ? 1.4 : 0.8);
    
    // Thrust profile based on fuel quality
    let stateMultiplier = 1;
    if (kno3State === 'CHIPS') stateMultiplier *= 0.1;
    else if (kno3State === 'GRANULES') stateMultiplier *= 0.7;
    
    if (sugarState === 'GAS') stateMultiplier *= 0;
    else if (sugarState === 'GRANULES') stateMultiplier *= 0.8;
    else if (sugarState === 'LIQUID') {
      if (heatLevel < 95) stateMultiplier *= 0.2; // Too wet
      else stateMultiplier *= 1.2; // Perfect mix if heated enough
    }

    const thrustMultiplier = Math.max(0, 1 - ratioError * 5) * (stirProgress / 100) * (packProgress / 100) * stateMultiplier;
    const burnTime = 3.0; // seconds
    const maxThrust = 50 * thrustMultiplier;

    let time = 0;
    let altitude = 0;
    let velocity = 0;
    const dt = 0.1;
    const points: TelemetryPoint[] = [];

    const interval = setInterval(() => {
      time += dt;
      
      const thrust = time < burnTime ? maxThrust : 0;
      const drag = 0.5 * 1.225 * velocity * Math.abs(velocity) * dragCoeff * 0.01;
      const gravity = mass * 9.81;
      
      const netForce = thrust - drag - gravity;
      const acceleration = netForce / mass;
      
      velocity += acceleration * dt;
      altitude += velocity * dt;

      if (altitude < 0 && time > 0.5) {
        altitude = 0;
        velocity = 0;
        clearInterval(interval);
        finalizeLaunch(points);
      }

      const point = { time: Number(time.toFixed(1)), altitude: Math.max(0, altitude), velocity, acceleration };
      points.push(point);
      setTelemetry([...points]);

      if (time > 15) { // Safety cutoff
        clearInterval(interval);
        finalizeLaunch(points);
      }
    }, 50);
  };

  const finalizeLaunch = (points: TelemetryPoint[]) => {
    const maxAlt = Math.max(...points.map(p => p.altitude));
    const maxVel = Math.max(...points.map(p => p.velocity));
    
    const totalAmount = kno3Amount + sugarAmount;
    const currentKno3Ratio = totalAmount > 0 ? kno3Amount / totalAmount : 0;
    const ratioError = Math.abs(currentKno3Ratio - PERFECT_KNO3_RATIO);

    let success = maxAlt > 100;
    let message = "Successful flight! The rocket performed well.";
    
    if (sugarState === 'GAS') {
      success = false;
      message = "Catastrophic Failure: Sugar decomposes and burns before becoming a gas. Mixture destroyed.";
    } else if (sugarState === 'LIQUID' && heatLevel < 95) {
      success = false;
      message = "Ignition Failure: The mixture was too wet. Liquid sugar requires high heat to boil off water.";
    } else if (kno3State === 'CHIPS') {
      success = false;
      message = "Weak burn: KNO3 chips are too large to mix properly with the fuel.";
    } else if (ratioError > TOLERANCE * 2) {
      success = false;
      message = currentKno3Ratio > PERFECT_KNO3_RATIO ? "Explosion! Too much oxidizer." : "Weak burn. Too much fuel.";
    } else if (packProgress < 80) {
      success = false;
      message = "Casing failure due to air pockets.";
    }

    setLaunchResult({
      success,
      message,
      stats: {
        maxAltitude: maxAlt.toFixed(1),
        maxVelocity: maxVel.toFixed(1),
        flightTime: points[points.length - 1].time.toFixed(1)
      }
    });
    setIsLaunching(false);
    setStep('ANALYSIS');
  };

  const reset = () => {
    setStep('DESIGN');
    setKno3Amount(0);
    setSugarAmount(0);
    setKno3State('POWDER');
    setSugarState('GRANULES');
    setStirProgress(0);
    setHeatLevel(0);
    setPackProgress(0);
    setLaunchResult(null);
    setIsLaunching(false);
    setTelemetry([]);
  };

  // --- Render Components ---

  const renderSafety = () => (
    <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
      <div className="bg-red-600 p-8 text-white flex items-center gap-4">
        <ShieldAlert className="w-12 h-12" />
        <div>
          <h2 className="text-3xl font-black">SAFETY FIRST</h2>
          <p className="opacity-90">Mandatory briefing before handling chemicals.</p>
        </div>
      </div>
      <div className="p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Chemical Risks
            </h3>
            <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
              <li>KNO3 is a strong oxidizer; keep away from open flames.</li>
              <li>Sugar is highly flammable when mixed with oxidizers.</li>
              <li>The mixture can ignite spontaneously if overheated.</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              Protective Gear
            </h3>
            <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
              <li>Always wear ANSI-rated safety goggles.</li>
              <li>Use heat-resistant gloves when melting fuel.</li>
              <li>Work in a well-ventilated outdoor area.</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-600">
          <strong>Storage:</strong> Store KNO3 in a cool, dry place in a labeled, airtight container. Never store pre-mixed fuel for long periods.
        </div>
        <button 
          onClick={() => setStep('DESIGN')}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
        >
          I UNDERSTAND THE RISKS <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderDesign = () => (
    <div className="flex flex-col lg:flex-row gap-12 items-start w-full max-w-6xl">
      <div className="flex-1 space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900">Rocket Design</h2>
          <p className="text-slate-500">Configure your airframe for optimal aerodynamics and stability.</p>
        </div>

        <div className="grid gap-6">
          <section className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Body Length</label>
            <div className="flex gap-2">
              {(['SHORT', 'MEDIUM', 'LONG'] as BodySize[]).map(size => (
                <button
                  key={size}
                  onClick={() => setDesign({...design, bodyLength: size})}
                  className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${design.bodyLength === size ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nose Cone Style</label>
            <div className="grid grid-cols-3 gap-2">
              {(['CONICAL', 'OGIVE', 'PARABOLIC'] as NoseType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setDesign({...design, noseType: type})}
                  className={`py-3 rounded-xl border-2 font-bold text-xs transition-all ${design.noseType === type ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Fin Configuration</label>
            <div className="grid grid-cols-3 gap-2">
              {(['DELTA', 'SWEPT', 'TRAPEZOIDAL'] as FinType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setDesign({...design, finType: type})}
                  className={`py-3 rounded-xl border-2 font-bold text-xs transition-all ${design.finType === type ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>
        </div>

        <button 
          onClick={() => setStep('MIXING')}
          className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl"
        >
          CONFIRM DESIGN <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="w-full lg:w-96 bg-slate-200 rounded-3xl p-12 flex items-center justify-center min-h-[500px] shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        
        <div className="relative flex flex-col items-center">
          {/* Nose Cone */}
          <div className={`w-16 h-20 bg-slate-700 transition-all duration-500 ${
            design.noseType === 'CONICAL' ? 'clip-path-conical' : 
            design.noseType === 'OGIVE' ? 'rounded-t-full' : 'rounded-t-[80%]'
          }`} style={{ clipPath: design.noseType === 'CONICAL' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none' }} />
          
          {/* Body */}
          <div className={`bg-slate-800 border-x-4 border-slate-600 transition-all duration-500 ${
            design.bodyDiameter === 'WIDE' ? 'w-20' : design.bodyDiameter === 'THIN' ? 'w-12' : 'w-16'
          } ${
            design.bodyLength === 'LONG' ? 'h-64' : design.bodyLength === 'SHORT' ? 'h-32' : 'h-48'
          }`} />

          {/* Fins */}
          <div className="absolute bottom-0 flex justify-between w-32 px-2">
            <div className={`w-8 h-12 bg-slate-600 transition-all duration-500 ${
              design.finType === 'DELTA' ? 'clip-path-delta-l' : 
              design.finType === 'SWEPT' ? 'clip-path-swept-l' : 'clip-path-trap-l'
            }`} style={{ clipPath: design.finType === 'DELTA' ? 'polygon(100% 0, 0 100%, 100% 100%)' : design.finType === 'SWEPT' ? 'polygon(100% 0, 0 80%, 40% 100%, 100% 100%)' : 'polygon(100% 0, 0 100%, 100% 100%)' }} />
            <div className={`w-8 h-12 bg-slate-600 transition-all duration-500 ${
              design.finType === 'DELTA' ? 'clip-path-delta-r' : 
              design.finType === 'SWEPT' ? 'clip-path-swept-r' : 'clip-path-trap-r'
            }`} style={{ clipPath: design.finType === 'DELTA' ? 'polygon(0 0, 0 100%, 100% 100%)' : design.finType === 'SWEPT' ? 'polygon(0 0, 100% 80%, 60% 100%, 0 100%)' : 'polygon(0 0, 0 100%, 100% 100%)' }} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="w-full max-w-5xl space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900">Flight Analysis</h2>
            <div className={`px-4 py-1 rounded-full text-xs font-bold ${launchResult?.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {launchResult?.success ? 'MISSION SUCCESS' : 'MISSION FAILURE'}
            </div>
          </div>
          
          <p className="text-slate-600 leading-relaxed">{launchResult?.message}</p>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider">Max Alt</span>
              </div>
              <div className="text-xl font-black text-slate-900">{launchResult?.stats.maxAltitude}m</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider">Peak Vel</span>
              </div>
              <div className="text-xl font-black text-slate-900">{launchResult?.stats.maxVelocity}m/s</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Timer className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider">Duration</span>
              </div>
              <div className="text-xl font-black text-slate-900">{launchResult?.stats.flightTime}s</div>
            </div>
          </div>

          <button 
            onClick={reset}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" /> NEW MISSION
          </button>
        </div>

        <div className="flex-1 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-[400px]">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Altitude Profile</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={telemetry}>
              <defs>
                <linearGradient id="colorAlt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                labelFormatter={(val) => `Time: ${val}s`}
              />
              <Area type="monotone" dataKey="altitude" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAlt)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderLaunch = () => (
    <div className="flex flex-col items-center gap-12 w-full max-w-4xl">
      <div className="relative w-full h-[500px] bg-slate-900 rounded-[40px] overflow-hidden border-8 border-slate-800 shadow-2xl">
        {/* Sky Background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-blue-900 via-blue-600 to-blue-400"
          animate={isLaunching ? { y: [0, 500] } : {}}
          transition={{ duration: 2, ease: "easeIn" }}
        />
        
        {/* Stars/Clouds */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute bg-white rounded-full" style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }} />
          ))}
        </div>

        {/* Rocket Visual */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative"
            animate={isLaunching ? { 
              y: [0, -200],
              scale: [1, 0.5],
              rotate: [0, 2, -2, 0]
            } : {}}
            transition={{ duration: 2, ease: "easeIn" }}
          >
            <Rocket className="w-24 h-24 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            {isLaunching && (
              <motion.div 
                className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-4 h-20 bg-gradient-to-t from-transparent via-orange-500 to-white rounded-full blur-sm" />
                <div className="w-8 h-8 bg-orange-600 rounded-full blur-xl animate-pulse" />
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Telemetry Overlay */}
        <div className="absolute top-8 left-8 space-y-4">
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white min-w-[160px]">
            <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Altitude</div>
            <div className="text-3xl font-black tabular-nums">
              {telemetry.length > 0 ? telemetry[telemetry.length - 1].altitude.toFixed(1) : '0.0'}
              <span className="text-sm font-normal ml-1 opacity-50">m</span>
            </div>
          </div>
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white min-w-[160px]">
            <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Velocity</div>
            <div className="text-3xl font-black tabular-nums">
              {telemetry.length > 0 ? telemetry[telemetry.length - 1].velocity.toFixed(1) : '0.0'}
              <span className="text-sm font-normal ml-1 opacity-50">m/s</span>
            </div>
          </div>
        </div>
      </div>

      {!isLaunching && !launchResult && (
        <button 
          onClick={runFlightSimulation}
          className="px-16 py-8 bg-red-600 text-white rounded-full font-black text-4xl shadow-2xl hover:bg-red-500 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
        >
          <Play className="w-10 h-10 fill-current" /> IGNITION
        </button>
      )}
    </div>
  );

  const getMixingConsequences = () => {
    if (sugarState === 'GAS') {
      return { text: "DANGER: Sugar cannot exist as a gas at standard pressures. It will decompose, caramelize, and burn, ruining the mixture and causing a fire hazard.", color: "text-red-700", bg: "bg-red-100", border: "border-red-200" };
    }
    if (kno3State === 'POWDER' && sugarState === 'POWDER') {
      return { text: "Excellent dry mixing potential. However, this creates a severe dust hazard. Extreme risk of accidental ignition from static electricity or friction.", color: "text-orange-700", bg: "bg-orange-100", border: "border-orange-200" };
    }
    if (kno3State === 'CHIPS') {
      return { text: "Poor mixing. Large KNO3 chips (like raw stump remover) will not integrate with the fuel, leading to an inconsistent burn and very low thrust.", color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-200" };
    }
    if (sugarState === 'LIQUID') {
      return { text: "Dissolving ingredients in liquid (water/syrup) is the safest mixing method (no dust) and yields perfect integration. However, it requires careful, prolonged heating to drive off all moisture.", color: "text-blue-700", bg: "bg-blue-100", border: "border-blue-200" };
    }
    if (kno3State === 'GRANULES' && sugarState === 'GRANULES') {
      return { text: "Standard mix, but granular particles don't combine perfectly. Requires thorough melting during the heating phase to ensure a homogenous propellant.", color: "text-slate-700", bg: "bg-slate-100", border: "border-slate-200" };
    }
    return { text: "Mixed particle sizes. Ensure thorough stirring and heating to achieve a consistent propellant dough.", color: "text-slate-700", bg: "bg-slate-100", border: "border-slate-200" };
  };

  const mixingConsequences = getMixingConsequences();

  const renderMixing = () => (
    <div className="flex flex-col lg:flex-row gap-12 w-full max-w-6xl">
      <div className="flex-1 flex flex-col items-center gap-8">
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleAddKno3}
              className="flex flex-col items-center justify-center p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl hover:bg-blue-100 transition-colors group"
            >
              <FlaskConical className="w-12 h-12 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-blue-900">Add KNO3</span>
              <span className="text-xs text-blue-500">(Oxidizer)</span>
            </button>
            <div className="bg-white p-2 rounded-xl border border-slate-200 flex flex-col gap-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">State</span>
              <div className="flex gap-1">
                {(['POWDER', 'GRANULES', 'CHIPS'] as Kno3State[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setKno3State(s)}
                    className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-colors ${kno3State === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleAddSugar}
              className="flex flex-col items-center justify-center p-6 bg-amber-50 border-2 border-amber-200 rounded-2xl hover:bg-amber-100 transition-colors group"
            >
              <Scale className="w-12 h-12 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-amber-900">Add Sugar</span>
              <span className="text-xs text-amber-500">(Fuel)</span>
            </button>
            <div className="bg-white p-2 rounded-xl border border-slate-200 flex flex-col gap-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">State</span>
              <div className="grid grid-cols-2 gap-1">
                {(['POWDER', 'GRANULES', 'LIQUID', 'GAS'] as SugarState[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setSugarState(s)}
                    className={`py-1 text-[10px] font-bold rounded-lg transition-colors ${sugarState === s ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-64 h-64 bg-slate-200 rounded-full border-8 border-slate-300 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
          <AnimatePresence>
            {kno3Amount > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-white/40"
                style={{ clipPath: `inset(${100 - (kno3Amount / 100) * 100}% 0 0 0)` }}
              />
            )}
            {sugarAmount > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-amber-200/40"
                style={{ clipPath: `inset(${100 - (sugarAmount / 100) * 100}% 0 0 0)` }}
              />
            )}
          </AnimatePresence>
          
          <motion.div 
            animate={isStirring ? { rotate: 360 } : {}}
            transition={{ duration: 0.5, ease: "linear" }}
            className="z-10"
          >
            <RotateCcw className={`w-16 h-16 ${isStirring ? 'text-slate-600' : 'text-slate-400'}`} />
          </motion.div>
        </div>

        <div className="w-full space-y-4">
          <div className="flex justify-between text-sm font-medium">
            <span>KNO3: {kno3Amount}g</span>
            <span>Sugar: {sugarAmount}g</span>
          </div>
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
            <div style={{ width: `${kno3Amount}%` }} className="bg-blue-500 h-full transition-all duration-300" />
            <div style={{ width: `${sugarAmount}%` }} className="bg-amber-500 h-full transition-all duration-300" />
          </div>
          
          <button 
            onClick={handleStir}
            disabled={totalAmount === 0}
            className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className={`w-5 h-5 ${isStirring ? 'animate-spin' : ''}`} />
            Stir Mixture ({stirProgress}%)
          </button>

          {stirProgress === 100 && totalAmount > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setStep('HEATING')}
              className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition-colors"
            >
              Proceed to Heating
            </motion.button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div className={`p-6 rounded-3xl border-2 ${mixingConsequences.bg} ${mixingConsequences.border} transition-colors duration-500`}>
          <div className="flex items-center gap-3 mb-4">
            <Info className={`w-6 h-6 ${mixingConsequences.color}`} />
            <h3 className={`text-lg font-black ${mixingConsequences.color}`}>Real Life Consequences</h3>
          </div>
          <p className={`text-sm leading-relaxed font-medium ${mixingConsequences.color}`}>
            {mixingConsequences.text}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-800">State Characteristics</h4>
          <ul className="space-y-3 text-sm text-slate-600">
            <li><strong className="text-slate-900">Powder:</strong> High surface area. Mixes thoroughly but creates dangerous, highly flammable dust.</li>
            <li><strong className="text-slate-900">Granules:</strong> Standard form (like table sugar). Safer to handle, but requires melting to integrate properly.</li>
            <li><strong className="text-slate-900">Chips:</strong> Unprocessed chunks. Too large to react efficiently. Results in sputtering or failure.</li>
            <li><strong className="text-slate-900">Liquid:</strong> Dissolving in water/syrup eliminates dust and mixes perfectly, but requires boiling off the water.</li>
            <li><strong className="text-slate-900">Gas:</strong> Impossible for sugar. Heating sugar to vaporization temperatures causes it to decompose and burn.</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderHeating = () => (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Heating Station</h2>
        <p className="text-slate-500">Melt the mixture slowly until it reaches a peanut butter consistency.</p>
      </div>

      <div className="relative w-48 h-64 bg-slate-800 rounded-t-3xl border-x-8 border-t-8 border-slate-700 flex flex-col items-center justify-end pb-8 shadow-2xl">
        <div className="absolute top-4 left-4 right-4 h-32 bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700">
          <motion.div 
            className="absolute bottom-0 left-0 right-0 bg-amber-600"
            animate={{ height: `${heatLevel}%` }}
          />
        </div>
        
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              animate={isHeating ? { 
                scaleY: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
                y: [0, -10, 0]
              } : {}}
              transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
            >
              <Flame className={`w-8 h-8 ${isHeating ? 'text-orange-500' : 'text-slate-600'}`} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center gap-4 bg-slate-100 p-4 rounded-xl border border-slate-200">
          <Thermometer className={`w-8 h-8 ${heatLevel > 90 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} />
          <div className="flex-1">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>TEMPERATURE</span>
              <span>{Math.round(heatLevel * 2)}°C</span>
            </div>
            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${heatLevel > 90 ? 'bg-red-500' : 'bg-orange-500'}`}
                animate={{ width: `${heatLevel}%` }}
              />
            </div>
          </div>
        </div>

        <button 
          onMouseDown={handleHeat}
          onMouseUp={() => setIsHeating(false)}
          onMouseLeave={() => setIsHeating(false)}
          onTouchStart={handleHeat}
          onTouchEnd={() => setIsHeating(false)}
          className="w-full py-6 bg-orange-600 text-white rounded-2xl font-black text-xl shadow-lg hover:bg-orange-50 hover:shadow-orange-200/50 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <Flame className="w-6 h-6" />
          HOLD TO HEAT
        </button>

        {heatLevel >= 70 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setStep('PACKING')}
            className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition-colors"
          >
            Proceed to Packing
          </motion.button>
        )}
      </div>
    </div>
  );

  const renderPacking = () => (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Motor Assembly</h2>
        <p className="text-slate-500">Pack the propellant tightly into the PVC casing. Avoid air bubbles!</p>
      </div>

      <div className="relative w-32 h-80 bg-slate-100 border-4 border-slate-300 rounded-lg overflow-hidden shadow-inner">
        <motion.div 
          className="absolute bottom-0 left-0 right-0 bg-amber-700/80"
          animate={{ height: `${packProgress}%` }}
        />
        <div className="absolute inset-0 flex flex-col justify-between p-2 opacity-20">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-px bg-slate-800 w-full" />
          ))}
        </div>
      </div>

      <div className="w-full max-w-md space-y-4">
        <button 
          onClick={handlePack}
          className="w-full py-8 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 active:scale-95 transition-all flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center border-2 border-slate-600">
            <Wind className="w-6 h-6 rotate-180" />
          </div>
          TAP TO PACK PROPELLANT
          <span className="text-xs font-normal text-slate-400">Progress: {packProgress}%</span>
        </button>

        {packProgress === 100 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setStep('LAUNCH')}
            className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-500 transition-colors shadow-lg shadow-red-200"
          >
            Go to Launch Pad
          </motion.button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-xl">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight">SUGAR ROCKET SIM</h1>
          </div>
          <div className="flex gap-2">
            {['SAFETY', 'DESIGN', 'MIXING', 'HEATING', 'PACKING', 'LAUNCH', 'ANALYSIS'].map((s, i) => (
              <div 
                key={s}
                className={`w-3 h-3 rounded-full ${
                  step === s ? 'bg-blue-600' : i < ['SAFETY', 'DESIGN', 'MIXING', 'HEATING', 'PACKING', 'LAUNCH', 'ANALYSIS'].indexOf(step) ? 'bg-green-500' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full flex justify-center"
          >
            {step === 'SAFETY' && renderSafety()}
            {step === 'DESIGN' && renderDesign()}
            {step === 'MIXING' && renderMixing()}
            {step === 'HEATING' && renderHeating()}
            {step === 'PACKING' && renderPacking()}
            {step === 'LAUNCH' && renderLaunch()}
            {step === 'ANALYSIS' && renderAnalysis()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="mt-auto py-12 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <Info className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
            <div className="space-y-2">
              <h4 className="font-bold text-blue-900">The Science of Sugar Rockets</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                Sugar rockets (R-Candy) typically use Potassium Nitrate (KNO3) as an oxidizer and table sugar (Sucrose) as fuel. 
                The standard ratio is <strong>65:35</strong>. 
                The process involves mixing the powders, heating them until the sugar melts and coats the KNO3, and then packing the resulting "dough" into a motor casing.
              </p>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400">
            Disclaimer: This is a simulation for educational purposes. Real rocketry involves significant risks and should only be performed under expert supervision and in compliance with local laws.
          </p>
        </div>
      </footer>
    </div>
  );
}
