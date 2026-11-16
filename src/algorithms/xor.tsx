import {motion} from 'motion/react';
import type {AlgorithmDefinition, AlgorithmTrace, AnimationFrame, VisualizerProps} from './types';

interface XorBitRow {
  inputBit: string;
  keyBit: string;
  outBit: string;
}

interface XorByteSnapshot {
  index: number;
  inputLabel: string;
  inputCode: number;
  keyChar: string;
  keyCode: number;
  outCode: number;
  outDisplay: string;
  bits: XorBitRow[];
}

interface XorState {
  activeByteIndex: number;
  key: string;
  decode: boolean;
  current: XorByteSnapshot | null;
  completedTokens: string[];
  streamLabels: string[];
}

function toBits8(num: number): string[] {
  return num.toString(2).padStart(8, '0').split('');
}

function toHex2(num: number): string {
  return num.toString(16).toUpperCase().padStart(2, '0');
}

function parseInputBytes(input: string, decode: boolean, hexOutput: boolean): Array<{code: number; label: string}> {
  if (decode && hexOutput) {
    const tokens = input.trim().split(/\s+/).filter(Boolean);
    const allHex = tokens.length > 0 && tokens.every((t) => /^[0-9a-fA-F]{1,2}$/.test(t));
    if (allHex) {
      return tokens.map((t) => ({
        code: parseInt(t, 16),
        label: t.toUpperCase().padStart(2, '0'),
      }));
    }
  }
  return input.split('').map((ch) => ({
    code: ch.charCodeAt(0),
    label: ch === ' ' ? '␣' : ch,
  }));
}

function computeXorTrace(input: string, params: Record<string, any>): AlgorithmTrace<XorState> {
  const key = String(params.key || 'K');
  const hexOutput = Boolean(params.hexOutput);
  const decode = Boolean(params.decode);

  const inputBytes = parseInputBytes(input, decode, hexOutput);
  const fullOutCodes = inputBytes.map((item, idx) => item.code ^ key.charCodeAt(idx % key.length));

  const finalOutput =
    !decode && hexOutput
      ? fullOutCodes.map((c) => toHex2(c)).join(' ')
      : fullOutCodes.map((c) => String.fromCharCode(c)).join('');

  const previewBytes = inputBytes.slice(0, 10);
  const streamLabels = previewBytes.map((b) => b.label);

  const frames: AnimationFrame<XorState>[] = [
    {
      title: `Initialize XOR ${decode ? 'decryption' : 'encryption'} with key "${key}"`,
      explanation: `Each byte will be XORed against repeating key "${key}" bit-by-bit (1 ^ 0 = 1, 1 ^ 1 = 0).`,
      outputSoFar: '',
      state: {
        activeByteIndex: -1,
        key,
        decode,
        current: null,
        completedTokens: [],
        streamLabels,
      },
    },
  ];

  const completedTokens: string[] = [];

  previewBytes.forEach((item, idx) => {
    const keyChar = key[idx % key.length];
    const keyCode = keyChar.charCodeAt(0);
    const outCode = item.code ^ keyCode;
    const outDisplay = !decode && hexOutput ? toHex2(outCode) : String.fromCharCode(outCode);

    const inBits = toBits8(item.code);
    const keyBits = toBits8(keyCode);
    const outBits = toBits8(outCode);

    const bits: XorBitRow[] = inBits.map((b, bitIdx) => ({
      inputBit: b,
      keyBit: keyBits[bitIdx],
      outBit: outBits[bitIdx],
    }));

    completedTokens.push(outDisplay);

    frames.push({
      title: `XOR byte #${idx} (${item.label} ^ '${keyChar}')`,
      explanation: `0x${toHex2(item.code)} (${inBits.join('')}) XOR 0x${toHex2(keyCode)} (${keyBits.join('')}) = 0x${toHex2(outCode)} (${outBits.join('')}).`,
      outputSoFar: !decode && hexOutput ? completedTokens.join(' ') : completedTokens.join(''),
      state: {
        activeByteIndex: idx,
        key,
        decode,
        current: {
          index: idx,
          inputLabel: item.label,
          inputCode: item.code,
          keyChar,
          keyCode,
          outCode,
          outDisplay,
          bits,
        },
        completedTokens: [...completedTokens],
        streamLabels,
      },
    });
  });

  frames.push({
    title: `Bitwise XOR ${decode ? 'decryption' : 'encryption'} complete`,
    explanation: `Processed ${inputBytes.length} bytes with key "${key}".`,
    outputSoFar: finalOutput,
    state: {
      activeByteIndex: previewBytes.length,
      key,
      decode,
      current: frames[frames.length - 1]?.state.current ?? null,
      completedTokens: [...completedTokens],
      streamLabels,
    },
  });

  return {frames, finalOutput};
}

