
"use client";

import { cn } from "@/lib/utils";

interface EvaluationBarProps {
  evaluation: number;
  isEvaluating: boolean;
}

const MAX_EVAL = 10;

export function EvaluationBar({ evaluation, isEvaluating }: EvaluationBarProps) {
  // Clamp the evaluation to be within -MAX_EVAL and MAX_EVAL
  const clampedEval = Math.max(-MAX_EVAL, Math.min(MAX_EVAL, evaluation));

  // Convert evaluation to a percentage. 50% is equal.
  // The scale is mapped so that -MAX_EVAL is 0%, 0 is 50%, and +MAX_EVAL is 100%.
  const whiteAdvantagePercent = ((clampedEval + MAX_EVAL) / (2 * MAX_EVAL)) * 100;
  const blackAdvantagePercent = 100 - whiteAdvantagePercent;

  const displayEval = (evaluation / 1).toFixed(1);

  return (
    <div className="flex flex-col items-center h-full">
      <div className="relative w-8 h-[65vh] lg:h-[calc(100vh-12rem)] bg-stone-900 rounded-full overflow-hidden border-2 border-primary/20 flex flex-col">
        <div
          className="bg-stone-50 transition-all duration-500"
          style={{ height: `${blackAdvantagePercent}%` }}
        />
        <div
          className="bg-stone-900"
          style={{ height: `${whiteAdvantagePercent}%` }}
        />
        {isEvaluating && (
           <div className="absolute inset-0 bg-primary/20 animate-pulse" />
        )}
      </div>
       <div className="mt-2 text-center font-bold text-lg text-foreground bg-background/50 px-2 py-1 rounded-md">
        {evaluation > 0 ? `+${displayEval}` : displayEval}
      </div>
    </div>
  );
}

    