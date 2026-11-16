import {
  ArrowDown,
  ArrowLeftRight,
  ArrowRight,
  ArrowUp,
  Bookmark,
  Check,
  Eye,
  EyeOff,
  FolderOpen,
  Lock,
  Plus,
  Trash2,
  Unlock,
} from 'lucide-react';
import {motion} from 'motion/react';
import {useState} from 'react';
import type {ExecutedStep} from '../algorithms/types';

interface RecipePipelineProps {
  executedSteps: ExecutedStep[];
  activeStepIndex: number;
  savedCount: number;
  isDecryptMode: boolean;
  onToggleDecryptMode: (decrypt: boolean) => void;
  onReverseOperations: () => void;
  onOpenAddOperation: () => void;
  onSelectStep: (index: number) => void;
  onUpdateParam: (instanceId: string, key: string, value: any) => void;
  onToggleStep: (instanceId: string) => void;
  onMoveStep: (index: number, direction: -1 | 1) => void;
  onRemoveStep: (instanceId: string) => void;
  onClearRecipe: () => void;
  onSaveRecipe: (name: string, description: string) => void;
  onOpenRecipes: () => void;
}

function truncateMiddle(text: string, max = 14): string {
  if (!text) return '""';
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3)}...`;
}

export function RecipePipeline({
  executedSteps,
  activeStepIndex,
  savedCount,
  isDecryptMode,
  onToggleDecryptMode,
  onReverseOperations,
  onOpenAddOperation,
  onSelectStep,
  onUpdateParam,
  onToggleStep,
  onMoveStep,
  onRemoveStep,
  onClearRecipe,
  onSaveRecipe,
  onOpenRecipes,
}: RecipePipelineProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [recipeName, setRecipeName] = useState('');
  const [recipeDesc, setRecipeDesc] = useState('');
  const [justSavedName, setJustSavedName] = useState<string | null>(null);

  function handleConfirmSave(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = recipeName.trim();
    if (!trimmed) return;
    onSaveRecipe(trimmed, recipeDesc.trim());
    setJustSavedName(trimmed);
    setRecipeName('');
    setRecipeDesc('');
    setIsSaving(false);
    window.setTimeout(() => setJustSavedName(null), 3500);
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 className="font-display text-sm font-semibold text-slate-900">Recipe</h2>
          <span className="text-xs text-slate-500 tabular-nums">
            {executedSteps.length} {executedSteps.length === 1 ? 'operation' : 'operations'}
            {isDecryptMode ? ' · Decrypting in reverse execution order' : ' · Executing left to right'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {justSavedName && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
              <Check className="h-3.5 w-3.5" />
              <span>Saved "{justSavedName}"</span>
            </span>
          )}

          {/* Add Operation Popup Trigger */}
          <button
            type="button"
            onClick={onOpenAddOperation}
            className="inline-flex items-center gap-1.5 rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-sky-700 whitespace-nowrap shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Operation</span>
          </button>

          {executedSteps.length > 0 && (
            <>
              {/* Encrypt / Decrypt Mode Toggle */}
              <div className="flex items-center gap-0.5 rounded-md bg-slate-100 p-0.5">
                <button
                  type="button"
                  onClick={() => onToggleDecryptMode(false)}
                  className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                    !isDecryptMode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Lock className="h-3 w-3" />
                  <span>Encrypt</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleDecryptMode(true)}
                  className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                    isDecryptMode ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Unlock className="h-3 w-3" />
                  <span>Decrypt</span>
                </button>
              </div>

              {/* Reverse Operations Order */}
              {executedSteps.length > 1 && (
                <button
                  type="button"
                  onClick={onReverseOperations}
                  title="Reverse the order of operations in this recipe"
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5 text-slate-500" />
                  <span>Reverse Order</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsSaving((prev) => !prev);
                  setJustSavedName(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-sky-600/30 bg-sky-50 px-2.5 py-1.5 text-xs font-semibold text-sky-800 transition-colors hover:border-sky-600 hover:bg-sky-100 whitespace-nowrap shrink-0"
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span>Save as Recipe</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onOpenRecipes}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
          >
            <FolderOpen className="h-3.5 w-3.5 text-slate-500" />
            <span>Recipes ({savedCount})</span>
          </button>

          {executedSteps.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setIsSaving(false);
                onClearRecipe();
              }}
              className="px-2 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-rose-600 whitespace-nowrap shrink-0"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Inline Save as Recipe form */}
      {isSaving && executedSteps.length > 0 && (
        <form
          onSubmit={handleConfirmSave}
          className="mb-3 flex flex-col gap-2.5 rounded-lg border border-sky-200 bg-sky-50/50 p-3 sm:flex-row sm:items-end"
        >
          <label className="flex flex-1 flex-col gap-1 text-xs">
            <span className="font-medium text-slate-700">Recipe name</span>
            <input
              type="text"
              required
              autoFocus
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              placeholder="e.g., Shift + Base64 Payload"
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-sky-600 focus:outline-none"
            />
          </label>
          <label className="flex flex-1 flex-col gap-1 text-xs">
            <span className="font-medium text-slate-700">Description (optional)</span>
            <input
              type="text"
              value={recipeDesc}
              onChange={(e) => setRecipeDesc(e.target.value)}
              placeholder="What does this chain demonstrate?"
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-sky-600 focus:outline-none"
            />
          </label>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="submit"
              className="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700 whitespace-nowrap"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsSaving(false)}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {executedSteps.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-center">
          <p className="text-xs text-slate-500">
            Your recipe is empty. Add one or more operations to build an animated transformation chain.
          </p>
          <button
            type="button"
            onClick={onOpenAddOperation}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:border-sky-600 hover:text-sky-700"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add First Operation</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-stretch gap-3">
          {executedSteps.map((item, idx) => {
            const isSelected = idx === activeStepIndex;
            const {step, effectiveParams, isInverted, algorithm, trace, input, output} = item;

            return (
              <div key={`${step.instanceId}-${idx}`} className="flex items-center gap-3">
                <motion.div
                  layout
                  transition={{type: 'spring', stiffness: 320, damping: 28}}
                  onClick={() => onSelectStep(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectStep(idx);
                    }
                  }}
                  className={`flex min-w-60 max-w-72 cursor-pointer flex-col justify-between rounded-lg border p-3 transition-colors ${
                    isSelected
                      ? isDecryptMode
                        ? 'border-amber-600 bg-amber-50/40'
                        : 'border-sky-600 bg-sky-50/40'
                      : step.enabled
                        ? 'border-slate-200 bg-white hover:border-slate-300'
                        : 'border-slate-200 bg-slate-50 opacity-65'
                  }`}
                >
                  {/* Step Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-medium text-slate-400 tabular-nums">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="truncate text-sm font-semibold text-slate-900">
                          {algorithm.name}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-500 tabular-nums">
                        {step.enabled ? `${trace.frames.length} frames` : 'Bypassed'} ·{' '}
                        {isInverted ? 'Inverted' : algorithm.category}
                      </p>
                    </div>

                    {/* Step Actions (disabled reordering while in auto-reversed Decrypt preview to keep source order clean) */}
                    <div
                      className="flex items-center gap-0.5 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {!isDecryptMode && (
                        <>
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => onMoveStep(idx, -1)}
                            aria-label="Move step earlier"
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === executedSteps.length - 1}
                            onClick={() => onMoveStep(idx, 1)}
                            aria-label="Move step later"
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => onToggleStep(step.instanceId)}
                        aria-label={step.enabled ? 'Disable step' : 'Enable step'}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        {step.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveStep(step.instanceId)}
                        aria-label="Remove step"
                        className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Mini animated text pass-through preview */}
                  <div className="mt-2.5 flex items-center justify-between gap-1.5 rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1.5 font-mono text-[11px]">
                    <span className="truncate text-slate-500">{truncateMiddle(input, 10)}</span>
                    <ArrowRight className="h-3 w-3 shrink-0 text-sky-600" />
                    <span className="truncate font-semibold text-slate-900">{truncateMiddle(output, 10)}</span>
                  </div>

                  {/* Auto-generated parameter controls */}
                  {algorithm.paramSchema.length > 0 && (
                    <div
                      className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-2.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {algorithm.paramSchema.map((field) => {
                        const value = effectiveParams[field.key];
                        if (field.type === 'number') {
                          return (
                            <label key={field.key} className="flex flex-col gap-1 text-xs">
                              <div className="flex items-center justify-between text-slate-600">
                                <span>{field.label}</span>
                                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                                  {value} {field.unit ?? ''}
                                </span>
                              </div>
                              <input
                                type="range"
                                min={field.min ?? -25}
                                max={field.max ?? 25}
                                step={field.step ?? 1}
                                value={Number(value ?? 0)}
                                onChange={(e) =>
                                  onUpdateParam(step.instanceId, field.key, Number(e.target.value))
                                }
                                className="h-1.5 w-full cursor-pointer accent-sky-600"
                              />
                            </label>
                          );
                        }

                        if (field.type === 'text') {
                          return (
                            <label key={field.key} className="flex items-center justify-between gap-2 text-xs">
                              <span className="text-slate-600 whitespace-nowrap">{field.label}</span>
                              <input
                                type="text"
                                value={String(value ?? '')}
                                placeholder={field.placeholder}
                                onChange={(e) => onUpdateParam(step.instanceId, field.key, e.target.value)}
                                className="w-24 rounded border border-slate-200 bg-white px-2 py-1 font-mono text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                              />
                            </label>
                          );
                        }

                        return (
                          <label key={field.key} className="flex items-center justify-between gap-2 text-xs">
                            <span className="text-slate-600">{field.label}</span>
                            <input
                              type="checkbox"
                              disabled={isDecryptMode && field.key === 'decode'}
                              checked={Boolean(value)}
                              onChange={(e) => onUpdateParam(step.instanceId, field.key, e.target.checked)}
                              className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-sky-600 disabled:opacity-60"
                            />
                          </label>
                        );
                      })}
                    </div>
                  )}
                </motion.div>

                {/* Animated connector arrow between stages */}
                {idx < executedSteps.length - 1 && (
                  <div className="hidden flex-col items-center gap-1 sm:flex">
                    <motion.div
                      animate={{
                        x: isSelected ? [0, 4, 0] : 0,
                        opacity: isSelected ? 1 : 0.45,
                      }}
                      transition={{repeat: isSelected ? Infinity : 0, duration: 1.2}}
                      className="flex items-center text-sky-600"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
