import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Subject, StudyTask, StudyLog, WorkoutPlan, WorkoutExercise, Priority } from '../types';

const TODAY = () => new Date().toISOString().split('T')[0];
const NOW = () => new Date().toISOString();

function loadFromLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return fallback;
}

function saveToLS(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// Default subjects with icons
const defaultSubjects: Subject[] = [
  { id: uuidv4(), name: 'Mathematics', color: '#3b82f6', icon: '📐', targetHoursPerDay: 2, targetHoursPerWeek: 12, category: 'Science' },
  { id: uuidv4(), name: 'Physics', color: '#8b5cf6', icon: '⚛️', targetHoursPerDay: 1.5, targetHoursPerWeek: 9, category: 'Science' },
  { id: uuidv4(), name: 'English', color: '#10b981', icon: '📚', targetHoursPerDay: 1, targetHoursPerWeek: 6, category: 'Language' },
];

interface AppState {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Subjects
  subjects: Subject[];
  addSubject: (data: Omit<Subject, 'id'>) => void;
  removeSubject: (id: string) => void;
  updateSubject: (id: string, data: Partial<Subject>) => void;

  // Study Tasks
  studyTasks: StudyTask[];
  addStudyTask: (subjectId: string, title: string, priority?: Priority, description?: string, dueTime?: string, date?: string) => void;
  toggleStudyTask: (id: string) => void;
  removeStudyTask: (id: string) => void;
  updateStudyTask: (id: string, data: Partial<StudyTask>) => void;
  updateStudyTaskMinutes: (id: string, minutes: number) => void;

  // Study Logs
  studyLogs: StudyLog[];
  addStudyLog: (subjectId: string, minutes: number, notes?: string, date?: string) => void;
  removeStudyLog: (id: string) => void;

  // Workout Plans
  workoutPlans: WorkoutPlan[];
  addWorkoutPlan: (name: string, targetCalories: number, targetDuration: number, date?: string) => void;
  removeWorkoutPlan: (id: string) => void;
  updateWorkoutPlan: (id: string, data: Partial<WorkoutPlan>) => void;
  toggleWorkoutPlanComplete: (id: string) => void;
  addExercise: (planId: string, exercise: Omit<WorkoutExercise, 'id' | 'completed'>) => void;
  removeExercise: (planId: string, exerciseId: string) => void;
  toggleExercise: (planId: string, exerciseId: string) => void;
  updateExercise: (planId: string, exerciseId: string, data: Partial<WorkoutExercise>) => void;

  // Selected date
  selectedDate: string;
  setSelectedDate: (date: string) => void;

  // Clear all data
  clearAllData: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Theme
  darkMode: loadFromLS('darkMode', window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false),
  toggleDarkMode: () => {
    const next = !get().darkMode;
    saveToLS('darkMode', next);
    set({ darkMode: next });
  },

  // Subjects
  subjects: loadFromLS('subjects', defaultSubjects),
  addSubject: (data) => {
    const subjects = [...get().subjects, { ...data, id: uuidv4() }];
    saveToLS('subjects', subjects);
    set({ subjects });
  },
  removeSubject: (id) => {
    const subjects = get().subjects.filter(s => s.id !== id);
    saveToLS('subjects', subjects);
    set({ subjects });
  },
  updateSubject: (id, data) => {
    const subjects = get().subjects.map(s => s.id === id ? { ...s, ...data } : s);
    saveToLS('subjects', subjects);
    set({ subjects });
  },

  // Study Tasks
  studyTasks: loadFromLS('studyTasks', []),
  addStudyTask: (subjectId, title, priority = 'medium', description, dueTime, date) => {
    const tasks = [...get().studyTasks, {
      id: uuidv4(),
      subjectId,
      title,
      description,
      dueTime,
      completed: false,
      date: date || TODAY(),
      studyMinutes: 0,
      priority,
      createdAt: NOW(),
    }];
    saveToLS('studyTasks', tasks);
    set({ studyTasks: tasks });
  },
  toggleStudyTask: (id) => {
    const tasks = get().studyTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveToLS('studyTasks', tasks);
    set({ studyTasks: tasks });
  },
  removeStudyTask: (id) => {
    const tasks = get().studyTasks.filter(t => t.id !== id);
    saveToLS('studyTasks', tasks);
    set({ studyTasks: tasks });
  },
  updateStudyTask: (id, data) => {
    const tasks = get().studyTasks.map(t => t.id === id ? { ...t, ...data } : t);
    saveToLS('studyTasks', tasks);
    set({ studyTasks: tasks });
  },
  updateStudyTaskMinutes: (id, minutes) => {
    const tasks = get().studyTasks.map(t => t.id === id ? { ...t, studyMinutes: minutes } : t);
    saveToLS('studyTasks', tasks);
    set({ studyTasks: tasks });
  },

  // Study Logs
  studyLogs: loadFromLS('studyLogs', []),
  addStudyLog: (subjectId, minutes, notes, date) => {
    const logs = [...get().studyLogs, { id: uuidv4(), subjectId, date: date || TODAY(), minutes, notes }];
    saveToLS('studyLogs', logs);
    set({ studyLogs: logs });
  },
  removeStudyLog: (id) => {
    const logs = get().studyLogs.filter(l => l.id !== id);
    saveToLS('studyLogs', logs);
    set({ studyLogs: logs });
  },

  // Workout Plans
  workoutPlans: loadFromLS('workoutPlans', []),
  addWorkoutPlan: (name, targetCalories, targetDuration, date) => {
    const plans = [...get().workoutPlans, {
      id: uuidv4(),
      name,
      date: date || TODAY(),
      exercises: [],
      targetCalories,
      targetDurationMinutes: targetDuration,
      completed: false,
    }];
    saveToLS('workoutPlans', plans);
    set({ workoutPlans: plans });
  },
  removeWorkoutPlan: (id) => {
    const plans = get().workoutPlans.filter(p => p.id !== id);
    saveToLS('workoutPlans', plans);
    set({ workoutPlans: plans });
  },
  updateWorkoutPlan: (id, data) => {
    const plans = get().workoutPlans.map(p => p.id === id ? { ...p, ...data } : p);
    saveToLS('workoutPlans', plans);
    set({ workoutPlans: plans });
  },
  toggleWorkoutPlanComplete: (id) => {
    const plans = get().workoutPlans.map(p => p.id === id ? { ...p, completed: !p.completed } : p);
    saveToLS('workoutPlans', plans);
    set({ workoutPlans: plans });
  },
  addExercise: (planId, exercise) => {
    const plans = get().workoutPlans.map(p => {
      if (p.id === planId) {
        return { ...p, exercises: [...p.exercises, { ...exercise, id: uuidv4(), completed: false }] };
      }
      return p;
    });
    saveToLS('workoutPlans', plans);
    set({ workoutPlans: plans });
  },
  removeExercise: (planId, exerciseId) => {
    const plans = get().workoutPlans.map(p => {
      if (p.id === planId) {
        return { ...p, exercises: p.exercises.filter(e => e.id !== exerciseId) };
      }
      return p;
    });
    saveToLS('workoutPlans', plans);
    set({ workoutPlans: plans });
  },
  toggleExercise: (planId, exerciseId) => {
    const plans = get().workoutPlans.map(p => {
      if (p.id === planId) {
        return { ...p, exercises: p.exercises.map(e => e.id === exerciseId ? { ...e, completed: !e.completed } : e) };
      }
      return p;
    });
    saveToLS('workoutPlans', plans);
    set({ workoutPlans: plans });
  },
  updateExercise: (planId, exerciseId, data) => {
    const plans = get().workoutPlans.map(p => {
      if (p.id === planId) {
        return { ...p, exercises: p.exercises.map(e => e.id === exerciseId ? { ...e, ...data } : e) };
      }
      return p;
    });
    saveToLS('workoutPlans', plans);
    set({ workoutPlans: plans });
  },

  // Selected date
  selectedDate: TODAY(),
  setSelectedDate: (date) => set({ selectedDate: date }),

  // Clear all data
  clearAllData: () => {
    localStorage.clear();
    set({
      subjects: defaultSubjects,
      studyTasks: [],
      studyLogs: [],
      workoutPlans: [],
      selectedDate: TODAY(),
    });
  },
}));
