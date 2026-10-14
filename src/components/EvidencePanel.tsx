import React, { useState } from 'react';
import { Threat, ThreatStatus } from '../types/threat';
import { 
  FileText, 
  Terminal, 
  CheckCircle, 
  Flag, 
  Send, 
  ExternalLink,
  Info
} from 'lucide-react';

interface EvidencePanelProps {
  threat: Threat;
  onUpdateStatus?: (id: string, status: ThreatStatus, feedback?: string) => void;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ threat, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState<'reasons' | 'evidence' | 'actions' | 'raw'>('reasons');
  const [feedbackNote, setFeedbackNote] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [takedownSuccess, setTakedownSuccess] = useState(false);

  const handleTakedown = () => {
    if (onUpdateStatus) {
      onUpdateStatus(threat.id, 'TAKEDOWN_REQUESTED');
      setTakedownSuccess(true);
      setTimeout(() => setTakedownSuccess(false), 4000);
    }
  };

  const handleFalsePositive = () => {
    if (onUpdateStatus) {
      onUpdateStatus(threat.id, 'FALSE_POSITIVE', feedbackNote);
      setShowFeedbackModal(false);
    }
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-900/90 text-xs font-medium">
        <button
          onClick={() => setActiveTab('reasons')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'reasons'
              ? 'border-rose-500 text-white bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          Detection Reasons ({threat.reasons?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'evidence'
              ? 'border-rose-500 text-white bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Forensic Artifacts
        </button>

        <button
          onClick={() => setActiveTab('actions')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'actions'
              ? 'border-rose-500 text-white bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          Recommended Actions ({threat.recommendations?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('raw')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'raw'
              ? 'border-rose-500 text-white bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          Raw JSON Payload
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-5">
        {activeTab === 'reasons' && (
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Explainable Risk Attribution Signals
            </h5>
            <div className="space-y-2">
              {threat.reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded border border-slate-800 bg-slate-900/80 text-sm text-slate-200"
                >
                  <span className="font-mono text-xs font-bold text-rose-400 mt-0.5 tabular-nums">
                    0{idx + 1}.
                  </span>
                  <div className="flex-1">
                    <p>{reason}</p>
                  </div>
                </div>
              ))}
            </div>

            {threat.structured_reasons && threat.structured_reasons.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <h6 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Signal Weight Attribution Breakdown
                </h6>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {threat.structured_reasons.map((sr) => (
                    <div key={sr.id} className="p-3 rounded border border-slate-800 bg-slate-950/60">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-mono uppercase">{sr.category}</span>
                        <span className="font-mono font-bold text-rose-400 tabular-nums">+{sr.weight}%</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-300 line-clamp-2">{sr.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded border border-slate-800 bg-slate-950/60">
                <span className="text-xs font-medium text-slate-400 uppercase">Detection Context</span>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Platform Source:</span>
                    <span className="font-mono text-white">{threat.evidence?.source_platform || 'Crawler Sensor'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Timestamp:</span>
                    <span className="font-mono text-white tabular-nums">
                      {new Date(threat.evidence?.detected_at || threat.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Target Entity:</span>
                    <span className="font-mono text-white">{threat.target_brand}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Threat Identifier:</span>
                    <span className="font-mono text-rose-400">{threat.id}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded border border-slate-800 bg-slate-950/60">
                <span className="text-xs font-medium text-slate-400 uppercase">Extracted Forensic Signals</span>
                <div className="mt-3 space-y-2 text-xs">
                  {threat.evidence?.risk_factors &&
                    Object.entries(threat.evidence.risk_factors).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">{key}:</span>
                        <span className="font-mono text-amber-300 font-medium truncate max-w-[200px]">{String(value)}</span>
                      </div>
                    ))}
                  {(!threat.evidence?.risk_factors || Object.keys(threat.evidence.risk_factors).length === 0) && (
                    <p className="text-slate-500 py-2">No raw signal overrides present for this entity.</p>
                  )}
                </div>
              </div>
            </div>

            {threat.evidence?.screenshot_simulated_url && (
              <div className="p-4 rounded border border-slate-800 bg-slate-950/60">
                <span className="text-xs font-medium text-slate-400 uppercase">Brand Visual Forensic Note</span>
                <p className="mt-2 text-xs text-slate-300 font-mono">
                  {threat.evidence.screenshot_simulated_url}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Automated Incident Response Workflow
              </h5>
              {threat.status !== 'TAKEDOWN_REQUESTED' && threat.status !== 'RESOLVED' && (
                <button
                  onClick={handleTakedown}
                  className="px-3 py-1.5 text-xs font-medium rounded border border-rose-600 bg-rose-600 hover:bg-rose-500 text-white transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch One-Click Takedown
                </button>
              )}
            </div>

            {takedownSuccess && (
              <div className="p-3 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Official DMCA & registrar abuse payload generated and dispatched to platform security desk.
                </span>
              </div>
            )}

            <div className="space-y-2">
              {threat.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded border border-slate-800 bg-slate-900/80 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">{rec}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Priority automated countermeasure for {threat.target_brand} brand defense.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400 shrink-0 uppercase">Step 0{i + 1}</span>
                </div>
              ))}
            </div>

            {/* Analyst Feedback / False-Positive Trigger */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                <span>Model evaluation feedback loop active. Help train detection accuracy:</span>
              </div>
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="px-3 py-1 text-xs font-medium rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <Flag className="w-3.5 h-3.5 text-amber-400" />
                Report False Positive
              </button>
            </div>
          </div>
        )}

        {activeTab === 'raw' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400">Normalized JSON Threat Object</span>
              <span className="text-xs font-mono text-slate-400">Schema v2.4</span>
            </div>
            <pre className="p-4 rounded border border-slate-800 bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto max-h-80">
              {JSON.stringify(threat, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* False Positive Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md p-6 rounded-lg border border-slate-700 bg-slate-900 shadow-2xl">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Flag className="w-4 h-4 text-amber-400" />
              Report False Positive Detection
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Marking <strong className="text-white">{threat.entity}</strong> as a false positive will suppress alerts and retrain the similarity threshold.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Analyst Notes / Reason
              </label>
              <textarea
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                placeholder="e.g. Authorized regional subsidiary marketing handle..."
                rows={3}
                className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleFalsePositive}
                className="px-4 py-1.5 text-xs font-medium bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors"
              >
                Confirm False Positive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
