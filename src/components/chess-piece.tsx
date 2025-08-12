import type { Piece } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Cherry, Crown, Fish, Footprints, Tower, Zap } from 'lucide-react';

const pieceMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  p: (props) => (
    <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" strokeWidth="5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 90 C 40 80, 40 60, 50 55 C 60 60, 60 80, 50 90 M50 55 C 50 45, 50 30, 50 20 M50 20 C 40 25, 60 25, 50 20" />
    </svg>
  ),
  r: (props) => (
    <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" strokeWidth="5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M25 90 L75 90 L75 70 L65 70 L65 30 L80 30 L80 15 L20 15 L20 30 L35 30 L35 70 L25 70 Z" />
    </svg>
  ),
  n: (props) => (
    <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" strokeWidth="5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M30 90 L30 60 C 30 40, 50 20, 70 20 C 90 20, 90 40, 75 55 L60 80 L75 90" />
    </svg>
  ),
  b: (props) => (
    <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" strokeWidth="5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 90 L 30 70 C 40 60, 60 60, 70 70 L50 90 M50 70 L 50 40 C 40 30, 60 30, 50 40 M50 25 C 45 20, 55 20, 50 25" />
    </svg>
  ),
  q: (props) => (
    <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" strokeWidth="5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M25 90 L75 90 L70 60 L85 45 L50 60 L15 45 L30 60 Z M50 60 L50 30 M20 20 L80 20" />
    </svg>
  ),
  k: (props) => (
    <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" strokeWidth="5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M25 90 L75 90 L70 65 L80 50 L50 70 L20 50 L30 65 Z M50 70 L50 30 M40 15 L60 15 M50 15 L50 5" />
    </svg>
  ),
};

interface ChessPieceProps {
  piece: Piece;
  isEvolving: boolean;
}

export function ChessPiece({ piece, isEvolving }: ChessPieceProps) {
  const SvgComponent = pieceMap[piece.type];

  if (!SvgComponent) return null;

  return (
    <div className={cn(
        "w-full h-full p-1 transition-transform duration-200 ease-in-out group-hover:scale-110",
        isEvolving && "shimmer"
    )}>
        <SvgComponent
            className={cn(
                "w-full h-full drop-shadow-lg",
                piece.color === 'w' ? 'text-stone-50' : 'text-stone-800'
            )}
            stroke={piece.color === 'w' ? 'hsl(var(--foreground))' : 'hsl(var(--background))'}
            strokeWidth="4"
        />
    </div>
  );
}
