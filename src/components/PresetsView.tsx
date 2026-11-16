import {ArrowRight, Trash2} from 'lucide-react';
import {ALGORITHM_MAP, PRESET_RECIPES} from '../algorithms/registry';
import type {PresetRecipe} from '../algorithms/types';

interface PresetsViewProps {
  savedRecipes: PresetRecipe[];
  onLoadPreset: (preset: PresetRecipe) => void;
  onDeleteSavedRecipe: (id: string) => void;
  onBackToWorkbench: () => void;
}

function RecipeCard({
  recipe,
  onLoad,
  onDelete,
}: {
  recipe: PresetRecipe;
  onLoad: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold text-slate-900">{recipe.name}</h3>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              aria-label={`Delete recipe ${recipe.name}`}
              className="rounded p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
          {recipe.description || `${recipe.steps.length} chained operations.`}
        </p>

        <div className="mt-4 flex flex-col gap-1.5 border-t border-slate-100 pt-3">
          <span className="text-[11px] font-medium text-slate-500">
            Input: <code className="font-mono text-slate-900">"{recipe.sampleInput}"</code>
            {recipe.mode === 'decrypt' ? ' · Decrypt mode' : ''}
          </span>
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-800">
            {recipe.steps.map((s, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5">
                <span>{ALGORITHM_MAP[s.algorithmId]?.name ?? s.algorithmId}</span>
                {idx < recipe.steps.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onLoad}
        className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
      >
        Load Recipe
      </button>
    </div>
  );
}

export function PresetsView({
  savedRecipes,
  onLoadPreset,
  onDeleteSavedRecipe,
  onBackToWorkbench,
}: PresetsViewProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Recipes</h1>
          <p className="mt-1 text-sm text-slate-600">
            Load saved operation chains or starter examples directly into the animated workbench.
          </p>
        </div>
        <button
          type="button"
          onClick={onBackToWorkbench}
          className="text-sm font-medium text-sky-700 hover:underline whitespace-nowrap shrink-0"
        >
          Back to Workbench
        </button>
      </div>

      {/* User Saved Recipes */}
      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-base font-semibold text-slate-900">Saved Recipes</h2>
          <span className="text-xs text-slate-500 tabular-nums">{savedRecipes.length} saved</span>
        </div>

        {savedRecipes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-xs text-slate-500">
            No custom recipes saved yet. Chain operations in the Workbench and click <span className="font-semibold text-slate-700">Save as Recipe</span> to store them here.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {savedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onLoad={() => onLoadPreset(recipe)}
                onDelete={() => onDeleteSavedRecipe(recipe.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Built-in Starter Recipes */}
      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-base font-semibold text-slate-900">Built-in Examples</h2>
          <span className="text-xs text-slate-500 tabular-nums">{PRESET_RECIPES.length} starters</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PRESET_RECIPES.map((preset) => (
            <RecipeCard
              key={preset.id}
              recipe={preset}
              onLoad={() => onLoadPreset(preset)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
