/**
 * Quiz Type Definitions
 * Defines all data structures for the GeoQuest quiz system
 */

/**
 * Geographic coordinates
 */
export interface Coordinates {
  lat: number;
  lon: number;
  radius?: number; // acceptable answer radius in km
}

/**
 * Question difficulty levels
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Question categories
 */
export type Category =
  | 'capitals'
  | 'cities'
  | 'mountains'
  | 'rivers'
  | 'geographic-regions'
  | 'fun-facts';

/**
 * Question types
 */
export type QuestionType = 'multiple-choice' | 'click-to-answer' | 'true-false';

/**
 * Base question interface
 */
export interface Question {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  category: Category;
  question: string;
  options?: string[]; // for multiple-choice questions
  correctAnswer: string | Coordinates; // string for MC/TF, coords for click
  explanation?: string;
  targetLocation?: Coordinates; // for globe zoom/highlight
}

/**
 * Quiz session state (client-side only)
 */
export interface QuizSession {
  sessionId: string;
  difficulty: Difficulty;
  questions: Question[];
  currentIndex: number;
  answers: Answer[];
  startTime: number;
  score: number;
  isActive: boolean;
}

/**
 * User answer
 */
export interface Answer {
  questionId: string;
  userAnswer: string | Coordinates | null;
  isCorrect: boolean;
  timeSpent: number; // seconds
}

/**
 * Performance badge types
 */
export type Badge = 'bronze' | 'silver' | 'gold' | 'platinum';

/**
 * Quiz results
 */
export interface QuizResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number; // percentage
  averageTime: number; // seconds
  badge: Badge;
  answers: Answer[];
}

/**
 * Question bank structure
 */
export interface QuestionBank {
  version: string;
  lastUpdated: string;
  questions: Question[];
}
