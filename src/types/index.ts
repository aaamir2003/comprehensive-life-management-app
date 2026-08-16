export type Priority = 'low' | 'medium' | 'high';

export interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
  targetHoursPerDay: number;
  targetHoursPerWeek: number;
  category: string;
}

export interface StudyTask {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  completed: boolean;
  date: string;
  dueTime?: string;
  studyMinutes: number;
  priority: Priority;
  createdAt: string;
}

export interface StudyLog {
  id: string;
  subjectId: string;
  date: string;
  minutes: number;
  notes?: string;
}

export type WorkoutType = 'cardio' | 'strength' | 'endurance' | 'flexibility';

export interface WorkoutExercise {
  id: string;
  name: string;
  type: WorkoutType;
  sets?: number;
  reps?: number;
  weight?: number;
  durationMinutes?: number;
  caloriesBurned?: number;
  completed: boolean;
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  date: string;
  exercises: WorkoutExercise[];
  targetCalories: number;
  targetDurationMinutes: number;
  completed: boolean;
}

export interface DailyGoal {
  date: string;
  studyTargetMinutes: number;
  studyActualMinutes: number;
  workoutTargetMinutes: number;
  workoutActualMinutes: number;
  workoutTargetCalories: number;
  workoutActualCalories: number;
}

export interface ScheduleItem {
  id: string;
  type: 'study' | 'workout' | 'task';
  title: string;
  time: string;
  duration: number;
  completed: boolean;
  color: string;
  relatedId?: string;
}

export type TabType = 'dashboard' | 'study' | 'fitness' | 'analytics';

export interface WeeklyStats {
  totalStudyMinutes: number;
  totalWorkoutMinutes: number;
  totalCaloriesBurned: number;
  tasksCompleted: number;
  totalTasks: number;
  avgProductivity: number;
}
