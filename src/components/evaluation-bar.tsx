
"use client";

import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EvaluationBarProps {
  evaluation: number;
}

export function EvaluationBar({ evaluation }: EvaluationBarProps) {
  // Clamp evaluation between -10 and 10, then normalize to 0-100 for the progress bar
  const clampedEval = Math.max(-10, Math.min(10, evaluation));
  const progress = 50 + (clampedEval * 5); // Maps -10 -> 0, 0 -> 50, 10 -> 100

  const advantageText = () => {
    if (evaluation === 0) return "Balanced";
    const side = evaluation > 0 ? "White" : "Black";
    const adv = Math.abs(evaluation).toFixed(1);
    return `${side} has a +${adv} advantage`;
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono text-muted-foreground px-1">
              <span>White</span>
                 <span>{advantageText()}</span>
              <span>Black</span>
            </div>
            <div className="w-full h-4 rounded-full bg-stone-900 border border-border overflow-hidden relative">
              <Progress value={progress} className="h-full rounded-none" />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs text-center">
          <p>Material advantage based on standard piece values.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
