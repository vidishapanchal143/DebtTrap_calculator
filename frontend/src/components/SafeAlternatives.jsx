import React from 'react';
import { ShieldCheck, ExternalLink, AlertOctagon, PhoneCall, Landmark } from 'lucide-react';

export default function SafeAlternatives({ t }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-100 p-2.5 sm:p-3 rounded-2xl text-emerald-800">
          <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-800" />
        </div>
        <div>
          <h3 className="font-black text-slate-900 text-base sm:text-lg leading-tight">{t.safeHeader}</h3>
          <p className="text-xs text-slate-500 font-bold">Government support & legal help</p>
        </div>
      </div>

      {/* Warning banner */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 sm:p-4 text-xs text-amber-950 font-black flex items-start gap-2.5 sm:gap-3 shadow-sm">
        <AlertOctagon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <span>{t.fraudWarning}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* PM Mudra Yojana */}
        <div className="bg-slate-50 border-2 border-slate-200 hover:border-emerald-400 rounded-2xl p-4 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center gap-2 mb-2 text-slate-900 font-black text-base">
              <Landmark className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <span>{t.mudraTitle}</span>
            </div>
            <p className="text-xs text-slate-600 font-bold leading-normal">
              {t.mudraDesc}
            </p>
          </div>
          <a
            href="https://udyamimitra.in"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 hover:underline"
          >
            <span>{t.mudraLinkText}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* RBI SACHET */}
        <div className="bg-slate-50 border-2 border-slate-200 hover:border-sky-400 rounded-2xl p-4 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center gap-2 mb-2 text-slate-900 font-black text-base">
              <ShieldCheck className="w-6 h-6 text-sky-600 flex-shrink-0" />
              <span>{t.sachetTitle}</span>
            </div>
            <p className="text-xs text-slate-600 font-bold leading-normal">
              {t.sachetDesc}
            </p>
          </div>
          <a
            href="https://sachet.rbi.org.in"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-sky-700 hover:underline"
          >
            <span>{t.sachetLinkText}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Cyber Crime Helpline 1930 */}
        <div className="bg-slate-50 border-2 border-slate-200 hover:border-rose-400 rounded-2xl p-4 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center gap-2 mb-2 text-slate-900 font-black text-base">
              <PhoneCall className="w-6 h-6 text-rose-600 flex-shrink-0" />
              <span>{t.cybercrimeTitle}</span>
            </div>
            <p className="text-xs text-slate-600 font-bold leading-normal">
              {t.cybercrimeDesc}
            </p>
          </div>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-rose-700 hover:underline"
          >
            <span>{t.cybercrimeLinkText}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
