# CipherFlow

Educational web application for composing encryption and text transformation chains, then visualizing each operation step by step.

## Architecture

```text
src/
├── App.tsx                 # global state, pipeline orchestration, and animation
├── main.tsx                # React entry point
├── algorithms/
│   ├── types.ts            # algorithm contracts, traces, and recipes
│   ├── registry.ts         # registry, predefined recipes, and pipeline execution
│   └── *.tsx               # algorithms and visualizers (Caesar, Base64, XOR, Reverse)
└── components/             # interface: pipeline, animations, inputs/outputs, recipes

public/                     # static resources
report/                     # project report and resources
```

Each algorithm exposes a `computeTrace` function that produces the result and a sequence of explanatory frames, along with a `Visualizer` component to display them. `registry.ts` assembles the algorithm registry, predefined recipes, and execution flow.

**Main flow:** input → execution of operations in order → animation of the selected step frames → result display.

## Technologies

React 18 · TypeScript · Vite · Tailwind CSS · Motion

## Getting Started

Prerequisites: Node.js and npm.

```bash
npm install
npm run dev
```

TypeScript checks and production builds are available with `npm run lint` and `npm run build`.

## Adding an Algorithm

Create a module in `src/algorithms/` that exports a definition matching `AlgorithmDefinition`, then import it and add it to the `ALGORITHMS` array in `src/algorithms/registry.ts`.
