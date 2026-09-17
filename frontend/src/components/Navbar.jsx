import React from 'react';
import { ShieldAlert, Languages } from 'lucide-react';

export default function Navbar({ lang, setLang, t }) {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md sticky top-0 z-50 backdrop-blur-md bg-slate-900/95">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-500/20 p-2 sm:p-2.5 rounded-xl border border-emerald-500/30 text-emerald-400">
              <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                {t.appTitle}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-tight">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          <span className="text-[10px] sm:text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
            100% Private
          </span>
        </div>

        {/* Language Selector */}
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 w-full sm:w-auto">
          <div className="flex items-center gap-1 px-1.5 text-slate-400 text-xs font-semibold">
            <Languages className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{t.languageLabel}:</span>
          </div>
          <button
            type="button"
            onClick={() => setLang('hi')}
            className={`flex-1 sm:flex-initial px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all active:scale-95 ${
              lang === 'hi'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            हिन्दी
          </button>
          <button
            type="button"
            onClick={() => setLang('gu')}
            className={`flex-1 sm:flex-initial px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all active:scale-95 ${
              lang === 'gu'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            ગુજરાતી
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`flex-1 sm:flex-initial px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all active:scale-95 ${
              lang === 'en'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            English
          </button>
        </div>
      </div>
    </header>
  );
}
