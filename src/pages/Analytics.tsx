import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import { TrendingUp, BookOpen, Dumbbell, Target, Calendar, Award, Flame, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { getLast7Days, getDayName, formatMinutes, getPercentage, calculateStreak } from '../utils/helpers';

export function Analytics() {
  const { subjects, studyLogs, workoutPlans, studyTasks, darkMode } = useStore();

  const last7 = getLast7Days();

  // Weekly study data
  const weeklyStudyData = useMemo(() => {
    return last7.map(date => {
      const dayLogs = studyLogs.filter(l => l.date === date);
      const actual = dayLogs.reduce((s, l) => s + l.minutes, 0);
      const target = subjects.reduce((s, sub) => s + sub.targetHoursPerDay * 60, 0);
      return {
        day: getDayName(date),
        actual: Math.round(actual),
        target: Math.round(target),
      };
    });
  }, [studyLogs, subjects, last7]);

  // Weekly workout data
  const weeklyWorkoutData = useMemo(() => {
    return last7.map(date => {
      const dayPlans = workoutPlans.filter(p => p.date === date);
      const actualCal = dayPlans.reduce((s, p) =>
        s + p.exercises.filter(e => e.completed).reduce((es, e) => es + (e.caloriesBurned || 0), 0), 0);
      const targetCal = dayPlans.reduce((s, p) => s + p.targetCalories, 0);
      const actualMin = dayPlans.reduce((s, p) =>
        s + p.exercises.filter(e => e.completed).reduce((es, e) => es + (e.durationMinutes || 0), 0), 0);
      return {
        day: getDayName(date),
        calories: actualCal,
        targetCal,
        minutes: actualMin,
      };
    });
  }, [workoutPlans, last7]);

  // Subject distribution
  const subjectPieData = useMemo(() => {
    return subjects.map(sub => {
      const totalMin = studyLogs.filter(l => l.subjectId === sub.id).reduce((s, l) => s + l.minutes, 0);
      return { name: sub.name, value: totalMin, color: sub.color };
    }).filter(d => d.value > 0);
  }, [subjects, studyLogs]);

  // Productivity trend
  const productivityData = useMemo(() => {
    return last7.map(date => {
      const dayLogs = studyLogs.filter(l => l.date === date);
      const studyActual = dayLogs.reduce((s, l) => s + l.minutes, 0);
      const studyTarget = subjects.reduce((s, sub) => s + sub.targetHoursPerDay * 60, 0);
      const studyPct = getPercentage(studyActual, studyTarget);

      const dayTasks = studyTasks.filter(t => t.date === date);
      const taskPct = getPercentage(
        dayTasks.filter(t => t.completed).length,
        dayTasks.length
      );

      const dayPlans = workoutPlans.filter(p => p.date === date);
      const wActual = dayPlans.reduce((s, p) =>
        s + p.exercises.filter(e => e.completed).reduce((es, e) => es + (e.durationMinutes || 0), 0), 0);
      const wTarget = dayPlans.reduce((s, p) => s + p.targetDurationMinutes, 0);
      const workoutPct = getPercentage(wActual, wTarget);

      const score = Math.round(studyPct * 0.4 + taskPct * 0.3 + workoutPct * 0.3);
      return { day: getDayName(date), score };
    });
  }, [studyLogs, studyTasks, workoutPlans, subjects, last7]);

  // Weekly totals
  const weeklyTotalStudy = studyLogs
    .filter(l => last7.includes(l.date))
    .reduce((s, l) => s + l.minutes, 0);

  const weeklyTotalWorkout = workoutPlans
    .filter(p => last7.includes(p.date))
    .reduce((s, p) => s + p.exercises.filter(e => e.completed).reduce((es, e) => es + (e.durationMinutes || 0), 0), 0);

  const weeklyTotalCal = workoutPlans
    .filter(p => last7.includes(p.date))
    .reduce((s, p) => s + p.exercises.filter(e => e.completed).reduce((es, e) => es + (e.caloriesBurned || 0), 0), 0);

  const weeklyTasks = studyTasks.filter(t => last7.includes(t.date));
  const weeklyTasksDone = weeklyTasks.filter(t => t.completed).length;

  const avgProductivity = Math.round(productivityData.reduce((s, d) => s + d.score, 0) / 7);

  // Calculate streaks
  const studyDates = studyLogs.map(l => l.date);
  const studyStreak = calculateStreak(studyDates);

  const workoutDates = workoutPlans
    .filter(p => p.exercises.some(e => e.completed))
    .map(p => p.date);
  const workoutStreak = calculateStreak(workoutDates);

  const textColor = darkMode ? '#9ca3af' : '#6b7280';
  const gridColor = darkMode ? '#374151' : '#e5e7eb';

  // Format tooltip values
  const formatTooltipValue = (value: unknown) => {
    if (typeof value === 'number') {
      return formatMinutes(value);
    }
    return String(value);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Weekly Summary */}
      <Card className="bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-800/20 border-violet-200 dark:border-violet-700/50" printCard>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-violet-500" />
          <p className="text-sm font-medium text-violet-600 dark:text-violet-400">Weekly Summary</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3">
            <BookOpen className="w-4 h-4 text-primary-500 mb-1" />
            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatMinutes(weeklyTotalStudy)}</p>
            <p className="text-[10px] text-gray-400">Total Study</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3">
            <Dumbbell className="w-4 h-4 text-fitness-500 mb-1" />
            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatMinutes(weeklyTotalWorkout)}</p>
            <p className="text-[10px] text-gray-400">Total Workout</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3">
            <Target className="w-4 h-4 text-accent-500 mb-1" />
            <p className="text-xl font-bold text-gray-900 dark:text-white">{weeklyTasksDone}<span className="text-sm font-normal text-gray-400">/{weeklyTasks.length}</span></p>
            <p className="text-[10px] text-gray-400">Tasks Done</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3">
            <Award className="w-4 h-4 text-amber-500 mb-1" />
            <p className="text-xl font-bold text-gray-900 dark:text-white">{avgProductivity}%</p>
            <p className="text-[10px] text-gray-400">Avg Score</p>
          </div>
        </div>
      </Card>

      {/* Streaks */}
      <div className="grid grid-cols-2 gap-3">
        <Card printCard className="relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full" />
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">📚</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Study Streak</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{studyStreak} <span className="text-sm font-normal text-gray-400">days</span></p>
          <ProgressBar progress={Math.min(studyStreak * 10, 100)} color="bg-amber-500" className="mt-2" height="h-1" />
        </Card>
        <Card printCard className="relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-fitness-50 dark:bg-fitness-900/20 rounded-full" />
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">💪</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Workout Streak</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{workoutStreak} <span className="text-sm font-normal text-gray-400">days</span></p>
          <ProgressBar progress={Math.min(workoutStreak * 10, 100)} color="bg-fitness-500" className="mt-2" height="h-1" />
        </Card>
      </div>

      {/* Productivity Trend */}
      <Card printCard>
        <CardHeader>
          <CardTitle icon={<TrendingUp className="w-5 h-5 text-violet-500" />}>
            Productivity Trend
          </CardTitle>
        </CardHeader>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={productivityData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradProd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: textColor }} />
              <YAxis tick={{ fontSize: 11, fill: textColor }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                  color: darkMode ? '#fff' : '#000',
                }}
                formatter={(value: unknown) => [`${value}%`, 'Score']}
              />
              <Area type="monotone" dataKey="score" stroke="#8b5cf6" fill="url(#gradProd)" strokeWidth={2.5} dot={{ r: 4, fill: '#8b5cf6' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Study vs Target */}
      <Card printCard>
        <CardHeader>
          <CardTitle icon={<BookOpen className="w-5 h-5 text-primary-500" />}>
            Study: Actual vs Target
          </CardTitle>
        </CardHeader>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyStudyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: textColor }} />
              <YAxis tick={{ fontSize: 11, fill: textColor }} />
              <Tooltip
                formatter={(value: unknown) => formatTooltipValue(value)}
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                  color: darkMode ? '#fff' : '#000',
                }}
              />
              <Bar dataKey="target" fill={darkMode ? '#374151' : '#e5e7eb'} radius={[4, 4, 0, 0]} name="Target" />
              <Bar dataKey="actual" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Workout Calories */}
      <Card printCard>
        <CardHeader>
          <CardTitle icon={<Flame className="w-5 h-5 text-orange-500" />}>
            Workout Calories
          </CardTitle>
        </CardHeader>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyWorkoutData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: textColor }} />
              <YAxis tick={{ fontSize: 11, fill: textColor }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                  color: darkMode ? '#fff' : '#000',
                }}
                formatter={(value: unknown) => [`${value} kcal`]}
              />
              <Line type="monotone" dataKey="targetCal" stroke={darkMode ? '#6b7280' : '#d1d5db'} strokeDasharray="5 5" name="Target" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={2.5} dot={{ r: 4, fill: '#f97316' }} name="Burned" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Workout Duration */}
      <Card printCard>
        <CardHeader>
          <CardTitle icon={<Clock className="w-5 h-5 text-fitness-500" />}>
            Workout Duration
          </CardTitle>
        </CardHeader>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyWorkoutData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: textColor }} />
              <YAxis tick={{ fontSize: 11, fill: textColor }} />
              <Tooltip
                formatter={(value: unknown) => formatTooltipValue(value)}
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                  color: darkMode ? '#fff' : '#000',
                }}
              />
              <Bar dataKey="minutes" fill="#ec4899" radius={[4, 4, 0, 0]} name="Duration" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Subject Distribution */}
      {subjectPieData.length > 0 && (
        <Card printCard>
          <CardHeader>
            <CardTitle icon={<Target className="w-5 h-5 text-accent-500" />}>
              Study Distribution
            </CardTitle>
          </CardHeader>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                >
                  {subjectPieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  formatter={(value: string) => <span className="text-xs text-gray-600 dark:text-gray-300">{value}</span>}
                />
                <Tooltip
                  formatter={(value: unknown) => formatTooltipValue(value)}
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                    color: darkMode ? '#fff' : '#000',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Weekly Totals Summary */}
      <Card printCard>
        <CardHeader>
          <CardTitle icon={<Award className="w-5 h-5 text-amber-500" />}>
            Weekly Totals
          </CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatMinutes(weeklyTotalStudy)}</p>
            <p className="text-xs text-gray-400 mt-0.5">Total Study Time</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatMinutes(weeklyTotalWorkout)}</p>
            <p className="text-xs text-gray-400 mt-0.5">Total Workout</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{weeklyTotalCal}</p>
            <p className="text-xs text-gray-400 mt-0.5">Calories Burned</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{weeklyTasksDone}</p>
            <p className="text-xs text-gray-400 mt-0.5">Tasks Completed</p>
          </div>
        </div>
      </Card>

      {/* Print Report */}
      <div className="print-only mt-8 print-section">
        <h2 className="print-title">Weekly Analytics Report</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <h3 className="font-bold mb-2">Study Statistics</h3>
            <p>Total Study Time: {formatMinutes(weeklyTotalStudy)}</p>
            <p>Tasks Completed: {weeklyTasksDone}/{weeklyTasks.length}</p>
            <p>Study Streak: {studyStreak} days</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Fitness Statistics</h3>
            <p>Total Workout: {formatMinutes(weeklyTotalWorkout)}</p>
            <p>Calories Burned: {weeklyTotalCal} kcal</p>
            <p>Workout Streak: {workoutStreak} days</p>
          </div>
        </div>
        <p className="mt-4 font-bold">Average Productivity Score: {avgProductivity}%</p>
      </div>
    </div>
  );
}
