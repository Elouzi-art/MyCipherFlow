# CipherFlow

Application web pédagogique pour composer des chaînes de chiffrement et de transformation de texte, puis visualiser chaque opération étape par étape.

## Architecture

```text
src/
├── App.tsx                 # état global, orchestration du pipeline et de l’animation
├── main.tsx                # point d’entrée React
├── algorithms/
│   ├── types.ts            # contrats des algorithmes, traces et recettes
│   ├── registry.ts         # registre, recettes prédéfinies et exécution du pipeline
│   └── *.tsx               # algorithmes et visualiseurs (Caesar, Base64, XOR, Reverse)
└── components/             # interface : pipeline, animations, entrées/sorties, recettes

public/                     # ressources statiques
report/                     # rapport et ressources du projet
```

Chaque algorithme expose une fonction `computeTrace` qui produit le résultat et une suite de frames explicatives, ainsi qu’un composant `Visualizer` pour les afficher. `registry.ts` assemble les opérations ; `App.tsx` transmet les traces aux composants d’interface et gère la lecture. Les recettes personnalisées sont conservées dans le `localStorage` du navigateur.

**Flux principal :** saisie → exécution des opérations dans l’ordre → animation des frames de l’étape sélectionnée → affichage du résultat.

## Technologies

React 18 · TypeScript · Vite · Tailwind CSS · Motion

## Démarrage

Prérequis : Node.js et npm.

```bash
npm install
npm run dev
```

La vérification TypeScript et la compilation de production sont disponibles avec `npm run lint` et `npm run build`.

## Ajouter un algorithme

Créer un module dans `src/algorithms/` qui exporte une définition conforme à `AlgorithmDefinition`, puis l’importer et l’ajouter au tableau `ALGORITHMS` dans `src/algorithms/registry.ts`.
