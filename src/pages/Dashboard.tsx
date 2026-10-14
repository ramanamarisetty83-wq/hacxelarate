import React, { useState } from 'react';
import { DashboardStats, Threat, ThreatStatus } from '../types/threat';
import { StatCard } from '../components/StatCard';
import { ThreatTable } from '../components/ThreatTable';
import { 
  ShieldAlert, 
  AlertTriangle, 
  ShieldCheck, 
  Globe, 
  Smartphone, 
  UserX, 
  FileText,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { Language, getTranslation } from '../i18n/translations';
import { ThreeShieldRadar } from '../components/ThreeShieldRadar';

interface DashboardProps {
  stats: DashboardStats;
  onSelectThreat: (threat: Threat) => void;
  onUpdateStatus?: (id: string, status: ThreatStatus) => void;
  onNavigateToCampaigns: () => void;
  currentLang: Language;
  brandName?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  onSelectThreat,
  onUpdateStatus,
  onNavigateToCampaigns,
  currentLang,
  brandName = 'ApexPay',
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredIncidents = stats.recent_incidents.filter((threat) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'CRITICAL') return threat.risk_level === 'CRITICAL';
    if (filterType === 'SOCIAL') return threat.threat_type === 'SOCIAL_IMPERSONATION';
    if (filterType === 'URL') return threat.threat_type === 'PHISHING_URL';
    if (filterType === 'APP') return threat.threat_type === 'ROGUE_APP';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Attack Campaign Alert */}
      <div className="p-4 rounded-lg border border-rose-900/50 bg-gradient-to-r from-rose-950/40 via-slate-900/90 to-slate-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-rose-600/20 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-rose-400 uppercase">
                {getTranslation(currentLang, 'activeCampaignAlert')}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-300 font-mono">Storm-0842 Credential Syndicate</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {getTranslation(currentLang, 'campaignSubtitle')}
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToCampaigns}
          className="px-3.5 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 rounded border border-rose-500/50 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 shadow-md"
        >
          <span>{getTranslation(currentLang, 'exploreCampaignGraph')}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Row 1: KPI Stat Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title={getTranslation(currentLang, 'totalThreats')}
          value={stats.total_threats}
          subtitle={getTranslation(currentLang, 'acrossAllVectors')}
          icon={ShieldAlert}
          variant="default"
        />
        <StatCard
          title={getTranslation(currentLang, 'criticalSeverity')}
          value={stats.critical_threats}
          subtitle={getTranslation(currentLang, 'immediateTakedown')}
          icon={AlertTriangle}
          variant="critical"
          trend={{ value: '+2 today', isPositive: true, isGood: false }}
        />
        <StatCard
          title={getTranslation(currentLang, 'highSeverity')}
          value={stats.high_threats}
          subtitle={getTranslation(currentLang, 'activeInvestigation')}
          icon={Activity}
          variant="warning"
        />
        <StatCard
          title={getTranslation(currentLang, 'mediumLow')}
          value={stats.medium_threats + stats.low_threats}
          subtitle={getTranslation(currentLang, 'monitoredWatchlist')}
          icon={ShieldCheck}
          variant="info"
        />
      </div>

      {/* Row 2: Vector Breakdown Secondary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400">
              {getTranslation(currentLang, 'fakeSocials')}
            </span>
            <p className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
              {stats.social_threats}
            </p>
          </div>
          <UserX className="w-5 h-5 text-amber-400" />
        </div>

        <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400">
              {getTranslation(currentLang, 'phishingUrls')}
            </span>
            <p className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
              {stats.suspicious_urls}
            </p>
          </div>
          <Globe className="w-5 h-5 text-rose-400" />
        </div>

        <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400">
              {getTranslation(currentLang, 'suspiciousApps')}
            </span>
            <p className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
              {stats.suspicious_apps}
            </p>
          </div>
          <Smartphone className="w-5 h-5 text-purple-400" />
        </div>

        <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400">
              {getTranslation(currentLang, 'scamContent')}
            </span>
            <p className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
              {stats.scam_content_threats}
            </p>
          </div>
          <FileText className="w-5 h-5 text-sky-400" />
        </div>
      </div>

      {/* Row 2.5: Interactive 3D Spatial Threat Radar & Defense Hologram */}
      <ThreeShieldRadar
        brandName={brandName}
        criticalCount={stats.critical_threats}
        totalThreats={stats.total_threats}
        currentLang={currentLang}
        onExploreCampaigns={onNavigateToCampaigns}
      />

      {/* Row 3: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Trend Chart */}
        <div className="lg:col-span-2 p-5 rounded-lg border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                {getTranslation(currentLang, 'threatVelocityTitle')}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {getTranslation(currentLang, 'threatVelocitySubtitle')}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Critical
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> High
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.risk_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="critical"
                  stroke="#F43F5E"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCritical)"
                  name="Critical"
                />
                <Area
                  type="monotone"
                  dataKey="high"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorHigh)"
                  name="High"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Distribution Chart */}
        <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              {getTranslation(currentLang, 'threatDistributionTitle')}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {getTranslation(currentLang, 'threatDistributionSubtitle')}
            </p>
          </div>

          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.threat_distribution} layout="vertical" margin={{ left: -10, right: 20 }}>
                <XAxis type="number" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {stats.threat_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
            <span>Mean Triage Time: <strong className="text-white">1.4 hrs</strong></span>
            <span>Takedown Success: <strong className="text-emerald-400">92%</strong></span>
          </div>
        </div>
      </div>

      {/* Row 4: Recent Incidents Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              {getTranslation(currentLang, 'recentIncidentsTitle')}
            </h3>
            <p className="text-xs text-slate-400">
              {getTranslation(currentLang, 'recentIncidentsSubtitle')}
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterType === 'ALL'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({stats.recent_incidents.length})
            </button>
            <button
              onClick={() => setFilterType('CRITICAL')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterType === 'CRITICAL'
                  ? 'bg-rose-950 text-rose-300 font-bold'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              {getTranslation(currentLang, 'sevCritical')}
            </button>
            <button
              onClick={() => setFilterType('URL')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterType === 'URL'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              URLs
            </button>
            <button
              onClick={() => setFilterType('SOCIAL')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterType === 'SOCIAL'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Socials
            </button>
            <button
              onClick={() => setFilterType('APP')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterType === 'APP'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Apps
            </button>
          </div>
        </div>

        <ThreatTable
          threats={filteredIncidents}
          onSelectThreat={onSelectThreat}
          onUpdateStatus={onUpdateStatus}
        />
      </div>
    </div>
  );
};
