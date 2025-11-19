'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useQuiz } from '@/lib/context/QuizContext';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime } from '@/lib/utils';

interface QuizScreenProps {
  onQuizComplete: () => void;
}

/**
 * Quiz Screen Component
 * Displays questions with timer and progress
 */
export default function QuizScreen({ onQuizComplete }: QuizScreenProps) {
  const {
    session,
    currentQuestion,
    timeRemaining,
    submitAnswer,
    nextQuestion,
  } = useQuiz();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Check if quiz is complete
  useEffect(() => {
    if (session && !session.isActive && session.answers.length > 0) {
      onQuizComplete();
    }
  }, [session, onQuizComplete]);

  if (!session || !currentQuestion) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg">Loading quiz...</p>
      </div>
    );
  }

  const progress = ((session.currentIndex + 1) / session.questions.length) * 100;
  const isLastQuestion = session.currentIndex === session.questions.length - 1;

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return; // Prevent changing answer after submission
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || showFeedback) return;

    // Check if answer is correct
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    // Submit to context
    submitAnswer(selectedAnswer);

    // Auto-advance after 2 seconds
    setTimeout(() => {
      handleNext();
    }, 2000);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    nextQuestion();
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Top bar - Progress and Timer */}
      <div className="relative z-10 px-4 py-3 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono text-muted-foreground">
              Question {session.currentIndex + 1}/{session.questions.length}
            </span>
            <div className="progress-bar w-32">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div
            className={`text-lg font-mono ${
              timeRemaining <= 5 ? 'timer-warning font-bold' : ''
            }`}
          >
            ⏱ {formatTime(timeRemaining)}
          </div>

          <div className="text-sm font-mono">
            Score: {session.score}
          </div>
        </div>
      </div>

      {/* Question Panel - Bottom overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card glassStrong className="p-6">
                {/* Question */}
                <h2 className="text-xl md:text-2xl font-bold mb-6">
                  {currentQuestion.question}
                </h2>

                {/* Answer Options */}
                {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedAnswer === option ? 'primary' : 'ghost'}
                        size="lg"
                        onClick={() => handleAnswerSelect(option)}
                        disabled={showFeedback}
                        className={`justify-start text-left ${
                          showFeedback && option === currentQuestion.correctAnswer
                            ? 'ring-2 ring-green-500'
                            : showFeedback && option === selectedAnswer && !isCorrect
                            ? 'ring-2 ring-destructive'
                            : ''
                        }`}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'true-false' && (
                  <div className="flex gap-4 mb-6">
                    <Button
                      variant={selectedAnswer === 'true' ? 'primary' : 'ghost'}
                      size="lg"
                      onClick={() => handleAnswerSelect('true')}
                      disabled={showFeedback}
                      className={`flex-1 ${
                        showFeedback && 'true' === currentQuestion.correctAnswer
                          ? 'ring-2 ring-green-500'
                          : showFeedback && 'true' === selectedAnswer && !isCorrect
                          ? 'ring-2 ring-destructive'
                          : ''
                      }`}
                    >
                      ✓ True
                    </Button>
                    <Button
                      variant={selectedAnswer === 'false' ? 'primary' : 'ghost'}
                      size="lg"
                      onClick={() => handleAnswerSelect('false')}
                      disabled={showFeedback}
                      className={`flex-1 ${
                        showFeedback && 'false' === currentQuestion.correctAnswer
                          ? 'ring-2 ring-green-500'
                          : showFeedback && 'false' === selectedAnswer && !isCorrect
                          ? 'ring-2 ring-destructive'
                          : ''
                      }`}
                    >
                      ✗ False
                    </Button>
                  </div>
                )}

                {/* Feedback */}
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg mb-4 ${
                      isCorrect ? 'bg-green-500/20 border border-green-500/50' : 'bg-destructive/20 border border-destructive/50'
                    }`}
                  >
                    <p className="font-semibold mb-2">
                      {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                    </p>
                    {currentQuestion.explanation && (
                      <p className="text-sm text-foreground/80">
                        {currentQuestion.explanation}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Submit/Next Button */}
                {!showFeedback ? (
                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={!selectedAnswer}
                    className="w-full"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleNext}
                    className="w-full"
                  >
                    {isLastQuestion ? 'View Results' : 'Next Question'}
                  </Button>
                )}

                {/* Category badge */}
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  Category: {currentQuestion.category.replace('-', ' ')} • Difficulty: {currentQuestion.difficulty}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Globe Background (placeholder for now) */}
      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
        <div className="text-9xl">🌍</div>
      </div>
    </div>
  );
}
