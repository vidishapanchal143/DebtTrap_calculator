import React from 'react';
import { Smile, BarChart3 } from 'lucide-react';

export default function ViewToggle({ mode, setMode, t }) {
  return (
    <div className="bg-slate-200 p-1.5 rounded-2xl flex items-center gap-1.5 border border-slate-300 shadow-inner">
      <button
        type="button"
        onClick={() => setMode('simple')}
        className={`flex-1 py-3 px-4 rounded-xl text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
          mode === 'simple'
            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20 ring-2 ring-emerald-500/30'
            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
        }`}
      >
        <Smile className="w-5 h-5 text-amber-300" />
        <div className="text-left leading-tight">
          <span className="block font-bold">{t.simpleViewLabel}</span>
          <span className="text-[11px] opacity-80 font-normal hidden sm:block">{t.simpleViewDesc}</span>
        </div>
      </button>

      <button
        type="button"
        onClick={() => setMode('detailed')}
        className={`flex-1 py-3 px-4 rounded-xl text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
          mode === 'detailed'
            ? 'bg-slate-900 text-white shadow-md shadow-slate-950/30 ring-2 ring-slate-800'
            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
        }`}
      >
        <BarChart3 className="w-5 h-5 text-sky-400" />
        <div className="text-left leading-tight">
          <span className="block font-bold">{t.detailedViewLabel}</span>
          <span className="text-[11px] opacity-80 font-normal hidden sm:block">{t.detailedViewDesc}</span>
        </div>
      </button>
    </div>
  );
}