function XorVisualizer({frame}: VisualizerProps<XorState>) {
  const {current, completedTokens, activeByteIndex, key, streamLabels, decode} = frame.state;

  if (streamLabels.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-slate-500">
        Enter text in the Input box to inspect bitwise XOR gates.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      {current ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <span>
              Byte #{current.index} · Input <code className="font-semibold text-slate-900">{current.inputLabel}</code> (0x{toHex2(current.inputCode)})
            </span>
            <span>
              Key <code className="font-semibold text-sky-700">'{current.keyChar}'</code> (0x{toHex2(current.keyCode)}) → Output <code className="font-semibold text-emerald-700">{current.outDisplay === ' ' ? '␣' : current.outDisplay}</code> (0x{toHex2(current.outCode)})
            </span>
          </div>

          <div className="grid grid-cols-[88px_repeat(8,minmax(0,1fr))] items-center gap-2 font-mono text-sm">
            <span className="text-xs font-medium text-slate-500">Input bits</span>
            {current.bits.map((b, i) => (
              <motion.div
                key={`in-${current.index}-${i}`}
                initial={{opacity: 0, y: -6}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: i * 0.03}}
                className="flex h-10 items-center justify-center rounded border border-slate-200 bg-slate-50 font-semibold text-slate-900"
              >
                {b.inputBit}
              </motion.div>
            ))}

            <span className="text-xs font-medium text-sky-700">XOR Key</span>
            {current.bits.map((b, i) => (
              <motion.div
                key={`key-${current.index}-${i}`}
                initial={{opacity: 0, y: -6}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.05 + i * 0.03}}
                className="flex h-10 items-center justify-center rounded border border-sky-200 bg-sky-50 font-semibold text-sky-900"
              >
                {b.keyBit}
              </motion.div>
            ))}

            <span className="text-xs font-medium text-emerald-700">Result</span>
            {current.bits.map((b, i) => {
              const differs = b.inputBit !== b.keyBit;
              return (
                <motion.div
                  key={`out-${current.index}-${i}`}
                  initial={{scale: 0.85, opacity: 0}}
                  animate={{scale: 1, opacity: 1}}
                  transition={{delay: 0.14 + i * 0.04, type: 'spring', stiffness: 300, damping: 24}}
                  className={`flex h-10 items-center justify-center rounded border font-semibold ${
                    differs
                      ? 'border-emerald-500/50 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 bg-white text-slate-500'
                  }`}
                >
                  {b.outBit}
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 text-sm text-slate-600">
          Ready to XOR bytes ({decode ? 'Decode' : 'Encode'}) against repeating key "{key}"
        </div>
      )}

      {/* Byte stream strip */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-slate-500">
          {decode ? 'Decoded character stream' : 'Encoded byte stream'}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {streamLabels.map((label, idx) => {
            const outTok = completedTokens[idx];
            const isCurrent = idx === activeByteIndex;
            return (
              <div
                key={idx}
                className={`flex min-w-12 flex-col items-center rounded border px-2 py-1.5 font-mono text-xs ${
                  isCurrent
                    ? 'border-sky-600 bg-sky-50 text-sky-900'
                    : outTok
                      ? 'border-emerald-600/30 bg-emerald-50/50 text-slate-900'
                      : 'border-slate-200 bg-white text-slate-400'
                }`}
              >
                <span className="text-[11px] text-slate-500">{label}</span>
                <span className="font-semibold">{outTok === ' ' ? '␣' : (outTok ?? '--')}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const xorAlgorithm: AlgorithmDefinition<XorState> = {
  id: 'xor-cipher',
  name: 'XOR Cipher',
  category: 'Bitwise',
  summary: 'Applies bitwise exclusive-OR between each byte of text and a repeating key.',
  animationPattern: '8-Bit Gate Matrix',
  complexity: 'O(n)',
  paramSchema: [
    {
      key: 'key',
      label: 'XOR Key',
      type: 'text',
      placeholder: 'KEY',
    },
    {
      key: 'hexOutput',
      label: 'Hex Byte Format',
      type: 'boolean',
    },
    {
      key: 'decode',
      label: 'Decrypt (Hex → Text)',
      type: 'boolean',
    },
  ],
  defaultParams: {
    key: 'K',
    hexOutput: true,
    decode: false,
  },
  invertParams: (params) => ({
    ...params,
    decode: !params.decode,
  }),
  computeTrace: computeXorTrace,
  Visualizer: XorVisualizer,
};
