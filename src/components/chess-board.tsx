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
    <div className="grid grid-cols-8 aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-card">
      {board.flat().map((piece, index) => {
        const row = Math.floor(index / 8);
        const col = index % 8;
        const square = String.fromCharCode('a'.charCodeAt(0) + col) + (8 - row) as Square;
        const isDark = (row + col) % 2 !== 0;

        const isLastMoveSquare = lastMove && (square === lastMove.from || square === lastMove.to);
        const isSelectedSquare = fromSquare === square;
        const isPossibleMove = fromSquareMoves.includes(square);
        
        return (
          <div
            key={square}
            onClick={() => handleSquareClick(square)}
            className={cn(
              'flex justify-center items-center relative cursor-pointer',
              isDark ? 'bg-secondary' : 'bg-background',
              turn === getPieceAtSquare(square)?.color && 'hover:bg-accent/30',
            )}
          >
            {isLastMoveSquare && <div className="absolute inset-0 bg-accent/40" />}
            {isSelectedSquare && <div className="absolute inset-0 bg-primary/40 ring-2 ring-primary" />}
            
            {piece && (
              <ChessPiece
                piece={piece}
                isEvolving={shiningPiece === square}
              />
            )}
            
            {isPossibleMove && (
              <div className="absolute w-1/3 h-1/3 rounded-full bg-primary/50" />
            )}

            <span className="absolute bottom-0 left-1 text-xs font-mono text-foreground/20 select-none">
              {square}
            </span>
          </div>
        );
      })}
    </div>
  );
}
