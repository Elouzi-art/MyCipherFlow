import {base64Algorithm} from './base64';
import {caesarAlgorithm} from './caesar';
import {reverseAlgorithm} from './reverse';
import type {AlgorithmDefinition, ExecutedStep, PresetRecipe, RecipeStep} from './types';
import {xorAlgorithm} from './xor';

/**
 * CENTRAL ALGORITHM REGISTRY
 * --------------------------
 * To plug a new algorithm into the workbench:
 * 1. Create a file in `src/algorithms/` exporting an `AlgorithmDefinition`.
 * 2. Import it above and add it to the `ALGORITHMS` array below.
 * The Add Operation popup, recipe pipeline, parameter controls, and
 * animation stage will automatically pick it up.
 */
export const ALGORITHMS: AlgorithmDefinition[] = [
  caesarAlgorithm,
  base64Algorithm,
  xorAlgorithm,
  reverseAlgorithm,
];

export const ALGORITHM_MAP: Record<string, AlgorithmDefinition> = Object.fromEntries(
  ALGORITHMS.map((algo) => [algo.id, algo]),
);

export const PRESET_RECIPES: PresetRecipe[] = [
  {
    id: 'secret-envelope',
    name: 'Caesar + Base64',
    description: 'Shift letters by +3, then encode the shifted text into Base64.',
    sampleInput: 'HELLO LAB',
    mode: 'forward',
    steps: [
      {algorithmId: 'caesar-cipher', params: {shift: 3, decode: false}},
      {algorithmId: 'base64-encode', params: {decode: false}},
    ],
  },
  {
    id: 'obfuscate-xor',
    name: 'Reverse + XOR',
    description: 'Reverse the text with case swap, then XOR bytes with key "CS".',
    sampleInput: 'Packet42',
    mode: 'forward',
    steps: [
      {algorithmId: 'reverse-text', params: {swapCase: true}},
      {algorithmId: 'xor-cipher', params: {key: 'CS', hexOutput: true, decode: false}},
    ],
  },
  {
    id: 'caesar-roundtrip',
    name: 'Caesar + Reverse',
    description: 'Shift characters by +5 and reverse the output order.',
    sampleInput: 'CIPHER',
    mode: 'forward',
    steps: [
      {algorithmId: 'caesar-cipher', params: {shift: 5, decode: false}},
      {algorithmId: 'reverse-text', params: {swapCase: false}},
    ],
  },
];

export function executePipeline(
  initialInput: string,
  recipeSteps: RecipeStep[],
  isDecryptMode = false,
): {
  executedSteps: ExecutedStep[];
  finalOutput: string;
} {
  let currentText = initialInput;
  const executedSteps: ExecutedStep[] = [];
  const orderedSteps = isDecryptMode ? [...recipeSteps].reverse() : recipeSteps;

  for (const step of orderedSteps) {
    const algorithm = ALGORITHM_MAP[step.algorithmId];
    if (!algorithm) continue;

    const effectiveParams =
      isDecryptMode && algorithm.invertParams
        ? algorithm.invertParams(step.params)
        : step.params;

    if (!step.enabled) {
      const bypassTrace = {
        frames: [
          {
            title: `${algorithm.name} bypassed`,
            explanation: 'This step is currently disabled; input passes straight through unchanged.',
            outputSoFar: currentText,
            state: algorithm.computeTrace(currentText, effectiveParams).frames[0]?.state ?? {},
          },
        ],
        finalOutput: currentText,
      };
      executedSteps.push({
        step,
        effectiveParams,
        isInverted: isDecryptMode,
        algorithm,
        input: currentText,
        trace: bypassTrace,
        output: currentText,
      });
      continue;
    }

    const trace = algorithm.computeTrace(currentText, effectiveParams);
    executedSteps.push({
      step,
      effectiveParams,
      isInverted: isDecryptMode,
      algorithm,
      input: currentText,
      trace,
      output: trace.finalOutput,
    });
    currentText = trace.finalOutput;
  }

  return {
    executedSteps,
    finalOutput: currentText,
  };
}
