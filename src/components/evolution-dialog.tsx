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
import type { PieceSymbol } from "@/lib/types";
import { ArrowRight } from "lucide-react";

interface EvolutionDialogProps {
  open: boolean;
  piece: PieceSymbol;
  onEvolve: (evolve: boolean) => void;
}

const pieceNames: Record<PieceSymbol, string> = {
  p: "Pawn",
  n: "Knight",
  b: "Bishop",
  r: "Rook",
  q: "Queen",
  k: "King",
};

const evolutionPath: Partial<Record<PieceSymbol, PieceSymbol>> = {
    p: 'n', n: 'b', b: 'r', r: 'q',
};

export function EvolutionDialog({ open, piece, onEvolve }: EvolutionDialogProps) {
  const pieceName = pieceNames[piece.toLowerCase() as PieceSymbol];
  const nextFormKey = evolutionPath[piece.toLowerCase() as PieceSymbol];
  const nextForm = nextFormKey ? pieceNames[nextFormKey] : '';

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onEvolve(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-3xl text-primary">A Choice of Power!</AlertDialogTitle>
          <AlertDialogDescription className="font-body text-lg pt-2">
            Your {pieceName} has vanquished a foe! Will you allow it to ascend to its next form?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center justify-center gap-4 text-2xl font-headline py-4">
            <span className="text-foreground">{pieceName}</span>
            <ArrowRight className="text-accent" />
            <span className="text-primary">{nextForm}</span>
        </div>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={() => onEvolve(false)}>Remain a {pieceName}</Button>
          <Button onClick={() => onEvolve(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Evolve to a {nextForm}!
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
