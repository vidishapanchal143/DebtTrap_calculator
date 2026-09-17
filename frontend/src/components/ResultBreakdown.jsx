import React, { useState } from 'react';
import { TrendingUp, Building2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

export default function ResultBreakdown({ result, viewMode, t }) {
  const [showTechDetails, setShowTechDetails] = useState(false);

  if (!result) return null;

  const {
    principal,
    total_repayment,
    total_interest,
    monthly_emi,
    effective_annual_rate,
    repayment_multiplier,
    danger_level,
    danger_label,
    comparison_at_bank_rate,
    assumptions_made,
    repayment_type_used
  } = result;

  // Determine Danger Meter Gauge percentage (max capped at 100% APR)
  const gaugePercent = Math.min(100, Math.max(8, (effective_annual_rate / 120) * 100));

  let emojiIcon = "😟";
  let emojiLabel = t.dangerTrapEmoji;
  let meterGradient = "from-emerald-500 via-amber-400 to-rose-600";
  let bgTheme = "bg-rose-50 border-rose-300 text-rose-950";

  if (danger_level === "LOW") {
    emojiIcon = "🙂";
    emojiLabel = t.dangerSafeEmoji;
    bgTheme = "bg-emerald-50 border-emerald-300 text-emerald-950";
  } else if (danger_level === "MEDIUM") {
    emojiIcon = "😐";
    emojiLabel = t.dangerCautionEmoji;
    bgTheme = "bg-amber-50 border-amber-300 text-amber-950";
  }

  // Format multiplier banner text
  const multiplierText = t.multiplierBanner
    .replace('{principal}', principal.toLocaleString('en-IN'))
    .replace('{totalRepayment}', total_repayment.toLocaleString('en-IN'))
    .replace('{multiplier}', repayment_multiplier);

  // Bank contrast amounts
  const bankTotal = comparison_at_bank_rate ? comparison_at_bank_rate.bank_total_repayment : principal * 1.05;
  const extraPaid = comparison_at_bank_rate ? comparison_at_bank_rate.extra_cost_vs_bank : 0;

  return (
    <div id="result-breakdown-card" className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden space-y-0">
      
      {/* 1. HERO VISUAL DANGER METER (Dominant Visual Element) */}
      <div className={`p-4 sm:p-6 border-b-2 ${bgTheme} space-y-4`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl sm:text-5xl md:text-6xl animate-bounce flex-shrink-0">{emojiIcon}</span>
            <div>
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-600 block">
                {t.dangerTitle}
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight mt-0.5">
                {emojiLabel}
              </h3>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-300 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl shadow-sm text-left sm:text-right w-full sm:w-auto flex sm:block items-center justify-between">
            <span className="text-[11px] text-slate-600 font-bold block">{t.monthlyEmiLabel}:</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900">₹{monthly_emi.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Big Visual Gauge Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="relative w-full h-6 sm:h-7 bg-slate-200 rounded-full overflow-hidden border border-slate-300 shadow-inner">
            <div
              className={`h-full bg-gradient-to-r ${meterGradient} rounded-full transition-all duration-1000`}
              style={{ width: `${gaugePercent}%` }}
            />
          </div>

          {/* Emoji Scale Labels */}
          <div className="flex justify-between text-[11px] sm:text-xs font-extrabold text-slate-600">
            <span>🙂 safe</span>
            <span>😐 caution</span>
            <span className="text-rose-700">😟 DANGER TRAP</span>
          </div>
        </div>
      </div>

      {/* 2. REPAYMENT SUMMARY CARD */}
      <div className="bg-slate-900 text-white p-4 sm:p-6 space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            {t.totalRepaymentLabel}
          </span>
          <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mt-1 break-words">
            ₹{total_repayment.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3.5 sm:p-4 text-emerald-300 font-extrabold text-sm sm:text-base md:text-lg flex items-center gap-3">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 flex-shrink-0" />
          <span className="leading-snug">{multiplierText}</span>
        </div>
      </div>

      {/* 3. MODE DEPENDENT PRESENTATION */}
      <div className="p-6 space-y-6">

        {/* SIMPLE MODE Presentation */}
        {viewMode === 'simple' ? (
          <div className="space-y-4">
            {/* Bank Comparison Box */}
            <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2.5 text-sky-950 font-black text-base">
                <Building2 className="w-6 h-6 text-sky-700" />
                <span>{t.bankComparisonTitle}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-bold">
                <div className="bg-white p-3.5 rounded-xl border border-sky-200">
                  <span className="text-slate-500 text-xs block">{t.bankTotalLabel}</span>
                  <span className="text-lg font-black text-slate-900">₹{bankTotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-sky-200">
                  <span className="text-slate-500 text-xs block">{t.bankExtraLabel}</span>
                  <span className="text-lg font-black text-rose-600">+ ₹{extraPaid.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Collapsible Technical Details (Default Collapsed in Simple Mode) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowTechDetails(!showTechDetails)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 py-1"
              >
                <span>{showTechDetails ? 'Hide technical numbers' : 'Show technical numbers (subtext)'}</span>
                {showTechDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showTechDetails && (
                <div className="mt-2 p-3 bg-slate-100 rounded-xl text-xs font-mono text-slate-600 space-y-1">
                  <p>Effective APR: {effective_annual_rate}%</p>
                  <p>Interest Calculation: {repayment_type_used} rate</p>
                  <p>Total Interest: ₹{total_interest}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* DETAILED MODE Presentation (Full Table & Bar Chart) */
          <div className="space-y-6">
            {/* Visual Bar Chart Comparison */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 space-y-3">
              <h4 className="font-black text-slate-900 text-base">{t.chartTitle}</h4>

              <div className="space-y-3">
                {/* This Loan Bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>{t.thisLoanBar}</span>
                    <span className="text-rose-600">₹{total_repayment.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-6 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full transition-all duration-700" style={{ width: '100%' }} />
                  </div>
                </div>

                {/* Bank Loan Bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>{t.bankLoanBar}</span>
                    <span className="text-sky-700">₹{bankTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-6 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, (bankTotal / total_repayment) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Financial Metrics Table */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-900 text-white px-4 py-3 font-extrabold text-sm">
                {t.technicalTableTitle}
              </div>
              <table className="w-full text-xs font-medium text-slate-800 divide-y divide-slate-200">
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-slate-50">
                    <td className="p-3 font-bold">{t.paramPrincipal}</td>
                    <td className="p-3 text-right font-black">₹{principal.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">{t.paramTotalInterest}</td>
                    <td className="p-3 text-right font-black text-amber-700">₹{total_interest.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-3 font-bold">{t.paramTotalRepayment}</td>
                    <td className="p-3 text-right font-black text-rose-600">₹{total_repayment.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">{t.paramEmi}</td>
                    <td className="p-3 text-right font-black">₹{monthly_emi.toLocaleString('en-IN')} / mo</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-3 font-bold">{t.paramTrueApr}</td>
                    <td className="p-3 text-right font-black text-rose-600">{effective_annual_rate}% APR</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">{t.paramMethod}</td>
                    <td className="p-3 text-right font-bold uppercase">{repayment_type_used} RATE</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Technical Assumptions Banner */}
            {assumptions_made && assumptions_made.length > 0 && (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-xs text-amber-950 space-y-1">
                <div className="font-extrabold flex items-center gap-1 text-amber-800">
                  <AlertCircle className="w-4 h-4" />
                  <span>Technical Assumptions Applied:</span>
                </div>
                {assumptions_made.map((item, idx) => (
                  <p key={idx} className="font-medium">• {item}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
