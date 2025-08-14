
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
import type { StoryLevel } from "@/lib/story-mode";
import { BookOpen } from "lucide-react";

interface PuzzleDialogProps {
  open: boolean;
  level: StoryLevel;
  levelNumber: number;
  onStart: () => void;
}

export function PuzzleDialog({ open, level, levelNumber, onStart }: PuzzleDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-3xl text-primary flex items-center gap-2">
            <BookOpen /> Chapter {levelNumber}: {level.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="font-body text-lg pt-2">
            {level.narrative}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 text-center font-bold text-xl bg-secondary/50 rounded-md">
            Objective: {level.objective}
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
