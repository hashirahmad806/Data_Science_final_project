import React, { useEffect, useState } from 'react';
import { Card, CardHeader, MetricCard, StatusChip } from '../components/ui';
import { BookOpen, Cpu, CpuIcon, Award, Settings, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const BADGE = ({ notebook, cell }) => (
  <a href="/notebooks" className="text-[10px] font-mono text-secondary bg-surface-variant hover:bg-primary-container/30 px-2 py-0.5 rounded transition-colors whitespace-nowrap">
    {notebook} → {cell}
  </a>
);

export default function ModelDevelopment() {
  const [models, setModels] = useState(null);

  useEffect(() => {
    fetch('/api/models')
      .then(res => res.json())
      .then(data => setModels(data))
      .catch(err => console.error("Error fetching models:", err));
  }, []);

  if (!models || !models.comparison) return (
    <div className="flex items-center justify-center p-16 text-secondary">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm">Loading models data...</p>
      </div>
    </div>
  );

  const getModelMetrics = (name) => {
    return models.comparison.find(m => m.name === name) || {};
  };

  const baselines = [
    {
      name: 'Logistic Regression (Before SVD)',
      displayName: 'Logistic Regression',
      desc: 'Simple linear classifier that uses a logistic function to model a binary dependent variable.',
      config: 'C=1.0, penalty=l2, solver=lbfgs, max_iter=1000',
      badge: 'Phase2_FE.ipynb',
      cell: 'Cell 10'
    },
    {
      name: 'Naive Bayes',
      displayName: 'Naive Bayes',
      desc: 'Probabilistic classifier based on Bayes\' theorem, assuming strong (naive) independence between features.',
      config: 'alpha=1.0 (Laplace smoothing), fit_prior=True',
      badge: 'Phase2_FE.ipynb',
      cell: 'Cell 12'
    }
  ];

  const advanced = [
    {
      name: 'Random Forest',
      desc: 'Ensemble method building many decision trees on random subsets of data/features and averaging their predictions.',
      config: 'n_estimators=200, max_depth=None, n_jobs=-1, random_state=42',
      badge: 'Phase3_Advanced.ipynb',
      cell: 'Cell 9'
    },
    {
      name: 'SVM (Linear)',
      desc: 'Support Vector Machine classifier finding the optimal decision boundary (hyperplane) that maximizes class margins.',
      config: 'LinearSVC (C=1.0, max_iter=5000) wrapped in CalibratedClassifierCV',
      badge: 'Phase3_Advanced.ipynb',
      cell: 'Cell 12'
    },
    {
      name: 'Gradient Boosting',
      desc: 'Sequential ensemble tree method (via XGBoost) where each new tree corrects the prediction errors of the previous ones.',
      config: 'n_estimators=200, max_depth=6, learning_rate=0.1, random_state=42',
      badge: 'Phase3_Advanced.ipynb',
      cell: 'Cell 15'
    }
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-2">Model Development & Architecture</h2>
          <p className="text-secondary max-w-3xl leading-relaxed">
            Phase 3 explores a range of machine learning classifiers. Starting from baseline linear/probabilistic models, 
            we move to advanced ensemble architectures and support vector machines to achieve robust classification.
          </p>
        </div>
        <Link to="/notebooks" className="flex items-center gap-2 text-xs font-semibold text-primary border border-primary px-3 py-2 rounded hover:bg-surface-variant transition-colors whitespace-nowrap">
          <BookOpen size={14} /> View Notebook
        </Link>
      </div>

      {/* Input Dimensions */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Layers size={18} className="text-primary" /> Training Input Dimensions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-surface-container border border-surface-variant flex items-center justify-between">
            <div>
              <p className="text-xs text-secondary uppercase tracking-wider mb-1">Training Samples</p>
              <p className="text-xl font-bold font-mono text-primary">31,284</p>
            </div>
            <span className="text-[10px] font-mono text-secondary bg-surface-variant px-2.5 py-1 rounded">80% Split</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container border border-surface-variant flex items-center justify-between">
            <div>
              <p className="text-xs text-secondary uppercase tracking-wider mb-1">Testing Samples</p>
              <p className="text-xl font-bold font-mono text-primary">7,821</p>
            </div>
            <span className="text-[10px] font-mono text-secondary bg-surface-variant px-2.5 py-1 rounded">20% Split</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container border border-surface-variant flex items-center justify-between">
            <div>
              <p className="text-xs text-secondary uppercase tracking-wider mb-1">Selected Features</p>
              <p className="text-xl font-bold font-mono text-primary">63</p>
            </div>
            <span className="text-[10px] font-mono text-secondary bg-[#E6F4F1] text-success px-2.5 py-1 rounded font-bold">Optimized</span>
          </div>
        </div>
      </section>

      {/* Baseline Models */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold border-b border-surface-variant pb-2 flex items-center gap-2">
          <Cpu size={20} className="text-secondary" /> Baseline Models (Phase 2)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {baselines.map(b => {
            const m = getModelMetrics(b.name);
            return (
              <Card key={b.name} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <CardHeader 
                    title={b.displayName} 
                    rightElement={<BADGE notebook={b.badge} cell={b.cell} />} 
                  />
                  <p className="text-xs text-secondary mt-2 leading-relaxed">{b.desc}</p>
                  
                  {/* Configuration detail */}
                  <div className="mt-4 p-3 bg-surface-container rounded-lg border border-surface-variant flex gap-2 items-start">
                    <Settings size={14} className="text-secondary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold uppercase text-secondary">sklearn parameters</p>
                      <code className="text-[10px] font-mono text-primary block mt-0.5">{b.config}</code>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6 border-t border-surface-variant pt-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-secondary tracking-wider">Accuracy</p>
                    <p className="text-lg font-bold font-mono text-primary">{(m.accuracy * 100 || 0).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-secondary tracking-wider">F1 Score</p>
                    <p className="text-lg font-bold font-mono text-primary">{(m.f1Score || 0).toFixed(4)}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Advanced Models */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold border-b border-surface-variant pb-2 flex items-center gap-2">
          <Cpu size={20} className="text-primary" /> Advanced ML Models (Phase 3)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {advanced.map(b => {
            const m = getModelMetrics(b.name);
            const isBest = models.best_model_name === b.name;
            return (
              <Card key={b.name} className={`flex flex-col justify-between hover:shadow-md transition-shadow ${isBest ? 'border-primary shadow-sm bg-primary/5' : ''}`}>
                <div>
                  <CardHeader 
                    title={b.name} 
                    rightElement={<BADGE notebook={b.badge} cell={b.cell} />} 
                  />
                  <p className="text-xs text-secondary mt-2 leading-relaxed">{b.desc}</p>
                  
                  {/* Configuration detail */}
                  <div className="mt-4 p-3 bg-surface-container rounded-lg border border-surface-variant flex gap-2 items-start">
                    <Settings size={14} className="text-secondary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold uppercase text-secondary">model configuration</p>
                      <code className="text-[10px] font-mono text-primary block mt-0.5">{b.config}</code>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6 border-t border-surface-variant pt-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-secondary tracking-wider">Accuracy</p>
                    <p className="text-lg font-bold font-mono text-primary">{(m.accuracy * 100 || 0).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-secondary tracking-wider">F1 Score</p>
                    <p className="text-lg font-bold font-mono text-primary">{(m.f1Score || 0).toFixed(4)}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Model Selection Summary */}
      <section>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader
            title="Final Deployed Model Choice"
            subtitle="The model integrated into the VeritasAI live prediction service"
            rightElement={<BADGE notebook="Phase3_Advanced.ipynb" cell="Cell 45" />}
          />
          <div className="flex gap-4 mt-4 p-4 bg-white border border-outline-variant rounded-xl flex-col md:flex-row items-center md:items-start">
            <div className="p-3 bg-primary/10 text-primary rounded-full shrink-0">
              <Award size={32} />
            </div>
            <div>
              <p className="text-base font-bold text-primary mb-1">Random Forest (Tuned) — 99.82% F1 Score</p>
              <p className="text-sm text-secondary leading-relaxed mb-3">
                After comprehensive comparison, the <strong>Tuned Random Forest Classifier</strong> was chosen for production deployment.
                It achieves a near-perfect balance, missing only 21 articles out of 7,821 test samples (14 False Negatives, 7 False Positives).
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono text-secondary">
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#2a9d8f] rounded-full inline-block" /> Accuracy: 99.82%</li>
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#2a9d8f] rounded-full inline-block" /> Precision: 99.86%</li>
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#2a9d8f] rounded-full inline-block" /> Recall: 99.81%</li>
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#2a9d8f] rounded-full inline-block" /> AUC Score: 99.99%</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
