
"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Award, ChevronsUp, RefreshCw } from "lucide-react";

interface GameOverDialogProps {
  open: boolean;
  status: string;
  onRematch: () => void;
  onIncreaseDifficulty: () => void;
  canIncreaseDifficulty: boolean;
}

export function GameOverDialog({
  open,
  status,
  onRematch,
  onIncreaseDifficulty,
  canIncreaseDifficulty
}: GameOverDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-3xl text-primary flex items-center gap-2">
            <Award /> Game Over
          </AlertDialogTitle>
          <AlertDialogDescription className="font-body text-lg pt-2">
            {status}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={onRematch}>
            <RefreshCw className="mr-2 h-4 w-4" /> Rematch
          </Button>
          {canIncreaseDifficulty && (
            <Button onClick={onIncreaseDifficulty} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <ChevronsUp className="mr-2 h-4 w-4" /> Increase Difficulty & Rematch
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
