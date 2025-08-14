
"use client";

import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Loader } from "./ui/loader";

interface EvaluationBarProps {
  evaluation: number;
  reason?: string;
  isEvaluating: boolean;
  isDisabled: boolean;
}

export function EvaluationBar({ evaluation, reason, isEvaluating, isDisabled }: EvaluationBarProps) {
  // Clamp evaluation between -10 and 10, then normalize to 0-100 for the progress bar
  const clampedEval = Math.max(-10, Math.min(10, evaluation));
  const progress = 50 + (clampedEval * 5); // Maps -10 -> 0, 0 -> 50, 10 -> 100

  const advantageText = () => {
    if (isDisabled) return "Evaluation disabled.";
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
              <div className="flex items-center gap-2">
                 {isEvaluating && !isDisabled && <Loader className="h-4 w-4" />}
                 <span className={cn(isDisabled && "text-destructive")}>{advantageText()}</span>
              </div>
              <span>Black</span>
            </div>
            <div className="w-full h-4 rounded-full bg-stone-900 border border-border overflow-hidden relative">
              <Progress value={progress} className="h-full rounded-none" />
              {isDisabled && <div className="absolute inset-0 bg-destructive/50 flex items-center justify-center text-destructive-foreground text-xs font-bold">DISABLED</div>}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs text-center">
          <p>{isDisabled ? "API rate limit reached." : (reason || "AI analysis of the current board position.")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
