import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Share2, Download, MessageSquare, Check, Sparkles, AlertCircle } from 'lucide-react';

export default function ShareResult({ result, t, lang }) {
  const [sharing, setSharing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [shareCount, setShareCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const storedCount = localStorage.getItem('debttrap_share_count');
    if (storedCount) {
      setShareCount(parseInt(storedCount, 10));
    } else {
      setShareCount(14); // Initial demo count baseline
      localStorage.setItem('debttrap_share_count', '14');
    }
  }, []);

  if (!result) return null;

  const extraCost = result.comparison_at_bank_rate
    ? Math.round(result.comparison_at_bank_rate.extra_cost_vs_bank).toLocaleString('en-IN')
    : '0';
  
  const appUrl = window.location.origin || 'http://localhost:5173';

  const shareText = t.shareMessageText
    .replace('{extra_cost}', extraCost)
    .replace('{app_url}', appUrl);

  const incrementCounter = () => {
    const newCount = shareCount + 1;
    setShareCount(newCount);
    localStorage.setItem('debttrap_share_count', newCount.toString());
  };

  const generateCardBlob = async () => {
    const cardElem = document.getElementById('result-breakdown-card');
    if (!cardElem) return null;

    try {
      const canvas = await html2canvas(cardElem, {
        scale: 2, // High resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      });
    } catch (err) {
      console.warn('html2canvas rendering notice:', err);
      return null;
    }
  };

  const handleWhatsAppShare = async () => {
    setSharing(true);
    setStatusMessage('');

    try {
      const blob = await generateCardBlob();

      // Mobile Web Share API check (if browser supports sharing image files directly)
      if (blob && navigator.canShare && navigator.share) {
        const file = new File([blob], 'DebtTrap_Loan_Breakdown.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'DebtTrap Escape Loan Cost',
            text: shareText,
            files: [file]
          });
          incrementCounter();
          setStatusMessage(t.shareSuccess);
          setSharing(false);
          return;
        }
      }
    } catch (err) {
      console.log('Native share closed or bypassed:', err);
    }

    // Desktop or Web Share fallback -> WhatsApp Click-to-Chat deep link
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    incrementCounter();
    setStatusMessage(t.shareSuccess);
    setSharing(false);
  };

  const handleDownloadImage = async () => {
    setDownloading(true);
    setStatusMessage('');

    try {
      const cardElem = document.getElementById('result-breakdown-card');
      if (!cardElem) throw new Error('Result card element not found');

      const canvas = await html2canvas(cardElem, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `DebtTrap_Loan_Breakdown_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      incrementCounter();
      setStatusMessage('PNG Card image downloaded!');
    } catch (err) {
      console.error('Download error:', err);
      setStatusMessage('Could not download image, please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-2xl p-6 shadow-xl border border-emerald-500/30 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-400" />
            {t.shareTitle}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5 font-medium">
            {t.shareSubtitle}
          </p>
        </div>

        {/* Local Demo Counter Badge */}
        <div className="bg-emerald-950/80 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 text-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold">
            {t.demoCounterCount.replace('{count}', shareCount)}
          </span>
          <span className="text-[10px] bg-emerald-900/80 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-mono">
            Demo Counter
          </span>
        </div>
      </div>

      {/* Buttons Action Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {/* WhatsApp Share Primary Button */}
        <button
          type="button"
          onClick={handleWhatsAppShare}
          disabled={sharing}
          className="py-3 px-5 bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.99] text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2.5 text-sm"
        >
          {sharing ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              <span>{t.generatingImage}</span>
            </>
          ) : (
            <>
              <MessageSquare className="w-5 h-5 fill-slate-950 text-[#25D366]" />
              <span>{t.shareWhatsAppBtn}</span>
            </>
          )}
        </button>

        {/* Download Card Secondary Button */}
        <button
          type="button"
          onClick={handleDownloadImage}
          disabled={downloading}
          className="py-3 px-5 bg-slate-800 hover:bg-slate-700 active:scale-[0.99] text-slate-100 font-bold rounded-xl border border-slate-700/80 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
        >
          {downloading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t.generatingImage}</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{t.downloadImageBtn}</span>
            </>
          )}
        </button>
      </div>

      {/* Pre-filled Message Preview */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-sans space-y-1">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
          Pre-filled Message Preview:
        </span>
        <p className="italic text-slate-200">"{shareText}"</p>
      </div>

      {statusMessage && (
        <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 pt-1">
          <Check className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
}
