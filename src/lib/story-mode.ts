
import { Chess } from 'chess.js';
import type { PieceSymbol, Color, Square } from './types';

type PieceHpMap = { [key in Square]?: { hp: number; maxHp: number; } };

// A solution can be a direct opponent response (string) or another nested object of moves.
// 'win' signifies the player's move solves the puzzle.
export type SolutionBranch = { [move: string]: SolutionBranch | string; };

export interface StoryLevel {
  title: string;
  narrative: string;
  objective: string;
  fen: string;
  playerColor: Color;
  hpMap?: PieceHpMap;
  lives: number;
  hint: string;
  solution: SolutionBranch;
  winCondition: (game: Chess) => boolean;
  allowEvolution?: boolean;
}

const pieceHpConfig: Partial<Record<PieceSymbol, number>> = {
    p: 1, n: 2, b: 3, r: 4, q: 5, k: 10
};

const createHpMapFromFen = (fen: string): PieceHpMap => {
    const game = new Chess(fen);
    const hpMap: PieceHpMap = {};
    game.board().forEach(row => {
        row.forEach(piece => {
            if (piece) {
                const maxHp = pieceHpConfig[piece.type];
                if (maxHp) {
                    hpMap[piece.square] = { hp: maxHp, maxHp: maxHp };
                }
            }
        });
    });
    return hpMap;
}

export const storyLevels: StoryLevel[] = [
  // Level 1: The Pawn's Breakthrough
  {
    title: "The Pawn's Breakthrough",
    narrative: "The battlefield is a dance of sacrifice and opportunity. Your pawn stands ready to strike. Capture the enemy pawn to evolve and gain a crucial advantage.",
    objective: "Capture the black pawn with your white pawn.",
    fen: "8/8/8/8/4p3/8/3P4/K6k w - - 0 1",
    playerColor: 'w',
    hpMap: createHpMapFromFen("8/8/8/8/4p3/8/3P4/K6k w - - 0 1"),
    lives: 1,
    hint: "Pawns capture diagonally. Move your pawn from d2 to capture the one on e4.",
    solution: {
      'd2e4': 'win'
    },
    winCondition: (game) => {
      // Win if the black pawn on e4 is gone and a white piece is on e4.
      const pawn = game.get('e4');
      return !!pawn && pawn.color === 'w';
    },
    allowEvolution: true,
  },
  // Level 2: The Knight's Fork
  {
    title: "The Knight's Fork",
    narrative: "A true tactician creates threats where none seem to exist. Your knight can leap into a position that attacks the enemy King and Rook simultaneously. Execute this fork to seize victory.",
    objective: "Fork the King and Rook with your Knight.",
    fen: "k6r/8/8/8/8/4N3/8/K7 w - - 0 1",
    playerColor: 'w',
    hpMap: createHpMapFromFen("k6r/8/8/8/8/4N3/8/K7 w - - 0 1"),
    lives: 2,
    hint: "Find the square where your knight can attack both the black king on a8 and the black rook on h8.",
    solution: {
      'e3f5': 'win'
    },
    winCondition: (game) => {
      const knight = game.get('f5');
      return !!knight && knight.type === 'n' && knight.color === 'w' && game.inCheck();
    }
  },
  // Level 3: The Rook's Ladder
  {
      title: "The Rook's Ladder",
      narrative: "A true commander uses all forces in concert. Your rooks are poised to create a 'ladder,' climbing the board to trap the enemy king. The first move is not the final one; it is the setup for victory.",
      objective: "Deliver checkmate in two moves.",
      fen: "6k1/8/8/8/R7/8/R7/K7 w - - 0 1",
      playerColor: 'w',
      hpMap: createHpMapFromFen("6k1/8/8/8/R7/8/R7/K7 w - - 0 1"),
      lives: 3,
      hint: "Use one rook to force the king to a new rank, then use the other rook to deliver the final blow.",
      solution: {
          'a4a7': {
              'g8h8': {
                  'a2h2': 'win'
              }
          }
      },
      winCondition: (game) => game.isCheckmate(),
  },
];
