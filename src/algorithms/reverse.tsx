import {motion} from 'motion/react';
import type {AlgorithmDefinition, AnimationFrame, VisualizerProps} from './types';

interface ReverseToken {
  id: string;
  char: string;
  originalIndex: number;
}

interface ReverseState {
  phase: 'initial' | 'swapping' | 'complete';
  tokens: ReverseToken[];
  leftIndex: number | null;
  rightIndex: number | null;
  swapCase: boolean;
}

function toggleCase(ch: string): string {
  if (ch >= 'a' && ch <= 'z') return ch.toUpperCase();
  if (ch >= 'A' && ch <= 'Z') return ch.toLowerCase();
  return ch;
}

function computeReverseTrace(input: string, params: Record<string, any>) {
  const swapCase = Boolean(params.swapCase);
  const fullOutput = input
    .split('')
    .reverse()
    .map((ch) => (swapCase ? toggleCase(ch) : ch))
    .join('');

  const chars = input.slice(0, 16).split('');
  const tokens: ReverseToken[] = chars.map((char, idx) => ({
    id: `tok-${idx}`,
    char,
    originalIndex: idx,
  }));

  const frames: AnimationFrame<ReverseState>[] = [
    {
      title: 'Load character array',
      explanation:
        chars.length === 0
          ? 'Enter input text to watch array elements swap positions.'
          : `Loaded ${chars.length} characters into indexed array slots.`,
      outputSoFar: chars.map((t) => t).join(''),
      state: {
        phase: 'initial',
        tokens: [...tokens],
        leftIndex: null,
        rightIndex: null,
        swapCase,
      },
    },
  ];

  const working = [...tokens];
  const half = Math.floor(working.length / 2);

  for (let i = 0; i < half; i++) {
    const j = working.length - 1 - i;
    const leftToken = working[i];
    const rightToken = working[j];

    working[i] = {
      ...rightToken,
      char: swapCase ? toggleCase(rightToken.char) : rightToken.char,
    };
    working[j] = {
      ...leftToken,
      char: swapCase ? toggleCase(leftToken.char) : leftToken.char,
    };

    frames.push({
      title: `Swap index ${i} and ${j}`,
      explanation: `Moved '${leftToken.char}' to index ${j} and '${rightToken.char}' to index ${i}${
        swapCase ? ' while inverting letter case' : ''
      }.`,
      outputSoFar: working.map((t) => t.char).join(''),
      state: {
        phase: 'swapping',
        tokens: working.map((t) => ({...t})),
        leftIndex: i,
        rightIndex: j,
        swapCase,
      },
    });
  }

  // Handle middle character case swap if odd length
  if (swapCase && working.length % 2 === 1) {
    const mid = Math.floor(working.length / 2);
    working[mid] = {...working[mid], char: toggleCase(working[mid].char)};
  }

  frames.push({
    title: 'Reversal complete',
    explanation: `All pointers met at the center. Final string is "${fullOutput}".`,
    outputSoFar: fullOutput,
    state: {
      phase: 'complete',
      tokens: working.map((t) => ({...t})),
      leftIndex: null,
      rightIndex: null,
      swapCase,
    },
  });

  return {frames, finalOutput: fullOutput};
}

function ReverseVisualizer({frame}: VisualizerProps<ReverseState>) {
  const {tokens, leftIndex, rightIndex, phase} = frame.state;

  if (tokens.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-slate-500">
        Type some text in the Input box to animate array reversal.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-6">
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {tokens.map((token, currentIndex) => {
          const isLeft = currentIndex === leftIndex;
          const isRight = currentIndex === rightIndex;
          const isHighlighted = isLeft || isRight;

          return (
            <motion.div
              key={token.id}
              layout
              transition={{type: 'spring', stiffness: 320, damping: 28}}
              className={`flex flex-col items-center gap-1.5`}
            >
              <div
                className={`flex h-14 w-12 items-center justify-center rounded-lg border font-mono text-lg font-semibold transition-colors ${
                  isHighlighted
                    ? 'border-sky-600 bg-sky-50 text-sky-900 shadow-sm'
                    : phase === 'complete'
                      ? 'border-emerald-600/40 bg-emerald-50/70 text-emerald-950'
                      : 'border-slate-200 bg-white text-slate-900'
                }`}
              >
                {token.char === ' ' ? '␣' : token.char}
              </div>
              <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                [{currentIndex}]
              </span>
              <span className="h-4 text-[11px] font-medium text-sky-700">
                {isLeft ? 'Left' : isRight ? 'Right' : ''}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center gap-6 text-xs text-slate-600">
        <span>Two-pointer swap · O(n / 2) steps</span>
        <span aria-hidden="true">·</span>
        <span>Uses motion layout prop for automatic position interpolation</span>
      </div>
    </div>
  );
}

export const reverseAlgorithm: AlgorithmDefinition<ReverseState> = {
  id: 'reverse-text',
  name: 'Reverse Text',
  category: 'Text',
  summary: 'Reverses character order using two pointers moving inward from both ends.',
  animationPattern: 'Array Swap (layout)',
  complexity: 'O(n)',
  paramSchema: [
    {
      key: 'swapCase',
      label: 'Invert Case',
      type: 'boolean',
    },
  ],
  defaultParams: {
    swapCase: false,
  },
  invertParams: (params) => ({...params}),
  computeTrace: computeReverseTrace,
  Visualizer: ReverseVisualizer,
};
