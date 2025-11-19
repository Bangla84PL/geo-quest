'use client';

import { useState } from 'react';
import { QuizProvider } from '@/lib/context/QuizContext';
import HomeScreen from '@/components/screens/HomeScreen';
import QuizScreen from '@/components/screens/QuizScreen';
import ResultsScreen from '@/components/screens/ResultsScreen';

/**
 * Main App Component
 * Manages the quiz flow between Home, Quiz, and Results screens
 */
export default function Home() {
  const [screen, setScreen] = useState<'home' | 'quiz' | 'results'>('home');

  const handleStartQuiz = () => {
    setScreen('quiz');
  };

  const handleQuizComplete = () => {
    setScreen('results');
  };

  const handlePlayAgain = () => {
    setScreen('home');
  };

  return (
    <QuizProvider>
      <main className="relative w-full h-screen overflow-hidden">
        {screen === 'home' && <HomeScreen onStartQuiz={handleStartQuiz} />}
        {screen === 'quiz' && <QuizScreen onQuizComplete={handleQuizComplete} />}
        {screen === 'results' && <ResultsScreen onPlayAgain={handlePlayAgain} />}
      </main>
    </QuizProvider>
  );
}
