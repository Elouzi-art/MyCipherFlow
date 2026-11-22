# CipherFlow — Animated Algorithm Pipeline Workbench

CipherFlow is an educational web application for data transformation and cryptography, inspired by CyberChef.

Unlike tools that perform transformations instantly, CipherFlow makes the execution process visible through step-by-step animations. Users can chain operations into custom recipes, inspect intermediate data states, adjust parameters, and follow transformations character by character or byte by byte.

## Key Features

- **Interactive Pipeline Builder:** Chain multiple operations into a recipe and manage the execution order.
- **Step-by-Step Animation:** Inspect transformations frame by frame using playback controls.
- **Plug-and-Play Architecture:** Add algorithms through a shared TypeScript contract without rewriting the core interface.
- **Live I/O Panel:** Enter input data and inspect the resulting output.
- **Preset Management:** Load predefined recipes and save custom pipeline configurations.

## Current Built-in Operations

| Operation | Category | Description | Animation |
|---|---|---|---|
| **Caesar Cipher** | Cipher | Shifts letters along the alphabet using a configurable key | Alphabet wheel and letter-by-letter tracking |
| **Base64 Encode/Decode** | Encoding | Converts text to and from Base64 representation | 3-byte to 4-character block mapping |
| **XOR Cipher** | Bitwise | Applies bitwise XOR between input bytes and a key | Binary comparison and bit-flip visualization |
| **Reverse Text** | Text | Reverses the order of characters | Positional character displacement |

## Architecture

```text
src/
├── App.tsx                 # Global state, pipeline orchestration, and animation
├── main.tsx                # React entry point
├── algorithms/
│   ├── types.ts            # Algorithm, trace, and recipe contracts
│   ├── registry.ts         # Algorithm registry and pipeline execution
│   └── *.tsx               # Algorithm implementations and visualizers
└── components/
    └── ...                 # Pipeline, animations, I/O panels, and recipes

public/                     # Static assets
report/                     # Project report and resources
