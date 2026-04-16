export interface TrainingProgress {
  brainSeconds: number;
  breathingSeconds: number;
  breathingByExercise: Record<string, number>;
  updatedAt: string | null;
}

export type ProgressArea = 'brain' | 'breathing';
