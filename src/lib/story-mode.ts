
import { Chess } from 'chess.js';
import type { PieceSymbol, Color, Square } from './types';

type PieceHpMap = { [key in Square]?: { hp: number; maxHp: number; } };

// A solution can be a direct opponent response (string) or another nested object of moves.
// 'win' signifies the player's move solves the puzzle.
type SolutionBranch = { [move: string]: SolutionBranch | string; };

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
  // Level 1: The First Step
  {
    title: "The First Step",
    narrative: "Your quest begins in the quiet village of White-haven. A lone pawn, you dream of glory. A grizzled old knight offers you your first challenge. 'The path to greatness is paved with sacrifice,' he says. 'Show me you understand.'",
    objective: "Capture the black pawn to evolve.",
    fen: "8/8/8/8/3p4/4P3/8/k1K5 w - - 0 1",
    playerColor: 'w',
    hpMap: createHpMapFromFen("8/8/8/8/3p4/4P3/8/k1K5 w - - 0 1"),
    lives: 3,
    hint: "Pawns capture diagonally. Move your pawn to capture the opponent.",
    solution: {
      'e3d4': 'win'
    },
    winCondition: (game) => {
        const board = game.board();
        return board.flat().some(p => p?.type === 'n' && p.color === 'w');
    }
  },
  // Level 2: The Fork in the Road
  {
    title: "The Fork in the Road",
    narrative: "Having become a Knight, you journey forth. You come across a king and his rook guarding a pass. 'True strength is not about brute force,' a mysterious voice echoes, 'but about seeing the paths others cannot.'",
    objective: "Win the rook by using a fork.",
    fen: "4k2r/8/8/8/5N2/8/8/K7 w - - 0 1",
    playerColor: 'w',
    hpMap: createHpMapFromFen("4k2r/8/8/8/5N2/8/8/K7 w - - 0 1"),
    lives: 2,
    hint: "A knight can attack multiple pieces at once. Find a square where your knight attacks both the king and the rook.",
    solution: {
        'f4g6': {
            'e8f7': {
                'g6h8': 'win'
            }
        }
    },
    winCondition: (game) => {
        const history = game.history({verbose: true});
        const capturedRook = history.some(move => move.color === 'w' && move.captured === 'r');
        return capturedRook;
    }
  },
  // Level 3: Scholar's Gambit
  {
      title: "The Scholar's Gambit",
      narrative: "You've proven your cunning. Now you face a true test of strategy. 'The quickest victory is the most decisive,' whispers a cloaked figure. 'End this swiftly.'",
      objective: "Deliver checkmate in 2 moves.",
      fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3",
      playerColor: 'w',
      hpMap: createHpMapFromFen("r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3"),
      lives: 1,
      hint: "Your Queen is your most powerful piece. Where can she strike the weakest point (f7)? Remember to protect your queen!",
      solution: {
          'd1h5': {
              'g7g6': {
                'h5e5': 'win'
              }
          }
      },
      winCondition: (game) => game.isCheckmate(),
  },
];

    