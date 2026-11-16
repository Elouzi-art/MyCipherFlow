import {AnimatePresence, motion} from 'motion/react';
import type {AlgorithmDefinition, AnimationFrame, VisualizerProps} from './types';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface CaesarCharResult {
  original: string;
  shifted: string;
  isLetter: boolean;
}

interface CaesarState {
  activeIndex: number;
  shift: number;
  decode: boolean;
  currentOriginal: string | null;
  currentShifted: string | null;
  originalPos: number | null;
  targetPos: number | null;
  results: CaesarCharResult[];
}

function shiftChar(char: string, shift: number): {result: string; isLetter: boolean; origIdx: number | null; nextIdx: number | null} {
  const code = char.charCodeAt(0);
  if (code >= 65 && code <= 90) {
    const origIdx = code - 65;
    const nextIdx = ((origIdx + shift) % 26 + 26) % 26;
    return {result: String.fromCharCode(65 + nextIdx), isLetter: true, origIdx, nextIdx};
  }
  if (code >= 97 && code <= 122) {
    const origIdx = code - 97;
    const nextIdx = ((origIdx + shift) % 26 + 26) % 26;
    return {result: String.fromCharCode(97 + nextIdx), isLetter: true, origIdx, nextIdx};
  }
  return {result: char, isLetter: false, origIdx: null, nextIdx: null};
}

function computeCaesarTrace(input: string, params: Record<string, any>) {
  const rawShift = Number(params.shift ?? 3);
  const decode = Boolean(params.decode);
  const effectiveShift = decode ? -rawShift : rawShift;

  const fullOutput = input
    .split('')
    .map((ch) => shiftChar(ch, effectiveShift).result)
    .join('');

  const previewChars = input.slice(0, 18).split('');
  const results: CaesarCharResult[] = [];

  const frames: AnimationFrame<CaesarState>[] = [
    {
      title: `Align alphabet ruler (${effectiveShift >= 0 ? `+${effectiveShift}` : effectiveShift})`,
      explanation: `Prepared Caesar shift of ${effectiveShift >= 0 ? `+${effectiveShift}` : effectiveShift} positions across A–Z.`,
      outputSoFar: '',
      state: {
        activeIndex: -1,
        shift: effectiveShift,
        decode,
        currentOriginal: null,
        currentShifted: null,
        originalPos: null,
        targetPos: null,
        results: [],
      },
    },
  ];

  previewChars.forEach((ch, idx) => {
    const mapped = shiftChar(ch, effectiveShift);
    results.push({original: ch, shifted: mapped.result, isLetter: mapped.isLetter});

    frames.push({
      title: mapped.isLetter ? `Map '${ch}' to '${mapped.result}'` : `Keep '${ch === ' ' ? 'space' : ch}' unchanged`,
      explanation: mapped.isLetter
        ? `Alphabet index ${mapped.origIdx} + (${effectiveShift}) mod 26 = index ${mapped.nextIdx} ('${mapped.result}').`
        : `Non-alphabetic character '${ch === ' ' ? 'space' : ch}' passes directly to output.`,
      outputSoFar: results.map((r) => r.shifted).join(''),
      state: {
        activeIndex: idx,
        shift: effectiveShift,
        decode,
        currentOriginal: ch,
        currentShifted: mapped.result,
        originalPos: mapped.origIdx,
        targetPos: mapped.nextIdx,
        results: [...results],
      },
    });
  });

  frames.push({
    title: 'Substitution complete',
    explanation: `Transformed ${input.length} characters with shift ${effectiveShift >= 0 ? `+${effectiveShift}` : effectiveShift}.`,
    outputSoFar: fullOutput,
    state: {
      activeIndex: previewChars.length,
      shift: effectiveShift,
      decode,
      currentOriginal: null,
      currentShifted: null,
      originalPos: null,
      targetPos: null,
      results: [...results],
    },
  });

  return {frames, finalOutput: fullOutput};
}

