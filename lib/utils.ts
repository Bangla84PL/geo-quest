import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Question, Difficulty, Badge, Coordinates } from '@/types/quiz';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Load questions from the JSON file
 */
export async function loadQuestions(): Promise<Question[]> {
  try {
    const response = await fetch('/data/questions.json');
    if (!response.ok) {
      throw new Error('Failed to load questions');
    }
    const data = await response.json();
    return data.questions || [];
  } catch (error) {
    console.error('Error loading questions:', error);
    return [];
  }
}

/**
 * Filter questions by difficulty and randomly select N questions
 */
export function selectQuizQuestions(
  allQuestions: Question[],
  difficulty: Difficulty,
  count: number = 10
): Question[] {
  const filtered = allQuestions.filter((q) => q.difficulty === difficulty);

  // Shuffle and select
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lon - coord1.lon);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Check if a click answer is correct (within radius)
 */
export function isClickAnswerCorrect(
  userClick: Coordinates,
  correctAnswer: Coordinates
): boolean {
  const distance = calculateDistance(userClick, correctAnswer);
  const allowedRadius = correctAnswer.radius || 100; // Default 100km radius
  return distance <= allowedRadius;
}

/**
 * Calculate badge based on score percentage
 */
export function calculateBadge(percentage: number): Badge {
  if (percentage >= 90) return 'platinum';
  if (percentage >= 75) return 'gold';
  if (percentage >= 60) return 'silver';
  return 'bronze';
}

/**
 * Get badge emoji
 */
export function getBadgeEmoji(badge: Badge): string {
  const badges = {
    platinum: '💎',
    gold: '🏆',
    silver: '⭐',
    bronze: '🥉',
  };
  return badges[badge];
}

/**
 * Get badge label
 */
export function getBadgeLabel(badge: Badge): string {
  const labels = {
    platinum: 'PLATINUM EXPLORER',
    gold: 'GOLD EXPLORER',
    silver: 'SILVER EXPLORER',
    bronze: 'BRONZE EXPLORER',
  };
  return labels[badge];
}

/**
 * Format time in seconds to MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate environment variables
 */
export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
  }
}
