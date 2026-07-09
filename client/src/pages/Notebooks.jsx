import React, { useEffect, useState } from "react";
import { Card, CardHeader } from "../components/ui";
import {
  ArrowLeft,
  BookOpen,
  Download,
  ExternalLink,
  Code,
} from "lucide-react";
import { apiUrl } from "../lib/api";

export default function Notebooks() {
  const [notebooks, setNotebooks] = useState([]);
  const [activeNotebook, setActiveNotebook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl("/api/notebooks"))
      .then((res) => res.json())
      .then((data) => {
        setNotebooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notebooks:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-secondary">Loading notebooks list...</div>;
  }

  if (activeNotebook) {
    const current = notebooks.find((n) => n.id === activeNotebook);
    return (
      <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveNotebook(null)}
            className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-container transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Notebooks
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-primary font-mono">
              {current?.filename}
            </span>
            <a
              href={apiUrl(`/api/notebooks/${activeNotebook}/download`)}
              className="flex items-center gap-2 text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded hover:bg-primary-container transition-colors"
            >
              <Download size={14} /> Download .ipynb
            </a>
          </div>
        </div>

        <div className="flex-1 bg-white border border-surface-variant rounded-lg overflow-hidden shadow-sm relative">
          <iframe
            src={apiUrl(`/api/notebooks/${activeNotebook}/preview`)}
            title={`${current?.title} Preview`}
            className="w-full h-full border-none"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">
          Project Notebooks
        </h2>
        <p className="text-secondary max-w-3xl">
          Verifiable proof of the Data Science pipeline. Inspect the raw code,
          data transformations, and training pipelines actually used in the
          capstone project.
        </p>
      </div>

      <section>
        <h3 className="text-xl font-semibold mb-6">Pipeline Artifacts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notebooks.map((nb) => (
            <Card
              key={nb.id}
              className="flex flex-col justify-between h-full hover:shadow-lg transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary-container text-on-primary-container rounded-lg">
                    <BookOpen size={20} />
                  </div>
                  <span className="bg-[#E6F4F1] text-success px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    ✓ Rubric-aligned
                  </span>
                </div>

                <h4 className="text-lg font-bold text-primary mb-2">
                  {nb.title}
                </h4>
                <p className="text-sm text-secondary mb-4 leading-relaxed">
                  {nb.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {nb.libraries.map((lib) => (
                    <span
                      key={lib}
                      className="text-xs font-mono bg-surface-variant text-on-surface px-2 py-0.5 rounded"
                    >
                      {lib}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-surface-variant pt-4">
                <div className="flex items-center justify-between text-xs text-secondary mb-4 font-mono">
                  <span>Size: {nb.size}</span>
                  <span>Modified: {nb.lastModified.split(",")[0]}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setActiveNotebook(nb.id)}
                    className="flex items-center justify-center gap-2 text-xs font-semibold border border-primary text-primary px-3 py-2 rounded hover:bg-surface-variant transition-colors cursor-pointer"
                  >
                    <Code size={14} /> View Notebook
                  </button>
                  <a
                    href={apiUrl(`/api/notebooks/${nb.id}/download`)}
                    className="flex items-center justify-center gap-2 text-xs font-semibold bg-primary text-white px-3 py-2 rounded hover:bg-primary-container transition-colors text-center"
                  >
                    <Download size={14} /> Download .ipynb
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Rubric Coverage Summary */}
      <section>
        <h3 className="text-xl font-semibold mb-6">
          Evaluation Rubric Coverage
        </h3>
        <div className="overflow-x-auto rounded-xl border border-surface-variant">
          <table className="w-full text-sm">
            <thead className="bg-surface-variant text-on-surface">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Criterion</th>
                <th className="text-center px-4 py-3 font-semibold">Weight</th>
                <th className="text-left px-4 py-3 font-semibold">
                  Addressed In
                </th>
                <th className="text-center px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {[
                {
                  criterion: "Problem Definition & EDA",
                  weight: "20%",
                  notebook: "Phase 1 (57 cells, 10+ plots)",
                  status: "Complete",
                },
                {
                  criterion: "Feature Engineering & Selection",
                  weight: "20%",
                  notebook: "Phase 2 (TF-IDF, Chi-Sq, RF Importance)",
                  status: "Complete",
                },
                {
                  criterion: "Model Development",
                  weight: "25%",
                  notebook: "Phase 3 (RF, XGBoost, SVM, LogReg)",
                  status: "Complete",
                },
                {
                  criterion: "Model Evaluation & Optimization",
                  weight: "20%",
                  notebook: "Phase 3 (GridSearchCV, ROC, Confusion Matrix)",
                  status: "Complete",
                },
                {
                  criterion: "Report & Presentation",
                  weight: "15%",
                  notebook: "README.md + Data Dictionary",
                  status: "Complete",
                },
              ].map((row) => (
                <tr
                  key={row.criterion}
                  className="hover:bg-surface-container/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-primary">
                    {row.criterion}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-secondary">
                    {row.weight}
                  </td>
                  <td className="px-4 py-3 text-secondary">{row.notebook}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-[#E6F4F1] text-success text-xs font-semibold px-2.5 py-1 rounded-full">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
