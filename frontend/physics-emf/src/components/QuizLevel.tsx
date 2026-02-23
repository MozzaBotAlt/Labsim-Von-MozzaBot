import { useState, FC } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../types';

export const QuizLevel: FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === QUIZ_QUESTIONS[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      onComplete(score + (selectedAnswer === QUIZ_QUESTIONS[currentQuestion].correctAnswer ? 1 : 0));
    }
  };

  const question = QUIZ_QUESTIONS[currentQuestion];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-4 max-w-3xl mx-auto"
    >
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-purple-600" />
          Knowledge Check
        </h2>
        <div className="bg-purple-100 text-purple-800 px-4 py-1.5 rounded-full font-mono text-sm font-medium">
          {currentQuestion + 1} / {QUIZ_QUESTIONS.length}
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 w-full relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-slate-100 w-full">
          <motion.div 
            className="h-full bg-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>

        <h3 className="text-xl md:text-2xl font-bold mb-8 text-slate-900 leading-snug">
          {question.question}
        </h3>
        
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => !showExplanation && handleAnswer(idx)}
              disabled={showExplanation}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all flex justify-between items-center group ${
                showExplanation
                  ? idx === question.correctAnswer
                    ? 'bg-green-50 border-green-500 text-green-900'
                    : idx === selectedAnswer
                    ? 'bg-red-50 border-red-500 text-red-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                  : 'bg-white border-slate-200 hover:border-purple-500 hover:bg-purple-50 text-slate-700 shadow-sm'
              }`}
            >
              <span className="font-medium text-lg">{option}</span>
              {showExplanation && idx === question.correctAnswer && <CheckCircle className="w-6 h-6 text-green-600" />}
              {showExplanation && idx === selectedAnswer && idx !== question.correctAnswer && <XCircle className="w-6 h-6 text-red-600" />}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="border-t border-slate-100 pt-6"
            >
              <div className={`p-4 rounded-xl mb-6 ${selectedAnswer === question.correctAnswer ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'}`}>
                <p className="font-bold mb-1">
                  {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Not quite.'}
                </p>
                <p className="text-sm opacity-90">{question.explanation}</p>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={nextQuestion}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold shadow-md flex items-center gap-2 transition-transform hover:scale-105"
                >
                  {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
