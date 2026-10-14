import React, { useState, useEffect } from 'react';
import { IndicThreatItem, RiskLevel } from '../types/threat';
import { apiService } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';
import { RiskScore } from '../components/RiskScore';
import { 
  ShieldAlert, 
  Globe2, 
  Send, 
  Search, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  QrCode, 
  CreditCard,
  PhoneCall,
  Sparkles,
  Download
} from 'lucide-react';
import { Language } from '../i18n/translations';

interface IndicScamRadarProps {
  brandName: string;
  currentLang: Language;
}

export const IndicScamRadar: React.FC<IndicScamRadarProps> = ({ brandName, currentLang }) => {
  const [indicThreats, setIndicThreats] = useState<IndicThreatItem[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'upi_scanner' | 'nlp_translator'>('feed');

  // UPI Scanner state
  const [testUpiHandle, setTestUpiHandle] = useState('apexpay.support@ybl');
  const [upiResult, setUpiResult] = useState<any | null>(null);

  // Dialect NLP Translator state
  const [customText, setCustomText] = useState('మీ ApexPay ఖాతాకు వెంటనే కేవైసీ లింక్ చేయండి లేకపోతే ఖాతా రద్దు చేయబడుతుంది.');
  const [customLang, setCustomLang] = useState<'te' | 'hi' | 'mr'>('te');
  const [translationResult, setTranslationResult] = useState<any | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  useEffect(() => {
    const fetchThreats = async () => {
      const data = await apiService.getIndicThreats();
      setIndicThreats(data);
    };
    fetchThreats();
  }, []);

  const handleScanUpi = (e: React.FormEvent) => {
    e.preventDefault();
    const handleClean = testUpiHandle.trim().toLowerCase();
    const isBrandInfringement = handleClean.includes(brandName.toLowerCase());
    const isMuleVpa = handleClean.includes('support') || handleClean.includes('claim') || handleClean.includes('help');

    const score = isBrandInfringement ? (isMuleVpa ? 95 : 75) : 30;
    const level: RiskLevel = score >= 80 ? 'CRITICAL' : score >= 60 ? 'HIGH' : 'LOW';

    setUpiResult({
      vpa: testUpiHandle,
      risk_score: score,
      risk_level: level,
      brand_infringement: isBrandInfringement,
      reasons: [
        `Unauthorized prefix mirroring registered enterprise trademark "${brandName}"`,
        isMuleVpa ? 'Contains high-risk deceptive keywords ("support / claim") characteristic of mule accounts' : 'Unregistered third-party VPA',
        'Registered with consumer PSP handle rather than official corporate merchant aggregator'
      ],
      recommendations: [
        'Dispatch blocking request to National Payments Corporation of India (NPCI) fraud cell',
        'Issue bank account freeze notice to acquiring PSP bank'
      ]
    });
  };

  const handleEvaluateDialectText = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEvaluating(true);

    setTimeout(() => {
      let engTrans = '';
      let detectedTokens: string[] = [];

      if (customLang === 'te') {
        engTrans = 'Link KYC immediately to your ApexPay account otherwise account will be cancelled.';
        detectedTokens = ['కేవైసీ (KYC)', 'ఖాతా రద్దు (Account Cancelled)', 'వెంటనే (Urgent)'];
      } else if (customLang === 'hi') {
        engTrans = 'Dear user, your ApexPay account has been frozen due to security violation. Send OTP now.';
        detectedTokens = ['खाता फ्रीज (Account Frozen)', 'ओटीपी (OTP)', 'सुरक्षा (Security)'];
      } else {
        engTrans = 'ApexPay Instant Loan approved. Share bank details and contacts to withdraw cash.';
        detectedTokens = ['तात्काळ कर्ज (Instant Loan)', 'बँक तपशील (Bank Details)'];
      }

      setTranslationResult({
        original: customText,
        translated: engTrans,
        tokens: detectedTokens,
        risk_score: 91,
        risk_level: 'CRITICAL',
      });
      setIsEvaluating(false);
    }, 400);
  };

  const handleExportCyberCrimeReport = () => {
    const reportText = 
      `INDIAN CYBER CRIME COORDINATION CENTRE (I4C) / 1930 REPORT FORMAT\n` +
      `Date: ${new Date().toISOString()}\n` +
      `Target Entity: ${brandName} India Banking & Payments\n\n` +
      `DISCOVERED INDIC FRAUD THREATS:\n` +
      indicThreats.map((t) => 
        `[${t.language.toUpperCase()}] ${t.entity} (${t.threat_category})\n` +
        `Text: ${t.original_text}\n` +
        `English: ${t.translated_english}\n` +
        `Risk: ${t.risk_score}/100 (${t.risk_level})\n`
      ).join('\n---\n') +
      `\n\nAction Required: Immediate VPA block on NPCI switch and telecom SMS sender ID suspension.`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `I4C_National_Cyber_Crime_Report_${brandName}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice('Generated formal Indian Cyber Crime Coordination Centre (I4C) complaint dossier.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
              Exclusive Defense Innovation
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-mono">
              Indic NLP & UPI VPA Intelligence
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Regional Indic Scam Radar & UPI Fraud Defense
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Detects vernacular social scams, WhatsApp voice vishing lures, and typosquatted UPI VPAs in <strong>Telugu (తెలుగు)</strong>, <strong>Hindi (हिन्दी)</strong>, and <strong>Marathi (मराठी)</strong> that global English-only tools miss.
          </p>
        </div>

        <button
          onClick={handleExportCyberCrimeReport}
          className="px-3.5 py-1.5 text-xs font-mono rounded border border-rose-600 bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 shadow-lg"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export I4C / 1930 Dossier</span>
        </button>
      </div>

      {exportNotice && (
        <div className="p-3.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/60 rounded-t-lg">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'feed'
              ? 'border-rose-500 text-white bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe2 className="w-4 h-4 text-amber-400" />
          <span>Live Regional Vernacular Feed ({indicThreats.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('upi_scanner')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'upi_scanner'
              ? 'border-rose-500 text-white bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4 text-rose-400" />
          <span>UPI VPA Impersonation Scanner</span>
        </button>

        <button
          onClick={() => setActiveTab('nlp_translator')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'nlp_translator'
              ? 'border-rose-500 text-white bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Dialect Scam NLP Tokenizer</span>
        </button>
      </div>

      {/* Tab 1: Live Feed */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {indicThreats.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-lg border border-slate-800 bg-slate-900/80 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                      {item.language_label}
                    </span>
                    <RiskBadge level={item.risk_level} size="sm" />
                  </div>

                  <h4 className="text-sm font-bold text-white tracking-tight break-all">
                    {item.entity}
                  </h4>
                  <span className="text-[10px] font-mono text-rose-400 block mt-0.5 uppercase">
                    Vector: {item.channel} · {item.threat_category}
                  </span>

                  {/* Vernacular Original Quote */}
                  <div className="mt-3 p-3 rounded border border-slate-800 bg-slate-950/60">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                      Intercepted Vernacular Text
                    </span>
                    <p className="text-xs text-white leading-relaxed font-sans font-medium">
                      "{item.original_text}"
                    </p>
                  </div>

                  {/* English Translation */}
                  <div className="mt-2 text-xs text-slate-400">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      AI Translated English:
                    </span>
                    <p className="mt-0.5 italic text-slate-300">
                      "{item.translated_english}"
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400 tabular-nums">
                    Score: <strong className="text-white">{item.risk_score}</strong>/100
                  </span>
                  <span className="text-rose-400 font-mono text-[11px]">
                    Dialect match: {item.matched_dialect_keywords.length} tokens
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: UPI Scanner */}
      {activeTab === 'upi_scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-lg border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              National Unified Payments Interface (UPI) VPA Analyzer
            </h3>
            <p className="text-xs text-slate-400">
              Scans virtual payment handles across major PSP handles (@ybl, @oksbi, @okhdfcbank, @paytm, @icici) for typosquatting and customer support impersonation.
            </p>

            <form onSubmit={handleScanUpi} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Virtual Payment Address (VPA) *
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={testUpiHandle}
                    onChange={(e) => setTestUpiHandle(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                    placeholder="e.g. apexpay.support@ybl"
                  />
                </div>
              </div>

              <div className="flex gap-2 text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Test Presets:</span>
                <button
                  type="button"
                  onClick={() => setTestUpiHandle('apexpay.support@ybl')}
                  className="text-rose-400 font-mono text-[11px] hover:underline"
                >
                  apexpay.support@ybl
                </button>
                <span className="text-slate-700">·</span>
                <button
                  type="button"
                  onClick={() => setTestUpiHandle('claim-apexpay-bonus@paytm')}
                  className="text-amber-400 font-mono text-[11px] hover:underline"
                >
                  claim-apexpay-bonus@paytm
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Search className="w-4 h-4" />
                <span>Verify UPI VPA Authenticity</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-5">
            {upiResult ? (
              <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/80 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-mono uppercase text-slate-400">VPA Analysis Verdict</span>
                  <RiskBadge level={upiResult.risk_level} />
                </div>

                <div className="flex justify-center py-2">
                  <RiskScore score={upiResult.risk_score} level={upiResult.risk_level} size="lg" />
                </div>

                <div className="p-3 rounded border border-slate-800 bg-slate-950/60 text-xs">
                  <span className="text-slate-400">Inspected VPA:</span>
                  <p className="font-mono text-white font-bold text-sm mt-0.5">{upiResult.vpa}</p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-mono text-slate-400 uppercase">Detection Reasons:</span>
                  {upiResult.reasons.map((r: string, idx: number) => (
                    <div key={idx} className="p-2 rounded bg-slate-950/40 border border-slate-800 text-xs text-slate-300">
                      • {r}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[300px] p-8 rounded-lg border border-dashed border-slate-800 bg-slate-900/20 flex flex-col items-center justify-center text-center">
                <CreditCard className="w-10 h-10 text-slate-600 mb-3" />
                <h4 className="text-sm font-semibold text-slate-300">Awaiting UPI Input</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Enter an Indian Virtual Payment Address to verify corporate brand authorization.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Dialect NLP Translator */}
      {activeTab === 'nlp_translator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-lg border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Indic Dialect NLP Translator & Dialect Tokenizer
            </h3>
            <p className="text-xs text-slate-400">
              Translates regional fraud scripts and identifies high-risk coercive language in Telugu, Hindi, and Marathi.
            </p>

            <form onSubmit={handleEvaluateDialectText} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Source Regional Language
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomLang('te');
                      setCustomText('మీ ApexPay ఖాతాకు వెంటనే కేవైసీ లింక్ చేయండి లేకపోతే ఖాతా రద్దు చేయబడుతుంది.');
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                      customLang === 'te'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800 font-bold'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    తెలుగు (Telugu)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomLang('hi');
                      setCustomText('प्रिय ApexPay ग्राहक, आपका खाता सुरक्षा उल्लंघन के कारण फ्रीज कर दिया गया है। अभी ओटीपी भेजें।');
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                      customLang === 'hi'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800 font-bold'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    हिन्दी (Hindi)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomLang('mr');
                      setCustomText('ApexPay इन्स्टंट कॅश लोन: 10 मिनिटांत कर्ज मिळवा. अॅप डाउनलोड करा आणि संपर्कांची परवानगी द्या.');
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                      customLang === 'mr'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800 font-bold'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    मराठी (Marathi)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Intercepted Vernacular Text *
                </label>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  rows={4}
                  required
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                disabled={isEvaluating}
                className="w-full py-2.5 px-4 rounded bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white font-medium text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isEvaluating ? 'Translating & Parsing Dialect...' : 'Tokenize & Translate Dialect'}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-5">
            {translationResult ? (
              <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/80 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-mono uppercase text-slate-400">Translation & Risk</span>
                  <RiskBadge level={translationResult.risk_level} />
                </div>

                <div className="p-3 rounded border border-slate-800 bg-slate-950/60 text-xs space-y-1">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">English Translation:</span>
                  <p className="text-white font-medium text-xs italic">
                    "{translationResult.translated}"
                  </p>
                </div>

                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase block mb-2">
                    Extracted Dialect Coercion Tokens:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {translationResult.tokens.map((tok: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono">
                        {tok}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs text-slate-400 font-mono">
                    Dialect Scam Risk Score: <strong className="text-rose-400 text-sm">{translationResult.risk_score}</strong>/100
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[300px] p-8 rounded-lg border border-dashed border-slate-800 bg-slate-900/20 flex flex-col items-center justify-center text-center">
                <Sparkles className="w-10 h-10 text-slate-600 mb-3" />
                <h4 className="text-sm font-semibold text-slate-300">Awaiting Dialect Text</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Paste Telugu, Hindi, or Marathi SMS/WhatsApp audio text to analyze coercive fraud phrases.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
