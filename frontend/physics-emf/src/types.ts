export type GameState = 'welcome' | 'battery' | 'circuit' | 'quiz' | 'summary';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the definition of Electromotive Force (EMF)?",
    options: [
      "The force that pushes electrons",
      "The energy supplied by a source in driving unit charge round a complete circuit",
      "The potential difference across a resistor",
      "The current flowing through a battery"
    ],
    correctAnswer: 1,
    explanation: "EMF is defined as the energy supplied by a source in driving unit charge round a complete circuit. It is measured in Volts (J/C)."
  },
  {
    id: 2,
    question: "What is the unit of EMF?",
    options: [
      "Amperes (A)",
      "Ohms (Ω)",
      "Volts (V)",
      "Joules (J)"
    ],
    correctAnswer: 2,
    explanation: "EMF is measured in Volts (V), which is equivalent to Joules per Coulomb (J/C)."
  },
  {
    id: 3,
    question: "How is EMF different from Potential Difference (p.d.)?",
    options: [
      "They are exactly the same",
      "EMF is energy given to charge, p.d. is energy used by charge",
      "EMF is measured in Amps, p.d. in Volts",
      "p.d. is only for batteries"
    ],
    correctAnswer: 1,
    explanation: "EMF refers to energy transferred TO electrical form (in a battery), while p.d. refers to energy transferred FROM electrical form (in a component)."
  }
];
