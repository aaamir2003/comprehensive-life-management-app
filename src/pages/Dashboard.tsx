import {
  BookOpen, Dumbbell, Flame, Clock, Target, TrendingUp,
  ChevronLeft, ChevronRight, Zap, Award, CheckCircle2, Calendar,
  Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { ProgressRing } from '../components/ui/ProgressRing';
import { ProgressBar } from '../components/ui/ProgressBar';
import { PriorityBadge } from '../components/ui/Badge';
import {
  formatMinutes, getPercentage, formatDate, isToday,
  sortByPriority, getGreeting
} from '../utils/helpers';
import { cn } from '../utils/cn';

export function Dashboard() {
  const { subjects, studyTasks, studyLogs, workoutPlans, selectedDate, setSelectedDate } = useStore();

  const todayTasks = studyTasks.filter(t => t.date === selectedDate);
  const todayLogs = studyLogs.filter(l => l.date === selectedDate);
  const todayPlans = workoutPlans.filter(p => p.date === selectedDate);

  // Study stats
  const totalStudyTarget = subjects.reduce((sum, s) => sum + s.targetHoursPerDay * 60, 0);
  const totalStudyActual = todayLogs.reduce((sum, l) => sum + l.minutes, 0);
  const studyProgress = getPercentage(totalStudyActual, totalStudyTarget);

  // Task completion
  const totalTasks = todayTasks.length;
  const completedTasks = todayTasks.filter(t => t.completed).length;
  const taskProgress = getPercentage(completedTasks, totalTasks);
  const highPriorityPending = todayTasks.filter(t => t.priority === 'high' && !t.completed).length;

  // Workout stats
  const totalWorkoutTarget = todayPlans.reduce((sum, p) => sum + p.targetDurationMinutes, 0);
  const totalWorkoutActual = todayPlans.reduce((sum, p) =>
    sum + p.exercises.filter(e => e.completed).reduce((es, e) => es + (e.durationMinutes || 0), 0), 0);
  const workoutProgress = getPercentage(totalWorkoutActual, totalWorkoutTarget);

  const totalCalTarget = todayPlans.reduce((sum, p) => sum + p.targetCalories, 0);
  const totalCalActual = todayPlans.reduce((sum, p) =>
    sum + p.exercises.filter(e => e.completed).reduce((es, e) => es + (e.caloriesBurned || 0), 0), 0);
  const caloriesProgress = getPercentage(totalCalActual, totalCalTarget);

  // Productivity Score
  const productivityScore = Math.round(
    (studyProgress * 0.4 + taskProgress * 0.3 + workoutProgress * 0.3)
  );

  const navigateDate = (dir: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + dir);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const isTodaySelected = isToday(selectedDate);

  // Get pending tasks sorted by priority
  const pendingTasks = sortByPriority(todayTasks.filter(t => !t.completed)).slice(0, 5);

  // Get today's schedule (combine tasks and workouts)
  const schedule = [
    ...todayTasks.filter(t => t.dueTime).map(t => ({
      id: t.id,
      type: 'task' as const,
      title: t.title,
      time: t.dueTime!,
      completed: t.completed,
      priority: t.priority,
      subject: subjects.find(s => s.id === t.subjectId),
    })),
    ...todayPlans.map(p => ({
      id: p.id,
      type: 'workout' as const,
      title: p.name,
      time: '—',
      completed: p.exercises.length > 0 && p.exercises.every(e => e.completed),
      exercisesDone: p.exercises.filter(e => e.completed).length,
      exercisesTotal: p.exercises.length,
    })),
  ].sort((a, b) => {
    if (a.time === '—') return 1;
    if (b.time === '—') return -1;
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Date Navigator */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigateDate(-1)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(selectedDate)}</p>
          {isTodaySelected && (
            <span className="text-[10px] text-primary-500 font-medium flex items-center gap-0.5 justify-center">
              <Sparkles className="w-3 h-3" /> Today
            </span>
          )}
        </div>
        <button onClick={() => navigateDate(1)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Greeting */}
      {isTodaySelected && (
        <div className="text-center py-2">
          <p className="text-lg font-bold text-gray-900 dark:text-white">{getGreeting()}! 👋</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {productivityScore >= 80 ? "You're crushing it today!" :
             productivityScore >= 50 ? "Good progress, keep going!" :
             "Let's make today productive!"}
          </p>
        </div>
      )}

      {/* Productivity Score */}
      <Card className="bg-gradient-to-br from-primary-500 via-primary-600 to-violet-600 border-none !text-white overflow-hidden relative" printCard>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="flex items-center justify-between relative">
          <div>
            <p className="text-primary-100 text-sm font-medium flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Productivity Score
            </p>
            <p className="text-4xl font-bold mt-1 text-white">{productivityScore}%</p>
            <p className="text-primary-200 text-xs mt-1">
              {productivityScore >= 80 ? '🔥 Outstanding!' :
               productivityScore >= 60 ? '💪 Great job!' :
               productivityScore >= 40 ? '📈 Making progress!' :
               '🎯 Just getting started'}
            </p>
          </div>
          <ProgressRing progress={productivityScore} size={90} strokeWidth={7} color="#ffffff" bgColor="rgba(255,255,255,0.2)">
            <Award className="w-7 h-7 text-white" />
          </ProgressRing>
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Study Time */}
        <Card printCard className="relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-full" />
          <BookOpen className="w-5 h-5 text-primary-500 mb-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Study Time</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{formatMinutes(totalStudyActual)}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">of {formatMinutes(totalStudyTarget)} target</p>
          <ProgressBar progress={studyProgress} color="bg-primary-500" className="mt-2" />
        </Card>

        {/* Tasks */}
        <Card printCard className="relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent-50 dark:bg-accent-900/20 rounded-full" />
          <Target className="w-5 h-5 text-accent-500 mb-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tasks Done</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{completedTasks}/{totalTasks}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">
            {highPriorityPending > 0 ? `${highPriorityPending} high priority pending` : `${taskProgress}% complete`}
          </p>
          <ProgressBar progress={taskProgress} color="bg-accent-500" className="mt-2" />
        </Card>

        {/* Workout Time */}
        <Card printCard className="relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-fitness-50 dark:bg-fitness-900/20 rounded-full" />
          <Clock className="w-5 h-5 text-fitness-500 mb-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Workout</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{formatMinutes(totalWorkoutActual)}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">of {formatMinutes(totalWorkoutTarget)} target</p>
          <ProgressBar progress={workoutProgress} color="bg-fitness-500" className="mt-2" />
        </Card>

        {/* Calories */}
        <Card printCard className="relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full" />
          <Flame className="w-5 h-5 text-orange-500 mb-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Calories</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{totalCalActual}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">of {totalCalTarget} kcal goal</p>
          <ProgressBar progress={caloriesProgress} color="bg-orange-500" className="mt-2" />
        </Card>
      </div>

      {/* Today's Schedule */}
      {schedule.length > 0 && (
        <Card printCard>
          <CardHeader>
            <CardTitle icon={<Calendar className="w-5 h-5 text-violet-500" />}>
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <div className="space-y-2">
            {schedule.map(item => (
              <div
                key={item.id}
                className={cn(
                  'flex items-center gap-3 p-2.5 rounded-xl transition-all',
                  item.completed ? 'bg-accent-50 dark:bg-accent-900/20' : 'bg-gray-50 dark:bg-gray-700/50'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                  item.type === 'task'
                    ? `bg-[${item.subject?.color || '#888'}20]`
                    : 'bg-fitness-100 dark:bg-fitness-900/30'
                )} style={item.type === 'task' ? { backgroundColor: `${item.subject?.color || '#888'}20` } : {}}>
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-accent-500" />
                  ) : item.type === 'task' ? (
                    <span className="text-sm">{item.subject?.icon || '📝'}</span>
                  ) : (
                    <Dumbbell className="w-4 h-4 text-fitness-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-medium truncate',
                    item.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'
                  )}>
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {item.time !== '—' && (
                      <span className="text-[10px] text-gray-400">{item.time}</span>
                    )}
                    {item.type === 'task' && 'priority' in item && (
                      <PriorityBadge priority={item.priority} showLabel={false} />
                    )}
                    {item.type === 'workout' && 'exercisesDone' in item && (
                      <span className="text-[10px] text-gray-400">{item.exercisesDone}/{item.exercisesTotal} exercises</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <Card printCard>
          <CardHeader>
            <CardTitle icon={<Target className="w-5 h-5 text-amber-500" />}>
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <div className="space-y-2">
            {pendingTasks.map(task => {
              const subject = subjects.find(s => s.id === task.subjectId);
              return (
                <div
                  key={task.id}
                  className={cn(
                    'flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50',
                    task.priority === 'high' && 'border-l-4 border-l-red-500',
                    task.priority === 'medium' && 'border-l-4 border-l-amber-500'
                  )}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm"
                    style={{ backgroundColor: `${subject?.color || '#888'}20` }}
                  >
                    {subject?.icon || '📝'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{task.title}</p>
                    <p className="text-[10px] text-gray-400">{subject?.name || 'Unknown'}</p>
                  </div>
                  <PriorityBadge priority={task.priority} />
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Subject Progress */}
      <Card printCard>
        <CardHeader>
          <CardTitle icon={<TrendingUp className="w-5 h-5 text-primary-500" />}>
            Subject Progress
          </CardTitle>
        </CardHeader>
        {subjects.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No subjects added yet</p>
        ) : (
          <div className="space-y-3">
            {subjects.map(subject => {
              const actual = todayLogs.filter(l => l.subjectId === subject.id).reduce((s, l) => s + l.minutes, 0);
              const target = subject.targetHoursPerDay * 60;
              const pct = getPercentage(actual, target);
              return (
                <div key={subject.id} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm"
                    style={{ backgroundColor: `${subject.color}20` }}
                  >
                    {subject.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{subject.name}</p>
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-2 shrink-0">{formatMinutes(actual)} / {formatMinutes(target)}</span>
                    </div>
                    <ProgressBar progress={pct} customColor={subject.color} className="mt-1" height="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Workout Summary */}
      {todayPlans.length > 0 && (
        <Card printCard>
          <CardHeader>
            <CardTitle icon={<Dumbbell className="w-5 h-5 text-fitness-500" />}>
              Workout Summary
            </CardTitle>
          </CardHeader>
          {todayPlans.map(plan => {
            const done = plan.exercises.filter(e => e.completed).length;
            const total = plan.exercises.length;
            const isComplete = done === total && total > 0;
            return (
              <div key={plan.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{plan.name}</p>
                    {isComplete && <CheckCircle2 className="w-4 h-4 text-accent-500" />}
                  </div>
                  <span className="text-xs text-gray-400">{done}/{total} exercises</span>
                </div>
                <ProgressBar progress={getPercentage(done, total)} color="bg-fitness-500" />
              </div>
            );
          })}
        </Card>
      )}

      {/* Print-only report */}
      <div className="print-only mt-8 print-section">
        <h2 className="print-title">Daily Report — {formatDate(selectedDate)}</h2>
        <table className="print-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Actual</th>
              <th>Target</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Productivity Score</td>
              <td colSpan={2}>{productivityScore}%</td>
              <td>{productivityScore >= 80 ? 'Excellent' : productivityScore >= 50 ? 'Good' : 'Needs Improvement'}</td>
            </tr>
            <tr>
              <td>Study Time</td>
              <td>{formatMinutes(totalStudyActual)}</td>
              <td>{formatMinutes(totalStudyTarget)}</td>
              <td>{studyProgress}%</td>
            </tr>
            <tr>
              <td>Tasks Completed</td>
              <td>{completedTasks}</td>
              <td>{totalTasks}</td>
              <td>{taskProgress}%</td>
            </tr>
            <tr>
              <td>Workout Duration</td>
              <td>{formatMinutes(totalWorkoutActual)}</td>
              <td>{formatMinutes(totalWorkoutTarget)}</td>
              <td>{workoutProgress}%</td>
            </tr>
            <tr>
              <td>Calories Burned</td>
              <td>{totalCalActual} kcal</td>
              <td>{totalCalTarget} kcal</td>
              <td>{caloriesProgress}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
