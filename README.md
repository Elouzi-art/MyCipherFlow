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
├── report/                 # LaTeX academic progress report and screenshots
│   ├── imgs/               # Report screenshots
│   ├── main.tex            # LaTeX report source
│   └── main.pdf            # Compiled progress report
├── src/
│   ├── algorithms/         # Algorithm definitions and transformation logic
│   │   ├── types.ts        # Core TypeScript interfaces (AlgorithmDefinition, Frame, etc.)
│   │   ├── registry.ts     # Central registry of available operations and presets
│   │   ├── caesar.tsx      # Caesar cipher logic and visualizer
│   │   ├── base64.tsx      # Base64 encoder/decoder logic and visualizer
│   │   ├── xor.tsx         # XOR cipher logic and visualizer
│   │   └── reverse.tsx     # String reverse logic and visualizer
│   ├── components/         # User interface components
│   │   ├── TopBar.tsx              # Navigation bar and global playback toggle
│   │   ├── IOPanels.tsx            # Input and output text areas
│   │   ├── RecipePipeline.tsx      # Draggable/reorderable operation chain
│   │   ├── AnimationStage.tsx      # Step-by-step frame visualizer stage
│   │   ├── AddOperationModal.tsx   # Modal dialog for selecting operations to append
│   │   └── PresetsView.tsx         # Preset recipes and saved workflows view
│   ├── App.tsx             # Main application state and pipeline orchestrator
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global Tailwind and font styles
├── index.html              # HTML shell
├── package.json            # Project dependencies and npm scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build and plugin configuration
```

---

## Built-in Operations

| Operation | Category | Description | Animation Pattern |
|-----------|----------|-------------|-------------------|
| **Caesar Cipher** | Cipher | Shifts letters along the alphabet by a configurable key | Alphabet wheel tracking letter by letter |
| **Base64 Encode/Decode** | Encoding | Converts text to and from standard Base64 representation | 3-byte to 4-character block mapping |
| **XOR Cipher** | Bitwise | Applies bitwise XOR between input bytes and a key | Binary comparison and bit-flip visualizer |
| **Reverse Text** | Text | Reverses string order with optional case swapping | Positional character displacement |

---

## How to Add a New Operation

CipherFlow uses an open architecture. To add a new algorithm:

1. Create a new file in `src/algorithms/<your-algorithm>.tsx`.
2. Export an object adhering to the `AlgorithmDefinition` interface:
   - `id`: Unique identifier (e.g., `'rot13'`).
   - `name`: Display name shown in UI cards.
   - `category`: Category (`'Cipher'`, `'Encoding'`, `'Bitwise'`, or `'Text'`).
   - `paramSchema`: Configurable fields (numbers, text inputs, toggles).
   - `computeTrace(input, params)`: Pure function returning the final output and an array of animation frames.
   - `Visualizer`: A React component rendering the algorithm snapshot using Motion.
3. Register the definition in `src/algorithms/registry.ts`:

```typescript
import { myCustomAlgorithm } from './myCustomAlgorithm';

export const ALGORITHMS: AlgorithmDefinition[] = [
  caesarAlgorithm,
  base64Algorithm,
  xorAlgorithm,
  reverseAlgorithm,
  myCustomAlgorithm, // Added here
];
```

The operation will automatically appear in the "Add Operation" modal, recipe builder, and animation player.

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mohamed-el-bouchir/cipherflow.git
cd cipherflow

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Team Members

- **Mohamed El Bouchir**
- **Bilal Akensouss**
- **Mohammed Alhayane**
- **Salam Elouzi**

