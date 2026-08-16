import { useState } from 'react';
import {
  BookOpen, Plus, Trash2, Check, Clock, GraduationCap,
  ChevronDown, ChevronUp, Timer, Edit2, AlertCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button, IconButton } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ProgressRing } from '../components/ui/ProgressRing';
import { PriorityBadge } from '../components/ui/Badge';
import {
  formatMinutes, getPercentage, SUBJECT_COLORS, SUBJECT_ICONS,
  SUBJECT_CATEGORIES, PRIORITY_CONFIG, sortByPriority
} from '../utils/helpers';
import { cn } from '../utils/cn';
import type { Priority, Subject } from '../types';

export function StudyPlanner() {
  const {
    subjects, addSubject, removeSubject, updateSubject,
    studyTasks, addStudyTask, toggleStudyTask, removeStudyTask, updateStudyTaskMinutes,
    studyLogs, addStudyLog,
    selectedDate
  } = useStore();

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Subject form
  const [subjectName, setSubjectName] = useState('');
  const [subjectColor, setSubjectColor] = useState(SUBJECT_COLORS[0]);
  const [subjectIcon, setSubjectIcon] = useState(SUBJECT_ICONS[0]);
  const [subjectCategory, setSubjectCategory] = useState(SUBJECT_CATEGORIES[0]);
  const [subjectTargetDay, setSubjectTargetDay] = useState('2');
  const [subjectTargetWeek, setSubjectTargetWeek] = useState('12');

  // Task form
  const [taskSubject, setTaskSubject] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  const [taskDueTime, setTaskDueTime] = useState('');

  // Log form
  const [logSubject, setLogSubject] = useState('');
  const [logMinutes, setLogMinutes] = useState('30');
  const [logNotes, setLogNotes] = useState('');

  const todayTasks = studyTasks.filter(t => t.date === selectedDate);
  const todayLogs = studyLogs.filter(l => l.date === selectedDate);

  const totalTarget = subjects.reduce((s, sub) => s + sub.targetHoursPerDay * 60, 0);
  const totalActual = todayLogs.reduce((s, l) => s + l.minutes, 0);
  const completedTasks = todayTasks.filter(t => t.completed).length;
  const totalTasks = todayTasks.length;

  const resetSubjectForm = () => {
    setSubjectName('');
    setSubjectColor(SUBJECT_COLORS[Math.floor(Math.random() * SUBJECT_COLORS.length)]);
    setSubjectIcon(SUBJECT_ICONS[0]);
    setSubjectCategory(SUBJECT_CATEGORIES[0]);
    setSubjectTargetDay('2');
    setSubjectTargetWeek('12');
    setEditingSubject(null);
  };

  const handleAddSubject = () => {
    if (!subjectName.trim()) return;
    if (editingSubject) {
      updateSubject(editingSubject.id, {
        name: subjectName,
        color: subjectColor,
        icon: subjectIcon,
        category: subjectCategory,
        targetHoursPerDay: parseFloat(subjectTargetDay) || 2,
        targetHoursPerWeek: parseFloat(subjectTargetWeek) || 12,
      });
    } else {
      addSubject({
        name: subjectName,
        color: subjectColor,
        icon: subjectIcon,
        category: subjectCategory,
        targetHoursPerDay: parseFloat(subjectTargetDay) || 2,
        targetHoursPerWeek: parseFloat(subjectTargetWeek) || 12,
      });
    }
    resetSubjectForm();
    setShowSubjectModal(false);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setSubjectName(subject.name);
    setSubjectColor(subject.color);
    setSubjectIcon(subject.icon);
    setSubjectCategory(subject.category);
    setSubjectTargetDay(String(subject.targetHoursPerDay));
    setSubjectTargetWeek(String(subject.targetHoursPerWeek));
    setShowSubjectModal(true);
  };

  const handleAddTask = () => {
    if (!taskTitle.trim() || !taskSubject) return;
    addStudyTask(taskSubject, taskTitle, taskPriority, taskDescription, taskDueTime, selectedDate);
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
    setTaskDueTime('');
    setShowTaskModal(false);
  };

  const handleAddLog = () => {
    if (!logSubject || !logMinutes) return;
    addStudyLog(logSubject, parseInt(logMinutes) || 0, logNotes, selectedDate);
    setLogMinutes('30');
    setLogNotes('');
    setShowLogModal(false);
  };

  // Group subjects by category
  const subjectsByCategory = subjects.reduce((acc, subject) => {
    if (!acc[subject.category]) acc[subject.category] = [];
    acc[subject.category].push(subject);
    return acc;
  }, {} as Record<string, Subject[]>);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-primary-50 to-blue-100 dark:from-primary-900/30 dark:to-blue-800/20 border-primary-200 dark:border-primary-700/50" printCard>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary-600 dark:text-primary-400 font-medium flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Study Overview
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{formatMinutes(totalActual)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">of {formatMinutes(totalTarget)} target • {completedTasks}/{totalTasks} tasks</p>
          </div>
          <ProgressRing progress={getPercentage(totalActual, totalTarget)} size={80} strokeWidth={6} color="#3b82f6">
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{getPercentage(totalActual, totalTarget)}%</span>
          </ProgressRing>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button size="sm" variant="secondary" onClick={() => { resetSubjectForm(); setShowSubjectModal(true); }} className="!rounded-xl">
          <Plus className="w-4 h-4" /> Subject
        </Button>
        <Button size="sm" variant="secondary" onClick={() => { setTaskSubject(subjects[0]?.id || ''); setShowTaskModal(true); }} className="!rounded-xl">
          <Plus className="w-4 h-4" /> Task
        </Button>
        <Button size="sm" onClick={() => { setLogSubject(subjects[0]?.id || ''); setShowLogModal(true); }} className="!rounded-xl">
          <Timer className="w-4 h-4" /> Log
        </Button>
      </div>

      {/* High Priority Tasks Alert */}
      {todayTasks.filter(t => t.priority === 'high' && !t.completed).length > 0 && (
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/50 !p-3">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {todayTasks.filter(t => t.priority === 'high' && !t.completed).length} high priority task(s) pending
            </span>
          </div>
        </Card>
      )}

      {/* Subjects with tasks */}
      {subjects.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No subjects yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add your first subject to start planning</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(subjectsByCategory).map(([category, categorySubjects]) => (
            <div key={category}>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">{category}</p>
              <div className="space-y-3">
                {categorySubjects.map(subject => {
                  const subjectTasks = sortByPriority(todayTasks.filter(t => t.subjectId === subject.id));
                  const subjectLogs = todayLogs.filter(l => l.subjectId === subject.id);
                  const actualMin = subjectLogs.reduce((s, l) => s + l.minutes, 0);
                  const targetMin = subject.targetHoursPerDay * 60;
                  const pct = getPercentage(actualMin, targetMin);
                  const isExpanded = expandedSubject === subject.id;
                  const completedSubjectTasks = subjectTasks.filter(t => t.completed).length;

                  return (
                    <Card key={subject.id} printCard className="overflow-hidden">
                      <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => setExpandedSubject(isExpanded ? null : subject.id)}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                          style={{ backgroundColor: `${subject.color}20` }}
                        >
                          {subject.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{subject.name}</h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">{formatMinutes(actualMin)}/{formatMinutes(targetMin)}</span>
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-gray-400">{completedSubjectTasks}/{subjectTasks.length} tasks</span>
                          </div>
                          <ProgressBar progress={pct} className="mt-1.5" height="h-1.5" customColor={subject.color} />
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 space-y-2 animate-fadeIn">
                          {subjectTasks.length === 0 ? (
                            <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-2">No tasks for this subject today</p>
                          ) : (
                            subjectTasks.map(task => (
                              <div
                                key={task.id}
                                className={cn(
                                  'flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 group transition-all',
                                  task.priority === 'high' && !task.completed && 'border-l-4 border-l-red-500',
                                  task.priority === 'medium' && !task.completed && 'border-l-4 border-l-amber-500',
                                  task.priority === 'low' && !task.completed && 'border-l-4 border-l-green-500'
                                )}
                              >
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleStudyTask(task.id); }}
                                  className={cn(
                                    'w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center transition-all shrink-0',
                                    task.completed
                                      ? 'bg-accent-500 border-accent-500'
                                      : 'border-gray-300 dark:border-gray-500 hover:border-accent-400'
                                  )}
                                >
                                  {task.completed && <Check className="w-3 h-3 text-white" />}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={cn(
                                      'text-sm font-medium',
                                      task.completed
                                        ? 'text-gray-400 dark:text-gray-500 line-through'
                                        : 'text-gray-700 dark:text-gray-200'
                                    )}>{task.title}</span>
                                    <PriorityBadge priority={task.priority} showLabel={false} />
                                  </div>
                                  {task.description && (
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">{task.description}</p>
                                  )}
                                  {task.dueTime && (
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> Due: {task.dueTime}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <input
                                    type="number"
                                    value={task.studyMinutes || ''}
                                    placeholder="min"
                                    onChange={(e) => { e.stopPropagation(); updateStudyTaskMinutes(task.id, parseInt(e.target.value) || 0); }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-14 text-xs text-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-1 focus:outline-none focus:ring-1 focus:ring-primary-400"
                                  />
                                  <IconButton
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => { e.stopPropagation(); removeStudyTask(task.id); }}
                                    className="opacity-0 group-hover:opacity-100"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </IconButton>
                                </div>
                              </div>
                            ))
                          )}
                          <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-700/50 mt-3">
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={(e) => { e.stopPropagation(); handleEditSubject(subject); }}
                            >
                              <Edit2 className="w-3 h-3" /> Edit
                            </Button>
                            <Button
                              size="xs"
                              variant="ghost"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={(e) => { e.stopPropagation(); removeSubject(subject.id); }}
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Study Logs */}
      {todayLogs.length > 0 && (
        <Card printCard>
          <CardHeader>
            <CardTitle icon={<Clock className="w-5 h-5 text-primary-500" />}>
              Today's Study Log
            </CardTitle>
          </CardHeader>
          <div className="space-y-2 stagger-animation">
            {todayLogs.map(log => {
              const sub = subjects.find(s => s.id === log.subjectId);
              return (
                <div key={log.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: `${sub?.color || '#888'}20` }}>
                    {sub?.icon || '📚'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">{sub?.name || 'Unknown'}</span>
                    {log.notes && <p className="text-[10px] text-gray-400 truncate">{log.notes}</p>}
                  </div>
                  <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{formatMinutes(log.minutes)}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Add/Edit Subject Modal */}
      <Modal isOpen={showSubjectModal} onClose={() => { setShowSubjectModal(false); resetSubjectForm(); }} title={editingSubject ? 'Edit Subject' : 'Add Subject'}>
        <div className="space-y-4">
          <Input
            label="Subject Name"
            value={subjectName}
            onChange={e => setSubjectName(e.target.value)}
            placeholder="e.g. Mathematics"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Icon</label>
            <div className="flex gap-2 flex-wrap">
              {SUBJECT_ICONS.map(icon => (
                <button
                  key={icon}
                  onClick={() => setSubjectIcon(icon)}
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all border-2',
                    subjectIcon === icon
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 scale-110'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  )}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Color</label>
            <div className="flex gap-2 flex-wrap">
              {SUBJECT_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setSubjectColor(c)}
                  className={cn(
                    'w-8 h-8 rounded-full transition-all',
                    subjectColor === c ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800 scale-110' : 'hover:scale-105'
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <Select
            label="Category"
            value={subjectCategory}
            onChange={e => setSubjectCategory(e.target.value)}
            options={SUBJECT_CATEGORIES.map(c => ({ value: c, label: c }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Hours/Day"
              type="number"
              step="0.5"
              value={subjectTargetDay}
              onChange={e => setSubjectTargetDay(e.target.value)}
            />
            <Input
              label="Hours/Week"
              type="number"
              step="0.5"
              value={subjectTargetWeek}
              onChange={e => setSubjectTargetWeek(e.target.value)}
            />
          </div>

          <Button onClick={handleAddSubject} className="w-full">
            {editingSubject ? <><Edit2 className="w-4 h-4" /> Update Subject</> : <><Plus className="w-4 h-4" /> Add Subject</>}
          </Button>
        </div>
      </Modal>

      {/* Add Task Modal */}
      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} title="Add Task">
        <div className="space-y-4">
          <Select
            label="Subject"
            value={taskSubject}
            onChange={e => setTaskSubject(e.target.value)}
            options={[{ value: '', label: 'Select subject' }, ...subjects.map(s => ({ value: s.id, label: `${s.icon} ${s.name}` }))]}
          />

          <Input
            label="Task Title"
            value={taskTitle}
            onChange={e => setTaskTitle(e.target.value)}
            placeholder="e.g. Complete Chapter 5 exercises"
          />

          <Textarea
            label="Description (optional)"
            value={taskDescription}
            onChange={e => setTaskDescription(e.target.value)}
            placeholder="Add any notes or details..."
            rows={2}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(PRIORITY_CONFIG) as Priority[]).map(p => {
                const config = PRIORITY_CONFIG[p];
                return (
                  <button
                    key={p}
                    onClick={() => setTaskPriority(p)}
                    className={cn(
                      'flex items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 text-sm font-medium transition-all',
                      taskPriority === p
                        ? 'scale-[1.02]'
                        : 'border-gray-200 dark:border-gray-600 text-gray-500'
                    )}
                    style={taskPriority === p ? { borderColor: config.color, color: config.color, backgroundColor: `${config.color}10` } : {}}
                  >
                    <span className="text-xs">{config.icon}</span>
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          <Input
            label="Due Time (optional)"
            type="time"
            value={taskDueTime}
            onChange={e => setTaskDueTime(e.target.value)}
          />

          <Button onClick={handleAddTask} className="w-full">
            <Plus className="w-4 h-4" /> Add Task
          </Button>
        </div>
      </Modal>

      {/* Log Study Time Modal */}
      <Modal isOpen={showLogModal} onClose={() => setShowLogModal(false)} title="Log Study Time">
        <div className="space-y-4">
          <Select
            label="Subject"
            value={logSubject}
            onChange={e => setLogSubject(e.target.value)}
            options={[{ value: '', label: 'Select subject' }, ...subjects.map(s => ({ value: s.id, label: `${s.icon} ${s.name}` }))]}
          />

          <div>
            <Input
              label="Minutes Studied"
              type="number"
              value={logMinutes}
              onChange={e => setLogMinutes(e.target.value)}
              placeholder="30"
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              {[15, 30, 45, 60, 90, 120].map(m => (
                <button
                  key={m}
                  onClick={() => setLogMinutes(String(m))}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
                    logMinutes === String(m)
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary-300'
                  )}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Notes (optional)"
            value={logNotes}
            onChange={e => setLogNotes(e.target.value)}
            placeholder="What did you study?"
            rows={2}
          />

          <Button onClick={handleAddLog} className="w-full">
            <Clock className="w-4 h-4" /> Log Study Time
          </Button>
        </div>
      </Modal>
    </div>
  );
}
