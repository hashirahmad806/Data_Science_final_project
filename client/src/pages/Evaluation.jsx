import React, { useEffect, useState } from "react";
import { Card, CardHeader } from "../components/ui";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  BookOpen,
  Settings,
  Sliders,
  Activity,
  Minimize2,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { apiUrl } from "../lib/api";

const BADGE = ({ cell }) => (
  <a
    href="/notebooks"
    className="text-[10px] font-mono text-secondary bg-surface-variant hover:bg-primary-container/30 px-2 py-0.5 rounded transition-colors whitespace-nowrap"
  >
    Phase3_Advanced.ipynb → {cell}
  </a>
);

export default function Evaluation() {
  const [models, setModels] = useState(null);

  useEffect(() => {
    fetch(apiUrl("/api/models"))
      .then((res) => res.json())
      .then((data) => setModels(data))
      .catch((err) => console.error("Error fetching models:", err));
  }, []);

  if (!models || !models.comparison)
    return (
      <div className="flex items-center justify-center p-16 text-secondary">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm">Loading evaluation data...</p>
        </div>
      </div>
    );

  const chartData = models.comparison.map((m) => ({
    name: m.name.replace("Logistic Regression", "LR"),
    Accuracy: Number((m.accuracy * 100).toFixed(2)),
    Precision: Number((m.precision * 100).toFixed(2)),
    Recall: Number((m.recall * 100).toFixed(2)),
    F1: Number((m.f1Score * 100).toFixed(2)),
    AUC: m.auc ? Number((m.auc * 100).toFixed(2)) : null,
  }));

  // Select top 3 models for the Radar chart comparison to keep it clean
  const radarModels = models.comparison.filter((m) =>
    ["Random Forest (Tuned)", "Gradient Boosting", "SVM (Linear)"].includes(
      m.name,
    ),
  );

  const radarData = [
    {
      metric: "Accuracy",
      ...radarModels.reduce(
        (acc, m) => ({
          ...acc,
          [m.name]: Number((m.accuracy * 100).toFixed(2)),
        }),
        {},
      ),
    },
    {
      metric: "Precision",
      ...radarModels.reduce(
        (acc, m) => ({
          ...acc,
          [m.name]: Number((m.precision * 100).toFixed(2)),
        }),
        {},
      ),
    },
    {
      metric: "Recall",
      ...radarModels.reduce(
        (acc, m) => ({ ...acc, [m.name]: Number((m.recall * 100).toFixed(2)) }),
        {},
      ),
    },
    {
      metric: "F1 Score",
      ...radarModels.reduce(
        (acc, m) => ({
          ...acc,
          [m.name]: Number((m.f1Score * 100).toFixed(2)),
        }),
        {},
      ),
    },
  ];

  const cm = models.confusion_matrix || [
    [0, 0],
    [0, 0],
  ];
  const gs = models.grid_search;
  const svd = models.svd_analysis;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-2">
            Model Evaluation & Optimization
          </h2>
          <p className="text-secondary max-w-3xl leading-relaxed">
            Phase 3 evaluates all candidate models on the held-out test set
            (7,821 samples). We compare performance across multiple metrics,
            perform hyperparameter tuning, analyze overfitting characteristics,
            and evaluate the final confusion matrix.
          </p>
        </div>
        <Link
          to="/notebooks"
          className="flex items-center gap-2 text-xs font-semibold text-primary border border-primary px-3 py-2 rounded hover:bg-surface-variant transition-colors whitespace-nowrap"
        >
          <BookOpen size={14} /> View Notebook
        </Link>
      </div>

      {/* Main Bar Chart & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader
            title="Performance Comparison"
            subtitle="Test set evaluation across metrics"
            rightElement={<BADGE cell="Cell 10" />}
          />
          <div className="h-[350px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#545F72" }}
                  interval={0}
                />
                <YAxis
                  domain={[95, 100]}
                  tick={{
                    fontSize: 11,
                    fill: "#545F72",
                    fontFamily: "JetBrains Mono",
                  }}
                />
                <RechartsTooltip
                  cursor={{ fill: "#f5f3f6" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "10px", fontSize: "11px" }}
                />
                <Bar dataKey="Accuracy" fill="#0f1f3d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="F1" fill="#2a9d8f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Multi-Metric Model Profile"
            subtitle="Radar comparison of Top 3 Advanced Models"
            rightElement={<BADGE cell="Cell 10" />}
          />
          <div className="h-[350px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: "#0f1f3d", fontSize: 12, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[99, 100]}
                  tick={{ fontSize: 10, fill: "#545F72" }}
                />
                <Radar
                  name="Random Forest (Tuned)"
                  dataKey="Random Forest (Tuned)"
                  stroke="#2a9d8f"
                  fill="#2a9d8f"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Gradient Boosting"
                  dataKey="Gradient Boosting"
                  stroke="#0f1f3d"
                  fill="#0f1f3d"
                  fillOpacity={0.2}
                />
                <Radar
                  name="SVM (Linear)"
                  dataKey="SVM (Linear)"
                  stroke="#e9c46a"
                  fill="#e9c46a"
                  fillOpacity={0.2}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "10px", fontSize: "11px" }}
                />
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Overfitting Analysis Section */}
      <section>
        <Card className="bg-[#E6F4F1]/30 border-[#2a9d8f]/30">
          <CardHeader
            title="Overfitting vs Underfitting Analysis"
            subtitle="Assessing Model Generalization"
            rightElement={<BADGE cell="Cell 9" />}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="col-span-1 p-4 bg-white rounded-xl border border-outline-variant shadow-sm flex flex-col justify-center">
              <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                Train vs Test Gap
              </p>
              <div className="flex items-end gap-4 mb-2">
                <div>
                  <p className="text-[10px] text-secondary">
                    Training Accuracy
                  </p>
                  <p className="text-2xl font-bold font-mono text-primary">
                    ~100.0%
                  </p>
                </div>
                <div className="text-secondary pb-1">-</div>
                <div>
                  <p className="text-[10px] text-secondary">Test Accuracy</p>
                  <p className="text-2xl font-bold font-mono text-[#2a9d8f]">
                    99.82%
                  </p>
                </div>
              </div>
              <p className="text-xs font-mono text-secondary bg-surface-variant p-2 rounded">
                Gap: 0.18%
              </p>
            </div>

            <div className="col-span-2 flex flex-col justify-center">
              <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                <CheckCircle size={16} className="text-[#2a9d8f]" /> Exceptional
                Generalization
              </h4>
              <p className="text-sm text-secondary leading-relaxed mb-3">
                A common concern with powerful models like Random Forest is{" "}
                <strong>overfitting</strong> (memorizing the training data but
                failing on unseen data).
              </p>
              <p className="text-sm text-secondary leading-relaxed">
                Our analysis shows a negligible <strong>0.18% gap</strong>{" "}
                between training and test performance. This confirms the model
                is highly robust and correctly generalizes the underlying
                linguistic patterns rather than just memorizing articles.
                Underfitting is also ruled out given the near-perfect baseline
                scores.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Confusion Matrix */}
        <Card>
          <CardHeader
            title={`Confusion Matrix`}
            subtitle={`Test set results for deployed ${models.best_model_name}`}
            rightElement={<BADGE cell="Cell 12" />}
          />
          <div className="flex flex-col items-center justify-center p-6">
            <div className="grid grid-cols-[auto_1fr_1fr] gap-2 text-center w-full">
              {/* Empty top-left */}
              <div></div>
              <div className="text-xs font-bold text-secondary tracking-wider uppercase mb-2">
                Predicted Fake
              </div>
              <div className="text-xs font-bold text-secondary tracking-wider uppercase mb-2">
                Predicted Real
              </div>

              <div className="text-xs font-bold text-secondary tracking-wider uppercase writing-vertical-lr rotate-180 flex items-center justify-center mr-2">
                Actual Fake
              </div>
              <div className="bg-[#E6F4F1] border border-[#2a9d8f]/30 text-on-surface font-bold p-6 rounded-xl flex flex-col justify-center items-center">
                <span className="text-[10px] text-success uppercase tracking-wider mb-1">
                  True Negative
                </span>
                <span className="text-3xl font-mono text-[#2a9d8f]">
                  {cm[0][0].toLocaleString()}
                </span>
              </div>
              <div className="bg-error-container/30 border border-error/20 text-on-surface font-bold p-6 rounded-xl flex flex-col justify-center items-center">
                <span className="text-[10px] text-error uppercase tracking-wider mb-1">
                  False Positive
                </span>
                <span className="text-3xl font-mono text-error">
                  {cm[0][1].toLocaleString()}
                </span>
              </div>

              <div className="text-xs font-bold text-secondary tracking-wider uppercase writing-vertical-lr rotate-180 flex items-center justify-center mr-2">
                Actual Real
              </div>
              <div className="bg-error-container/30 border border-error/20 text-on-surface font-bold p-6 rounded-xl flex flex-col justify-center items-center">
                <span className="text-[10px] text-error uppercase tracking-wider mb-1">
                  False Negative
                </span>
                <span className="text-3xl font-mono text-error">
                  {cm[1][0].toLocaleString()}
                </span>
              </div>
              <div className="bg-[#E6F4F1] border border-[#2a9d8f]/30 text-on-surface font-bold p-6 rounded-xl flex flex-col justify-center items-center">
                <span className="text-[10px] text-success uppercase tracking-wider mb-1">
                  True Positive
                </span>
                <span className="text-3xl font-mono text-[#2a9d8f]">
                  {cm[1][1].toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-secondary mt-2 italic text-center">
            Total Test Samples: 7,821. The model made only 21 incorrect
            predictions out of 7,821.
          </p>
        </Card>

        <div className="space-y-8">
          {/* Hyperparameter Tuning */}
          {gs && (
            <Card>
              <CardHeader
                title="Hyperparameter Tuning"
                subtitle={`Random Forest Optimization via ${gs.method}`}
                rightElement={<BADGE cell="Cell 15" />}
              />
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex gap-2 items-center text-sm text-secondary">
                    <Sliders size={16} className="text-primary" /> CV Folds:{" "}
                    {gs.cv_folds}
                  </div>
                  <div className="flex gap-2 items-center text-sm text-secondary">
                    <Activity size={16} className="text-primary" /> Iterations:{" "}
                    {gs.n_iter}
                  </div>
                </div>

                <div className="bg-surface-container p-4 rounded-xl border border-surface-variant">
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-2">
                    Best Parameters Found
                  </p>
                  <pre className="text-sm font-mono text-primary whitespace-pre-wrap">
                    {JSON.stringify(gs.best_params, null, 2)}
                  </pre>
                </div>
                <div className="flex items-center justify-between p-4 border border-outline-variant rounded-xl bg-white">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-secondary">
                      Before Tuning
                    </p>
                    <p className="text-lg font-bold font-mono">
                      {(gs.before_accuracy * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div className="text-2xl text-secondary">&rarr;</div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-secondary">
                      After Tuning
                    </p>
                    <p className="text-lg font-bold font-mono text-[#2a9d8f]">
                      {(gs.after_accuracy * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Dimensionality Reduction */}
          {svd && (
            <Card>
              <CardHeader
                title="Dimensionality Reduction"
                subtitle={svd.method}
                rightElement={<BADGE cell="Cell 21" />}
              />
              <div className="mt-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Minimize2 size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      Target: {svd.n_components} Components
                    </p>
                    <p className="text-xs text-secondary">
                      Reduced sparse TF-IDF matrix into dense components.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-surface-variant rounded-xl bg-surface-container">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-secondary">
                      Before SVD (LogReg)
                    </p>
                    <p className="text-base font-bold font-mono text-primary">
                      {(svd.before_accuracy * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div className="text-lg text-secondary">&rarr;</div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-secondary">
                      After SVD (LogReg)
                    </p>
                    <p className="text-base font-bold font-mono text-primary">
                      {(svd.after_accuracy * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
                <p className="text-xs text-secondary mt-3 italic leading-relaxed">
                  {svd.note}
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
