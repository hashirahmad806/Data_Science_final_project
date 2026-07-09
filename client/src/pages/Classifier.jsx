import React, { useState, useRef } from "react";
import { Card, CardHeader, StatusChip } from "../components/ui";
import {
  Search,
  FileText,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Zap,
  TrendingDown,
  Info,
  XCircle,
  CheckCircle,
  BarChart2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { apiUrl } from "../lib/api";

// Sample articles chosen to match ISOT dataset patterns:
// REAL = Reuters/AP wire-service style (sourced, neutral, dateline)
// FAKE = Sensationalist, unsourced, conspiracy-style (no Reuters dateline)
const SAMPLE_ARTICLES = {
  fake: "BREAKING: Deep state operatives inside the Pentagon have confirmed to our sources that Hillary Clinton's secret server contained classified communications directly linked to a foreign intelligence operation. Multiple whistleblowers, who spoke on condition of anonymity, revealed that the FBI covered up evidence that would have led to immediate criminal charges. Share this before it gets taken down! The mainstream media won't report this because they are part of the coverup. Patriots must stand up and demand accountability NOW.",
  real: "WASHINGTON (Reuters) - U.S. President Donald Trump said on Tuesday he will impose a 25 percent tariff on steel imports and a 10 percent tariff on aluminum imports, a move he said was needed to protect U.S. national security. Trump made the announcement in a meeting with steel and aluminum executives at the White House. The decision, which has been weeks in the making, drew sharp criticism from U.S. trading partners including the European Union and Canada, who warned they would retaliate.",
};

// Static test-set model stats (Phase 3 notebook)
const MODEL_TEST_STATS = {
  testSamples: 1749,
  totalErrors: 21,
  accuracy: 98.8,
  f1: 0.988,
  confMatrix: { tn: 862, fp: 11, fn: 10, tp: 866 },
  errorRate: "1.20",
};

const RISK_COLORS = {
  low: {
    bg: "bg-[#E6F4F1]",
    text: "text-[#2a9d8f]",
    border: "border-[#2a9d8f]/30",
    icon: <CheckCircle size={14} className="text-[#2a9d8f]" />,
  },
  medium: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-300",
    icon: <AlertTriangle size={14} className="text-amber-500" />,
  },
  high: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-300",
    icon: <XCircle size={14} className="text-red-500" />,
  },
};

