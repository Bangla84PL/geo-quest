'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { Difficulty } from '@/types/quiz';
import { useQuiz } from '@/lib/context/QuizContext';
import { motion } from 'framer-motion';

interface HomeScreenProps {
  onStartQuiz: () => void;
}

/**
 * Home Screen Component
 * Landing page with logo, description, and start quiz button
 */
export default function HomeScreen({ onStartQuiz }: HomeScreenProps) {
  const { startQuiz, isLoading } = useQuiz();
  const [showDifficultySelect, setShowDifficultySelect] = useState(false);

  const handleStart = () => {
    setShowDifficultySelect(true);
  };

  const handleDifficultySelect = async (difficulty: Difficulty) => {
    await startQuiz(difficulty);
    onStartQuiz();
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90 z-0" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-2xl"
      >
        {/* Logo */}
        <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
          GeoQuest
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          Explore the World in 3D
        </p>

        {/* Description */}
        <p className="text-base md:text-lg text-foreground/80 mb-12 max-w-xl mx-auto">
          Test your geography knowledge with an immersive interactive globe. Answer questions about capitals, cities, mountains, and more!
        </p>

        {/* Difficulty Selection or Start Button */}
        {!showDifficultySelect ? (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              glow
              onClick={handleStart}
              disabled={isLoading}
              aria-label="Start Quiz"
              className="min-w-[200px]"
            >
              {isLoading ? 'Loading...' : 'START QUIZ'}
            </Button>
          </motion.div>
        ) : (
          <Card glassStrong className="p-8">
            <h2 className="text-2xl font-bold mb-6">Select Difficulty</h2>
            <div className="flex flex-col gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleDifficultySelect('easy')}
                aria-label="Easy difficulty"
              >
                🟢 Easy
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleDifficultySelect('medium')}
                aria-label="Medium difficulty"
              >
                🟡 Medium
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleDifficultySelect('hard')}
                aria-label="Hard difficulty"
              >
                🔴 Hard
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowDifficultySelect(false)}
                aria-label="Go back"
              >
                Back
              </Button>
            </div>
          </Card>
        )}

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm"
        >
          <div>
            <div className="text-3xl mb-2">🌍</div>
            <h3 className="font-semibold mb-1">Interactive 3D Globe</h3>
            <p className="text-muted-foreground">Powered by Cesium.js</p>
          </div>
          <div>
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-semibold mb-1">250+ Questions</h3>
            <p className="text-muted-foreground">Covering the entire world</p>
          </div>
          <div>
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold mb-1">Instant Play</h3>
            <p className="text-muted-foreground">No login required</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
