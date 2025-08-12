"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { PieceSymbol } from "@/lib/types";

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

export function EvolutionDialog({ open, piece, onEvolve }: EvolutionDialogProps) {
  const pieceName = pieceNames[piece.toLowerCase() as PieceSymbol];

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onEvolve(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-2xl text-primary">A choice awaits!</AlertDialogTitle>
          <AlertDialogDescription className="font-body text-base">
            Your {pieceName} has captured an enemy piece. Do you wish to evolve it to the next form?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onEvolve(false)}>Keep as {pieceName}</Button>
          <Button onClick={() => onEvolve(true)}>Evolve!</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
