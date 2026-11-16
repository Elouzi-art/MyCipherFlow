import type {ComponentType} from 'react';

export type AlgorithmCategory = 'Cipher' | 'Encoding' | 'Bitwise' | 'Text';

export interface ParamField {
  key: string;
  label: string;
  type: 'number' | 'text' | 'boolean';
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
}

export interface AnimationFrame<TState = unknown> {
  /** Short title shown in the playback bar (e.g., "Shift character 'H'") */
  title: string;
  /** Plain-language explanation of what happens during this step */
  explanation: string;
  /** Intermediate transformed string up to this step */
  outputSoFar: string;
  /** Algorithm-specific snapshot rendered by the Visualizer component */
  state: TState;
}

export interface AlgorithmTrace<TState = unknown> {
  frames: AnimationFrame<TState>[];
  finalOutput: string;
}

export interface VisualizerProps<TState = any> {
  frame: AnimationFrame<TState>;
  frameIndex: number;
  totalFrames: number;
  input: string;
  params: Record<string, any>;
}

export interface AlgorithmDefinition<TState = any> {
  id: string;
  name: string;
  category: AlgorithmCategory;
  summary: string;
  /** Short pattern tag explaining what animation technique this module demonstrates */
  animationPattern: string;
  complexity: string;
  paramSchema: ParamField[];
  defaultParams: Record<string, any>;
  /** Pure function: takes input text + params and returns step-by-step frames + final output */
  computeTrace: (input: string, params: Record<string, any>) => AlgorithmTrace<TState>;
  /** Optional function returning inverted params when running a recipe in Decrypt mode */
  invertParams?: (params: Record<string, any>) => Record<string, any>;
  /** React component rendering a single frame using motion/react */
  Visualizer: ComponentType<VisualizerProps<TState>>;
}

export interface RecipeStep {
  instanceId: string;
  algorithmId: string;
  enabled: boolean;
  params: Record<string, any>;
}

export interface ExecutedStep {
  step: RecipeStep;
  effectiveParams: Record<string, any>;
  isInverted: boolean;
  algorithm: AlgorithmDefinition;
  input: string;
  trace: AlgorithmTrace;
  output: string;
}

export interface PresetRecipe {
  id: string;
  name: string;
  description: string;
  sampleInput: string;
  mode?: 'forward' | 'decrypt';
  isCustom?: boolean;
  createdAt?: string;
  steps: Array<{
    algorithmId: string;
    params?: Record<string, any>;
  }>;
}
