import {Plus, Search, X} from 'lucide-react';
import {useMemo, useState} from 'react';
import {ALGORITHMS} from '../algorithms/registry';
import type {AlgorithmCategory, AlgorithmDefinition} from '../algorithms/types';

interface AddOperationModalProps {
  open: boolean;
  onClose: () => void;
  onSelectOperation: (algorithm: AlgorithmDefinition) => void;
}

const CATEGORIES: Array<'All' | AlgorithmCategory> = ['All', 'Cipher', 'Encoding', 'Bitwise', 'Text'];

export function AddOperationModal({open, onClose, onSelectOperation}: AddOperationModalProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | AlgorithmCategory>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALGORITHMS.filter((algo) => {
      const matchesCategory = selectedCategory === 'All' || algo.category === selectedCategory;
      const matchesQuery =
        q.length === 0 ||
        algo.name.toLowerCase().includes(q) ||
        algo.summary.toLowerCase().includes(q) ||
        algo.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-op-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id="add-op-title" className="font-display text-base font-bold text-slate-900">
              Add Operation to Recipe
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {ALGORITHMS.length} plugged-in modules · Select an algorithm to append it to your pipeline
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close operations menu"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/70 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search algorithms..."
              aria-label="Search algorithms"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-3 pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-sky-600 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === category
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Algorithm Options */}
        <div className="flex-1 divide-y divide-slate-100 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No operations match "{query}".
            </div>
          ) : (
            filtered.map((algo) => (
              <div
                key={algo.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{algo.name}</h3>
                    <span className="text-xs text-slate-500">
                      {algo.category} · {algo.animationPattern}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">{algo.summary}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectOperation(algo);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-700 whitespace-nowrap shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
