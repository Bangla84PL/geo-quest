'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useQuiz } from '@/lib/context/QuizContext';
import { motion } from 'framer-motion';
import { getBadgeEmoji, getBadgeLabel, formatTime } from '@/lib/utils';

interface ResultsScreenProps {
  onPlayAgain: () => void;
}

/**
 * Results Screen Component
 * Displays quiz results with score, badge, and statistics
 */
export default function ResultsScreen({ onPlayAgain }: ResultsScreenProps) {
  const { getResults, resetQuiz } = useQuiz();
  const results = getResults();

  if (!results) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg">No results available</p>
      </div>
    );
  }

  const handlePlayAgain = () => {
    resetQuiz();
    onPlayAgain();
  };

  const handleShare = async () => {
    const shareText = `I scored ${results.score}/100 (${results.correctAnswers}/${results.totalQuestions} correct) on GeoQuest! ${getBadgeEmoji(results.badge)} ${getBadgeLabel(results.badge)}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'GeoQuest Results',
          text: shareText,
          url: window.location.href,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        alert('Score copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90" />

      {/* Results Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl w-full"
      >
        <Card glassStrong className="p-8 md:p-12 text-center">
          {/* Trophy */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-8xl mb-4 badge-float"
          >
            {getBadgeEmoji(results.badge)}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl font-bold mb-2"
          >
            Quiz Complete!
          </motion.h1>

          {/* Badge */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-primary font-semibold mb-8"
          >
            {getBadgeLabel(results.badge)}
          </motion.p>

          {/* Score */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="bg-accent/20 rounded-lg p-6 mb-8"
          >
            <div className="text-6xl md:text-7xl font-bold text-primary mb-2">
              {results.correctAnswers}/{results.totalQuestions}
            </div>
            <div className="text-lg text-muted-foreground">
              {results.score} points • {results.accuracy.toFixed(0)}% accuracy
            </div>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            <div className="bg-background/50 rounded-lg p-4">
              <div className="text-3xl font-bold text-secondary">
                {results.accuracy.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="bg-background/50 rounded-lg p-4">
              <div className="text-3xl font-bold text-secondary">
                {formatTime(results.averageTime)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Time</div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="lg"
              glow
              onClick={handlePlayAgain}
              className="flex-1"
              aria-label="Play again"
            >
              Play Again
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={handleShare}
              className="flex-1"
              aria-label="Share score"
            >
              📤 Share Score
            </Button>
          </motion.div>

          {/* Performance Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-sm text-muted-foreground"
          >
            {results.accuracy >= 90
              ? "Outstanding! You're a geography expert! 🌟"
              : results.accuracy >= 75
              ? "Great job! You really know your geography! 🎉"
              : results.accuracy >= 60
              ? "Good effort! Keep exploring to improve! 💪"
              : "Keep practicing! Geography is an adventure! 🗺️"}
          </motion.p>
        </Card>
      </motion.div>
    </div>
  );
}
