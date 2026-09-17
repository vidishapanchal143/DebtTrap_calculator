export const translations = {
  hi: {
    appTitle: "DebtTrap Escape",
    appSubtitle: "लोन का असली खर्च जानें",
    languageLabel: "भाषा",
    
    // View Toggle
    simpleViewLabel: "आसान रूप",
    detailedViewLabel: "विस्तार से",
    simpleViewDesc: "केवल मुख्य बातें",
    detailedViewDesc: "पूरा हिसाब और टेबल",
    
    // Voice Assistant
    voiceInputBtn: "बोलकर लोन बताएं 🎙️",
    listeningPrompt: "बोलिए... (उदा. 10000 लोन, 5 प्रतिशत, 12 महीने)",
    speechNotSupported: "आपके ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है",
    listenExplanationBtn: "आवाज़ में सुनें 🔊",
    speakingExplanation: "सुनाया जा रहा है...",

    // Form labels (Icon & Plain Language)
    principalLabel: "लोन रकम (₹)",
    principalPlaceholder: "10000",
    rateLabel: "ब्याज %",
    ratePlaceholder: "5",
    rateTypeLabel: "ब्याज समय",
    rateTypeMonthly: "हर महीने %",
    rateTypeAnnual: "हर साल %",
    rateTypeNotSure: "पता नहीं",
    
    tenureLabel: "महीने",
    tenurePlaceholder: "12",
    
    repaymentTypeLabel: "ब्याज का तरीका",
    repaymentFlat: "पूरे पैसों पर (फ्लैट)",
    repaymentReducing: "बचे पैसों पर (कम होता)",
    repaymentNotSure: "पता नहीं",
    
    processingFeeLabel: "फीस %",
    
    calculateBtn: "असली खर्च देखें ➔",
    calculating: "हिसाब हो रहा है...",
    
    presetsTitle: "तुरंत चुनें:",
    preset1: "₹10,000 @ 5%/महीना",
    preset2: "₹5,000 @ 24%/साल",
    preset3: "₹10,000 @ 4% (अनिश्चित)",

    // Result Breakdown - Simple vs Detailed
    resultHeader: "लोन की असली सच्चाई",
    totalRepaymentLabel: "कुल वापस करना होगा",
    multiplierBanner: "आपने ₹{principal} लिया ➔ ₹{totalRepayment} भरोगे ({multiplier} गुना)",
    monthlyEmiLabel: "हर महीने किश्त",
    plainCostDescription: "यह लोन आपके लिए बहुत महंगा है!",
    
    // Emoji Risk Gauge
    dangerTitle: "जोखिम स्तर",
    dangerSafeEmoji: "🙂 सुरक्षित दर",
    dangerCautionEmoji: "😐 सावधान रहें",
    dangerTrapEmoji: "😟 बहुत महंगा / जाल!",
    
    // Bank comparison
    bankComparisonTitle: "सरकारी बैंक से तुलना (10%)",
    bankTotalLabel: "बैंक में कुल खर्च:",
    bankExtraLabel: "इस लोन में अतिरिक्त खर्च:",

    // Technical Details (Detailed Mode)
    technicalTableTitle: "विस्तृत वित्तीय ब्रेकडाउन",
    tableColMetric: "पैरामीटर",
    tableColValue: "मान",
    paramPrincipal: "मूलधन (Principal)",
    paramTotalRepayment: "कुल भुगतान (Total Repayment)",
    paramTotalInterest: "कुल ब्याज (Total Interest)",
    paramEmi: "मासिक किश्त (EMI)",
    paramTrueApr: "असली सालाना ब्याज (True APR %)",
    paramMethod: "गणना का तरीका",
    paramProcessingFee: "प्रोसेसिंग शुल्क",
    chartTitle: "कुल खर्च की तुलना (ग्राफ)",
    thisLoanBar: "यह लोन",
    bankLoanBar: "सरकारी बैंक (10%)",

    // AI Explanation
    aiHeader: "सरल सलाह",
    aiSourceGemini: "AI सलाह",
    aiSourceFallback: "ऑफलाइन सलाह",
    aiLoading: "सलाह तैयार हो रही है...",

    // Share Result
    shareTitle: "व्हाट्सएप पर भेजें",
    shareSubtitle: "दूसरों को सावधान करें",
    shareWhatsAppBtn: "WhatsApp पर शेयर करें 💬",
    downloadImageBtn: "इमेज डाउनलोड करें ⬇️",
    generatingImage: "तैयार हो रहा है...",
    shareSuccess: "शेयर लिंक खुला!",
    demoCounterLabel: "शेयर काउंटर:",
    demoCounterCount: "{count} बार शेयर हुआ",
    shareMessageText: "मैंने DebtTrap Escape पर चेक किया — इस लोन में मैं ₹{extra_cost} अतिरिक्त दे रहा हूँ बैंक की तुलना में! तुम भी अपना लोन चेक करो: {app_url}",

    // Safe Alternatives
    safeHeader: "सुरक्षित सरकारी मदद",
    mudraTitle: "पीएम मुद्रा योजना (PMMY)",
    mudraDesc: "10% कम ब्याज पर सरकारी लोन",
    mudraLinkText: "udyamimitra.in",
    sachetTitle: "RBI सचेत पोर्टल",
    sachetDesc: "धोखेबाज़ ऐप की शिकायत करें",
    sachetLinkText: "sachet.rbi.org.in",
    cybercrimeTitle: "साइबर हेल्पलाइन 1930",
    cybercrimeDesc: "धमकी मिलने पर 1930 मिलाएं",
    cybercrimeLinkText: "cybercrime.gov.in",
    fraudWarning: "⚠️ ध्यान दें: MUDRA कोई एजेंट या 100% गारंटी नहीं देता।",

    // Disclaimer
    disclaimerText: "यह टूल केवल वित्तीय शिक्षा के लिए है। निर्णय से पहले बैंक से बात करें।"
  },
  
  gu: {
    appTitle: "DebtTrap Escape",
    appSubtitle: "લોનનો સાચો ખર્ચ જાણો",
    languageLabel: "ભાષા",
    
    simpleViewLabel: "સરળ મોડ",
    detailedViewLabel: "વિસ્તારથી",
    simpleViewDesc: "મુખ્ય વિગતો જ",
    detailedViewDesc: "પૂરો હિસાબ અને ટેબલ",
    
    voiceInputBtn: "બોલીને લોન બતાવો 🎙️",
    listeningPrompt: "બોલો... (દા.ત. 10000 લોન, 5 ટકા, 12 મહિના)",
    speechNotSupported: "તમારા બ્રાઉઝરમાં અવાજ ઓળખ ઉપલબ્ધ નથી",
    listenExplanationBtn: "અવાજમાં સાંભળો 🔊",
    speakingExplanation: "સંભળાવી રહ્યા છીએ...",

    principalLabel: "લોન રકમ (₹)",
    principalPlaceholder: "10000",
    rateLabel: "વ્યાજ %",
    ratePlaceholder: "5",
    rateTypeLabel: "વ્યાજ સમય",
    rateTypeMonthly: "દર મહિને %",
    rateTypeAnnual: "દર વર્ષે %",
    rateTypeNotSure: "ખબર નથી",
    
    tenureLabel: "મહિના",
    tenurePlaceholder: "12",
    
    repaymentTypeLabel: "વ્યાજ પદ્ધતિ",
    repaymentFlat: "પૂરી રકમ પર (ફ્લેટ)",
    repaymentReducing: "બાકી રકમ પર (ઘટતું)",
    repaymentNotSure: "ખબર નથી",
    
    processingFeeLabel: "ફી %",
    
    calculateBtn: "સાચો ખર્ચ જુઓ ➔",
    calculating: "ગણતરી થાય છે...",
    
    presetsTitle: "ઝડપી પસંદગી:",
    preset1: "₹10,000 @ 5%/મહિનો",
    preset2: "₹5,000 @ 24%/વર્ષ",
    preset3: "₹10,000 @ 4% (અનિશ્ચિત)",

    resultHeader: "લોનની સાચી હકીકત",
    totalRepaymentLabel: "કુલ પાછા આપવાના",
    multiplierBanner: "તમે ₹{principal} લીધા ➔ ₹{totalRepayment} આપશો ({multiplier} ગણા)",
    monthlyEmiLabel: "દર મહિને હપ્તો",
    plainCostDescription: "આ લોન ખૂબ જ મોંઘી છે!",
    
    dangerTitle: "જોખમ લેવલ",
    dangerSafeEmoji: "🙂 સુરક્ષિત દર",
    dangerCautionEmoji: "😐 સાવધાન રહો",
    dangerTrapEmoji: "😟 ખૂબ મોંઘું / શિકાર!",
    
    bankComparisonTitle: "સરકારી બેંક સાથે સરખામણી (10%)",
    bankTotalLabel: "બેંકમાં કુલ ખર્ચ:",
    bankExtraLabel: "વધારાનો ખર્ચ:",

    technicalTableTitle: "વિસ્તૃત નાણાકીય બ્રેકડાઉન",
    tableColMetric: "પેરામીટર",
    tableColValue: "મૂલ્ય",
    paramPrincipal: "મુદ્દલ રકમ (Principal)",
    paramTotalRepayment: "કુલ ચુકવણી (Total Repayment)",
    paramTotalInterest: "કુલ વ્યાજ (Total Interest)",
    paramEmi: "માસિક હપ્તો (EMI)",
    paramTrueApr: "સાચો વાર્ષિક વ્યાજ દર (True APR %)",
    paramMethod: "ગણતરીની રીત",
    paramProcessingFee: "પ્રોસેસિંગ ફી",
    chartTitle: "કુલ ખર્ચ સરખામણી (ગ્રાફ)",
    thisLoanBar: "આ લોન",
    bankLoanBar: "સરકારી બેંક (10%)",

    aiHeader: "સરળ સલાહ",
    aiSourceGemini: "AI સલાહ",
    aiSourceFallback: "ઓફલાઇન સલાહ",
    aiLoading: "સલાહ તૈયાર થાય છે...",

    shareTitle: "વોટ્સએપ પર મોકલો",
    shareSubtitle: "અન્યોને સાવધાન કરો",
    shareWhatsAppBtn: "WhatsApp પર શેર કરો 💬",
    downloadImageBtn: "ઈમેજ ડાઉનલોડ કરો ⬇️",
    generatingImage: "તૈયાર થાય છે...",
    shareSuccess: "લિંક ખૂલી ગઈ!",
    demoCounterLabel: "શેર કાઉન્ટર:",
    demoCounterCount: "{count} વખત શેર થયું",
    shareMessageText: "મેં DebtTrap Escape પર ચેક કર્યું — આ લોનમાં હું બેંક કરતા ₹{extra_cost} વધુ આપું છું! તમે પણ તમારી લોન ચેક કરો: {app_url}",

    safeHeader: "સુરક્ષિત સરકારી મદદ",
    mudraTitle: "પીએમ મુદ્રા યોજના",
    mudraDesc: "10% ઓછા વ્યાજે લોન",
    mudraLinkText: "udyamimitra.in",
    sachetTitle: "RBI સચેત પોર્ટલ",
    sachetDesc: "છેતરપિંડીની ફરિયાદ કરો",
    sachetLinkText: "sachet.rbi.org.in",
    cybercrimeTitle: "સાયબર હેલ્પલાઇન 1930",
    cybercrimeDesc: "ધમકી મળતા 1930 કૉલ કરો",
    cybercrimeLinkText: "cybercrime.gov.in",
    fraudWarning: "⚠️ MUDRA કોઈ એજન્ટ કે 100% ગેરંટી નથી આપતું.",

    disclaimerText: "આ ટૂલ માત્ર શિક્ષણ માટે છે. નિર્ણય પહેલા બેંક સાથે વાત કરો."
  },

  en: {
    appTitle: "DebtTrap Escape",
    appSubtitle: "Understand true loan cost",
    languageLabel: "Language",
    
    simpleViewLabel: "Simple View",
    detailedViewLabel: "Detailed View",
    simpleViewDesc: "Key facts & icons",
    detailedViewDesc: "Full tables & charts",
    
    voiceInputBtn: "Speak Loan Terms 🎙️",
    listeningPrompt: "Speak now... (e.g. 10000 loan, 5 percent, 12 months)",
    speechNotSupported: "Voice recognition not supported in browser",
    listenExplanationBtn: "Listen Audio 🔊",
    speakingExplanation: "Playing audio...",

    principalLabel: "Loan Amount (₹)",
    principalPlaceholder: "10000",
    rateLabel: "Rate %",
    ratePlaceholder: "5",
    rateTypeLabel: "Rate Period",
    rateTypeMonthly: "Per Month %",
    rateTypeAnnual: "Per Year %",
    rateTypeNotSure: "Not Sure",
    
    tenureLabel: "Months",
    tenurePlaceholder: "12",
    
    repaymentTypeLabel: "Interest Type",
    repaymentFlat: "Flat Rate",
    repaymentReducing: "Reducing Balance",
    repaymentNotSure: "Not Sure",
    
    processingFeeLabel: "Fee %",
    
    calculateBtn: "Calculate True Cost ➔",
    calculating: "Calculating...",
    
    presetsTitle: "Quick Presets:",
    preset1: "₹10,000 @ 5%/mo",
    preset2: "₹5,000 @ 24%/yr",
    preset3: "₹10,000 @ 4% (Uncertain)",

    resultHeader: "True Loan Cost",
    totalRepaymentLabel: "Total Amount You Pay Back",
    multiplierBanner: "You borrow ₹{principal} ➔ You pay back ₹{totalRepayment} ({multiplier}x)",
    monthlyEmiLabel: "Monthly Payment",
    plainCostDescription: "This loan is very expensive!",
    
    dangerTitle: "Risk Rating",
    dangerSafeEmoji: "🙂 Fair Rate",
    dangerCautionEmoji: "😐 Moderate Caution",
    dangerTrapEmoji: "😟 High Risk Debt Trap!",
    
    bankComparisonTitle: "Bank Comparison (10% Rate)",
    bankTotalLabel: "Bank total cost:",
    bankExtraLabel: "Extra cost on this loan:",

    technicalTableTitle: "Detailed Financial Metrics",
    tableColMetric: "Metric",
    tableColValue: "Value",
    paramPrincipal: "Principal Amount",
    paramTotalRepayment: "Total Repayment",
    paramTotalInterest: "Total Interest",
    paramEmi: "Monthly EMI",
    paramTrueApr: "Effective Annual Rate (True APR)",
    paramMethod: "Calculation Method",
    paramProcessingFee: "Processing Fee",
    chartTitle: "Cost Comparison Chart",
    thisLoanBar: "This Loan",
    bankLoanBar: "Govt Bank (10%)",

    aiHeader: "Plain Advice",
    aiSourceGemini: "AI Advice",
    aiSourceFallback: "Offline Advice",
    aiLoading: "Preparing advice...",

    shareTitle: "Share on WhatsApp",
    shareSubtitle: "Warn friends & family",
    shareWhatsAppBtn: "Share on WhatsApp 💬",
    downloadImageBtn: "Download PNG Image ⬇️",
    generatingImage: "Generating...",
    shareSuccess: "Share link opened!",
    demoCounterLabel: "Share Counter:",
    demoCounterCount: "Shared {count} times",
    shareMessageText: "I checked my loan on DebtTrap Escape — I am paying ₹{extra_cost} extra on this loan compared to a standard bank! Check your loan true cost here: {app_url}",

    safeHeader: "Safe Government Options",
    mudraTitle: "PM Mudra Yojana",
    mudraDesc: "~10% interest govt loan",
    mudraLinkText: "udyamimitra.in",
    sachetTitle: "RBI SACHET Portal",
    sachetDesc: "Report illegal loan apps",
    sachetLinkText: "sachet.rbi.org.in",
    cybercrimeTitle: "Cyber Helpline 1930",
    cybercrimeDesc: "Call 1930 for threats",
    cybercrimeLinkText: "cybercrime.gov.in",
    fraudWarning: "⚠️ MUDRA gives no direct loans or 100% agent guarantees.",

    disclaimerText: "This tool is for education only. Consult a bank before taking loans."
  }
};
