
"use client";

import { useState } from 'react';
import type { Board, Square, Piece, Color, Move } from '@/lib/types';
import { ChessPiece } from '@/components/chess-piece';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

type PieceState = { hp: number; maxHp: number; };
type PieceHpMap = { [key in Square]?: PieceState };

interface ChessBoardProps {
  board: Board;
  pieceHp: PieceHpMap;
  turn: Color;
  onMove: (from: Square, to: Square) => void;
  lastMove: { from: Square; to: Square } | null;
  shiningPiece: Square | null;
  validMoves: Move[];
  playerColor: Color;
  isPlayerTurn: boolean;
  gameMode: 'vs-ai' | 'vs-player';
}

export default function ChessBoard({ board, pieceHp, onMove, turn, lastMove, shiningPiece, validMoves, playerColor, isPlayerTurn, gameMode }: ChessBoardProps) {
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
    } else if (piece && piece.color === turn && isPlayerTurn) {
      setFromSquare(square);
    }
  };

  const getPieceAtSquare = (square: Square): Piece | null => {
    const rankIndex = 8 - parseInt(square[1], 10);
    const fileIndex = square.charCodeAt(0) - 'a'.charCodeAt(0);
    return board[rankIndex]?.[fileIndex] || null;
  };

  const possibleMovesForSelectedPiece = fromSquare ? validMoves.filter(m => m.from === fromSquare).map(m => m.to) : [];

  const effectivePlayerColor = gameMode === 'vs-player' ? 'w' : playerColor;

  const ranks = effectivePlayerColor === 'w' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
  const files = effectivePlayerColor === 'w' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];

  return (
    <div className="w-full h-full">
      <div className={cn("grid grid-cols-8 grid-rows-8 aspect-square rounded-lg overflow-hidden shadow-2xl border-2 border-primary/20 bg-primary/10")}>
        {ranks.flatMap(rank =>
          files.map(file => {
            const square = `${file}${rank}` as Square;
            const piece = getPieceAtSquare(square);
            const hpState = piece ? pieceHp[square] : undefined;
            
            const rankIndex = 8 - rank;
            const fileIndex = file.charCodeAt(0) - 'a'.charCodeAt(0);

            const isDark = (rankIndex + fileIndex) % 2 !== 0;

            const isLastMoveSquare = lastMove && (square === lastMove.from || square === lastMove.to);
            const isSelectedSquare = fromSquare === square;
            const isPossibleMove = possibleMovesForSelectedPiece.includes(square);
            const isCaptureMove = isPossibleMove && !!getPieceAtSquare(square);
          
            return (
              <div
                key={square}
                onClick={() => handleSquareClick(square)}
                className={cn(
                  'flex justify-center items-center relative group h-full w-full p-1',
                  isDark ? 'bg-primary/30' : 'bg-primary/10',
                  isPlayerTurn && getPieceAtSquare(square)?.color === turn && 'cursor-pointer',
                  'border border-primary/20'
                )}
              >
                {isLastMoveSquare && <div className="absolute inset-0 bg-accent/30" />}
                {isSelectedSquare && <div className="absolute inset-0 bg-yellow-400/30" />}
                
                {piece && (
                  <div className="w-full h-full flex flex-col items-center justify-end">
                     <ChessPiece
                      piece={piece}
                      isEvolving={shiningPiece === square}
                    />
                    {hpState && hpState.maxHp > 0 && (
                        <Progress value={(hpState.hp / hpState.maxHp) * 100} className="h-1.5 w-full bg-red-500/50 [&>div]:bg-green-500" />
                    )}
                  </div>
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
