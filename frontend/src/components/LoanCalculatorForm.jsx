import React, { useState } from 'react';
import { Banknote, Percent, Calendar, Mic, MicOff, HelpCircle, Zap, Calculator } from 'lucide-react';

export default function LoanCalculatorForm({
  formData,
  setFormData,
  onSubmit,
  loading,
  t,
  lang
}) {
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const applyPreset = (principal, rate, rate_type, tenure_months, repayment_type) => {
    setFormData({
      principal,
      rate,
      rate_type,
      tenure_months,
      repayment_type,
      processing_fee_pct: 0,
      late_penalty_pct: 0
    });
  };

  // Web Speech API Voice Input Handler
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceStatus(t.speechNotSupported);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    const langMap = { hi: 'hi-IN', gu: 'gu-IN', en: 'en-US' };
    recognition.lang = langMap[lang] || 'hi-IN';

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus(t.listeningPrompt);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Voice Transcript:', transcript);
      setVoiceStatus(`Recognized: "${transcript}"`);
      
      // Smart Multi-language Voice Parsing
      let text = transcript.toLowerCase();
      const indicDigitsMap = {
        '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
        '૦': '0', '૧': '1', '૨': '2', '૩': '3', '૪': '4', '૫': '5', '૬': '6', '૭': '7', '૮': '8', '૯': '9',
      };
      text = text.replace(/[०-९૦-૯]/g, m => indicDigitsMap[m] || m);
      text = text.replace(/(\d+)\s*(हजार|हज़ार|હજાર|k|thousand)/gi, (_, num) => `${parseInt(num, 10) * 1000}`);
      text = text.replace(/(\d+)\s*(लाख|લાખ|lac|lakh)/gi, (_, num) => `${parseInt(num, 10) * 100000}`);
      
      const numbers = text.match(/\d+(\.\d+)?/g);
      if (numbers && numbers.length >= 1) {
        const parsedNums = numbers.map(n => parseFloat(n));
        const principalCandidate = parsedNums.find(n => n >= 500);
        if (principalCandidate) {
          handleChange('principal', principalCandidate.toString());
        } else {
          handleChange('principal', parsedNums[0].toString());
        }

        const remaining = parsedNums.filter(n => n !== principalCandidate);
        if (remaining.length >= 1) handleChange('rate', remaining[0].toString());
        if (remaining.length >= 2) handleChange('tenure_months', Math.round(remaining[1]).toString());
      }
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setVoiceStatus(`Voice error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Voice Assistant Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-3 rounded-2xl border border-emerald-500/30 text-emerald-400">
            <Calculator className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold">{t.appTitle}</h2>
            <p className="text-xs text-slate-300 font-medium">{t.appSubtitle}</p>
          </div>
        </div>

        {/* Large Primary Mic Button */}
        <button
          type="button"
          onClick={handleVoiceInput}
          className={`px-5 py-3 rounded-2xl font-extrabold text-sm flex items-center gap-2.5 transition-all shadow-md active:scale-95 touch-target ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
              : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black shadow-emerald-500/20'
          }`}
        >
          {isListening ? <MicOff className="w-6 h-6 animate-spin" /> : <Mic className="w-6 h-6" />}
          <span>{isListening ? 'Listening...' : t.voiceInputBtn}</span>
        </button>
      </div>

      {voiceStatus && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2 text-xs font-bold text-emerald-900 flex items-center justify-between">
          <span>{voiceStatus}</span>
          <button onClick={() => setVoiceStatus('')} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      {/* Quick Presets */}
      <div className="bg-slate-50 p-4 border-b border-slate-200">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>{t.presetsTitle}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => applyPreset(10000, 5, 'monthly', 12, 'flat')}
            className="p-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 rounded-2xl text-left text-xs font-bold text-slate-800 shadow-sm transition-all"
          >
            {t.preset1}
          </button>
          <button
            type="button"
            onClick={() => applyPreset(5000, 24, 'annual', 6, 'reducing')}
            className="p-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 rounded-2xl text-left text-xs font-bold text-slate-800 shadow-sm transition-all"
          >
            {t.preset2}
          </button>
          <button
            type="button"
            onClick={() => applyPreset(10000, 4, 'not_sure', 12, 'not_sure')}
            className="p-3 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-400 rounded-2xl text-left text-xs font-bold text-slate-800 shadow-sm transition-all"
          >
            {t.preset3}
          </button>
        </div>
      </div>

      {/* Form Fields - Icon First & 48px Touch Targets */}
      <form onSubmit={onSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Principal Amount - Rupee Icon */}
          <div>
            <label className="flex items-center gap-2 text-base font-extrabold text-slate-800 mb-2">
              <div className="bg-emerald-100 p-2 rounded-xl text-emerald-700">
                <Banknote className="w-6 h-6 text-emerald-700" />
              </div>
              <span>{t.principalLabel}</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-extrabold text-xl">₹</span>
              <input
                type="number"
                min="100"
                step="100"
                required
                value={formData.principal}
                onChange={(e) => handleChange('principal', e.target.value)}
                placeholder={t.principalPlaceholder}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 rounded-2xl text-slate-900 font-black text-xl outline-none transition-all touch-target"
              />
            </div>
          </div>

          {/* Interest Rate - Coin Stack / Percent Icon */}
          <div>
            <label className="flex items-center gap-2 text-base font-extrabold text-slate-800 mb-2">
              <div className="bg-amber-100 p-2 rounded-xl text-amber-700">
                <Percent className="w-6 h-6 text-amber-700" />
              </div>
              <span>{t.rateLabel}</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0.1"
                step="0.1"
                required
                value={formData.rate}
                onChange={(e) => handleChange('rate', e.target.value)}
                placeholder={t.ratePlaceholder}
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border-2 border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 rounded-2xl text-slate-900 font-black text-xl outline-none transition-all touch-target"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-extrabold text-xl">%</span>
            </div>
          </div>

          {/* Rate Period */}
          <div>
            <label className="block text-sm font-extrabold text-slate-700 mb-2">
              {t.rateTypeLabel}
            </label>
            <div className="grid grid-cols-3 gap-1 sm:gap-2 bg-slate-100 p-1 sm:p-1.5 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleChange('rate_type', 'monthly')}
                className={`py-2.5 sm:py-3 px-1 text-[11px] sm:text-xs font-black rounded-xl transition-all touch-target text-center ${
                  formData.rate_type === 'monthly'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.rateTypeMonthly}
              </button>
              <button
                type="button"
                onClick={() => handleChange('rate_type', 'annual')}
                className={`py-2.5 sm:py-3 px-1 text-[11px] sm:text-xs font-black rounded-xl transition-all touch-target text-center ${
                  formData.rate_type === 'annual'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.rateTypeAnnual}
              </button>
              <button
                type="button"
                onClick={() => handleChange('rate_type', 'not_sure')}
                className={`py-2.5 sm:py-3 px-1 text-[11px] sm:text-xs font-black rounded-xl transition-all touch-target flex items-center justify-center gap-1 ${
                  formData.rate_type === 'not_sure'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{t.rateTypeNotSure}</span>
              </button>
            </div>
          </div>

          {/* Tenure (Months) - Calendar Icon */}
          <div>
            <label className="flex items-center gap-2 text-base font-extrabold text-slate-800 mb-2">
              <div className="bg-sky-100 p-2 rounded-xl text-sky-700">
                <Calendar className="w-6 h-6 text-sky-700" />
              </div>
              <span>{t.tenureLabel}</span>
            </label>
            <input
              type="number"
              min="1"
              max="120"
              required
              value={formData.tenure_months}
              onChange={(e) => handleChange('tenure_months', e.target.value)}
              placeholder={t.tenurePlaceholder}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 rounded-2xl text-slate-900 font-black text-lg sm:text-xl outline-none transition-all touch-target"
            />
          </div>

          {/* Repayment Type */}
          <div className="md:col-span-2">
            <label className="block text-sm font-extrabold text-slate-700 mb-2">
              {t.repaymentTypeLabel}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => handleChange('repayment_type', 'flat')}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all touch-target ${
                  formData.repayment_type === 'flat'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span className="font-extrabold text-xs sm:text-sm block">{t.repaymentFlat}</span>
              </button>

              <button
                type="button"
                onClick={() => handleChange('repayment_type', 'reducing')}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all touch-target ${
                  formData.repayment_type === 'reducing'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span className="font-extrabold text-xs sm:text-sm block">{t.repaymentReducing}</span>
              </button>

              <button
                type="button"
                onClick={() => handleChange('repayment_type', 'not_sure')}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all touch-target ${
                  formData.repayment_type === 'not_sure'
                    ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span className="font-extrabold text-xs sm:text-sm flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>{t.repaymentNotSure}</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Big Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/30 transition-all active:scale-[0.99] flex items-center justify-center gap-3 text-lg touch-target disabled:opacity-60"
        >
          {loading ? (
            <>
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t.calculating}</span>
            </>
          ) : (
            <span>{t.calculateBtn}</span>
          )}
        </button>
      </form>
    </div>
  );
}
