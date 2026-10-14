import React, { useState } from 'react';
import { Threat, AppInput } from '../types/threat';
import { RiskScore } from '../components/RiskScore';
import { RiskBadge } from '../components/RiskBadge';
import { 
  Smartphone, 
  UploadCloud, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  FileCode, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface AppMonitoringProps {
  brandName: string;
  onAnalyzeApp: (input: AppInput) => Promise<Threat>;
  onSelectThreat: (threat: Threat) => void;
}

const COMMON_DANGEROUS_PERMS = [
  { id: 'READ_SMS', label: 'READ_SMS (Intercepts 2FA OTPs)', risk: 'CRITICAL' },
  { id: 'RECEIVE_SMS', label: 'RECEIVE_SMS (Background SMS capture)', risk: 'CRITICAL' },
  { id: 'SYSTEM_ALERT_WINDOW', label: 'SYSTEM_ALERT_WINDOW (Overlay fake login screens)', risk: 'CRITICAL' },
  { id: 'REQUEST_INSTALL_PACKAGES', label: 'REQUEST_INSTALL_PACKAGES (Drops secondary payloads)', risk: 'HIGH' },
  { id: 'READ_CONTACTS', label: 'READ_CONTACTS (Exfiltrates contact address book)', risk: 'HIGH' },
  { id: 'ACCESS_FINE_LOCATION', label: 'ACCESS_FINE_LOCATION (Real-time GPS tracking)', risk: 'MEDIUM' },
  { id: 'RECORD_AUDIO', label: 'RECORD_AUDIO (Microphone wiretapping)', risk: 'HIGH' },
  { id: 'BIND_ACCESSIBILITY_SERVICE', label: 'BIND_ACCESSIBILITY_SERVICE (Automated screen scraping)', risk: 'CRITICAL' },
];

export const AppMonitoring: React.FC<AppMonitoringProps> = ({
  brandName,
  onAnalyzeApp,
  onSelectThreat,
}) => {
  const [appName, setAppName] = useState('ApexPay 2FA Authenticator & Backup');
  const [packageName, setPackageName] = useState('com.apexpay.wallet.security.auth');
  const [developerName, setDeveloperName] = useState('Apex Digital Security Solutions LLC');
  const [selectedPerms, setSelectedPerms] = useState<string[]>([
    'READ_SMS',
    'RECEIVE_SMS',
    'SYSTEM_ALERT_WINDOW',
    'REQUEST_INSTALL_PACKAGES',
  ]);
  const [extractedUrl, setExtractedUrl] = useState('apexpay-security-verify.cc');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultThreat, setResultThreat] = useState<Threat | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const togglePermission = (permId: string) => {
    setSelectedPerms((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setAppName(file.name.replace('.apk', '').replace(/[-_]/g, ' '));
      setPackageName(`com.apexpay.sideload.${file.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8)}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setResultThreat(null);
    try {
      const threat = await onAnalyzeApp({
        app_name: appName,
        package_name: packageName,
        developer_name: developerName,
        permissions: selectedPerms,
        target_brand: brandName,
        apk_file_name: uploadedFileName || `${appName.replace(/\s+/g, '_')}.apk`,
        extracted_urls: extractedUrl ? [extractedUrl] : [],
      });
      setResultThreat(threat);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadPreset = (type: 'trojan' | 'safe') => {
    if (type === 'trojan') {
      setAppName('ApexPay Instant Loan & Fast Cash');
      setPackageName('com.apexpay.quickloan.cash');
      setDeveloperName('Apex Cash Global Group');
      setSelectedPerms([
        'READ_SMS',
        'RECEIVE_SMS',
        'READ_CONTACTS',
        'SYSTEM_ALERT_WINDOW',
        'ACCESS_FINE_LOCATION',
      ]);
      setExtractedUrl('api.apexpay-cashloan-portal.top');
      setUploadedFileName('ApexPay_Loan_v2.1.apk');
    } else {
      setAppName('Apex Community Companion');
      setPackageName('org.apexcommunity.tools');
      setDeveloperName('Open Community Contributors');
      setSelectedPerms(['ACCESS_FINE_LOCATION']);
      setExtractedUrl('https://apexcommunity.github.io');
      setUploadedFileName('ApexCommunity.apk');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Mobile App & APK Manifest Security Inspector
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Safe static analysis of Android APK packages without binary execution. Audits package name typosquatting, dangerous permission clusters, and embedded C2 URLs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/60">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                Static APK Attributes
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Presets:</span>
                <button
                  type="button"
                  onClick={() => loadPreset('trojan')}
                  className="text-[11px] font-mono text-rose-400 hover:underline"
                >
                  Trojanized Banking APK
                </button>
                <span className="text-slate-700">·</span>
                <button
                  type="button"
                  onClick={() => loadPreset('safe')}
                  className="text-[11px] font-mono text-emerald-400 hover:underline"
                >
                  Low-Risk Community Tool
                </button>
              </div>
            </div>

            {/* Drag & Drop APK File Simulation */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Upload APK File (Static Extraction Only - No Execution)
              </label>
              <label className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950 cursor-pointer transition-colors">
                <UploadCloud className="w-6 h-6 text-slate-500 mb-1" />
                <span className="text-xs text-slate-300">
                  {uploadedFileName ? (
                    <strong className="text-rose-400 font-mono">{uploadedFileName}</strong>
                  ) : (
                    'Drop .apk file or click to simulate manifest extraction'
                  )}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Max upload limit 50MB · Sandboxed parser
                </span>
                <input
                  type="file"
                  accept=".apk"
                  onChange={handleSimulatedFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Application Name *
                  </label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                    placeholder="e.g. ApexPay 2FA"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Android Package Identifier *
                  </label>
                  <input
                    type="text"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                    placeholder="com.apexpay.wallet.security"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Official package: com.apexpay.wallet
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Signer / Developer Name
                  </label>
                  <input
                    type="text"
                    value={developerName}
                    onChange={(e) => setDeveloperName(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                    placeholder="Developer identity in certificate"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Extracted C2 / Network URL
                  </label>
                  <input
                    type="text"
                    value={extractedUrl}
                    onChange={(e) => setExtractedUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                    placeholder="apexpay-security-verify.cc"
                  />
                </div>
              </div>

              {/* Dangerous Permissions Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Declared Android Permissions ({selectedPerms.length} selected)
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    High-Risk Flag: {selectedPerms.filter((p) => p.includes('SMS') || p.includes('ALERT') || p.includes('ACCESSIBILITY')).length}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 rounded bg-slate-950 border border-slate-800">
                  {COMMON_DANGEROUS_PERMS.map((perm) => {
                    const isSelected = selectedPerms.includes(perm.id);
                    return (
                      <div
                        key={perm.id}
                        onClick={() => togglePermission(perm.id)}
                        className={`p-2 rounded border cursor-pointer text-xs transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-rose-950/40 border-rose-800 text-white'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="font-mono text-[11px] truncate">{perm.id}</span>
                        <span
                          className={`text-[9px] font-mono px-1 rounded ${
                            perm.risk === 'CRITICAL'
                              ? 'bg-rose-900 text-rose-300'
                              : 'bg-amber-900 text-amber-300'
                          }`}
                        >
                          {perm.risk}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full py-2.5 px-4 rounded bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white font-medium text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{isAnalyzing ? 'Analyzing Bytecode Signatures...' : 'Analyze Mobile APK Risk'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Real-Time Result Column */}
        <div className="lg:col-span-5">
          {resultThreat ? (
            <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/80 space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono uppercase text-slate-400">Analysis Verdict</span>
                <RiskBadge level={resultThreat.risk_level} />
              </div>

              {/* Gauge Score */}
              <div className="flex justify-center py-2">
                <RiskScore score={resultThreat.risk_score} level={resultThreat.risk_level} size="lg" />
              </div>

              <div className="p-3 rounded border border-slate-800 bg-slate-950/60 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Inspected APK:</span>
                  <span className="font-mono text-white font-semibold truncate max-w-[200px]">{resultThreat.entity}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Model Confidence:</span>
                  <span className="font-mono text-emerald-400 font-bold tabular-nums">{resultThreat.confidence}%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Incident Reference:</span>
                  <span className="font-mono text-rose-400 font-bold">{resultThreat.id}</span>
                </div>
              </div>

              {/* Detection Reasons */}
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Extracted Risk Factors ({resultThreat.reasons.length})
                </span>
                <div className="space-y-1.5">
                  {resultThreat.reasons.map((r, i) => (
                    <div key={i} className="p-2 rounded bg-slate-950/40 border border-slate-800 text-xs text-slate-300">
                      • {r}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectThreat(resultThreat)}
                className="w-full py-2 px-3 text-xs font-medium rounded border border-rose-800 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Forensic Artifacts & Evidence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="h-full min-h-[360px] p-8 rounded-lg border border-dashed border-slate-800 bg-slate-900/20 flex flex-col items-center justify-center text-center">
              <Smartphone className="w-10 h-10 text-slate-600 mb-3" />
              <h4 className="text-sm font-semibold text-slate-300">Awaiting APK Inspection</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Provide APK metadata or select a preset to evaluate Android banking overlay threats and dangerous permissions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
