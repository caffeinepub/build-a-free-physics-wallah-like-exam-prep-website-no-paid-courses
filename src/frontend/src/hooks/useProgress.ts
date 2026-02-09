import { useState, useEffect } from 'react';

interface ProgressData {
  [lessonId: string]: boolean;
}

const STORAGE_KEY = 'exam-prep-progress';

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }, [progress]);

  const markComplete = (lessonId: string) => {
    setProgress(prev => ({ ...prev, [lessonId]: true }));
  };

  const markIncomplete = (lessonId: string) => {
    setProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[lessonId];
      return newProgress;
    });
  };

  const isComplete = (lessonId: string) => {
    return !!progress[lessonId];
  };

  const getCompletionCount = (lessonIds: string[]) => {
    return lessonIds.filter(id => progress[id]).length;
  };

  return {
    markComplete,
    markIncomplete,
    isComplete,
    getCompletionCount,
    progress
  };
}
