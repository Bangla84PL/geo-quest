'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type {
  Question,
  QuizSession,
  Answer,
  Difficulty,
  QuizResults,
  Coordinates,
} from '@/types/quiz';
import {
  loadQuestions,
  selectQuizQuestions,
  generateSessionId,
  isClickAnswerCorrect,
  calculateBadge,
} from '@/lib/utils';

interface QuizContextType {
  session: QuizSession | null;
  allQuestions: Question[];
  isLoading: boolean;
  startQuiz: (difficulty: Difficulty) => Promise<void>;
  submitAnswer: (answer: string | Coordinates) => void;
  nextQuestion: () => void;
  getResults: () => QuizResults | null;
  resetQuiz: () => void;
  currentQuestion: Question | null;
  timeRemaining: number;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

/**
 * Quiz Context Provider
 * Manages quiz state, questions, answers, and scoring
 */
export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(20);

  // Load questions on mount
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      const questions = await loadQuestions();
      setAllQuestions(questions);
      setIsLoading(false);
    }
    init();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!session || !session.isActive) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up - auto-submit wrong answer
          submitAnswer('');
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [session?.currentIndex, session?.isActive]);

  /**
   * Start a new quiz session
   */
  const startQuiz = useCallback(
    async (difficulty: Difficulty) => {
      if (allQuestions.length === 0) {
        console.error('No questions loaded');
        return;
      }

      const selectedQuestions = selectQuizQuestions(allQuestions, difficulty, 10);

      const newSession: QuizSession = {
        sessionId: generateSessionId(),
        difficulty,
        questions: selectedQuestions,
        currentIndex: 0,
        answers: [],
        startTime: Date.now(),
        score: 0,
        isActive: true,
      };

      setSession(newSession);
      setTimeRemaining(20);
    },
    [allQuestions]
  );

  /**
   * Submit an answer for the current question
   */
  const submitAnswer = useCallback(
    (userAnswer: string | Coordinates) => {
      if (!session || !session.isActive) return;

      const currentQ = session.questions[session.currentIndex];
      if (!currentQ) return;

      let isCorrect = false;

      // Check answer based on question type
      if (currentQ.type === 'click-to-answer' && typeof userAnswer !== 'string') {
        isCorrect = isClickAnswerCorrect(userAnswer, currentQ.correctAnswer as Coordinates);
      } else if (typeof userAnswer === 'string') {
        isCorrect = userAnswer === currentQ.correctAnswer;
      }

      const answer: Answer = {
        questionId: currentQ.id,
        userAnswer,
        isCorrect,
        timeSpent: 20 - timeRemaining,
      };

      const newAnswers = [...session.answers, answer];
      const newScore = isCorrect ? session.score + 10 : session.score;

      setSession({
        ...session,
        answers: newAnswers,
        score: newScore,
      });
    },
    [session, timeRemaining]
  );

  /**
   * Move to next question
   */
  const nextQuestion = useCallback(() => {
    if (!session) return;

    if (session.currentIndex < session.questions.length - 1) {
      setSession({
        ...session,
        currentIndex: session.currentIndex + 1,
      });
      setTimeRemaining(20);
    } else {
      // Quiz complete
      setSession({
        ...session,
        isActive: false,
      });
    }
  }, [session]);

  /**
   * Get quiz results
   */
  const getResults = useCallback((): QuizResults | null => {
    if (!session || session.answers.length === 0) return null;

    const correctAnswers = session.answers.filter((a) => a.isCorrect).length;
    const totalQuestions = session.questions.length;
    const accuracy = (correctAnswers / totalQuestions) * 100;
    const averageTime =
      session.answers.reduce((sum, a) => sum + a.timeSpent, 0) / session.answers.length;

    return {
      score: session.score,
      totalQuestions,
      correctAnswers,
      accuracy,
      averageTime,
      badge: calculateBadge(accuracy),
      answers: session.answers,
    };
  }, [session]);

  /**
   * Reset quiz state
   */
  const resetQuiz = useCallback(() => {
    setSession(null);
    setTimeRemaining(20);
  }, []);

  const currentQuestion = session?.questions[session.currentIndex] || null;

  const value: QuizContextType = {
    session,
    allQuestions,
    isLoading,
    startQuiz,
    submitAnswer,
    nextQuestion,
    getResults,
    resetQuiz,
    currentQuestion,
    timeRemaining,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

/**
 * Hook to use quiz context
 */
export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
