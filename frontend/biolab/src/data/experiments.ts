import { ExperimentConfig } from '../types';

export const EXPERIMENTS: Record<string, ExperimentConfig> = {
  benedicts: {
    id: 'benedicts',
    name: "Benedict's Test",
    description: "Test for reducing sugars (e.g., glucose). Requires heat.",
    reagents: ['benedicts'],
    requiresHeat: true,
    requiresWaterBath: true,
    targetColor: 'bg-orange-500', // Brick red/orange
    steps: [
      "Add 2cm³ of food sample to a test tube",
      "Add 2cm³ of Benedict's solution",
      "Heat in a boiling water bath for 5 minutes",
      "Observe color change (Blue → Green → Yellow → Orange → Brick Red)"
    ]
  },
  iodine: {
    id: 'iodine',
    name: "Iodine Test",
    description: "Test for starch.",
    reagents: ['iodine'],
    requiresHeat: false,
    requiresWaterBath: false,
    targetColor: 'bg-slate-900', // Blue-black
    steps: [
      "Add 2cm³ of food sample to a test tube",
      "Add a few drops of Iodine solution",
      "Observe color change (Orange-brown → Blue-black)"
    ]
  },
  biuret: {
    id: 'biuret',
    name: "Biuret Test",
    description: "Test for proteins.",
    reagents: ['biuretA', 'biuretB'],
    requiresHeat: false,
    requiresWaterBath: false,
    targetColor: 'bg-purple-600', // Lilac/Purple
    steps: [
      "Add 2cm³ of food sample to a test tube",
      "Add 2cm³ of Biuret A (NaOH) and Biuret B (CuSO4)",
      "Shake gently",
      "Observe color change (Blue → Purple/Lilac)"
    ]
  },
  ethanol: {
    id: 'ethanol',
    name: "Ethanol Emulsion Test",
    description: "Test for fats/lipids.",
    reagents: ['ethanol', 'water'],
    requiresHeat: false,
    requiresWaterBath: false,
    targetColor: 'bg-white/90', // Cloudy white
    steps: [
      "Add 2cm³ of food sample to a test tube",
      "Add 2cm³ of Ethanol",
      "Shake vigorously to dissolve lipid",
      "Add 2cm³ of distilled water",
      "Observe formation of white emulsion"
    ]
  }
};
