
"use client";

import { useState, useEffect } from 'react';
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
  playerColor: Color;
}

export default function ChessBoard({ board, onMove, turn, lastMove, shiningPiece, validMoves, playerColor }: ChessBoardProps) {
  const [fromSquare, setFromSquare] = useState<Square | null>(null);

  const handleSquareClick = (square: Square) => {
    const piece = getPieceAtSquare(square);

    if (fromSquare) {
      // Check if the move is valid by searching the validMoves array
      const isMoveValid = validMoves.some(m => m.from === fromSquare && m.to === square);
      
      if (isMoveValid) {
        onMove(fromSquare, square);
        setFromSquare(null);
      } else if (piece && piece.color === turn) {
        // If the user clicks on another of their pieces, select it
        setFromSquare(square);
      } else {
        // If the user clicks an empty square or an opponent's piece (not a valid move), deselect
        setFromSquare(null);
      }
    } else if (piece && piece.color === turn) {
      // If no piece is selected, and user clicks on their own piece, select it
      setFromSquare(square);
    }
  };

  const getPieceAtSquare = (square: Square): Piece | null => {
    const rank = playerColor === 'w' ? 8 - parseInt(square[1], 10) : parseInt(square[1], 10) - 1;
    const file = playerColor === 'w' ? square.charCodeAt(0) - 'a'.charCodeAt(0) : 'h'.charCodeAt(0) - square.charCodeAt(0);
    return board[rank]?.[file] || null;
  };

  const possibleMovesForSelectedPiece = fromSquare ? validMoves.filter(m => m.from === fromSquare).map(m => m.to) : [];

  const ranks = playerColor === 'w' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
  const files = playerColor === 'w' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];

  return (
    <div className="w-full h-full">
      <div className={cn("grid grid-cols-8 grid-rows-8 aspect-square rounded-lg overflow-hidden shadow-2xl border-2 border-primary/20 bg-primary/10", playerColor === 'b' && "rotate-180")}>
        {ranks.flatMap(rank =>
          files.map(file => {
            const square = `${file}${rank}` as Square;
            const piece = getPieceAtSquare(square);
            
            const row = playerColor === 'w' ? 8 - rank : rank - 1;
            const col = playerColor === 'w' ? file.charCodeAt(0) - 'a'.charCodeAt(0) : 'h'.charCodeAt(0) - file.charCodeAt(0);

            const isDark = (row + col) % 2 !== 0;

            const isLastMoveSquare = lastMove && (square === lastMove.from || square === lastMove.to);
            const isSelectedSquare = fromSquare === square;
            const isPossibleMove = possibleMovesForSelectedPiece.includes(square);
            const isCaptureMove = isPossibleMove && !!getPieceAtSquare(square);
          
            return (
              <div
                key={square}
                onClick={() => handleSquareClick(square)}
                className={cn(
                  'flex justify-center items-center relative group h-full w-full',
                  isDark ? 'bg-primary/30' : 'bg-primary/10',
                  turn === getPieceAtSquare(square)?.color && 'cursor-pointer',
                  'border border-primary/20'
                )}
              >
                {isLastMoveSquare && <div className="absolute inset-0 bg-accent/30" />}
                {isSelectedSquare && <div className="absolute inset-0 bg-yellow-400/30" />}
                
                {piece && (
                  <ChessPiece
                    piece={piece}
                    isEvolving={shiningPiece === square}
                    isFlipped={playerColor === 'b'}
                  />
                )}
                
                {isPossibleMove && !isCaptureMove && (
                  <div className="absolute w-1/4 h-1/4 rounded-full bg-yellow-400/50 opacity-50 group-hover:opacity-100" />
                )}
                {isCaptureMove && (
                  <div className="absolute inset-1 rounded-full border-4 border-destructive/50 opacity-80 group-hover:opacity-100" />
                )}
              </div>
            );
        }))}
      </div>
    </div>
  );
}