export default function Classifier() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleClassify = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(apiUrl("/api/classify"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.detail ||
            data.error ||
            "Failed to classify. Ensure the ML service is running.",
        );
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 600);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const loadSample = (type) => {
    setText(SAMPLE_ARTICLES[type]);
    setResult(null);
    setError("");
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    if (!file.name.endsWith(".txt")) {
      setError("Upload a .txt file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setText(e.target.result);
      setError("");
    };
    reader.readAsText(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
  };

  const risk = result
    ? RISK_COLORS[result.risk_level] || RISK_COLORS.low
    : null;
  const isReal = result?.prediction === "Real";

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in">
      {/* ── HEADER ── */}
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2 flex items-center gap-3">
          <Activity className="text-[#2a9d8f]" /> Live AI Classifier
        </h2>
        <p className="text-secondary max-w-2xl leading-relaxed">
          Classify any news article in real-time. All analysis below updates
          dynamically based on your input. The pipeline replicates Phase 2
          exactly: TF-IDF → Structural Features → StandardScaler → 63-Feature
          RF.
        </p>
      </div>

      {/* ── INPUT + RESULT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input */}
        <div className="lg:col-span-2 space-y-5">
          <Card
            className={`transition-all duration-300 ${isDragging ? "border-[#2a9d8f] shadow-md -translate-y-1" : ""}`}
          >
            <div className="flex justify-between items-start mb-4">
              <CardHeader
                title="Article Input"
                subtitle="Paste text or drag & drop a .txt file"
              />
              <div className="flex flex-col items-end shrink-0">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Zap size={10} /> Quick examples:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadSample("fake")}
                    className="text-xs px-2 py-1 rounded bg-surface-variant hover:bg-error-container hover:text-error transition-colors"
                  >
                    Sample Fake
                  </button>
                  <button
                    onClick={() => loadSample("real")}
                    className="text-xs px-2 py-1 rounded bg-surface-variant hover:bg-[#E6F4F1] hover:text-[#2a9d8f] transition-colors"
                  >
                    Sample Real
                  </button>
                </div>
              </div>
            </div>
            <div
              className="relative rounded-xl overflow-hidden border border-surface-variant bg-surface-container-lowest"
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <textarea
                className="w-full h-52 p-5 focus:outline-none resize-none bg-transparent font-sans text-sm leading-relaxed text-on-surface placeholder-outline"
                placeholder="Paste a news article here…&#10;&#10;Tip: Longer articles with more context give the model higher confidence."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={loading}
              />
              {isDragging && (
                <div className="absolute inset-0 bg-[#2a9d8f]/10 flex items-center justify-center border-2 border-dashed border-[#2a9d8f] rounded-xl z-10 pointer-events-none">
                  <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                    <p className="font-bold text-primary">
                      Drop .txt file here
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept=".txt"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-secondary bg-surface-container hover:bg-surface-variant border border-outline-variant rounded-lg transition-colors"
                >
                  <FileText size={16} /> Upload .txt
                </button>
                <span className="text-xs text-secondary font-mono">
                  {text.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <button
                onClick={handleClassify}
                disabled={loading || !text.trim()}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-md ${loading || !text.trim() ? "bg-surface-variant text-outline cursor-not-allowed shadow-none" : "bg-[#0f1f3d] hover:bg-[#2a9d8f] text-white hover:shadow-lg hover:-translate-y-0.5"}`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                    Analyzing…
                  </>
                ) : (
                  <>
                    <Search size={18} /> Run Classification
                  </>
                )}
              </button>
            </div>
          </Card>
          {error && (
            <div className="p-4 bg-error-container/50 border border-error/30 text-on-error-container rounded-xl flex items-start gap-3">
              <AlertTriangle className="text-error shrink-0 mt-0.5" size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Result / Awaiting */}
        <div className="lg:col-span-1">
          {result ? (
            <div className="space-y-4 animate-slide-up">
              {/* Verdict Card */}
              <Card
                className={`border-t-4 ${isReal ? "border-t-[#2a9d8f]" : "border-t-error"}`}
              >
                <div className="text-center pb-5 border-b border-surface-variant mb-4">
                  <div
                    className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-3 ${isReal ? "bg-[#E6F4F1] text-[#2a9d8f]" : "bg-error-container text-error"}`}
                  >
                    {isReal ? (
                      <ShieldCheck size={28} />
                    ) : (
                      <AlertTriangle size={28} />
                    )}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-0.5">
                    Model Verdict
                  </p>
                  <div className="text-4xl font-black text-primary">
                    {result.prediction}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                      Confidence
                    </span>
                    <span className="text-2xl font-mono font-bold text-primary">
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 w-full bg-surface-variant rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ease-out ${isReal ? "bg-[#2a9d8f]" : "bg-error"}`}
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </Card>

              {/* Risk Assessment */}
              {result.risk_level && (
                <div
                  className={`${risk.bg} border ${risk.border} rounded-xl p-3 flex items-center gap-2`}
                >
                  {risk.icon}
                  <p className={`text-xs font-bold ${risk.text}`}>
                    {result.risk_label}
                  </p>
                </div>
              )}

              {/* Pipeline steps */}
              <div className="bg-[#0f1f3d] text-white p-4 rounded-xl">
                <h4 className="text-xs font-bold tracking-wider uppercase mb-3 text-[#b7c6ed]">
                  Pipeline Executed
                </h4>
                <ul className="space-y-1.5 text-xs text-blue-100 font-mono">
                  {[
                    `${result.structural_features?.word_count} words tokenized`,
                    `TF-IDF vectorized (5,000 vocab)`,
                    `${result.structural_features ? Object.keys(result.structural_features).length : 7} structural features computed`,
                    `StandardScaler applied`,
                    `63 features selected → RF`,
                    `Inference complete`,
                  ].map((s, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle
                        size={11}
                        className="text-[#2a9d8f] shrink-0"
                      />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center p-8 text-center bg-surface-container-lowest">
              <ShieldCheck
                size={44}
                className="text-outline-variant mb-3 opacity-40"
              />
              <p className="font-semibold text-on-surface mb-1">
                Awaiting Input
              </p>
              <p className="text-xs text-secondary max-w-[180px] leading-relaxed">
                Submit an article to see live analysis, confidence breakdown,
                and feature attribution.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── DYNAMIC ANALYSIS (only when result exists) ── */}
      {result && (
        <div className="space-y-6 animate-slide-up">
          <div className="flex items-center gap-3">
            <BarChart2 className="text-[#2a9d8f]" size={22} />
            <div>
              <h3 className="text-xl font-bold text-primary">
                Input Analysis — This Article
              </h3>
              <p className="text-sm text-secondary">
                Dynamic breakdown of the features extracted from your submitted
                text.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Structural Features */}
            <Card>
              <CardHeader
                title="Computed Structural Features"
                subtitle="Phase 2 feature engineering — live values"
              />
              <div className="mt-4 space-y-3">
                {result.structural_features &&
                  Object.entries({
                    "Word Count": result.structural_features.word_count,
                    "Text Length (chars)":
                      result.structural_features.text_length,
                    "Avg Word Length":
                      result.structural_features.avg_word_length,
                    "Punctuation Count":
                      result.structural_features.punctuation_count,
                    "Uppercase Words":
                      result.structural_features.uppercase_words,
                  }).map(([label, val]) => {
                    const maxes = {
                      "Word Count": 800,
                      "Text Length (chars)": 5000,
                      "Avg Word Length": 12,
                      "Punctuation Count": 80,
                      "Uppercase Words": 30,
                    };
                    const pct = Math.min(100, (val / maxes[label]) * 100);
                    return (
                      <div key={label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-secondary">
                            {label}
                          </span>
                          <span className="font-mono font-bold text-primary">
                            {val}
                          </span>
                        </div>
                        <div className="h-2 bg-surface-variant rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#2a9d8f] rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </Card>

            {/* Top TF-IDF Tokens */}
            <Card>
              <CardHeader
                title="Top Triggered Features"
                subtitle="Highest-weighted words from the 63 selected features"
              />
              {result.top_tokens && result.top_tokens.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={result.top_tokens}
                    layout="vertical"
                    margin={{ top: 5, right: 10, left: 60, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      horizontal={false}
                    />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis
                      type="category"
                      dataKey="token"
                      tick={{ fontSize: 11, fontWeight: 600 }}
                    />
                    <Tooltip
                      formatter={(v) => [`${v.toFixed(4)}`, "TF-IDF Weight"]}
                    />
                    <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
                      {result.top_tokens.map((_, i) => (
                        <Cell
                          key={i}
                          fill={isReal ? "#2a9d8f" : "#ef4444"}
                          opacity={1 - i * 0.08}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="py-8 text-center text-secondary text-sm">
                  <p>No matching tokens found in the top 63 features.</p>
                  <p className="text-xs mt-1">
                    The model relied primarily on structural features for this
                    prediction.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ── STATIC MODEL ERROR ANALYSIS ── */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <TrendingDown className="text-error" size={22} />
          <div>
            <h3 className="text-xl font-bold text-primary">
              Overall Model Error Analysis
            </h3>
            <p className="text-sm text-secondary">
              Sourced from Phase 3 notebook — evaluated on 1,749 held-out test
              samples.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Test Accuracy",
              value: "98.80%",
              sub: "1,728 / 1,749 correct",
              color: "text-[#2a9d8f]",
              bg: "bg-[#E6F4F1]",
            },
            {
              label: "Total Errors",
              value: "21",
              sub: "11 FP + 10 FN",
              color: "text-error",
              bg: "bg-error-container",
            },
            {
              label: "Error Rate",
              value: "1.20%",
              sub: "~1.2 per 100 articles",
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
            {
              label: "F1 Score",
              value: "0.9880",
              sub: "Precision × Recall balance",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
          ].map(({ label, value, sub, color, bg }) => (
            <div
              key={label}
              className={`${bg} border border-outline-variant/30 rounded-2xl p-4 text-center`}
            >
              <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                {label}
              </p>
              <p className={`text-2xl font-black ${color} mb-0.5`}>{value}</p>
              <p className="text-[10px] text-secondary">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Confusion Matrix */}
          <Card>
            <CardHeader
              title="Confusion Matrix — Test Set"
              subtitle="1,749 samples, Phase 3 notebook"
            />
            <div className="grid grid-cols-2 gap-2 mt-4">
              {[
                {
                  label: "True Positive",
                  val: 866,
                  note: "Fake → Fake ✓",
                  bg: "bg-[#E6F4F1]",
                  border: "border-[#2a9d8f]/30",
                  color: "text-[#2a9d8f]",
                },
                {
                  label: "False Positive",
                  val: 11,
                  note: "Real → Fake ✗",
                  bg: "bg-amber-50",
                  border: "border-amber-200",
                  color: "text-amber-600",
                },
                {
                  label: "False Negative",
                  val: 10,
                  note: "Fake → Real ✗",
                  bg: "bg-red-50",
                  border: "border-red-200",
                  color: "text-red-500",
                },
                {
                  label: "True Negative",
                  val: 862,
                  note: "Real → Real ✓",
                  bg: "bg-blue-50",
                  border: "border-blue-200",
                  color: "text-blue-600",
                },
              ].map(({ label, val, note, bg, border, color }) => (
                <div
                  key={label}
                  className={`${bg} border ${border} rounded-xl p-4 text-center`}
                >
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  <p className={`text-3xl font-black ${color}`}>{val}</p>
                  <p className="text-[10px] text-secondary mt-1">{note}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Cost Analysis */}
          <Card>
            <CardHeader
              title="Error Cost Breakdown"
              subtitle="FP vs FN — what each error means"
            />
            <ResponsiveContainer width="100%" height={130}>
              <BarChart
                data={[
                  { name: "FP (Real→Fake)", count: 11 },
                  { name: "FN (Fake→Real)", count: 10 },
                ]}
                margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fontWeight: 600 }}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => [`${v} articles`, "Misclassified"]}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  <Cell fill="#f59e0b" />
                  <Cell fill="#ef4444" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="font-bold text-amber-700">FP Cost</p>
                <p className="text-amber-600 mt-0.5">
                  Real news incorrectly flagged — credibility risk, false alarm
                  fatigue.
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="font-bold text-red-600">FN Cost</p>
                <p className="text-red-500 mt-0.5">
                  Fake news missed — most dangerous; misinformation reaches
                  audience.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-surface-container p-4 rounded-xl border border-outline-variant/40">
          <Info size={18} className="text-secondary shrink-0 mt-0.5" />
          <div className="space-y-2 text-xs text-secondary leading-relaxed">
            <p>
              <strong className="text-on-surface">Academic Note:</strong> This
              model achieves <strong>98.80% accuracy</strong> on the ISOT
              held-out test set, producing exactly{" "}
              <strong>21 misclassifications</strong> (11 FP + 10 FN) from 1,749
              samples.
            </p>
            <p>
              <strong className="text-on-surface">
                ⚠️ Known Bias — Reuters Dateline:
              </strong>{" "}
              The ISOT training dataset's real news articles are{" "}
              <em>almost entirely</em> Reuters wire-service articles beginning
              with{" "}
              <code className="bg-surface-variant px-1 rounded font-mono text-[10px]">
                WASHINGTON (Reuters) -
              </code>
              . As a result, the model has learned this dateline as a very
              strong <em>Real</em> signal. Fake news articles that mimic Reuters
              style will likely be{" "}
              <strong>incorrectly classified as Real</strong>. The sample "Fake
              News" button uses sensationalist/conspiracy-style text (typical of
              ISOT fake articles) to demonstrate correct classification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
