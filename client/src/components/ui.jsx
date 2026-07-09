import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-surface-variant rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 animate-slide-up ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, rightElement }) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-lg font-bold text-primary tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm text-secondary mt-1">{subtitle}</p>}
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
}

export function MetricCard({ title, value, label, subtitle }) {
  return (
    <Card className="flex flex-col justify-between">
      <div>
        <p className="text-sm font-semibold text-secondary uppercase tracking-wider">{title}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-4xl font-bold font-mono text-primary tracking-tight">{value}</span>
          {label && <span className="text-sm font-semibold text-success bg-[#E6F4F1] px-2 py-0.5 rounded-full">{label}</span>}
        </div>
      </div>
      {subtitle && <p className="text-xs text-secondary mt-4 border-t border-surface-variant pt-2">{subtitle}</p>}
    </Card>
  );
}

export function StatusChip({ status }) {
  const isReal = status === 'Real' || status === 'Success';
  const isFake = status === 'Fake' || status === 'Error';
  
  let colors = 'bg-surface-variant text-on-surface';
  if (isReal) colors = 'bg-[#E6F4F1] text-success border border-success/20';
  if (isFake) colors = 'bg-error-container text-on-error-container border border-error/20';

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${colors}`}>
      {status}
    </span>
  );
}
