import { useState } from 'react';
import {
  Dumbbell, Plus, Trash2, Check, Flame, Clock, Heart,
  ChevronDown, ChevronUp, Wind, Waves, Edit2, Trophy
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button, IconButton } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Badge } from '../components/ui/Badge';
import { formatMinutes, getPercentage, WORKOUT_TYPE_LABELS, WORKOUT_TYPE_COLORS } from '../utils/helpers';
import type { WorkoutType, WorkoutPlan } from '../types';
import { cn } from '../utils/cn';

const typeIcons: Record<WorkoutType, typeof Dumbbell> = {
  cardio: Heart,
  strength: Dumbbell,
  endurance: Wind,
  flexibility: Waves,
};

export function FitnessTracker() {
  const {
    workoutPlans, addWorkoutPlan, removeWorkoutPlan, updateWorkoutPlan,
    addExercise, removeExercise, toggleExercise,
    selectedDate
  } = useStore();

  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);

  // Plan form
  const [planName, setPlanName] = useState('');
  const [planCalories, setPlanCalories] = useState('300');
  const [planDuration, setPlanDuration] = useState('60');

  // Exercise form
  const [exName, setExName] = useState('');
  const [exType, setExType] = useState<WorkoutType>('strength');
  const [exSets, setExSets] = useState('3');
  const [exReps, setExReps] = useState('12');
  const [exWeight, setExWeight] = useState('');
  const [exDuration, setExDuration] = useState('');
  const [exCalories, setExCalories] = useState('');
  const [exNotes, setExNotes] = useState('');

  const todayPlans = workoutPlans.filter(p => p.date === selectedDate);

  const totalTargetCal = todayPlans.reduce((s, p) => s + p.targetCalories, 0);
  const totalActualCal = todayPlans.reduce((s, p) =>
    s + p.exercises.filter(e => e.completed).reduce((es, e) => es + (e.caloriesBurned || 0), 0), 0);
  const totalTargetMin = todayPlans.reduce((s, p) => s + p.targetDurationMinutes, 0);
  const totalActualMin = todayPlans.reduce((s, p) =>
    s + p.exercises.filter(e => e.completed).reduce((es, e) => es + (e.durationMinutes || 0), 0), 0);
  const totalExercises = todayPlans.reduce((s, p) => s + p.exercises.length, 0);
  const completedExercises = todayPlans.reduce((s, p) => s + p.exercises.filter(e => e.completed).length, 0);

  const resetPlanForm = () => {
    setPlanName('');
    setPlanCalories('300');
    setPlanDuration('60');
    setEditingPlan(null);
  };

  const resetExerciseForm = () => {
    setExName('');
    setExType('strength');
    setExSets('3');
    setExReps('12');
    setExWeight('');
    setExDuration('');
    setExCalories('');
    setExNotes('');
  };

  const handleAddPlan = () => {
    if (!planName.trim()) return;
    if (editingPlan) {
      updateWorkoutPlan(editingPlan.id, {
        name: planName,
        targetCalories: parseInt(planCalories) || 300,
        targetDurationMinutes: parseInt(planDuration) || 60,
      });
    } else {
      addWorkoutPlan(planName, parseInt(planCalories) || 300, parseInt(planDuration) || 60, selectedDate);
    }
    resetPlanForm();
    setShowPlanModal(false);
  };

  const handleEditPlan = (plan: WorkoutPlan) => {
    setEditingPlan(plan);
    setPlanName(plan.name);
    setPlanCalories(String(plan.targetCalories));
    setPlanDuration(String(plan.targetDurationMinutes));
    setShowPlanModal(true);
  };

  const handleAddExercise = () => {
    if (!exName.trim() || !selectedPlanId) return;
    addExercise(selectedPlanId, {
      name: exName,
      type: exType,
      sets: parseInt(exSets) || undefined,
      reps: parseInt(exReps) || undefined,
      weight: parseFloat(exWeight) || undefined,
      durationMinutes: parseInt(exDuration) || undefined,
      caloriesBurned: parseInt(exCalories) || undefined,
      notes: exNotes || undefined,
    });
    resetExerciseForm();
    setShowExerciseModal(false);
  };

  // Quick workout templates
  const quickTemplates = [
    { name: 'Upper Body', calories: 250, duration: 45 },
    { name: 'Lower Body', calories: 300, duration: 50 },
    { name: 'Cardio Session', calories: 400, duration: 30 },
    { name: 'Full Body', calories: 350, duration: 60 },
  ];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-fitness-50 to-pink-100 dark:from-fitness-900/30 dark:to-pink-800/20 border-fitness-200 dark:border-fitness-700/50" printCard>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-fitness-600 dark:text-fitness-400 font-medium flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4" /> Workout Overview
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {totalActualCal} <span className="text-lg font-normal text-gray-400">kcal</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatMinutes(totalActualMin)} active • {completedExercises}/{totalExercises} exercises
            </p>
          </div>
          <ProgressRing progress={getPercentage(totalActualCal, totalTargetCal)} size={80} strokeWidth={6} color="#ec4899">
            <Flame className="w-6 h-6 text-fitness-500" />
          </ProgressRing>
        </div>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center !p-3" printCard>
          <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{totalActualCal}</p>
          <p className="text-[10px] text-gray-400">of {totalTargetCal} kcal</p>
          <ProgressBar progress={getPercentage(totalActualCal, totalTargetCal)} color="bg-orange-500" className="mt-1.5" height="h-1" />
        </Card>
        <Card className="text-center !p-3" printCard>
          <Clock className="w-5 h-5 text-primary-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{formatMinutes(totalActualMin)}</p>
          <p className="text-[10px] text-gray-400">of {formatMinutes(totalTargetMin)}</p>
          <ProgressBar progress={getPercentage(totalActualMin, totalTargetMin)} color="bg-primary-500" className="mt-1.5" height="h-1" />
        </Card>
        <Card className="text-center !p-3" printCard>
          <Trophy className="w-5 h-5 text-accent-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">{completedExercises}</p>
          <p className="text-[10px] text-gray-400">of {totalExercises} done</p>
          <ProgressBar progress={getPercentage(completedExercises, totalExercises)} color="bg-accent-500" className="mt-1.5" height="h-1" />
        </Card>
      </div>

      {/* Quick Templates */}
      {todayPlans.length === 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">Quick Start</p>
          <div className="grid grid-cols-2 gap-2">
            {quickTemplates.map(template => (
              <Card
                key={template.name}
                hover
                className="!p-3"
                onClick={() => {
                  addWorkoutPlan(template.name, template.calories, template.duration, selectedDate);
                }}
              >
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{template.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {template.calories} kcal • {template.duration}min
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <Button onClick={() => { resetPlanForm(); setShowPlanModal(true); }} className="w-full !rounded-xl">
        <Plus className="w-4 h-4" /> New Workout Plan
      </Button>

      {/* Workout Plans */}
      {todayPlans.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <Dumbbell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No workout plans for today</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Create a plan or use quick templates above</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {todayPlans.map(plan => {
            const done = plan.exercises.filter(e => e.completed).length;
            const total = plan.exercises.length;
            const pct = getPercentage(done, total);
            const planCals = plan.exercises.filter(e => e.completed).reduce((s, e) => s + (e.caloriesBurned || 0), 0);
            const planMins = plan.exercises.filter(e => e.completed).reduce((s, e) => s + (e.durationMinutes || 0), 0);
            const isExpanded = expandedPlan === plan.id;
            const isComplete = done === total && total > 0;

            return (
              <Card key={plan.id} printCard className={cn(isComplete && 'border-accent-300 dark:border-accent-700/50')}>
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setExpandedPlan(isExpanded ? null : plan.id)}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                    isComplete
                      ? 'bg-accent-100 dark:bg-accent-900/30'
                      : 'bg-fitness-100 dark:bg-fitness-900/30'
                  )}>
                    {isComplete ? (
                      <Check className="w-5 h-5 text-accent-500" />
                    ) : (
                      <Dumbbell className="w-5 h-5 text-fitness-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{plan.name}</h3>
                        {isComplete && <Badge variant="success">Complete!</Badge>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{done}/{total}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                        <Flame className="w-3 h-3" />{planCals}/{plan.targetCalories} kcal
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />{planMins}/{plan.targetDurationMinutes}min
                      </span>
                    </div>
                    <ProgressBar progress={pct} color="bg-fitness-500" className="mt-1.5" height="h-1.5" />
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-2 animate-fadeIn">
                    {plan.exercises.length === 0 ? (
                      <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-2">No exercises added</p>
                    ) : (
                      plan.exercises.map(exercise => {
                        const Icon = typeIcons[exercise.type] || Dumbbell;
                        const typeColor = WORKOUT_TYPE_COLORS[exercise.type] || '#888';
                        return (
                          <div
                            key={exercise.id}
                            className={cn(
                              'flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 group transition-all',
                              exercise.completed && 'opacity-70'
                            )}
                          >
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleExercise(plan.id, exercise.id); }}
                              className={cn(
                                'w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center transition-all shrink-0',
                                exercise.completed
                                  ? 'border-accent-500 bg-accent-500'
                                  : 'border-gray-300 dark:border-gray-500 hover:border-accent-400'
                              )}
                            >
                              {exercise.completed && <Check className="w-3 h-3 text-white" />}
                            </button>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${typeColor}20` }}>
                              <Icon className="w-4 h-4" style={{ color: typeColor }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                'text-sm font-medium',
                                exercise.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'
                              )}>{exercise.name}</p>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium" style={{ backgroundColor: `${typeColor}15`, color: typeColor }}>
                                  {WORKOUT_TYPE_LABELS[exercise.type]}
                                </span>
                                {exercise.sets && exercise.reps && (
                                  <span className="text-[10px] text-gray-400">{exercise.sets}×{exercise.reps}</span>
                                )}
                                {exercise.weight && (
                                  <span className="text-[10px] text-gray-400">{exercise.weight}kg</span>
                                )}
                                {exercise.durationMinutes && (
                                  <span className="text-[10px] text-gray-400">{exercise.durationMinutes}min</span>
                                )}
                                {exercise.caloriesBurned && (
                                  <span className="text-[10px] text-gray-400">{exercise.caloriesBurned}kcal</span>
                                )}
                              </div>
                              {exercise.notes && (
                                <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{exercise.notes}</p>
                              )}
                            </div>
                            <IconButton
                              size="sm"
                              variant="ghost"
                              onClick={(e) => { e.stopPropagation(); removeExercise(plan.id, exercise.id); }}
                              className="opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </IconButton>
                          </div>
                        );
                      })
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-700/50 mt-3">
                      <div className="flex gap-2">
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPlanId(plan.id);
                            resetExerciseForm();
                            setShowExerciseModal(true);
                          }}
                        >
                          <Plus className="w-3 h-3" /> Add Exercise
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={(e) => { e.stopPropagation(); handleEditPlan(plan); }}
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </Button>
                      </div>
                      <Button
                        size="xs"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={(e) => { e.stopPropagation(); removeWorkoutPlan(plan.id); }}
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
      )}

      {/* Add/Edit Plan Modal */}
      <Modal isOpen={showPlanModal} onClose={() => { setShowPlanModal(false); resetPlanForm(); }} title={editingPlan ? 'Edit Workout Plan' : 'New Workout Plan'}>
        <div className="space-y-4">
          <Input
            label="Plan Name"
            value={planName}
            onChange={e => setPlanName(e.target.value)}
            placeholder="e.g. Upper Body Day"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Target Calories"
              type="number"
              value={planCalories}
              onChange={e => setPlanCalories(e.target.value)}
              placeholder="300"
            />
            <Input
              label="Duration (min)"
              type="number"
              value={planDuration}
              onChange={e => setPlanDuration(e.target.value)}
              placeholder="60"
            />
          </div>
          <Button onClick={handleAddPlan} className="w-full bg-fitness-500 hover:bg-fitness-600 focus:ring-fitness-400">
            {editingPlan ? <><Edit2 className="w-4 h-4" /> Update Plan</> : <><Plus className="w-4 h-4" /> Create Plan</>}
          </Button>
        </div>
      </Modal>

      {/* Add Exercise Modal */}
      <Modal isOpen={showExerciseModal} onClose={() => { setShowExerciseModal(false); resetExerciseForm(); }} title="Add Exercise">
        <div className="space-y-4">
          <Input
            label="Exercise Name"
            value={exName}
            onChange={e => setExName(e.target.value)}
            placeholder="e.g. Bench Press"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(WORKOUT_TYPE_LABELS) as WorkoutType[]).map(t => {
                const Icon = typeIcons[t];
                const color = WORKOUT_TYPE_COLORS[t];
                return (
                  <button
                    key={t}
                    onClick={() => setExType(t)}
                    className={cn(
                      'flex items-center gap-2 p-2.5 rounded-xl border-2 text-sm transition-all',
                      exType === t
                        ? 'font-medium'
                        : 'border-gray-200 dark:border-gray-600 text-gray-500'
                    )}
                    style={exType === t ? { borderColor: color, color: color, backgroundColor: `${color}10` } : {}}
                  >
                    <Icon className="w-4 h-4" />
                    {WORKOUT_TYPE_LABELS[t]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Sets"
              type="number"
              value={exSets}
              onChange={e => setExSets(e.target.value)}
              placeholder="3"
            />
            <Input
              label="Reps"
              type="number"
              value={exReps}
              onChange={e => setExReps(e.target.value)}
              placeholder="12"
            />
            <Input
              label="Weight (kg)"
              type="number"
              value={exWeight}
              onChange={e => setExWeight(e.target.value)}
              placeholder="20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Duration (min)"
              type="number"
              value={exDuration}
              onChange={e => setExDuration(e.target.value)}
              placeholder="5"
            />
            <Input
              label="Calories"
              type="number"
              value={exCalories}
              onChange={e => setExCalories(e.target.value)}
              placeholder="50"
            />
          </div>

          <Textarea
            label="Notes (optional)"
            value={exNotes}
            onChange={e => setExNotes(e.target.value)}
            placeholder="Any notes about this exercise..."
            rows={2}
          />

          <Button onClick={handleAddExercise} className="w-full bg-fitness-500 hover:bg-fitness-600 focus:ring-fitness-400">
            <Plus className="w-4 h-4" /> Add Exercise
          </Button>
        </div>
      </Modal>
    </div>
  );
}
