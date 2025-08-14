
import { Chess } from 'chess.js';
import type { PieceSymbol, Color, Square } from './types';

type PieceHpMap = { [key in Square]?: { hp: number; maxHp: number; } };

export interface StoryLevel {
  title: string;
  narrative: string;
  objective: string;
  fen: string;
  playerColor: Color;
  hpMap?: PieceHpMap;
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
    fen: "k7/8/8/8/4p3/8/3P4/K7 w - - 0 1",
    playerColor: 'w',
    hpMap: createHpMapFromFen("k7/8/8/8/4p3/8/3P4/K7 w - - 0 1"),
    winCondition: (game) => {
        // Win condition is met if a white knight is on the board (the result of evolution).
        const board = game.board();
        return board.flat().some(p => p?.type === 'n' && p.color === 'w');
    }
  },
  // Level 2: The Fork in the Road
  {
    title: "The Fork in the Road",
    narrative: "Having become a Knight, you journey forth. You come across two enemy rooks blocking your path. 'True strength is not about brute force,' a mysterious voice echoes, 'but about seeing the paths others cannot.'",
    objective: "Win a rook.",
    fen: "r3k3/8/8/8/4N3/8/8/R3K3 w - - 0 1",
    playerColor: 'w',
    hpMap: createHpMapFromFen("r3k3/8/8/8/4N3/8/8/R3K3 w - - 0 1"),
    winCondition: (game) => {
        // Win if there is only one or zero black rooks left.
        const board = game.board();
        const blackRooks = board.flat().filter(p => p?.type === 'r' && p.color === 'b').length;
        return blackRooks <= 1;
    }
  },
  // Level 3: The Bishop's Gambit
  {
    title: "The Bishop's Gambit",
    narrative: "You've proven your cunning. Now you face a true test of faith and power. A fanatical Bishop guards a narrow pass. 'Only the truly enlightened may pass!' he declares, his eyes glowing with power. His queen stands behind him, a menacing shadow.",
    objective: "Checkmate the Black King.",
    fen: "r1b1k2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1",
    playerColor: 'w',
    hpMap: createHpMapFromFen("r1b1k2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1"),
    winCondition: (game) => game.isCheckmate(),
  },
  // ... more levels to come
];
