import React from 'react';
import { Info } from 'lucide-react';

export default function DisclaimerFooter({ t }) {
  return (
    <footer className="mt-8 py-4 bg-slate-900 text-slate-400 border-t border-slate-800 text-center">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-center gap-2 text-xs font-medium">
        <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <p className="max-w-2xl text-[11px] leading-relaxed">
          {t.disclaimerText}
        </p>
      </div>
    </footer>
  );
}
