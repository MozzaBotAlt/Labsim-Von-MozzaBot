// Experiment configurations
const EXPERIMENTS = {
  benedicts: {
    id: 'benedicts',
    name: "Benedict's Test",
    description: "Test for reducing sugars (e.g., glucose). Requires heat.",
    reagents: ['benedicts'],
    requiresHeat: true,
    requiresWaterBath: true,
    targetColor: '#ef4444',
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
    targetColor: '#0f172a',
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
    targetColor: '#a855f7',
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
    targetColor: '#ffffff',
    steps: [
      "Add 2cm³ of food sample to a test tube",
      "Add 2cm³ of Ethanol",
      "Shake vigorously to dissolve lipid",
      "Add 2cm³ of distilled water",
      "Observe formation of white emulsion"
    ]
  }
};

// Reagent definitions
const REAGENTS = {
  // Samples
  sample_glucose: { id: 'sample_glucose', label: 'Glucose (High)', color: 'transparent', category: 'sample' },
  sample_glucose_low: { id: 'sample_glucose_low', label: 'Glucose (Low)', color: 'transparent', category: 'sample' },
  sample_starch: { id: 'sample_starch', label: 'Starch', color: '#fef3c7', category: 'sample' },
  sample_protein: { id: 'sample_protein', label: 'Protein', color: '#fde68a', category: 'sample' },
  sample_lipid: { id: 'sample_lipid', label: 'Lipid', color: '#fcd34d', category: 'sample' },
  sample_water: { id: 'sample_water', label: 'Water', color: '#dbeafe', category: 'sample' },

  // Reagent chemicals
  benedicts: { id: 'benedicts', label: "Benedict's", color: '#3b82f6', category: 'reagent' },
  iodine: { id: 'iodine', label: 'Iodine', color: '#b45309', category: 'reagent' },
  biuretA: { id: 'biuretA', label: 'Biuret A', color: '#f3f4f6', category: 'reagent' },
  biuretB: { id: 'biuretB', label: 'Biuret B', color: '#60a5fa', category: 'reagent' },
  ethanol: { id: 'ethanol', label: 'Ethanol', color: '#f3f4f6', category: 'reagent' },
  water: { id: 'water', label: 'Water', color: '#dbeafe', category: 'reagent' }
};

// Color sequences for reactions
const COLOR_SEQUENCES = {
  benedicts_high: ['#3b82f6', '#22c55e', '#eab308', '#f97316', '#ef4444'],
  benedicts_low: ['#3b82f6', '#22c55e', '#eab308']
};
