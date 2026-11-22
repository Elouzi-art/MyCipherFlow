# CipherFlow — Animated Algorithm Pipeline Workbench

CipherFlow is an educational web application for data transformation and cryptography, inspired by CyberChef.

Unlike tools that perform transformations instantly, CipherFlow makes the execution process visible through step-by-step animations. Users can chain operations into custom recipes, inspect intermediate data states, adjust parameters, and follow transformations character by character or byte by byte.

## Key Features

- **Interactive Pipeline Builder:** Chain multiple operations into a recipe and manage the execution order.
- **Step-by-Step Animation:** Inspect transformations frame by frame using playback controls.
- **Plug-and-Play Architecture:** Add algorithms through a shared TypeScript contract without rewriting the core interface.
- **Live I/O Panel:** Enter input data and inspect the resulting output.
- **Preset Management:** Load predefined recipes and save custom pipeline configurations.
- **Interactive Application Guide:** A dedicated Guide page introduces the application workflow, explains the main interface, and helps users understand how to work with operations, the Workbench, and Recipes.

## Current Built-in Operations

| Operation | Category | Description | Animation |
|---|---|---|---|
| **Caesar Cipher** | Cipher | Shifts letters along the alphabet using a configurable key | Alphabet wheel and letter-by-letter tracking |
| **Base64 Encode/Decode** | Encoding | Converts text to and from Base64 representation | 3-byte to 4-character block mapping |
| **XOR Cipher** | Bitwise | Applies bitwise XOR between input bytes and a key | Binary comparison and bit-flip visualization |
| **Reverse Text** | Text | Reverses the order of characters | Positional character displacement |

## Getting Started

### Prerequisites

- Node.js and npm
- A modern web browser

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Vite prints the local URL in the terminal (usually `http://localhost:5173`).

### Validate the project

```bash
npm run lint
npm run build
```

## Using CipherFlow

1. Open the **Workbench** to enter input data and select an operation.
2. Configure the operation parameters, then inspect the generated transformation trace.
3. Use the playback controls to move through the animation and understand each processing step.
4. Combine operations into a **Recipe** to build a multi-step transformation pipeline.
5. Open the **Guide** page from the application navigation for an introduction to the interface and its main workflows.

## UI and Styling

The application uses React, TypeScript, Vite, and Tailwind CSS. Bootstrap 5 is also included for responsive layout utilities used by the Guide page. Bootstrap is used selectively so the Guide can follow the application's existing visual language rather than replacing the global styling.

## Architecture

```text
src/
├── App.tsx                 # Global state, navigation, pipeline orchestration, and animation
├── main.tsx                # React entry point
├── algorithms/
│   ├── types.ts            # Algorithm, trace, and recipe contracts
│   ├── registry.ts         # Algorithm registry and pipeline execution
│   └── *.tsx               # Algorithm implementations and visualizers
├── components/
│   └── ...                 # Navigation, pipeline, animations, I/O panels, and recipes
└── pages/
    └── Guide/
        ├── GuidePage.tsx   # Interactive application guide
        └── guide.css       # Guide-specific styles

public/                     # Static assets
report/                     # Project report and resources
```
