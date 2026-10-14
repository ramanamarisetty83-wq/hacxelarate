import React from 'react';
import { 
  Shield, 
  Sparkles, 
  RefreshCw, 
  Server, 
  Globe2, 
  Mic, 
  Bot 
} from 'lucide-react';
import { Language, SUPPORTED_LANGUAGES, getTranslation } from '../i18n/translations';

interface NavbarProps {
  currentPath: string;
  brandName: string;
  isBackendConnected: boolean;
  onTriggerScan: () => void;
  isScanning: boolean;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenVoiceAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  brandName,
  isBackendConnected,
  onTriggerScan,
  isScanning,
  currentLang,
  onLanguageChange,
  onOpenVoiceAssistant,
}) => {
  // Breadcrumb generation with multilingual support
  const getBreadcrumb = () => {
    switch (currentPath) {
      case '/':
      case '/dashboard':
        return `DRPP / ${getTranslation(currentLang, 'navDashboard')}`;
      case '/brand-setup':
        return `DRPP / ${getTranslation(currentLang, 'navBrandSetup')}`;
      case '/social-monitoring':
        return `DRPP / ${getTranslation(currentLang, 'navSocialMonitoring')}`;
      case '/app-monitoring':
        return `DRPP / ${getTranslation(currentLang, 'navAppMonitoring')}`;
      case '/url-monitoring':
        return `DRPP / ${getTranslation(currentLang, 'navUrlMonitoring')}`;
      case '/campaigns':
        return `DRPP / ${getTranslation(currentLang, 'navCampaigns')}`;
      case '/reports':
        return `DRPP / ${getTranslation(currentLang, 'navReports')}`;
      default:
        if (currentPath.startsWith('/threats/')) {
          return `DRPP / Forensics / ${currentPath.replace('/threats/', '')}`;
        }
        return 'DRPP / Security Operations';
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between gap-6 sticky top-0 z-40">
      {/* Zone 1: Breadcrumb & Brand Identity */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 truncate">
          <span className="text-white font-semibold truncate">{getBreadcrumb()}</span>
          <span className="text-slate-600">/</span>
          <span className="text-rose-400 font-bold shrink-0">{brandName}</span>
        </div>
      </div>

      {/* Zone 2: Language Selector & Mode Indicator */}
      <div className="hidden md:flex items-center gap-3 text-xs font-mono">
        {/* Language Selector Dropdown */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
          <Globe2 className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={currentLang}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                {l.nativeName} ({l.name})
              </option>
            ))}
          </select>
        </div>

        {/* API Backend Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
          <Server className="w-3.5 h-3.5 text-slate-400" />
          <span>API:</span>
          {isBackendConnected ? (
            <span className="text-emerald-400 font-bold">{getTranslation(currentLang, 'fastApiConnected')}</span>
          ) : (
            <span className="text-amber-400 font-medium">{getTranslation(currentLang, 'localDemoMode')}</span>
          )}
        </div>
      </div>

      {/* Zone 3: AI Voice Assistant & Primary Scan Action */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* AI Voice Assistant Trigger Button */}
        <button
          onClick={onOpenVoiceAssistant}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded border border-rose-500/40 hover:border-rose-400 transition-all shadow-[0_0_15px_rgba(244,63,94,0.15)] group"
          title="Open AI Voice Assistant (Telugu, Hindi, Marathi, English)"
        >
          <div className="w-4 h-4 rounded-full bg-rose-600/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
            <Mic className="w-3 h-3 text-rose-400" />
          </div>
          <span className="hidden sm:inline font-mono">
            {currentLang === 'te' ? 'AI వాయిస్' : currentLang === 'hi' ? 'AI वॉयस' : currentLang === 'mr' ? 'AI व्हॉइस' : 'AI Voice Assistant'}
          </span>
        </button>

        {/* Primary Trigger Scan */}
        <button
          onClick={onTriggerScan}
          disabled={isScanning}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-500 rounded border border-rose-500/50 transition-colors whitespace-nowrap shrink-0 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? getTranslation(currentLang, 'scanningFeeds') : getTranslation(currentLang, 'triggerBrandScan')}</span>
        </button>
      </div>
    </header>
  );
};
