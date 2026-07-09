import React, { useEffect, useState } from "react";
import { MetricCard, Card, CardHeader } from "../components/ui";
import {
  ShieldAlert,
  Database,
  Cpu,
  Activity,
  ArrowRight,
  ShieldCheck,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { apiUrl } from "../lib/api";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch(apiUrl("/api/summary"))
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch((err) => {
        console.error("Error fetching summary:", err);
        setSummary(fallbackSummary);
      });
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f1f3d] to-[#1a365d] text-white rounded-2xl p-8 md:p-12 shadow-xl border border-[#2a9d8f]/30">
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck size={32} className="text-[#2a9d8f]" />
            <span className="text-[#2a9d8f] font-mono font-bold tracking-wider text-sm">
              VERITAS AI / DATA SCIENCE CAPSTONE
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Combating Misinformation with Machine Learning
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl">
            VeritasAI is an end-to-end Data Science pipeline engineered to
            detect fake news articles with high precision. Built on the ISOT
            Fake News Dataset, this platform demonstrates the complete lifecycle
            of a machine learning project—from raw data cleaning to a deployed
            production classifier.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/classifier"
              className="bg-[#2a9d8f] hover:bg-[#21867a] text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
            >
              Try Live Classifier <ArrowRight size={18} />
            </Link>
            <Link
              to="/notebooks"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
            >
              View Jupyter Notebooks <FileText size={18} />
            </Link>
          </div>
        </div>
        {/* Background abstract shapes */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-[#2a9d8f] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-40 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </section>

      {/* Key Performance Indicators */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <Activity size={20} className="text-[#2a9d8f]" /> Project KPIs
          </h3>
          <span className="text-xs font-mono bg-surface-variant text-secondary px-2.5 py-1 rounded">
            Live DB Sync
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Articles Processed"
            value={summary ? summary.datasetSize.toLocaleString() : "..."}
            subtitle="Cleaned & deduplicated"
          />
          <MetricCard
            title="Models Evaluated"
            value={summary ? summary.modelsCompared : "..."}
            subtitle="Baselines + Ensembles"
          />
          <MetricCard
            title="Best Model Accuracy"
            value={
              summary ? `${(summary.bestAccuracy * 100).toFixed(2)}%` : "..."
            }
            subtitle="Held-out Test Set (20%)"
          />
          <MetricCard
            title="Deployed Model"
            value={summary ? summary.deployedModel : "..."}
            subtitle="Serving via FastAPI"
          />
        </div>
      </section>

      {/* The Data Science Pipeline */}
      <section>
        <h3 className="text-xl font-semibold mb-6">The Methodology Pipeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <Card className="relative z-10 border-t-4 border-t-[#2a9d8f] hover:-translate-y-1 transition-transform duration-300">
            <div className="p-3 bg-[#E6F4F1] w-fit rounded-lg mb-4 text-[#2a9d8f]">
              <Database size={24} />
            </div>
            <div className="text-xs font-bold text-secondary mb-1 tracking-wide uppercase">
              Phase 1
            </div>
            <h4 className="text-lg font-bold mb-3 text-primary">
              Data Quality & EDA
            </h4>
            <p className="text-sm text-secondary leading-relaxed mb-4">
              Raw ISOT dataset cleaning. Handled 28,484 missing values,
              deduplicated records, and identified a critical data leakage
              source (the 'subject' column). Performed deep statistical EDA on
              text features.
            </p>
            <Link
              to="/dataset-eda"
              className="text-xs font-bold text-[#2a9d8f] hover:underline flex items-center gap-1"
            >
              Explore EDA <ArrowRight size={14} />
            </Link>
          </Card>

          <Card className="relative z-10 border-t-4 border-t-blue-500 hover:-translate-y-1 transition-transform duration-300">
            <div className="p-3 bg-blue-50 w-fit rounded-lg mb-4 text-blue-600">
              <FileText size={24} />
            </div>
            <div className="text-xs font-bold text-secondary mb-1 tracking-wide uppercase">
              Phase 2
            </div>
            <h4 className="text-lg font-bold mb-3 text-primary">
              Feature Engineering
            </h4>
            <p className="text-sm text-secondary leading-relaxed mb-4">
              Transformed unstructured text into numerical vectors using TF-IDF
              (5,000 max features, 1-2 n-grams). Applied Chi-Square and Random
              Forest importance to select the top 63 most discriminative
              features.
            </p>
            <Link
              to="/feature-engineering"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              View Features <ArrowRight size={14} />
            </Link>
          </Card>

          <Card className="relative z-10 border-t-4 border-t-[#ba1a1a] hover:-translate-y-1 transition-transform duration-300">
            <div className="p-3 bg-error-container/30 w-fit rounded-lg mb-4 text-error">
              <Cpu size={24} />
            </div>
            <div className="text-xs font-bold text-secondary mb-1 tracking-wide uppercase">
              Phase 3
            </div>
            <h4 className="text-lg font-bold mb-3 text-primary">
              Modeling & Tuning
            </h4>
            <p className="text-sm text-secondary leading-relaxed mb-4">
              Trained 6 baseline and advanced models (LogReg, NB, SVM, XGBoost,
              RF). Conducted hyperparameter tuning via RandomizedSearchCV to
              select the optimal Tuned Random Forest model.
            </p>
            <Link
              to="/evaluation"
              className="text-xs font-bold text-error hover:underline flex items-center gap-1"
            >
              Review Models <ArrowRight size={14} />
            </Link>
          </Card>
        </div>
      </section>

      {/* Project Impact */}
      <section className="bg-surface-container rounded-2xl p-8 border border-surface-variant">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant flex items-center justify-center">
              <ShieldAlert size={80} className="text-amber-500" />
            </div>
          </div>
          <div className="md:w-2/3">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Why Fake News Detection Matters
            </h3>
            <p className="text-secondary leading-relaxed mb-4">
              Misinformation spreads up to six times faster than truthful
              reporting on social media platforms. The inability to
              automatically scale fact-checking operations poses a significant
              threat to public discourse, elections, and public health.
            </p>
            <ul className="space-y-2">
              {[
                "Automates the triage of high-risk articles for human fact-checkers",
                "Demonstrates the power of NLP (Natural Language Processing) on raw text",
                "Provides a highly interpretable model prioritizing critical vocabulary markers",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-secondary"
                >
                  <CheckCircle
                    size={16}
                    className="text-[#2a9d8f] shrink-0 mt-0.5"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
