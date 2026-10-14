import React from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Building2, 
  Share2, 
  Smartphone, 
  Globe, 
  Network, 
  FileBarChart2, 
  LogOut,
  Shield,
  Layers,
  QrCode,
  Target,
  BrainCircuit
} from 'lucide-react';
import { Language, getTranslation } from '../i18n/translations';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  brandName: string;
  threatCount: number;
  currentLang: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  brandName,
  threatCount,
  currentLang,
}) => {
  const navItems = [
    { path: '/dashboard', label: getTranslation(currentLang, 'navDashboard'), icon: LayoutDashboard },
    { path: '/brand-setup', label: getTranslation(currentLang, 'navBrandSetup'), icon: Building2 },
    { path: '/social-monitoring', label: getTranslation(currentLang, 'navSocialMonitoring'), icon: Share2 },
    { path: '/app-monitoring', label: getTranslation(currentLang, 'navAppMonitoring'), icon: Smartphone },
    { path: '/url-monitoring', label: getTranslation(currentLang, 'navUrlMonitoring'), icon: Globe },
    { path: '/campaigns', label: getTranslation(currentLang, 'navCampaigns'), icon: Network, badge: getTranslation(currentLang, 'badgeCorrelated') },
    { path: '/dataset-training', label: getTranslation(currentLang, 'navDatasetTraining'), icon: BrainCircuit, badge: getTranslation(currentLang, 'badgeMl') },
    { path: '/indic-radar', label: getTranslation(currentLang, 'navIndicRadar'), icon: QrCode, badge: getTranslation(currentLang, 'badgeUnique') },
    { path: '/canary-deception', label: getTranslation(currentLang, 'navCanary'), icon: Target, badge: getTranslation(currentLang, 'badgeUnique') },
    { path: '/reports', label: getTranslation(currentLang, 'navReports'), icon: FileBarChart2 },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white font-sans uppercase">
              DRPP CONSOLE
            </h1>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              {currentLang === 'te' ? 'రిస్క్ డిఫెన్స్ ప్లాట్‌ఫామ్' : currentLang === 'hi' ? 'रिस्क डिफेंस प्लेटफॉर्म' : currentLang === 'mr' ? 'रिस्क डिफेन्स प्लॅटफॉर्म' : 'Risk Defense Platform'}
            </p>
          </div>
        </div>

        {/* Brand Target Context Box */}
        <div className="p-4 mx-3 my-3 rounded border border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px] uppercase tracking-wider">
              {getTranslation(currentLang, 'monitoredBrand')}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-bold text-white text-sm tracking-tight">{brandName}</span>
            <span className="text-[11px] font-mono text-rose-400 font-semibold tabular-nums">
              {threatCount} {getTranslation(currentLang, 'alerts')}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPath === item.path ||
              (item.path === '/dashboard' && currentPath === '/') ||
              (item.path === '/campaigns' && currentPath.startsWith('/campaigns'));

            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 text-left ${
                  isActive
                    ? 'bg-rose-600/15 text-rose-400 border border-rose-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800/60 shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Analyst Session */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-mono font-bold text-xs">
              AP
            </div>
            <div>
              <p className="font-medium text-white text-xs">Security Analyst</p>
              <p className="text-[10px] text-slate-400 font-mono">SOC Tier 2</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/login')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            title={getTranslation(currentLang, 'navLogout')}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