function CaesarVisualizer({frame, input}: VisualizerProps<CaesarState>) {
  const {activeIndex, shift, originalPos, targetPos, results, currentOriginal, currentShifted} = frame.state;
  const previewChars = input.slice(0, 18).split('');
  const normalizedShift = ((shift % 26) + 26) % 26;

  if (previewChars.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-slate-500">
        Enter text in the Input box to animate the Caesar Cipher shift.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Input vs Output Character Tape */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Character stream</span>
          <span className="tabular-nums">Showing {previewChars.length} of {input.length} chars</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {previewChars.map((ch, idx) => {
            const isCurrent = idx === activeIndex;
            const processed = results[idx];
            return (
              <motion.div
                key={idx}
                animate={{
                  y: isCurrent ? -4 : 0,
                  scale: isCurrent ? 1.05 : 1,
                }}
                transition={{duration: 0.18}}
                className={`flex w-10 flex-col items-center rounded-md border py-1.5 font-mono text-xs ${
                  isCurrent
                    ? 'border-sky-600 bg-sky-50 text-sky-900 shadow-sm'
                    : processed
                      ? 'border-emerald-600/30 bg-emerald-50/50 text-slate-900'
                      : 'border-slate-200 bg-white text-slate-400'
                }`}
              >
                <span className="text-[11px] text-slate-500">{ch === ' ' ? '␣' : ch}</span>
                <span className="my-0.5 text-[10px] text-slate-400">↓</span>
                <span className="text-sm font-semibold">
                  {processed ? (processed.shifted === ' ' ? '␣' : processed.shifted) : '·'}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Sliding Alphabet Lookup Strip */}
      <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
        <div className="mb-3 flex items-center justify-between text-xs text-slate-600">
          <span>Alphabet lookup ruler</span>
          <AnimatePresence mode="wait">
            {currentOriginal !== null && currentShifted !== null ? (
              <motion.span
                key={`${activeIndex}-${currentOriginal}`}
                initial={{opacity: 0, y: 4}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -4}}
                transition={{duration: 0.16}}
                className="font-mono font-medium text-sky-700"
              >
                '{currentOriginal === ' ' ? '␣' : currentOriginal}' → '{currentShifted === ' ' ? '␣' : currentShifted}' (shift {shift >= 0 ? `+${shift}` : shift})
              </motion.span>
            ) : (
              <span className="font-mono text-slate-500">Shift = {shift >= 0 ? `+${shift}` : shift}</span>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-13 gap-1 sm:grid-cols-26">
          {ALPHABET.map((letter, idx) => {
            const shiftedLetter = ALPHABET[(idx + normalizedShift) % 26];
            const isSource = idx === originalPos;
            const isTarget = (idx + normalizedShift) % 26 === targetPos && isSource;

            return (
              <div
                key={letter}
                className={`flex flex-col items-center rounded border py-1 font-mono text-[11px] transition-colors ${
                  isSource
                    ? 'border-sky-600 bg-sky-600 text-white'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <span className="font-semibold">{letter}</span>
                <span className={`text-[10px] ${isSource ? 'text-sky-100' : 'text-slate-400'}`}>↓</span>
                <span className={`font-semibold ${isTarget ? 'text-amber-200' : isSource ? 'text-white' : 'text-emerald-700'}`}>
                  {shiftedLetter}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const caesarAlgorithm: AlgorithmDefinition<CaesarState> = {
  id: 'caesar-cipher',
  name: 'Caesar Cipher',
  category: 'Cipher',
  summary: 'Shifts each alphabetic letter by a fixed offset around the 26-letter alphabet.',
  animationPattern: 'Character Tape + Lookup Ruler',
  complexity: 'O(n)',
  paramSchema: [
    {
      key: 'shift',
      label: 'Shift Offset',
      type: 'number',
      min: -25,
      max: 25,
      step: 1,
      unit: 'chars',
    },
    {
      key: 'decode',
      label: 'Reverse Shift (Decode)',
      type: 'boolean',
    },
  ],
  defaultParams: {
    shift: 3,
    decode: false,
  },
  invertParams: (params) => ({
    ...params,
    decode: !params.decode,
  }),
  computeTrace: computeCaesarTrace,
  Visualizer: CaesarVisualizer,
};
