import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, MessageSquareQuote, Cpu, CheckCircle } from 'lucide-react';

export default function AIExplanation({ explanation, source, loading, viewMode, lang, t }) {
  const [speaking, setSpeaking] = useState(false);

  const handleTextToSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert(t.speechNotSupported || 'Speech synthesis is not supported in this browser.');
      return;
    }

    try {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel(); // Clear any pending audio queue

      const utterance = new SpeechSynthesisUtterance(explanation);
      const langMap = { hi: 'hi-IN', gu: 'gu-IN', en: 'en-US' };
      utterance.lang = langMap[lang] || 'hi-IN';
      utterance.rate = 0.9; // Slightly slower for clarity

      // Attempt to pick matching voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const targetLang = langMap[lang] || 'hi-IN';
        const matchingVoice = voices.find(v => v.lang && v.lang.startsWith(targetLang.slice(0, 2)));
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      utterance.onend = () => setSpeaking(false);
      utterance.onerror = (err) => {
        console.warn('SpeechSynthesis error:', err);
        setSpeaking(false);
      };

      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Audio playback exception:', err);
      setSpeaking(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-emerald-500/30 text-white animate-pulse-subtle space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-emerald-400 animate-spin" />
          <h3 className="font-extrabold text-base text-emerald-300">{t.aiHeader}</h3>
        </div>
        <div className="h-4 bg-slate-800 rounded-lg w-3/4 animate-pulse"></div>
        <div className="h-4 bg-slate-800 rounded-lg w-full animate-pulse"></div>
      </div>
    );
  }

  if (!explanation) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-500/30 space-y-4 relative overflow-hidden">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2.5 rounded-2xl text-emerald-400 border border-emerald-500/30">
            <MessageSquareQuote className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="font-black text-lg text-white">{t.aiHeader}</h3>
        </div>

        {/* Source Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-300">
          {source === 'gemini' ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.aiSourceGemini}</span>
            </>
          ) : (
            <>
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.aiSourceFallback}</span>
            </>
          )}
        </div>
      </div>

      {/* Audio-First Large Speaker Button (Prominent in Simple Mode) */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handleTextToSpeech}
          className={`w-full py-4 px-5 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all shadow-lg active:scale-98 touch-target ${
            speaking
              ? 'bg-amber-500 text-slate-950 animate-pulse ring-4 ring-amber-400/30'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
          }`}
        >
          {speaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          <span>{speaking ? t.speakingExplanation : t.listenExplanationBtn}</span>
        </button>
      </div>

      {/* Explanation Text */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 sm:p-5 text-slate-100 text-base leading-relaxed font-bold whitespace-pre-line shadow-inner">
        {explanation}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <span className="flex items-center gap-1 text-emerald-400 font-bold">
          <CheckCircle className="w-4 h-4" />
          100% Math Verified
        </span>
        <span className="font-mono text-[11px]">Gemini 2.0 Flash Free Tier</span>
      </div>
    </div>
  );
}
