
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
  // Level 1: The Queen's Strike (Mate in 1)
  {
    title: "The Queen's Strike",
    narrative: "The first lesson of a true warrior is to recognize overwhelming advantage. Your queen stands ready. Seize the opportunity and end the battle with a single, decisive blow.",
    objective: "Deliver checkmate in one move.",
    fen: "6k1/8/8/8/8/8/4Q3/K7 w - - 0 1",
    playerColor: 'w',
    hpMap: createHpMapFromFen("6k1/8/8/8/8/8/4Q3/K7 w - - 0 1"),
    lives: 3,
    hint: "Your Queen is a powerful piece. Find the square where she can attack the enemy king without being captured.",
    solution: {
      'e2e8': 'win'
    },
    winCondition: (game) => game.isCheckmate(),
  },
  // Level 2: The Rook's Ladder (Mate in 2)
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
        'a4a7': { // Player's first move
            'g8h8': { // Opponent's forced move
                'a2h2': 'win' // Player's winning move
            }
        }
    },
    winCondition: (game) => game.isCheckmate(),
  },
  // Level 3: The Pawn's Power (Promotion & Mate)
  {
      title: "The Pawn's Power",
      narrative: "The humblest soldier can become the greatest hero. Your pawn is on the verge of glory. Guide it to the final rank to unlock its true potential and secure victory.",
      objective: "Promote your pawn and then deliver checkmate.",
      fen: "7k/P7/8/8/8/8/8/K7 w - - 0 1",
      playerColor: 'w',
      hpMap: createHpMapFromFen("7k/P7/8/8/8/8/8/K7 w - - 0 1"),
      lives: 2,
      hint: "Advance your pawn to the 8th rank to promote it to a Queen. Then, use your new Queen to checkmate the lonely king.",
      solution: {
          'a7a8q': { // Player promotes pawn
              'h8g7': { // Opponent's forced move
                'a8g8': 'win' // Player delivers checkmate
              }
          }
      },
      winCondition: (game) => game.isCheckmate(),
  },
];
    
