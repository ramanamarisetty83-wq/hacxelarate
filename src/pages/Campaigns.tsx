import React, { useState } from 'react';
import { Campaign, ThreatStatus } from '../types/threat';
import { CampaignGraph } from '../components/CampaignGraph';
import { TimelineReplayer } from '../components/TimelineReplayer';
import { 
  Network, 
  ShieldAlert, 
  Download, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface CampaignsProps {
  campaigns: Campaign[];
  onInspectThreat: (threatId: string) => void;
  onTakedownNode: (threatId: string) => void;
}

export const Campaigns: React.FC<CampaignsProps> = ({
  campaigns,
  onInspectThreat,
  onTakedownNode,
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    campaigns[0]?.id || 'CAMP-OCT-01'
  );
  const [takedownAllTriggered, setTakedownAllTriggered] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const currentCampaign =
    campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  const handleTakedownEntireCampaign = () => {
    setTakedownAllTriggered(true);
    if (currentCampaign) {
      currentCampaign.nodes.forEach((n) => {
        if (n.threat_id) {
          onTakedownNode(n.threat_id);
        }
      });
    }
    setTimeout(() => setTakedownAllTriggered(false), 5000);
  };

  const handleExportIOCs = () => {
    if (!currentCampaign) return;
    const iocList = currentCampaign.nodes
      .filter((n) => n.type !== 'BRAND')
      .map((n) => `[${n.type}] ${n.label} (Risk: ${n.risk_score}, ID: ${n.threat_id || 'N/A'})`)
      .join('\n');
    
    const blob = new Blob(
      [
        `# DRPP Threat Intelligence Export - Campaign: ${currentCampaign.name}\n` +
        `# Threat Actor: ${currentCampaign.threat_actor}\n` +
        `# Exported At: ${new Date().toISOString()}\n\n` +
        `IOC Indicators:\n` +
        iocList
      ],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentCampaign.id}_IOC_Report.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice('IOC list downloaded in STIX/OpenIOC plain text format.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header with Architectural Differentiator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
              Adversary Correlation Engine
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-mono">Multi-Stage Campaign Topology</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Attack Campaign Graph
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            "Instead of treating fake profiles, suspicious URLs, and fake apps as isolated alerts, DRPP correlates them into a unified digital attack campaign."
          </p>
        </div>

        {/* Global Campaign Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportIOCs}
            className="px-3.5 py-1.5 text-xs font-mono rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export IOCs</span>
          </button>

          <button
            onClick={handleTakedownEntireCampaign}
            disabled={takedownAllTriggered}
            className="px-3.5 py-1.5 text-xs font-medium rounded border border-rose-600 bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 transition-colors shadow-lg"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{takedownAllTriggered ? 'Dispatched to Registrars & Platforms' : 'Takedown Entire Campaign'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {takedownAllTriggered && (
        <div className="p-3.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Coordinated takedown notices dispatched across social media trust & safety, domain registrars, and APK file hosts.
          </span>
        </div>
      )}

      {exportNotice && (
        <div className="p-3 rounded-lg bg-sky-950/60 border border-sky-800 text-sky-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Campaign Switcher Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
        {campaigns.map((camp) => (
          <button
            key={camp.id}
            onClick={() => setSelectedCampaignId(camp.id)}
            className={`flex items-center gap-2.5 px-4 py-2 rounded text-xs transition-colors whitespace-nowrap shrink-0 ${
              selectedCampaignId === camp.id
                ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800/80 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{camp.name}</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
              {camp.nodes.length} Nodes
            </span>
          </button>
        ))}
      </div>

      {/* Interactive 4D Timeline Replayer & Blast Radius Metrics */}
      {currentCampaign && currentCampaign.timeline_events && (
        <TimelineReplayer
          events={currentCampaign.timeline_events}
          blastRadius={currentCampaign.blast_radius}
        />
      )}

      {/* Interactive Visual Graph Canvas */}
      {currentCampaign ? (
        <CampaignGraph
          campaign={currentCampaign}
          onInspectThreat={onInspectThreat}
          onTakedownNode={onTakedownNode}
        />
      ) : (
        <div className="p-12 text-center border border-slate-800 bg-slate-900/60 rounded-lg">
          <AlertTriangle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-300">No campaigns currently active.</p>
        </div>
      )}

      {/* Attack Methodology Walkthrough Strip */}
      <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/60">
        <h4 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider mb-3">
          Unified Attack Campaign Lifecycle (Brand Protection Pipeline)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded border border-slate-800 bg-slate-950/60">
            <span className="font-mono text-rose-400 font-bold block mb-1">01. DETECT</span>
            <p className="text-slate-300">
              Continuous multi-channel ingestion of typosquat handles, domains, and newly published APK packages.
            </p>
          </div>

          <div className="p-3 rounded border border-slate-800 bg-slate-950/60">
            <span className="font-mono text-amber-400 font-bold block mb-1">02. EXPLAIN</span>
            <p className="text-slate-300">
              Feature attribution: Levenshtein distance, NLP scam keyword intensity, and Android permission risk weights.
            </p>
          </div>

          <div className="p-3 rounded border border-slate-800 bg-slate-950/60">
            <span className="font-mono text-sky-400 font-bold block mb-1">03. PRIORITIZE</span>
            <p className="text-slate-300">
              0–100 normalized risk score categorizing incidents into Low, Medium, High, and Critical triage tiers.
            </p>
          </div>

          <div className="p-3 rounded border border-slate-800 bg-slate-950/60">
            <span className="font-mono text-purple-400 font-bold block mb-1">04. CONNECT</span>
            <p className="text-slate-300">
              Cross-asset graph correlation linking social lures, phishing portals, and weaponized mobile payloads.
            </p>
          </div>

          <div className="p-3 rounded border border-slate-800 bg-slate-950/60">
            <span className="font-mono text-emerald-400 font-bold block mb-1">05. RECOMMEND</span>
            <p className="text-slate-300">
              Automated registrar abuse filings, DMCA notices, and enterprise firewall DNS sinkhole distribution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
