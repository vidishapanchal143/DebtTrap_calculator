import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoanCalculatorForm from './components/LoanCalculatorForm';
import ViewToggle from './components/ViewToggle';
import ResultBreakdown from './components/ResultBreakdown';
import ShareResult from './components/ShareResult';
import AIExplanation from './components/AIExplanation';
import SafeAlternatives from './components/SafeAlternatives';
import DisclaimerFooter from './components/DisclaimerFooter';
import { translations } from './translations';

export default function App() {
  const [lang, setLang] = useState('hi'); // Default Hindi
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('debttrap_view_mode') || 'simple';
  });

  const [formData, setFormData] = useState({
    principal: 10000,
    rate: 5,
    rate_type: 'monthly',
    tenure_months: 12,
    repayment_type: 'flat',
    processing_fee_pct: 0,
    late_penalty_pct: 0
  });

  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [explanationSource, setExplanationSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = translations[lang] || translations.hi;

  useEffect(() => {
    localStorage.setItem('debttrap_view_mode', viewMode);
  }, [viewMode]);

  const handleSubmit = async (e, overrideLang = null) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setError('');

    const targetLang = overrideLang || lang;

    const payload = {
      principal: parseFloat(formData.principal) || 10000,
      rate: parseFloat(formData.rate) || 0,
      rate_type: formData.rate_type,
      tenure_months: parseInt(formData.tenure_months, 10) || 12,
      repayment_type: formData.repayment_type,
      processing_fee_pct: parseFloat(formData.processing_fee_pct || 0),
      late_penalty_pct: parseFloat(formData.late_penalty_pct || 0),
      lang: targetLang
    };

    let response = null;

    try {
      // Try relative endpoint first (works with Vite proxy & production server across mobile/tablet/laptop)
      response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (primaryErr) {
      console.warn('Relative /api/calculate fetch failed, trying direct localhost fallback...', primaryErr);
      try {
        response = await fetch('http://127.0.0.1:8000/api/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (fallbackErr) {
        console.error('All API fetch attempts failed:', fallbackErr);
      }
    }

    try {
      if (!response) {
        throw new Error('Network error: Could not reach DebtTrap backend server.');
      }
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const json = await response.json();
      if (json.success) {
        setResult(json.data);
        setExplanation(json.ai_explanation);
        setExplanationSource(json.explanation_source);
      } else {
        throw new Error(json.message || 'Calculation failed');
      }
    } catch (err) {
      console.error('API Processing Error:', err);
      setError('Could not connect to backend server. Please ensure FastAPI backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch explanation when language changes if result already calculated
  useEffect(() => {
    if (result) {
      handleSubmit(null, lang);
    }
  }, [lang]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans selection:bg-emerald-200">
      <Navbar lang={lang} setLang={setLang} t={t} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="bg-rose-50 border-2 border-rose-200 text-rose-900 px-4 py-3 rounded-2xl text-sm font-bold">
            {error}
          </div>
        )}

        {/* 1. Input Form (Icon-First, Voice Mic) */}
        <LoanCalculatorForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          loading={loading}
          t={t}
          lang={lang}
        />

        {/* 2. Single-Screen Flow Results */}
        {result && (
          <div className="space-y-6 animate-fadeIn">
            {/* View Mode Segmented Control Toggle */}
            <ViewToggle mode={viewMode} setMode={setViewMode} t={t} />

            {/* Hero Danger Meter & Breakdown */}
            <ResultBreakdown result={result} viewMode={viewMode} t={t} />

            {/* Share on WhatsApp */}
            <ShareResult result={result} t={t} lang={lang} />

            {/* Audio-First AI Explanation */}
            <AIExplanation
              explanation={explanation}
              source={explanationSource}
              loading={loading}
              viewMode={viewMode}
              lang={lang}
              t={t}
            />
          </div>
        )}

        {/* 3. Official Safe Alternatives */}
        <SafeAlternatives t={t} />
      </main>

      {/* Clean Unobtrusive Legal Disclaimer Only */}
      <DisclaimerFooter t={t} />
    </div>
  );
}
