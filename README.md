# CipherFlow

An educational web application for building chains of encryption and text transformation operations, then visualizing each operation step by step.

## Architecture

```text
src/
├── App.tsx                 # global state, pipeline orchestration, and animation
├── main.tsx                # React entry point
├── algorithms/
│   ├── types.ts            # algorithm, trace, and recipe contracts
│   ├── registry.ts         # registry, predefined recipes, and pipeline execution
│   └── *.tsx               # algorithms and visualizers (Caesar, Base64, XOR, Reverse)
└── components/             # interface: pipeline, animations, inputs/outputs, and recipes

public/                     # static assets
report/                     # project report and resources
```

Each algorithm exposes a `computeTrace` function that returns the result and a sequence of explanatory frames, as well as a `Visualizer` component to display them. `registry.ts` brings together the algorithms, predefined recipes, and pipeline execution.

**Main flow:** enter text → run the operations in order → animate the frames for the selected step → display the result.

## Technologies

React 18 · TypeScript · Vite · Tailwind CSS · Motion

## Getting Started

Prerequisites: Node.js and npm.

```bash
npm install
npm run dev
```

Run TypeScript checks and create a production build with `npm run lint` and `npm run build`.

## Adding an Algorithm

Create a module in `src/algorithms/` that exports a definition conforming to `AlgorithmDefinition`, then import it and add it to the `ALGORITHMS` array in `src/algorithms/registry.ts`.
