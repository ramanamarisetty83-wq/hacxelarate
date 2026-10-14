import React, { useState, useEffect } from 'react';
import { IncidentReport } from '../types/threat';
import { 
  FileBarChart2, 
  Download, 
  FileText, 
  Printer, 
  CheckCircle2, 
  ShieldAlert, 
  RefreshCw,
  Clock,
  Send
} from 'lucide-react';

interface ReportsProps {
  brandName: string;
  onGenerateReport: (options?: { period?: string }) => Promise<IncidentReport>;
}

export const Reports: React.FC<ReportsProps> = ({ brandName, onGenerateReport }) => {
  const [report, setReport] = useState<IncidentReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 Days (Active Sprint)');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    // Initial fetch of report
    const load = async () => {
      setIsGenerating(true);
      try {
        const data = await onGenerateReport({ period: selectedPeriod });
        setReport(data);
      } finally {
        setIsGenerating(false);
      }
    };
    load();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = await onGenerateReport({ period: selectedPeriod });
      setReport(data);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!report) return;
    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.report_id}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Executive Incident & Takedown Reports
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate formal security briefings for executive leadership, legal counsel, and compliance auditors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono"
          >
            <option>Last 7 Days (Tactical)</option>
            <option>Last 30 Days (Active Sprint)</option>
            <option>Quarter to Date (Q4 2026)</option>
          </select>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-3.5 py-1.5 text-xs font-medium rounded border border-rose-600 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Compiling Report...' : 'Re-Generate Report'}</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Incident report downloaded in machine-readable JSON format.</span>
        </div>
      )}

      {report && (
        <div className="p-8 rounded-lg border border-slate-800 bg-slate-900/60 space-y-6">
          {/* Report Metadata Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>REPORT ID: <strong className="text-rose-400">{report.report_id}</strong></span>
                <span>·</span>
                <span>CLASSIFICATION: <strong className="text-amber-400">CONFIDENTIAL (SOC TLP:AMBER)</strong></span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                Digital Brand Threat Assessment: {report.brand_name}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 text-xs font-mono rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 text-xs font-mono rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Executive Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded border border-slate-800 bg-slate-950/60">
              <span className="text-[11px] font-mono uppercase text-slate-400">Total Incidents</span>
              <p className="text-2xl font-bold font-mono text-white tabular-nums mt-1">
                {report.summary.total_incidents}
              </p>
            </div>

            <div className="p-4 rounded border border-slate-800 bg-slate-950/60">
              <span className="text-[11px] font-mono uppercase text-slate-400">Critical Threats</span>
              <p className="text-2xl font-bold font-mono text-rose-400 tabular-nums mt-1">
                {report.summary.critical_risk_incidents}
              </p>
            </div>

            <div className="p-4 rounded border border-slate-800 bg-slate-950/60">
              <span className="text-[11px] font-mono uppercase text-slate-400">Takedowns Executed</span>
              <p className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
                {report.summary.takedowns_executed}
              </p>
            </div>

            <div className="p-4 rounded border border-slate-800 bg-slate-950/60">
              <span className="text-[11px] font-mono uppercase text-slate-400">Mean Time to Detect</span>
              <p className="text-2xl font-bold font-mono text-sky-400 tabular-nums mt-1">
                {report.summary.mean_time_to_detect_hours} hrs
              </p>
            </div>
          </div>

          {/* Executive Narrative */}
          <div className="p-5 rounded border border-slate-800 bg-slate-950/40 space-y-2">
            <h4 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
              Executive Threat Narrative
            </h4>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans">
              {report.executive_narrative}
            </p>
          </div>

          {/* Threat Vector Breakdown */}
          <div>
            <h4 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider mb-3">
              Incident Breakdown by Threat Surface
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {Object.entries(report.threat_breakdown).map(([vector, count]) => (
                <div key={vector} className="p-3 rounded border border-slate-800 bg-slate-950/60">
                  <span className="text-slate-400">{vector}:</span>
                  <p className="text-base font-bold font-mono text-white mt-1 tabular-nums">
                    {count}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Incidents Forensics */}
          <div>
            <h4 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider mb-3">
              Priority Escalated Incidents (Risk Score ≥ 80)
            </h4>
            <div className="space-y-2">
              {report.top_incidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-3.5 rounded border border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-rose-400">{inc.id}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400">{inc.threat_type}</span>
                    </div>
                    <p className="text-white font-semibold text-sm mt-0.5">{inc.entity}</p>
                    {inc.reasons?.[0] && (
                      <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{inc.reasons[0]}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0 font-mono">
                    <span className="text-xs text-rose-400 font-bold tabular-nums">
                      {inc.risk_score}/100 Risk
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                      {inc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Security Postures */}
          <div>
            <h4 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider mb-3">
              Recommended Defensive Postures & Hardening
            </h4>
            <div className="space-y-2 text-xs">
              {report.recommended_security_postures.map((posture, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded border border-slate-800 bg-slate-950/60 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-slate-300">{posture}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
