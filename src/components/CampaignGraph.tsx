import React, { useState } from 'react';
import { Campaign, CampaignNode, Threat } from '../types/threat';
import { RiskBadge } from './RiskBadge';
import { 
  ShieldCheck, 
  UserX, 
  Globe, 
  Smartphone, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ArrowRight, 
  X,
  ExternalLink,
  Send,
  AlertOctagon,
  Sparkles
} from 'lucide-react';

interface CampaignGraphProps {
  campaign: Campaign;
  onInspectThreat?: (threatId: string) => void;
  onTakedownNode?: (threatId: string) => void;
}

export const CampaignGraph: React.FC<CampaignGraphProps> = ({
  campaign,
  onInspectThreat,
  onTakedownNode,
}) => {
  const [selectedNode, setSelectedNode] = useState<CampaignNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag if clicking canvas background
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'graph-canvas') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getNodeIcon = (type: CampaignNode['type']) => {
    switch (type) {
      case 'BRAND':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'SOCIAL':
        return <UserX className="w-5 h-5 text-amber-400" />;
      case 'URL':
        return <Globe className="w-5 h-5 text-rose-400" />;
      case 'APP':
        return <Smartphone className="w-5 h-5 text-purple-400" />;
    }
  };

  const getNodeBorder = (node: CampaignNode) => {
    if (selectedNode?.id === node.id) {
      return 'ring-2 ring-rose-400 border-white shadow-[0_0_25px_rgba(244,63,94,0.4)]';
    }
    switch (node.risk_level) {
      case 'CRITICAL':
        return 'border-rose-600/80 hover:border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]';
      case 'HIGH':
        return 'border-amber-600/80 hover:border-amber-400';
      case 'MEDIUM':
        return 'border-sky-600/80 hover:border-sky-400';
      default:
        return 'border-emerald-600/80 hover:border-emerald-400';
    }
  };

  return (
    <div className="relative w-full h-[600px] rounded-lg border border-slate-800 bg-slate-950/90 overflow-hidden select-none">
      {/* Canvas Top Bar / Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
        <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-slate-400 uppercase tracking-wider">Attack Campaign:</span>
            <span className="font-semibold text-white">{campaign.name}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Threat Actor: <strong className="text-amber-400 font-mono">{campaign.threat_actor}</strong>
          </p>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1 rounded-lg border border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <button
          onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* SVG Canvas Area */}
      <div
        id="graph-canvas"
        className="w-full h-full cursor-grab active:cursor-grabbing relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          className="absolute inset-0 origin-top-left transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          <svg className="w-[1200px] h-[600px] pointer-events-none absolute inset-0">
            <defs>
              <linearGradient id="edgeGradCritical" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="edgeGradBrand" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
              </linearGradient>
              <marker
                id="arrow-end"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#F43F5E" />
              </marker>
            </defs>

            {/* Render Edges */}
            {campaign.edges.map((edge) => {
              const srcNode = campaign.nodes.find((n) => n.id === edge.source);
              const tgtNode = campaign.nodes.find((n) => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              const srcX = srcNode.x + 130;
              const srcY = srcNode.y + 45;
              const tgtX = tgtNode.x;
              const tgtY = tgtNode.y + 45;
              const deltaX = (tgtX - srcX) / 2;

              const d = `M ${srcX} ${srcY} C ${srcX + deltaX} ${srcY}, ${tgtX - deltaX} ${tgtY}, ${tgtX} ${tgtY}`;

              return (
                <g key={edge.id} className="transition-all">
                  <path
                    d={d}
                    fill="none"
                    stroke={srcNode.type === 'BRAND' ? 'url(#edgeGradBrand)' : 'url(#edgeGradCritical)'}
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                    markerEnd="url(#arrow-end)"
                  />
                  <text
                    x={(srcX + tgtX) / 2}
                    y={(srcY + tgtY) / 2 - 12}
                    fill="#94A3B8"
                    fontSize="11"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="bg-slate-900 px-1 font-semibold"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Render Nodes */}
          {campaign.nodes.map((node) => {
            const isBrand = node.type === 'BRAND';
            return (
              <div
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(node);
                }}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                className={`absolute w-64 p-3.5 rounded-lg border bg-slate-900/95 backdrop-blur-md cursor-pointer transition-all duration-200 ${getNodeBorder(
                  node
                )}`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-slate-800/80 border border-slate-700">
                      {getNodeIcon(node.type)}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wide">
                      {node.type}
                    </span>
                  </div>
                  {!isBrand && <RiskBadge level={node.risk_level} size="sm" />}
                  {isBrand && (
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">PROTECTED</span>
                  )}
                </div>

                <h5 className="text-xs font-bold text-white tracking-tight truncate" title={node.label}>
                  {node.label}
                </h5>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{node.sublabel}</p>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">
                    {isBrand ? 'Official Entity' : `Risk: ${node.risk_score}/100`}
                  </span>
                  <span className="text-rose-400 hover:text-white font-medium flex items-center gap-1">
                    Details <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Narrative Banner Bottom */}
      <div className="absolute bottom-4 left-4 right-4 z-10 p-3 rounded-lg border border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center gap-3">
        <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
        <p className="text-xs text-slate-300 line-clamp-1 flex-1">
          <strong className="text-white">Attack Narrative:</strong> {campaign.attack_narrative}
        </p>
        <span className="text-xs font-mono text-slate-400 shrink-0">
          Correlated Assets: <strong className="text-white">{campaign.nodes.length}</strong>
        </span>
      </div>

      {/* Drilldown Side Drawer */}
      {selectedNode && (
        <div className="absolute top-0 right-0 bottom-0 w-96 z-30 border-l border-slate-800 bg-slate-900/98 backdrop-blur-xl p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {getNodeIcon(selectedNode.type)}
                <span className="text-xs font-mono uppercase text-slate-400">{selectedNode.type} NODE</span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-bold text-white break-all">{selectedNode.label}</h3>
              <p className="text-xs text-slate-400 mt-1">{selectedNode.sublabel}</p>
            </div>

            <div className="mt-5 p-4 rounded border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-400 uppercase">Assigned Severity</span>
                <RiskBadge level={selectedNode.risk_level} />
              </div>
              <div className="flex items-baseline justify-between mt-3 pt-3 border-t border-slate-800/80">
                <span className="text-xs text-slate-400">Risk Calculation Score</span>
                <span className="text-xl font-bold font-mono text-white tabular-nums">
                  {selectedNode.risk_score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Attack Stage Role
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedNode.type === 'BRAND' &&
                  'The authentic enterprise brand identity being targeted and impersonated by the coordinated adversary group.'}
                {selectedNode.type === 'SOCIAL' &&
                  'Impersonates customer service to build false trust with victims and lure them away from secure channels into credential phish links.'}
                {selectedNode.type === 'URL' &&
                  'A typosquatted phishing landing page styled identically to the official brand portal, harvesting credentials and offering malicious download.'}
                {selectedNode.type === 'APP' &&
                  'Trojanized mobile APK requesting dangerous accessibility and SMS permissions to intercept 2FA banking codes.'}
              </p>
            </div>

            {selectedNode.threat_id && (
              <div className="mt-5 p-3 rounded border border-slate-800 bg-slate-950/60 text-xs space-y-1">
                <span className="text-slate-400">Linked Threat ID:</span>
                <p className="font-mono text-rose-400 font-bold">{selectedNode.threat_id}</p>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-2">
            {selectedNode.threat_id && onInspectThreat && (
              <button
                onClick={() => onInspectThreat(selectedNode.threat_id!)}
                className="w-full py-2.5 px-4 text-xs font-medium rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Full Threat Forensics
              </button>
            )}

            {selectedNode.type !== 'BRAND' && selectedNode.threat_id && onTakedownNode && (
              <button
                onClick={() => onTakedownNode(selectedNode.threat_id!)}
                className="w-full py-2.5 px-4 text-xs font-medium rounded border border-rose-600 bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch Immediate Takedown
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
