
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
    fen: "k7/8/8/8/8/4p3/3P4/K7 w - - 0 1",
    playerColor: 'w',
    hpMap: createHpMapFromFen("k7/8/8/8/8/4p3/3P4/K7 w - - 0 1"),
    lives: 3,
    hint: "Pawns capture diagonally. Move your pawn to capture the opponent.",
    solution: {
      'd2d3': 'e3d2', // Wrong move, opponent captures
      'd2d4': 'e3d2', // Wrong move
      'd2xe3': 'win' // Correct move
    },
    winCondition: (game) => {
        const board = game.board();
        return board.flat().some(p => p?.type === 'n' && p.color === 'w');
    }
  },
  // Level 2: The Fork in the Road
  {
    title: "The Fork in the Road",
    narrative: "Having become a Knight, you journey forth. You come across two enemy rooks guarding a pass. 'True strength is not about brute force,' a mysterious voice echoes, 'but about seeing the paths others cannot.'",
    objective: "Win a rook by using a fork.",
    fen: "r3k2r/8/8/8/4N3/8/8/R3K2R w KQkq - 0 1",
    playerColor: 'w',
    hpMap: createHpMapFromFen("r3k2r/8/8/8/4N3/8/8/R3K2R w KQkq - 0 1"),
    lives: 2,
    hint: "A knight can attack multiple pieces at once. Find a square where your knight attacks both the king and a rook.",
    solution: {
        'e4f6': { // This is the check, forcing the king to move.
          'e8f7': 'f6h7' // Opponent moves, player takes the rook
        },
        'e4d6': { // This is also a check, with a different outcome
          'e8d7': 'd6f7'
        },
        'e4g5': 'h8h1',
        'e4c5': 'a8a1'
    },
    winCondition: (game) => {
        const board = game.board();
        const blackRooks = board.flat().filter(p => p?.type === 'r' && p.color === 'b').length;
        // After the fork, the player should be able to capture a rook.
        return blackRooks <= 1 && game.history().length > 1;
    }
  },
  // Level 3: Scholar's Mate
  {
      title: "The Scholar's Gambit",
      narrative: "You've proven your cunning. Now you face a true test of strategy. 'The quickest victory is the most decisive,' whispers a cloaked figure. 'End this swiftly.'",
      objective: "Deliver checkmate in 2 moves.",
      fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3",
      playerColor: 'w',
      hpMap: createHpMapFromFen("r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3"),
      lives: 1,
      hint: "Your Queen is your most powerful piece. Where can she strike the weakest point (f7)?",
      solution: {
          'd1f3': { // Player's first move
              'a7a6': 'f3f7' // Opponent's scripted response, then player's winning move is mate
          },
          'c4f7': { // check but not mate
              'e8f7': 'd1h5'
          }
      },
      winCondition: (game) => game.isCheckmate(),
  },
];
