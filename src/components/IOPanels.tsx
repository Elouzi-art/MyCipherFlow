import {ArrowUpFromLine, Check, Copy} from 'lucide-react';
import {AnimatePresence, motion} from 'motion/react';
import {useState} from 'react';

interface InputPanelProps {
  input: string;
  onChangeInput: (val: string) => void;
}

const SAMPLE_INPUTS = ['HELLO LAB', 'Packet42', 'CipherFlow'];

export function InputPanel({input, onChangeInput}: InputPanelProps) {
  return (
    <section className="flex flex-col rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-baseline gap-2.5">
          <h2 className="font-display text-sm font-semibold text-slate-900">Input</h2>
          <span className="font-mono text-xs text-slate-500 tabular-nums">
            {input.length} chars · {new TextEncoder().encode(input).length} bytes
          </span>
        </div>

        <div className="flex items-center gap-1">
          {SAMPLE_INPUTS.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => onChangeInput(sample)}
              className="rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap shrink-0"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={input}
        onChange={(e) => onChangeInput(e.target.value)}
        rows={2}
        placeholder="Type text to send through the animated recipe..."
        aria-label="Pipeline input text"
        className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-600 focus:bg-white focus:outline-none"
      />
    </section>
  );
}

interface OutputPanelProps {
  finalOutput: string;
  stageOutput: string | null;
  stageName: string | null;
  isDecryptMode: boolean;
  onUseAsInput: (val: string) => void;
}

function toHexString(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(16).toUpperCase().padStart(2, '0'))
    .join(' ');
}

export function OutputPanel({
  finalOutput,
  stageOutput,
  stageName,
  isDecryptMode,
  onUseAsInput,
}: OutputPanelProps) {
  const [outputFormat, setOutputFormat] = useState<'text' | 'hex'>('text');
  const [copied, setCopied] = useState(false);

  const displayedOutput = outputFormat === 'hex' ? toHexString(finalOutput) : finalOutput;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(displayedOutput);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable
    }
  }

  return (
    <section className="flex flex-col rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <h2 className="font-display text-sm font-semibold text-slate-900">
            Output {isDecryptMode ? '(Decrypted)' : ''}
          </h2>
          <span className="font-mono text-xs text-slate-500 tabular-nums">
            {finalOutput.length} chars
            {stageName && stageOutput !== null && stageOutput !== finalOutput
              ? ` · Active stage (${stageName}): ${stageOutput}`
              : ''}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-md bg-slate-100 p-0.5">
            <button
              type="button"
              onClick={() => setOutputFormat('text')}
              className={`rounded px-2 py-1 text-xs font-medium ${
                outputFormat === 'text' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Text
            </button>
            <button
              type="button"
              onClick={() => setOutputFormat('hex')}
              className={`rounded px-2 py-1 text-xs font-medium ${
                outputFormat === 'hex' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Hex
            </button>
          </div>

          <button
            type="button"
            disabled={!finalOutput}
            onClick={() => onUseAsInput(finalOutput)}
            title="Send output back to Input to test round-trip decryption"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 whitespace-nowrap shrink-0"
          >
            <ArrowUpFromLine className="h-3.5 w-3.5" />
            <span>Send to Input</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={displayedOutput}
          initial={{opacity: 0.55, y: 3}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.18}}
        >
          <textarea
            readOnly
            value={displayedOutput}
            rows={2}
            aria-label="Pipeline output text"
            className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm text-slate-900 focus:outline-none"
          />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
