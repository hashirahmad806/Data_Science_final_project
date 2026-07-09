import React, { useEffect, useState } from "react";
import { Card, CardHeader } from "../components/ui";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  BookOpen,
  ChevronRight,
  Layers,
  Filter,
  GitBranch,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { apiUrl } from "../lib/api";

const BADGE = ({ cell }) => (
  <a
    href="/notebooks"
    className="text-[10px] font-mono text-secondary bg-surface-variant hover:bg-primary-container/30 px-2 py-0.5 rounded transition-colors whitespace-nowrap"
  >
    Phase2_FE.ipynb → {cell}
  </a>
);

export default function FeatureEngineering() {
  const [features, setFeatures] = useState(null);

  useEffect(() => {
    fetch(apiUrl("/api/features"))
      .then((res) => res.json())
      .then((data) => setFeatures(data))
      .catch((err) => {
        console.error("Error fetching features:", err);
        setFeatures(fallbackFeatures);
      });
  }, []);

  if (!features)
    return (
      <div className="flex items-center justify-center p-16 text-secondary">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm">Loading feature data...</p>
        </div>
      </div>
    );

  const vc = features.vectorizer_config || {};
  const fm = features.feature_matrix || {};
  const steps = features.engineering_steps || [];
  const selMethods = features.selection_methods || [];
  const topFeatures = features.top_tfidf_features || [];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-2">
            Feature Engineering & Selection
          </h2>
          <p className="text-secondary max-w-3xl leading-relaxed">
            Phase 2 transforms raw text into machine-learnable features using{" "}
            <span className="font-semibold text-primary">
              TF-IDF Vectorization
            </span>{" "}
            (5,000 features, 1–2 grams), numeric feature scaling, and two
            selection methods. The output feeds directly into Phase 3 models.
          </p>
        </div>
        <Link
          to="/notebooks"
          className="flex items-center gap-2 text-xs font-semibold text-primary border border-primary px-3 py-2 rounded hover:bg-surface-variant transition-colors whitespace-nowrap"
        >
          <BookOpen size={14} /> View Notebook
        </Link>
      </div>

      {/* Feature Matrix Stats */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Layers size={18} className="text-primary" /> Feature Matrix
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Train Samples",
              value: (fm.train_samples || 0).toLocaleString(),
              sub: "80% stratified split",
            },
            {
              label: "Test Samples",
              value: (fm.test_samples || 0).toLocaleString(),
              sub: "20% held-out set",
            },
            {
              label: "TF-IDF Features",
              value: vc.max_features?.toLocaleString() || "5,000",
              sub: "After vectorization",
            },
            {
              label: "Selected Features",
              value: (fm.n_features || 63).toLocaleString(),
              sub: "After Chi-Sq + RF selection",
            },
          ].map(({ label, value, sub }) => (
            <div
              key={label}
              className="p-4 rounded-xl bg-surface-container border border-surface-variant"
            >
              <p className="text-xs text-secondary uppercase tracking-wider mb-1">
                {label}
              </p>
              <p className="text-2xl font-bold font-mono text-primary">
                {value}
              </p>
              <p className="text-xs text-secondary mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline Steps */}
      <section>
        <Card>
          <CardHeader
            title="Feature Engineering Pipeline"
            subtitle="Ordered steps applied to transform raw ISOT data into the final feature matrix"
            rightElement={<BADGE cell="Cell 3–7" />}
          />
          <div className="mt-4 space-y-0">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-4 relative">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 z-10">
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-0.5 h-8 bg-surface-variant mt-1" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="text-sm font-semibold text-primary">{s.step}</p>
                  <p className="text-xs text-secondary mt-0.5">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* TF-IDF Config + Selection Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader
            title="TF-IDF Vectorizer Configuration"
            subtitle="Parameters used for text feature extraction"
            rightElement={<BADGE cell="Cell 5" />}
          />
          <div className="space-y-3 mt-4">
            {[
              [
                "Max Features",
                vc.max_features?.toLocaleString() || "5,000",
                "Vocabulary capped to reduce dimensionality",
              ],
              [
                "N-Gram Range",
                `(${vc.ngram_range?.[0] || 1}, ${vc.ngram_range?.[1] || 2})`,
                "Unigrams + bigrams — captures phrase-level patterns",
              ],
              [
                "Stop Words",
                vc.stop_words || "english",
                "Removes 'the', 'is', 'and', etc.",
              ],
              [
                "Min Document Freq",
                vc.min_df || 5,
                "Terms must appear in ≥5 docs",
              ],
              [
                "Max Document Freq",
                `${((vc.max_df || 1.0) * 100).toFixed(0)}%`,
                "Removes terms in >100% of docs (none removed)",
              ],
              [
                "Sublinear TF",
                vc.sublinear_tf ? "True" : "False",
                "Standard TF (not log-scaled)",
              ],
            ].map(([k, v, hint]) => (
              <div
                key={k}
                className="flex items-start justify-between border-b border-surface-variant pb-3"
              >
                <div>
                  <p className="text-sm font-medium text-on-surface">{k}</p>
                  <p className="text-xs text-secondary">{hint}</p>
                </div>
                <span className="font-mono text-sm font-bold text-primary ml-4">
                  {v}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Feature Selection Methods"
            subtitle="Two complementary approaches used to select the most informative features"
            rightElement={<BADGE cell="Cell 6–7" />}
          />
          <div className="space-y-6 mt-4">
            {selMethods.map((m, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-surface-variant bg-surface-container"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Filter size={16} className="text-primary" />
                  <p className="text-sm font-bold text-primary">{m.name}</p>
                  <span className="ml-auto text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {m.type}
                  </span>
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  {m.description}
                </p>
              </div>
            ))}
            <div className="p-4 rounded-xl border border-[#2a9d8f]/30 bg-[#E6F4F1]">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch size={16} className="text-[#2a9d8f]" />
                <p className="text-sm font-bold text-[#2a9d8f]">
                  Result: 63 Final Features
                </p>
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                From 5,000 raw TF-IDF features down to 63 highly informative
                features — a 98.7% dimensionality reduction while maintaining
                99.8% classification accuracy.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Features Chart */}
      <section>
        <Card>
          <CardHeader
            title="Top 20 TF-IDF Features by Corpus Importance"
            subtitle="Terms with highest cumulative TF-IDF scores across the training corpus"
            rightElement={<BADGE cell="Cell 8" />}
          />
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topFeatures.slice(0, 20).map((f) => ({
                  ...f,
                  importance: parseFloat(f.importance.toFixed(2)),
                }))}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#E2E8F0"
                />
                <XAxis
                  type="number"
                  tick={{
                    fontSize: 11,
                    fill: "#545F72",
                    fontFamily: "JetBrains Mono",
                  }}
                />
                <YAxis
                  dataKey="term"
                  type="category"
                  tick={{
                    fontSize: 11,
                    fill: "#0f1f3d",
                    fontFamily: "JetBrains Mono",
                  }}
                  width={75}
                />
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="importance"
                  name="TF-IDF Score"
                  fill="#0f1f3d"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-secondary mt-3 italic">
            High-scoring terms like "trump", "said", "president" appear
            frequently in both classes — but with different surrounding context,
            making them strong discriminative signals.
          </p>
        </Card>
      </section>

      {/* Key Insight */}
      <section>
        <Card>
          <CardHeader
            title="Key Feature Engineering Insight"
            subtitle="The most important finding from this phase"
            rightElement={<BADGE cell="Cell 9" />}
          />
          <div className="flex gap-4 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertTriangle
              size={20}
              className="text-amber-500 shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">
                Data Leakage: 'subject' column dropped
              </p>
              <p className="text-sm text-amber-700 leading-relaxed">
                The 'subject' column perfectly separates Real vs Fake news (Real
                = politicsNews/worldnews, Fake = News/left-news/etc.). Including
                it would inflate accuracy to ~100% — but model would fail on any
                real-world deployment. Decision:{" "}
                <strong>dropped before feature matrix creation</strong>.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
