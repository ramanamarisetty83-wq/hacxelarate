import React, { useState } from 'react';
import { Brand } from '../types/threat';
import { 
  Building2, 
  Globe, 
  Share2, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Smartphone, 
  Mail,
  AlertCircle
} from 'lucide-react';

interface BrandSetupProps {
  currentBrand: Brand;
  onSaveBrand: (brandData: Partial<Brand>) => Promise<void>;
}

export const BrandSetup: React.FC<BrandSetupProps> = ({ currentBrand, onSaveBrand }) => {
  const [brandName, setBrandName] = useState(currentBrand.brand_name || 'ApexPay');
  const [officialWebsite, setOfficialWebsite] = useState(currentBrand.official_website || 'https://apexpay.io');
  const [twitterHandle, setTwitterHandle] = useState(currentBrand.official_social_handles?.twitter || '@ApexPayHQ');
  const [instagramHandle, setInstagramHandle] = useState(currentBrand.official_social_handles?.instagram || '@apexpay.official');
  const [facebookHandle, setFacebookHandle] = useState(currentBrand.official_social_handles?.facebook || 'ApexPayFinancial');
  const [telegramHandle, setTelegramHandle] = useState(currentBrand.official_social_handles?.telegram || 't.me/apexpay_official');
  const [logoUrl, setLogoUrl] = useState(currentBrand.official_logo || '');
  const [appPackage, setAppPackage] = useState(currentBrand.official_app_package || 'com.apexpay.wallet');
  const [securityContact, setSecurityContact] = useState(currentBrand.security_contact || 'security-abuse@apexpay.io');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    try {
      await onSaveBrand({
        brand_name: brandName,
        official_website: officialWebsite,
        official_social_handles: {
          twitter: twitterHandle,
          instagram: instagramHandle,
          facebook: facebookHandle,
          telegram: telegramHandle,
        },
        official_logo: logoUrl,
        official_app_package: appPackage,
        security_contact: securityContact,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch {
      setErrorMsg('Failed to update brand parameters. Please check inputs.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Brand Asset Registry & Monitored Parameters
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure authentic brand identifiers used by the DRPP heuristic engines to detect typosquatting, impersonation, and fraudulent assets.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Brand parameters updated successfully. Risk heuristics baseline re-calibrated.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Core Brand Info */}
        <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-semibold text-white">
            <Building2 className="w-4 h-4 text-rose-400" />
            <span>Enterprise Brand Identity</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Official Brand Name *
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                placeholder="e.g. ApexPay"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Primary entity name evaluated in Levenshtein similarity.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Official Website Domain *
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="url"
                  value={officialWebsite}
                  onChange={(e) => setOfficialWebsite(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 rounded bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                  placeholder="https://apexpay.io"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                External bio links outside this root domain trigger warnings.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Brand Logo URL
              </label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                placeholder="https://.../brand-logo.png"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Security Abuse Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={securityContact}
                  onChange={(e) => setSecurityContact(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                  placeholder="security-abuse@apexpay.io"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Official Social Profiles */}
        <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-semibold text-white">
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>Authorized Social Media Handles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Official X / Twitter Handle
              </label>
              <input
                type="text"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                placeholder="@ApexPayHQ"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Official Instagram Handle
              </label>
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                placeholder="@apexpay.official"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Official Facebook Page Name
              </label>
              <input
                type="text"
                value={facebookHandle}
                onChange={(e) => setFacebookHandle(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                placeholder="ApexPayFinancial"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Official Telegram Channel
              </label>
              <input
                type="text"
                value={telegramHandle}
                onChange={(e) => setTelegramHandle(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                placeholder="t.me/apexpay_official"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Official Mobile App */}
        <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-semibold text-white">
            <Smartphone className="w-4 h-4 text-purple-400" />
            <span>Authorized Mobile Application Package</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Google Play / Android Package Identifier
            </label>
            <input
              type="text"
              value={appPackage}
              onChange={(e) => setAppPackage(e.target.value)}
              className="w-full max-w-md px-3 py-2 rounded bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
              placeholder="com.apexpay.wallet"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              APKs claiming affiliation with distinct package IDs are flagged as rogue installers.
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white font-medium text-xs tracking-wide uppercase transition-colors flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Registry...' : 'Save Brand Parameters'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
