"use client";

import { useState } from 'react';
import type { Board, Square, Piece, Color, Move } from '@/lib/types';
import { ChessPiece } from '@/components/chess-piece';
import { cn } from '@/lib/utils';

interface ChessBoardProps {
  board: Board;
  turn: Color;
  onMove: (from: Square, to: Square) => void;
  lastMove: { from: Square; to: Square } | null;
  shiningPiece: Square | null;
  validMoves: Move[];
}

export default function ChessBoard({ board, onMove, turn, lastMove, shiningPiece, validMoves }: ChessBoardProps) {
  const [fromSquare, setFromSquare] = useState<Square | null>(null);

  const handleSquareClick = (square: Square) => {
    const piece = getPieceAtSquare(square);

    if (fromSquare) {
      const isMoveValid = validMoves.some(m => m.from === fromSquare && m.to === square);
      if (isMoveValid) {
        onMove(fromSquare, square);
        setFromSquare(null);
      } else if (piece && piece.color === turn) {
        setFromSquare(square);
      } else {
        setFromSquare(null);
      }
    } else if (piece && piece.color === turn) {
      setFromSquare(square);
    }
  };

  const getPieceAtSquare = (square: Square): Piece | null => {
    const row = 8 - parseInt(square[1], 10);
    const col = square.charCodeAt(0) - 'a'.charCodeAt(0);
    return board[row]?.[col] || null;
  };

  const fromSquareMoves = fromSquare ? validMoves.filter(m => m.from === fromSquare).map(m => m.to) : [];

  return (
    <div className="grid grid-cols-8 aspect-square rounded-lg overflow-hidden shadow-2xl border-4 border-card/80 bg-card">
      {Array.from({ length: 64 }).map((_, index) => {
        const row = Math.floor(index / 8);
        const col = index % 8;
        const square = String.fromCharCode('a'.charCodeAt(0) + col) + (8 - row) as Square;
        const piece = getPieceAtSquare(square);
        const isDark = (row + col) % 2 !== 0;

        const isLastMoveSquare = lastMove && (square === lastMove.from || square === lastMove.to);
        const isSelectedSquare = fromSquare === square;
        const isPossibleMove = fromSquareMoves.includes(square);
        const isCaptureMove = isPossibleMove && !!getPieceAtSquare(square);
        
        return (
          <div
            key={square}
            onClick={() => handleSquareClick(square)}
            className={cn(
              'flex justify-center items-center relative group',
              isDark ? 'bg-secondary/40' : 'bg-card/20',
              turn === getPieceAtSquare(square)?.color && 'cursor-pointer',
            )}
          >
            {isLastMoveSquare && <div className="absolute inset-0 bg-accent/30" />}
            {isSelectedSquare && <div className="absolute inset-0 bg-primary/40" />}
            
            {piece && (
              <ChessPiece
                piece={piece}
                isEvolving={shiningPiece === square}
              />
            )}
            
            {isPossibleMove && !isCaptureMove && (
              <div className="absolute w-1/4 h-1/4 rounded-full bg-primary/50 opacity-50 group-hover:opacity-100" />
            )}
            {isCaptureMove && (
              <div className="absolute inset-1 rounded-full border-4 border-destructive/50 opacity-80 group-hover:opacity-100" />
            )}
          </div>
        );
      })}
    </div>
  );
}
