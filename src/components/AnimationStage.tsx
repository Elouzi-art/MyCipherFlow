import {ArrowRight, ChevronLeft, ChevronRight, Pause, Play, RotateCcw, SkipBack, SkipForward} from 'lucide-react';
import {AnimatePresence, motion} from 'motion/react';
import type {ExecutedStep} from '../algorithms/types';

interface AnimationStageProps {
  activeExecution: ExecutedStep | null;
  activeStepIndex: number;
  totalSteps: number;
  frameIndex: number;
  isPlaying: boolean;
  speed: 0.5 | 1 | 2;
  onSetFrameIndex: (idx: number) => void;
  onTogglePlay: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onResetFrame: () => void;
  onChangeSpeed: (speed: 0.5 | 1 | 2) => void;
  onSelectStep: (idx: number) => void;
}

const SPEEDS: Array<0.5 | 1 | 2> = [0.5, 1, 2];

export function AnimationStage({
  activeExecution,
  activeStepIndex,
  totalSteps,
  frameIndex,
  isPlaying,
  speed,
  onSetFrameIndex,
  onTogglePlay,
  onStepBack,
  onStepForward,
  onResetFrame,
  onChangeSpeed,
  onSelectStep,
}: AnimationStageProps) {
  if (!activeExecution) {
    return (
      <section className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center">
        <h2 className="font-display text-lg font-semibold text-slate-900">Animation Stage</h2>
        <p className="mt-2 max-w-md text-sm text-slate-600">
          Click Add Operation in the Recipe panel above or load a saved recipe to watch text transform step by step.
        </p>
      </section>
    );
  }

  const {algorithm, trace, input, effectiveParams, isInverted} = activeExecution;
  const totalFrames = trace.frames.length;
  const safeFrameIndex = Math.min(frameIndex, Math.max(0, totalFrames - 1));
  const currentFrame = trace.frames[safeFrameIndex];
  const Visualizer = algorithm.Visualizer;

  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Stage Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-3.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-medium text-sky-700 tabular-nums">
              Stage {activeStepIndex + 1} of {totalSteps}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <h2 className="font-display text-base font-semibold text-slate-900">
              {algorithm.name} {isInverted ? '(Decrypt)' : ''}
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            {algorithm.category} · {algorithm.animationPattern} · {algorithm.complexity}
          </p>
        </div>

        {/* Multi-stage quick navigation */}
        {totalSteps > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={activeStepIndex === 0}
              onClick={() => onSelectStep(activeStepIndex - 1)}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 whitespace-nowrap shrink-0"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev stage</span>
            </button>
            <button
              type="button"
              disabled={activeStepIndex >= totalSteps - 1}
              onClick={() => onSelectStep(activeStepIndex + 1)}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 whitespace-nowrap shrink-0"
            >
              <span>Next stage</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Animated Text Flow Transfer Strip: Input -> Stage -> Live Output */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-3">
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-col rounded-md border border-slate-200 bg-white px-3 py-2">
            <span className="text-[10px] font-medium text-slate-500">Entering stage {activeStepIndex + 1}</span>
            <AnimatePresence mode="wait">
              <motion.code
                key={`in-${activeStepIndex}-${input}`}
                initial={{opacity: 0, x: -8}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: 8}}
                transition={{duration: 0.2}}
                className="mt-0.5 truncate font-mono text-xs font-semibold text-slate-900"
              >
                {input || '""'}
              </motion.code>
            </AnimatePresence>
          </div>

          {/* Animated directional transfer packet */}
          <div className="flex items-center justify-center gap-1.5 px-2">
            <motion.div
              key={`pulse-${activeStepIndex}-${safeFrameIndex}`}
              initial={{x: -10, opacity: 0.3}}
              animate={{x: 10, opacity: 1}}
              transition={{duration: 0.45, ease: [0.16, 1, 0.3, 1]}}
              className="flex items-center gap-1 text-sky-600"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col rounded-md border border-sky-200 bg-sky-50/60 px-3 py-2">
            <span className="text-[10px] font-medium text-sky-800">
              Leaving stage {activeStepIndex + 1} (Frame {safeFrameIndex + 1})
            </span>
            <AnimatePresence mode="wait">
              <motion.code
                key={`out-${activeStepIndex}-${currentFrame.outputSoFar}`}
                initial={{opacity: 0, y: 4}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -4}}
                transition={{duration: 0.18}}
                className="mt-0.5 truncate font-mono text-xs font-semibold text-sky-950"
              >
                {currentFrame.outputSoFar || '""'}
              </motion.code>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Main Visualization Canvas */}
      <div className="min-h-60 bg-slate-50/40 px-5 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={`viz-${activeExecution.step.instanceId}-${activeStepIndex}-${isInverted}`}
            initial={{opacity: 0, y: 6}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -6}}
            transition={{duration: 0.2}}
          >
            <Visualizer
              frame={currentFrame}
              frameIndex={safeFrameIndex}
              totalFrames={totalFrames}
              input={input}
              params={effectiveParams}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step Explanation & Playback Deck */}
      <div className="border-t border-slate-200 bg-white px-5 py-4">
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-sky-700 tabular-nums">
                Frame {safeFrameIndex + 1}/{totalFrames}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-sm font-semibold text-slate-900">{currentFrame.title}</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">{currentFrame.explanation}</p>
          </div>
        </div>

        {/* Scrubber + Controls */}
        <div className="flex flex-col gap-3">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalFrames - 1)}
            value={safeFrameIndex}
            onChange={(e) => onSetFrameIndex(Number(e.target.value))}
            aria-label="Animation frame scrubber"
            className="h-1.5 w-full cursor-pointer accent-sky-600"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onResetFrame}
                aria-label="Reset to first frame"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={safeFrameIndex === 0}
                onClick={onStepBack}
                aria-label="Step backward"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onTogglePlay}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-800 whitespace-nowrap shrink-0"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <button
                type="button"
                disabled={safeFrameIndex >= totalFrames - 1}
                onClick={onStepForward}
                aria-label="Step forward"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            {/* Playback Speed */}
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChangeSpeed(s)}
                  className={`rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors tabular-nums ${
                    speed === s
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
