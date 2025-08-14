
import type { Piece } from '@/lib/types';
import type { PieceSymbol, Color } from 'chess.js';
import { cn } from '@/lib/utils';

interface ChessPieceProps {
  piece: Piece;
  isEvolving: boolean;
}

function pieceToUnicode(piece: PieceSymbol, color: Color) {
    const map: Record<PieceSymbol, string> = {
        p: '♙',
        n: '♘',
        b: '♗',
        r: '♖',
        q: '♕',
        k: '♔'
    };
    const whiteUnicode = map[piece.toLowerCase() as PieceSymbol];
    const blackUnicodeMap: Record<string, string> = {
        '♙': '♟',
        '♘': '♞',
        '♗': '♝',
        '♖': '♜',
        '♕': '♛',
        '♔': '♚'
    };

    return color === 'w' ? whiteUnicode : blackUnicodeMap[whiteUnicode];
}


export function ChessPiece({ piece, isEvolving }: ChessPieceProps) {
  if (!piece) return null;

  const unicodePiece = pieceToUnicode(piece.type, piece.color);

  return (
    <div className={cn(
        "w-full h-full p-1 transition-transform duration-200 ease-in-out group-hover:scale-110 flex items-center justify-center flex-1",
        isEvolving && "shimmer"
    )}>
        <span
            className={cn(
                "text-4xl md:text-5xl drop-shadow-lg",
                piece.color === 'w' ? 'text-stone-50' : 'text-stone-900',
            )}
            style={{
                textShadow: piece.color === 'w' 
                    ? '2px 2px 4px rgba(0,0,0,0.5)' 
                    : '2px 2px 4px rgba(255,255,255,0.3)'
            }}
        >
            {unicodePiece}
        </span>
    </div>
  );
}
