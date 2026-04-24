"use client";

import clsx from "clsx";

interface Props {
  onBack?: () => void;
  onNext?: () => void;
  isLast?: boolean;
  isLoading?: boolean;
  nextLabel?: string;
  backLabel?: string;
}

export default function StepNav({
  onBack,
  onNext,
  isLast,
  isLoading,
  nextLabel = "Avanti",
  backLabel = "Indietro",
}: Props) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
      <button
        type="button"
        onClick={onBack}
        disabled={!onBack}
        className={clsx(
          "px-5 py-2 rounded-lg text-sm font-medium transition",
          onBack
            ? "text-slate-700 border border-slate-300 hover:bg-slate-50"
            : "invisible"
        )}
      >
        ← {backLabel}
      </button>
      <button
        type={onNext ? "button" : "submit"}
        onClick={onNext}
        disabled={isLoading}
        className={clsx(
          "px-6 py-2 rounded-lg text-sm font-medium text-white transition",
          isLast
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-700",
          isLoading && "opacity-70 cursor-not-allowed"
        )}
      >
        {isLoading ? "Salvataggio..." : isLast ? "Invia" : `${nextLabel} →`}
      </button>
    </div>
  );
}
