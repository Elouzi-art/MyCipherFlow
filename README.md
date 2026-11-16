# CipherFlow - Animated Algorithm Pipeline Workbench

CipherFlow is a web-based data transformation and cryptography workbench inspired by CyberChef. While CyberChef performs transformations instantly, CipherFlow makes the internal execution visible, intuitive, and educational through declarative, frame-by-frame animations.

Users can chain operations into custom recipes, inspect intermediate data states, adjust parameters in real time, and step through the transformation process character by character or byte by byte.

---

## Key Features

- **Interactive Pipeline Builder (Recipe)**: Chain multiple cryptographic and encoding operations in sequence, toggle steps, reorder them, or invert the pipeline for decryption.
- **Step-by-Step Animation Stage**: Inspect transformations frame-by-frame with playback controls (play, pause, step forward/back, jump to start/end) and variable playback speed (0.5x, 1x, 2x).
- **Plug-and-Play Architecture**: Easily add new algorithms by implementing a single TypeScript contract (`AlgorithmDefinition`) without modifying the core UI.
- **Live I/O Panel**: Real-time input entry and output preview with instant feedback and a quick action to pipe results back into input.
- **Preset Management**: Load predefined multi-step recipes or save custom pipeline setups.

---

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Animation Engine**: Motion (formerly Framer Motion)
- **Bundler & Dev Server**: Vite
- **Icons**: Lucide React

---

## Project Structure

```text
cipherflow/
├── public/                 # Static assets and favicon
├── src/
│   ├── algorithms/         # Algorithm definitions and transformation logic
│   ├── components/         # User interface components
│   ├── App.tsx             # Main application state and pipeline orchestrator
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global Tailwind and font styles
├── index.html              # HTML shell
├── package.json            # Project dependencies and npm scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build and plugin configuration
```

---

## Current built-in Operations

| Operation | Category | Description | Animation Pattern |
|-----------|----------|-------------|-------------------|
| **Caesar Cipher** | Cipher | Shifts letters along the alphabet by a configurable key | Alphabet wheel tracking letter by letter |
| **Base64 Encode/Decode** | Encoding | Converts text to and from standard Base64 representation | 3-byte to 4-character block mapping |
| **XOR Cipher** | Bitwise | Applies bitwise XOR between input bytes and a key | Binary comparison and bit-flip visualizer |
| **Reverse Text** | Text | Reverses string order with optional case swapping | Positional character displacement |

