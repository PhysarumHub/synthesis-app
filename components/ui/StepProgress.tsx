"use client";

interface Props {
  currentStep: number;
  totalSteps: number;
  title: string;
}

export default function StepProgress({ currentStep, totalSteps, title }: Props) {
  const pct = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-600">
          Step {currentStep} di {totalSteps}
        </span>
        <span className="text-sm text-slate-500">{pct}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
    </div>
  );
}
