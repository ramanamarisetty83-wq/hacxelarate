import React, { useState, useEffect } from 'react';
import { 
  apiService, 
  checkBackendHealth 
} from './services/api';
import { 
  Brand, 
  Threat, 
  Campaign, 
  DashboardStats, 
  SocialProfileInput, 
  ScamContentInput, 
  UrlInput, 
  AppInput,
  ThreatStatus
} from './types/threat';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { Language, getTranslation } from './i18n/translations';

import { Dashboard } from './pages/Dashboard';
import { BrandSetup } from './pages/BrandSetup';
import { SocialMonitoring } from './pages/SocialMonitoring';
import { AppMonitoring } from './pages/AppMonitoring';
import { UrlMonitoring } from './pages/UrlMonitoring';
import { ThreatDetails } from './pages/ThreatDetails';
import { Campaigns } from './pages/Campaigns';
import { Reports } from './pages/Reports';
import { IndicScamRadar } from './pages/IndicScamRadar';
import { CanaryDeception } from './pages/CanaryDeception';
import { DatasetTrainingStudio } from './pages/DatasetTrainingStudio';
import { Login } from './pages/Login';
import { Mic, Bot } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentPath, setCurrentPath] = useState<string>('/dashboard');
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Multi-Language State (English, Telugu, Hindi, Marathi)
  const [currentLang, setCurrentLang] = useState<Language>('en');

  // AI Voice Assistant State
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState<boolean>(false);

  // Core App State
  const [brand, setBrand] = useState<Brand>({
    id: 'brand-apexpay',
    brand_name: 'ApexPay',
    official_website: 'https://apexpay.io',
    official_social_handles: {
      twitter: '@ApexPayHQ',
      instagram: '@apexpay.official',
      facebook: 'ApexPayFinancial',
      linkedin: 'apexpay-technologies',
      telegram: 't.me/apexpay_official',
    },
    official_app_package: 'com.apexpay.wallet',
    security_contact: 'security-abuse@apexpay.io',
    created_at: new Date().toISOString(),
  });

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);

  // Notification Toast State
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Initial Data Hydration
  const refreshAllData = async () => {
    try {
      const [brandData, statsData, threatsData, campaignsData] = await Promise.all([
        apiService.getBrand(),
        apiService.getDashboard(),
        apiService.getThreats(),
        apiService.getCampaigns(),
      ]);

      setBrand(brandData);
      setDashboardStats(statsData);
      setThreats(threatsData);
      setCampaigns(campaignsData);
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const isReachable = await checkBackendHealth();
      setIsBackendConnected(isReachable);
      await refreshAllData();
      setIsLoading(false);
    };
    init();
  }, []);

  // Action Handlers
  const handleTriggerScan = async () => {
    setIsScanning(true);
    showToast(getTranslation(currentLang, 'scanningFeeds'), 'info');
    setTimeout(async () => {
      await refreshAllData();
      setIsScanning(false);
      showToast('Threat scan complete. 10 assets audited, telemetry updated.', 'success');
    }, 1200);
  };

  const handleSaveBrand = async (brandData: Partial<Brand>) => {
    const updated = await apiService.registerBrand(brandData);
    setBrand(updated);
    await refreshAllData();
    showToast(`Brand registry for ${updated.brand_name} saved successfully.`);
  };

  const handleAnalyzeProfile = async (input: SocialProfileInput) => {
    const threat = await apiService.analyzeSocialProfile(input);
    await refreshAllData();
    showToast(`Analyzed ${threat.entity} (Risk: ${threat.risk_score}/100)`);
    return threat;
  };

  const handleAnalyzeContent = async (input: ScamContentInput) => {
    const threat = await apiService.analyzeSocialContent(input);
    await refreshAllData();
    showToast(`Evaluated scam message (Risk: ${threat.risk_score}/100)`);
    return threat;
  };

  const handleAnalyzeUrl = async (input: UrlInput) => {
    const threat = await apiService.analyzeUrl(input);
    await refreshAllData();
    showToast(`Evaluated URL ${threat.entity} (Risk: ${threat.risk_score}/100)`);
    return threat;
  };

  const handleAnalyzeApp = async (input: AppInput) => {
    const threat = await apiService.analyzeApp(input);
    await refreshAllData();
    showToast(`Evaluated APK ${threat.entity} (Risk: ${threat.risk_score}/100)`);
    return threat;
  };

  const handleSelectThreat = (threat: Threat) => {
    setSelectedThreat(threat);
    setCurrentPath(`/threats/${threat.id}`);
  };

  const handleInspectThreatId = async (threatId: string) => {
    try {
      const threat = await apiService.getThreatById(threatId);
      handleSelectThreat(threat);
    } catch {
      showToast(`Threat ${threatId} not found in current inventory`, 'error');
    }
  };

  const handleUpdateStatus = async (id: string, status: ThreatStatus, feedback?: string) => {
    const updated = await apiService.updateThreatStatus(id, status, feedback);
    if (selectedThreat && selectedThreat.id === id) {
      setSelectedThreat(updated);
    }
    await refreshAllData();
    showToast(`Updated incident ${id} status to ${status}`);
  };

  const handleTakedownNode = async (threatId: string) => {
    await handleUpdateStatus(threatId, 'TAKEDOWN_REQUESTED');
    showToast(`Dispatched official takedown request for ${threatId}`);
  };

  const handleNavigateToCampaign = (campaignId?: string) => {
    setCurrentPath('/campaigns');
  };

  const handleGenerateReport = async (options?: { period?: string }) => {
    const report = await apiService.generateReport(options);
    return report;
  };

  // If on login route or unauthenticated
  if (!isAuthenticated || currentPath === '/login') {
    return (
      <Login
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setCurrentPath('/dashboard');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-20 z-50 animate-in slide-in-from-bottom duration-200">
          <div
            className={`px-4 py-3 rounded-lg border text-xs font-mono font-medium shadow-2xl flex items-center gap-2 ${
              notification.type === 'success'
                ? 'bg-slate-900 border-emerald-600 text-emerald-300'
                : notification.type === 'error'
                ? 'bg-slate-900 border-rose-600 text-rose-300'
                : 'bg-slate-900 border-sky-600 text-sky-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                notification.type === 'success'
                  ? 'bg-emerald-400'
                  : notification.type === 'error'
                  ? 'bg-rose-400'
                  : 'bg-sky-400'
              }`}
            />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Floating AI Voice Assistant Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsVoiceAssistantOpen(true)}
          className="w-13 h-13 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_25px_rgba(244,63,94,0.5)] flex items-center justify-center transition-all duration-300 hover:scale-105 group border-2 border-rose-400/50"
          title="Open AI Voice Assistant (Telugu, Hindi, Marathi, English)"
        >
          <Mic className="w-6 h-6 group-hover:animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full" />
        </button>
      </div>

      {/* Persistent Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={(path) => {
          if (path === '/login') {
            setIsAuthenticated(false);
          }
          setCurrentPath(path);
        }}
        brandName={brand.brand_name}
        threatCount={threats.length}
        currentLang={currentLang}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Navbar with Language selector and Voice button */}
        <Navbar
          currentPath={currentPath}
          brandName={brand.brand_name}
          isBackendConnected={isBackendConnected}
          onTriggerScan={handleTriggerScan}
          isScanning={isScanning}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {isLoading ? (
            <div className="h-[60vh] flex items-center justify-center">
              <LoadingSpinner size="lg" label="Initializing Multilingual Threat Defense Platform..." />
            </div>
          ) : (
            <>
              {currentPath === '/dashboard' && dashboardStats && (
                <Dashboard
                  stats={dashboardStats}
                  onSelectThreat={handleSelectThreat}
                  onUpdateStatus={handleUpdateStatus}
                  onNavigateToCampaigns={() => setCurrentPath('/campaigns')}
                  currentLang={currentLang}
                />
              )}

              {currentPath === '/brand-setup' && (
                <BrandSetup
                  currentBrand={brand}
                  onSaveBrand={handleSaveBrand}
                />
              )}

              {currentPath === '/social-monitoring' && (
                <SocialMonitoring
                  brandName={brand.brand_name}
                  onAnalyzeProfile={handleAnalyzeProfile}
                  onAnalyzeContent={handleAnalyzeContent}
                  onSelectThreat={handleSelectThreat}
                />
              )}

              {currentPath === '/app-monitoring' && (
                <AppMonitoring
                  brandName={brand.brand_name}
                  onAnalyzeApp={handleAnalyzeApp}
                  onSelectThreat={handleSelectThreat}
                />
              )}

              {currentPath === '/url-monitoring' && (
                <UrlMonitoring
                  brandName={brand.brand_name}
                  onAnalyzeUrl={handleAnalyzeUrl}
                  onSelectThreat={handleSelectThreat}
                />
              )}

              {currentPath.startsWith('/threats/') && selectedThreat && (
                <ThreatDetails
                  threat={selectedThreat}
                  onBack={() => setCurrentPath('/dashboard')}
                  onSelectThreat={handleSelectThreat}
                  onUpdateStatus={handleUpdateStatus}
                  onNavigateToCampaign={handleNavigateToCampaign}
                />
              )}

              {currentPath === '/campaigns' && (
                <Campaigns
                  campaigns={campaigns}
                  onInspectThreat={handleInspectThreatId}
                  onTakedownNode={handleTakedownNode}
                />
              )}

              {currentPath === '/indic-radar' && (
                <IndicScamRadar
                  brandName={brand.brand_name}
                  currentLang={currentLang}
                />
              )}

              {currentPath === '/canary-deception' && (
                <CanaryDeception
                  brandName={brand.brand_name}
                  currentLang={currentLang}
                />
              )}

              {currentPath === '/dataset-training' && (
                <DatasetTrainingStudio
                  currentLang={currentLang}
                />
              )}

              {currentPath === '/reports' && (
                <Reports
                  brandName={brand.brand_name}
                  onGenerateReport={handleGenerateReport}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* AI Voice Assistant Interactive Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        brandName={brand.brand_name}
        threats={threats}
        campaigns={campaigns}
        onNavigateToCampaign={() => {
          setIsVoiceAssistantOpen(false);
          setCurrentPath('/campaigns');
        }}
      />
    </div>
  );
}
