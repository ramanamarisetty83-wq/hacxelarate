import React, { useState, useEffect } from 'react';
import { 
  BenchmarkDataset, 
  BenchmarkSample, 
  TestInferenceResult 
} from '../types/threat';
import { apiService } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';
import { RiskScore } from '../components/RiskScore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Language, getTranslation } from '../i18n/translations';
import { 
  BrainCircuit, 
  Database, 
  Play, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  BarChart3, 
  Sparkles, 
  Cpu, 
  Activity,
  Award,
  BookOpen,
  RefreshCw,
  Search
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';

interface DatasetTrainingStudioProps {
  currentLang: Language;
}

export const DatasetTrainingStudio: React.FC<DatasetTrainingStudioProps> = ({ currentLang }) => {
  const [datasets, setDatasets] = useState<BenchmarkDataset[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('ds-instagram');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTrainingIndividual, setIsTrainingIndividual] = useState<boolean>(false);
  const [isTrainingAll, setIsTrainingAll] = useState<boolean>(false);
  const [trainAllProgress, setTrainAllProgress] = useState<number>(0);
  const [notification, setNotification] = useState<string | null>(null);

  // Test bench state
  const [selectedSample, setSelectedSample] = useState<BenchmarkSample | null>(null);
  const [inferenceResult, setInferenceResult] = useState<TestInferenceResult | null>(null);
  const [isTestingInference, setIsTestingInference] = useState<boolean>(false);

  useEffect(() => {
    const loadDatasets = async () => {
      setIsLoading(true);
      const data = await apiService.getBenchmarkDatasets();
      setDatasets(data);
      if (data.length > 0) {
        setSelectedDatasetId(data[0].id);
        if (data[0].benchmark_samples.length > 0) {
          setSelectedSample(data[0].benchmark_samples[0]);
        }
      }
      setIsLoading(false);
    };
    loadDatasets();
  }, []);

  const currentDataset = datasets.find((d) => d.id === selectedDatasetId) || datasets[0];

  useEffect(() => {
    if (currentDataset && currentDataset.benchmark_samples.length > 0) {
      setSelectedSample(currentDataset.benchmark_samples[0]);
      setInferenceResult(null);
    }
  }, [selectedDatasetId]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleTrainCurrentModel = async () => {
    if (!currentDataset) return;
    setIsTrainingIndividual(true);
    showToast(`Initiating training for ${currentDataset.name}...`);
    
    // Simulate real training iteration
    setTimeout(async () => {
      const updated = await apiService.trainBenchmarkDataset(currentDataset.id);
      setDatasets((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      setIsTrainingIndividual(false);
      showToast(`Training complete! ${currentDataset.name} accuracy increased to ${(updated.metrics.accuracy * 100).toFixed(1)}%. Model calibrated.`);
    }, 1400);
  };

  const handleTrainAllModels = async () => {
    setIsTrainingAll(true);
    setTrainAllProgress(10);
    showToast('Starting sequential training across all 5 benchmark datasets...');

    for (let i = 1; i <= 5; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setTrainAllProgress(i * 20);
    }

    const updated = await apiService.trainAllBenchmarkDatasets();
    setDatasets(updated);
    setIsTrainingAll(false);
    showToast('All 5 Top Benchmark Models successfully trained, evaluated, and deployed to active Risk Engine!');
  };

  const handleRunInference = async (sample: BenchmarkSample) => {
    setSelectedSample(sample);
    setIsTestingInference(true);
    
    setTimeout(async () => {
      const result = await apiService.testInferenceOnSample(currentDataset.id, sample.features);
      setInferenceResult(result);
      setIsTestingInference(false);
    }, 400);
  };

  if (isLoading || !currentDataset) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading Top 5 Cybersecurity Benchmark Datasets..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-20 z-50 animate-in slide-in-from-bottom duration-200">
          <div className="px-4 py-3 rounded-lg border border-emerald-500 bg-slate-900 text-emerald-300 text-xs font-mono font-medium shadow-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
              {currentLang === 'te' ? 'టాప్ 5 డేటాసెట్‌లు & మోడల్ ట్రైనింగ్' : currentLang === 'hi' ? 'शीर्ष 5 डेटासेट एवं मॉडल ट्रेनिंग' : currentLang === 'mr' ? 'अव्वल 5 डेटासेट्स आणि मॉडेल ट्रेनिंग' : 'Top 5 Cybersecurity Benchmark Datasets'}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-mono">
              Academic & Open-Source Ground Truth
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-rose-400" />
            <span>
              {currentLang === 'te' ? 'మోడల్ ట్రైనింగ్ & బెంచ్‌మార్క్ స్టూడియో' : currentLang === 'hi' ? 'मॉडल ट्रेनिंग एवं बेंचमार्क स्टूडियो' : currentLang === 'mr' ? 'मॉडेल ट्रेनिंग आणि बेंचमार्क स्टुडिओ' : 'Model Training & Benchmark Calibration Studio'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            {currentLang === 'te' 
              ? 'ఈ మోడల్స్ ప్రపంచవ్యాప్తంగా ప్రసిద్ధి చెందిన టాప్ 5 పరిశోధనా డేటాసెట్‌ల ద్వారా ట్రైన్ చేయబడ్డాయి: ఇన్‌స్టాగ్రామ్ ఫేక్ స్పామర్స్, Cresci-2017 బాట్స్, TwiBot-22, PhiUSIIL ఫిషింగ్ URLలు మరియు CICMalDroid 2020 ఆండ్రాయిడ్ మాల్వేర్.'
              : currentLang === 'hi'
              ? 'ये मॉडल विश्व प्रसिद्ध शीर्ष 5 शोध डेटासेट्स पर प्रशिक्षित हैं: इंस्टाग्राम फर्जी अकाउंट्स, Cresci-2017 बॉट्स, TwiBot-22, PhiUSIIL फ़िशिंग URL और CICMalDroid 2020 एंड्रॉयड मैलवेयर।'
              : currentLang === 'mr'
              ? 'हे मॉडेल्स जगातील अव्वल 5 संशोधन डेटासेट्सवर प्रशिक्षित आहेत: इन्स्टाग्राम बनावट खाती, Cresci-2017 बॉट्स, TwiBot-22, PhiUSIIL फिशिंग URLs आणि CICMalDroid 2020 अँड्रॉइड मालवेअर.'
              : "Calibrate and train DRPP's multi-vector risk engine directly against the 5 most respected research datasets: Instagram Fake Spammers (Kaggle), Cresci-2017 Social Bot (Botometer), TwiBot-22 (NeurIPS), PhiUSIIL Phishing URLs (UCI ML Repository), and CICMalDroid 2020 Android Malware (UNB)."}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleTrainAllModels}
            disabled={isTrainingAll}
            className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(244,63,94,0.35)] flex items-center gap-2"
          >
            {isTrainingAll ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Training ({trainAllProgress}%)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>
                  {currentLang === 'te' ? 'అన్ని 5 మోడల్స్ ట్రైన్ చేయి' : currentLang === 'hi' ? 'सभी 5 मॉडल ट्रेन करें' : currentLang === 'mr' ? 'सर्व 5 मॉडेल ट्रेन करा' : 'Train All 5 Models'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar for Train All */}
      {isTrainingAll && (
        <div className="p-3 rounded-lg bg-slate-900 border border-rose-900/60 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-rose-400 font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 animate-pulse" />
              Executing Sequential Multi-Vector Model Training
            </span>
            <span className="text-white">{trainAllProgress}% Complete</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-600 to-amber-500 transition-all duration-300"
              style={{ width: `${trainAllProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Top 5 Dataset Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {datasets.map((ds) => {
          const isSelected = ds.id === selectedDatasetId;
          return (
            <button
              key={ds.id}
              onClick={() => setSelectedDatasetId(ds.id)}
              className={`p-3.5 rounded-lg border text-left transition-all duration-200 relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-rose-950/25 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    isSelected ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    #{ds.rank} DATASET
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {(ds.metrics.accuracy * 100).toFixed(1)}% Acc
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                  {ds.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  {ds.source}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{ds.sample_count.toLocaleString()} rows</span>
                <span className="text-rose-400 font-medium">Inspect →</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Selected Dataset Deep Dive View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Dataset Specs, Loss Graph, Feature Importances */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dataset Header Card */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800/60 text-[10px] font-mono font-bold">
                    BENCHMARK #{currentDataset.rank}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Vector: <strong className="text-slate-200">{currentDataset.target_vector}</strong>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {currentDataset.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  <span>Source: <strong className="text-white">{currentDataset.source}</strong></span>
                  <span className="text-slate-600">·</span>
                  <a 
                    href={currentDataset.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 font-mono text-[11px]"
                  >
                    <span>Dataset Repository</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Individual Train Button */}
              <button
                onClick={handleTrainCurrentModel}
                disabled={isTrainingIndividual}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-xs font-mono transition-colors flex items-center gap-2 shrink-0 self-start"
              >
                {isTrainingIndividual ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-400" />
                    <span>Training Model...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                    <span>Retrain This Model</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
              {currentDataset.description}
            </p>

            {/* Metric KPI Gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Accuracy</p>
                <p className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                  {(currentDataset.metrics.accuracy * 100).toFixed(1)}%
                </p>
                <p className="text-[9px] text-slate-500 font-mono">Test Partition</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Precision</p>
                <p className="text-lg font-bold text-sky-400 font-mono mt-0.5">
                  {(currentDataset.metrics.precision * 100).toFixed(1)}%
                </p>
                <p className="text-[9px] text-slate-500 font-mono">True Positives</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Recall</p>
                <p className="text-lg font-bold text-indigo-400 font-mono mt-0.5">
                  {(currentDataset.metrics.recall * 100).toFixed(1)}%
                </p>
                <p className="text-[9px] text-slate-500 font-mono">Coverage</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">F1-Score</p>
                <p className="text-lg font-bold text-rose-400 font-mono mt-0.5">
                  {(currentDataset.metrics.f1_score * 100).toFixed(1)}%
                </p>
                <p className="text-[9px] text-slate-500 font-mono">Harmonic Mean</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">AUC-ROC</p>
                <p className="text-lg font-bold text-amber-400 font-mono mt-0.5">
                  {currentDataset.metrics.auc_roc.toFixed(3)}
                </p>
                <p className="text-[9px] text-slate-500 font-mono">Discrimination</p>
              </div>
            </div>
          </div>

          {/* Loss Curve Training Telemetry (Recharts) */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-rose-400" />
                  <span>Model Convergence & Loss History</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Training loss vs Validation loss over 25 optimization epochs
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Training Loss
                </span>
                <span className="flex items-center gap-1.5 text-sky-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Val Loss
                </span>
              </div>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentDataset.loss_curve}>
                  <defs>
                    <linearGradient id="trainLossGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="valLossGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis 
                    dataKey="epoch" 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickFormatter={(val) => `Epoch ${val}`} 
                  />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 0.8]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="loss" 
                    stroke="#f43f5e" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#trainLossGrad)" 
                    name="Training Loss" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="val_loss" 
                    stroke="#38bdf8" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#valLossGrad)" 
                    name="Validation Loss" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feature Importance Analysis */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-rose-400" />
                  <span>Learned Feature Weights & Explanations</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Normalized Shapley importance values derived from training on {currentDataset.name}
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Algorithm: <strong className="text-slate-200">{currentDataset.algorithm}</strong>
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {currentDataset.feature_importances.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-200 font-semibold">{item.feature}</span>
                    <span className="text-rose-400 font-bold">{(item.importance * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-600 to-amber-500 rounded-full"
                      style={{ width: `${item.importance * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Live Benchmark Testing Bench */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-rose-400 text-xs font-mono font-bold uppercase mb-1">
                <Cpu className="w-4 h-4" />
                <span>Live Test Bench</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Evaluate Benchmark Test Samples
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Test the calibrated model on real ground-truth vectors from {currentDataset.source}
              </p>
            </div>

            {/* Benchmark Samples Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Select Test Sample
              </label>
              <div className="space-y-2">
                {currentDataset.benchmark_samples.map((sample) => {
                  const isSampleActive = selectedSample?.id === sample.id;
                  return (
                    <div
                      key={sample.id}
                      onClick={() => handleRunInference(sample)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSampleActive
                          ? 'bg-rose-950/30 border-rose-500/80 shadow-md'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white truncate">
                          {sample.sample_name}
                        </span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          sample.label === 1 
                            ? 'bg-rose-950 text-rose-400 border border-rose-800' 
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}>
                          {sample.label === 1 ? 'FRAUD / MALWARE' : 'BENIGN / GENUINE'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                        {sample.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inference Result Card */}
            {isTestingInference ? (
              <div className="p-6 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                <LoadingSpinner size="md" label="Running neural inference on sample..." />
              </div>
            ) : inferenceResult ? (
              <div className="p-4 rounded-lg bg-slate-950 border border-rose-900/50 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                    Model Inference Verdict
                  </span>
                  <RiskBadge level={inferenceResult.risk_level} size="sm" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Prediction</p>
                    <p className={`text-sm font-bold font-mono ${
                      inferenceResult.predicted_label === 1 ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {inferenceResult.predicted_label === 1 ? 'MALICIOUS / SPAM' : 'GENUINE / LEGITIMATE'}
                    </p>
                  </div>
                  <RiskScore score={inferenceResult.risk_score} level={inferenceResult.risk_level} size="sm" />
                </div>

                <div>
                  <p className="text-[10px] font-mono uppercase text-slate-400 mb-1">
                    Key Contributing Signals
                  </p>
                  <ul className="space-y-1">
                    {inferenceResult.key_contributors.map((c, i) => (
                      <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">›</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : selectedSample ? (
              <button
                onClick={() => handleRunInference(selectedSample)}
                className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Activity className="w-4 h-4" />
                <span>Evaluate Selected Sample</span>
              </button>
            ) : null}

            {/* Raw Feature Vector Inspection */}
            {selectedSample && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Ground Truth Feature Vector
                </span>
                <div className="p-3 rounded bg-slate-950 border border-slate-800/80 max-h-48 overflow-y-auto font-mono text-[10px] text-slate-300 space-y-1">
                  {Object.entries(selectedSample.features).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between border-b border-slate-900/80 pb-0.5">
                      <span className="text-slate-400">{k}:</span>
                      <span className="text-emerald-400 font-bold">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
