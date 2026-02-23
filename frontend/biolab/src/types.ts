import { LucideIcon } from 'lucide-react';

export type ReagentType = 
  | 'benedicts' 
  | 'iodine' 
  | 'biuretA' 
  | 'biuretB' 
  | 'ethanol' 
  | 'water' 
  | 'sample_starch' 
  | 'sample_glucose' 
  | 'sample_glucose_low'
  | 'sample_protein' 
  | 'sample_lipid' 
  | 'sample_water';

export interface LabState {
  selectedTest: 'benedicts' | 'iodine' | 'biuret' | 'ethanol' | null;
  tubeContents: ReagentType[];
  tubeColor: string | string[];
  tubeOpacity: number; // 0-1
  isHeated: boolean;
  isShaken: boolean;
  hasGoggles: boolean;
  temperature: number;
  messages: LogMessage[];
  status: 'idle' | 'success' | 'failed';
  failureReason?: string;
}

export interface LogMessage {
  id: string;
  text: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface ExperimentConfig {
  id: string;
  name: string;
  description: string;
  reagents: ReagentType[];
  requiresHeat: boolean;
  requiresWaterBath: boolean;
  targetColor: string;
  steps: string[];
}
