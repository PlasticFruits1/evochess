
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
import type { Puzzle } from "@/lib/story-mode";
import { BookOpen } from "lucide-react";

interface PuzzleDialogProps {
  open: boolean;
  puzzle: Puzzle;
  levelNumber: number;
  onStart: () => void;
}

export function PuzzleDialog({ open, puzzle, levelNumber, onStart }: PuzzleDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-3xl text-primary flex items-center gap-2">
            <BookOpen /> Chapter {levelNumber}: {puzzle.tags.join(', ')}
          </AlertDialogTitle>
          <AlertDialogDescription className="font-body text-lg pt-2">
            A new challenge appears on the horizon.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 text-center font-bold text-xl bg-secondary/50 rounded-md">
            Objective: {puzzle.goal.replace(/-/g, ' ')}
        </div>
        <AlertDialogFooter>
          <Button onClick={onStart} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Begin Challenge
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
