import type { Piece } from '@/lib/types';
import { cn } from '@/lib/utils';

const pieceMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  p: (props) => (
    <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="30" r="15" fill="currentColor"/>
      <rect x="40" y="45" width="20" height="35" rx="10" fill="currentColor"/>
      <rect x="25" y="80" width="50" height="10" rx="5" fill="currentColor"/>
    </svg>
  ),
  r: (props) => (
    <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="20" width="40" height="10" rx="5" fill="currentColor"/>
      <rect x="30" y="30" width="40" height="50" rx="10" fill="currentColor"/>
      <rect x="20" y="80" width="60" height="10" rx="5" fill="currentColor"/>
    </svg>
  ),
  n: (props) => (
    <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 20 C 20 20, 20 60, 40 60 L 40 80 L 30 80 L 30 90 L 70 90 L 70 80 L 60 80 L 60 50 C 80 50, 80 20, 60 20 Z" fill="currentColor"/>
    </svg>
  ),
  b: (props) => (
    <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="25" r="12" fill="currentColor" />
      <path d="M 50 35 L 30 80 L 70 80 Z" fill="currentColor"/>
      <rect x="20" y="80" width="60" height="10" rx="5" fill="currentColor"/>
    </svg>
  ),
  q: (props) => (
    <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="20" r="8" fill="currentColor" />
      <path d="M 30 30 L 70 30 L 60 80 L 40 80 Z" fill="currentColor"/>
      <rect x="20" y="80" width="60" height="10" rx="5" fill="currentColor"/>
    </svg>
  ),
  k: (props) => (
    <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="45" y="10" width="10" height="30" rx="2" fill="currentColor"/>
      <rect x="30" y="20" width="40" height="10" rx="2" fill="currentColor"/>
      <path d="M 35 40 L 65 40 L 55 80 L 45 80 Z" fill="currentColor"/>
      <rect x="25" y="80" width="50" height="10" rx="5" fill="currentColor"/>
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
        "w-full h-full p-1.5 transition-transform duration-200 ease-in-out hover:scale-110",
        isEvolving && "shimmer"
    )}>
        <SvgComponent
            className={cn(
                "w-full h-full drop-shadow-md",
                piece.color === 'w' ? 'text-white' : 'text-gray-800'
            )}
            stroke={piece.color === 'w' ? 'hsl(var(--foreground) / 0.5)' : 'hsl(var(--background) / 0.5)'}
            strokeWidth="3"
        />
    </div>
  );
}
