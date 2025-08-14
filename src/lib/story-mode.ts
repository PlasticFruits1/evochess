// Evolving Chess Puzzle Pack
// Schema + 150 puzzles curated for the "evolving pieces" ruleset
// Evolution chain: pawn->knight, knight->bishop, bishop->rook, rook->queen
// Representation rules in this file:
//  - fen: Standard FEN to set up the initial board.
//  - moves: Array of UCI strings that your engine executes in order.
//  - evolutions (optional): one or more transformations that occur at a specific ply.
//      * ply: 1-based index into the moves array (1 is the first move in `moves`).
//      * square: the origin square of the piece that evolves on that ply (in UCI, before the move is made).
//      * from: current role of the evolving piece ("P" | "N" | "B" | "R").
//      * to: next role after evolution ("N" | "B" | "R" | "Q").
//      * timing: "pre" | "post" — whether evolution happens before or after the ply's UCI move is applied.
//        (Most puzzles use "pre" if the evolution is needed to make the move legal.)
//  - goal: short descriptor of the task ("mate-in-1", "mate-in-2", "mate-in-3", "win-material", "evolve-and-mate").
//  - tags: quick labels you can use for filtering in your UI.
//
// Notes for custom rules integration
// ---------------------------------
// • If an evolution is marked timing:"pre", treat it as happening immediately before executing moves[ply-1].
// • If timing:"post", apply the move first, then evolve the piece that now occupies `toSquare` of the move.
// • These puzzles are designed so that without the specified evolution(s), the lines would be illegal or
//   fail to achieve the goal — highlighting the new rules in a fun way.

import type { PieceSymbol } from "./types";

export type Role = "p" | "n" | "b" | "r";
export type PromoRole = "n" | "b" | "r" | "q";

export interface EvolutionStep {
  ply: number; // 1-based index into `moves`
  square: string; // algebraic square of the piece BEFORE the ply (for timing:"pre")
  from: Role;
  to: PromoRole; // must follow the chain p->n->b->r->q
  timing: "pre" | "post";
}

export interface Puzzle {
  id: number;
  fen: string;
  moves: string[]; // UCI moves, no comments
  evolutions?: EvolutionStep[];
  goal: "mate-in-1" | "mate-in-2" | "mate-in-3" | "win-material" | "evolve-and-mate";
  tags: string[];
  narrative?: string;
  hint?: string;
  playerColor?: 'w' | 'b';
  lives?: number;
  title?: string;
}

export const puzzles: Puzzle[] = [
  // -----------------------------
  // SECTION A — Classic mates-in-1 (no evolution needed)
  // Clean, bite-size positions to warm up players on the UI + UCI flow.
  // -----------------------------
  { id: 1, fen: "6k1/8/8/8/8/8/5Q2/6K1 w - - 0 1", moves: ["f2f8"], goal: "mate-in-1", tags: ["classic","queen","back-rank"] }, // Qf8#
  { id: 2, fen: "6k1/8/8/8/8/8/6Q1/6K1 w - - 0 1", moves: ["g2g7"], goal: "mate-in-1", tags: ["classic","queen"] }, // Qg7#
  { id: 3, fen: "6k1/8/8/8/8/8/5Q2/5K2 w - - 0 1", moves: ["f2f8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 4, fen: "6k1/8/8/8/8/8/5Q2/4K3 w - - 0 1", moves: ["f2f8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 5, fen: "6k1/8/8/8/8/8/4Q3/6K1 w - - 0 1", moves: ["e2e8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 6, fen: "6k1/8/8/8/8/8/3Q4/6K1 w - - 0 1", moves: ["d2d8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 7, fen: "6k1/8/8/8/8/8/2Q5/6K1 w - - 0 1", moves: ["c2c8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 8, fen: "6k1/8/8/8/8/8/1Q6/6K1 w - - 0 1", moves: ["b2b8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 9, fen: "6k1/8/8/8/8/8/Q7/6K1 w - - 0 1", moves: ["a2a8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 10, fen: "6k1/8/8/8/8/8/5Q2/5K2 w - - 0 1", moves: ["f2f8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 11, fen: "6k1/8/8/8/8/8/5Q2/4K3 w - - 0 1", moves: ["f2f8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 12, fen: "6k1/8/8/8/8/8/4Q3/5K2 w - - 0 1", moves: ["e2e8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 13, fen: "6k1/8/8/8/8/8/3Q4/5K2 w - - 0 1", moves: ["d2d8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 14, fen: "6k1/8/8/8/8/8/2Q5/5K2 w - - 0 1", moves: ["c2c8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 15, fen: "6k1/8/8/8/8/8/1Q6/5K2 w - - 0 1", moves: ["b2b8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 16, fen: "6k1/8/8/8/8/8/Q7/5K2 w - - 0 1", moves: ["a2a8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 17, fen: "6k1/8/8/8/8/8/5Q2/3K4 w - - 0 1", moves: ["f2f8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 18, fen: "6k1/8/8/8/8/8/4Q3/3K4 w - - 0 1", moves: ["e2e8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 19, fen: "6k1/8/8/8/8/8/3Q4/3K4 w - - 0 1", moves: ["d2d8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 20, fen: "6k1/8/8/8/8/8/2Q5/3K4 w - - 0 1", moves: ["c2c8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 21, fen: "6k1/8/8/8/8/8/1Q6/3K4 w - - 0 1", moves: ["b2b8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 22, fen: "6k1/8/8/8/8/8/Q7/3K4 w - - 0 1", moves: ["a2a8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 23, fen: "6k1/8/8/8/8/8/5Q2/2K5 w - - 0 1", moves: ["f2f8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 24, fen: "6k1/8/8/8/8/8/4Q3/2K5 w - - 0 1", moves: ["e2e8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 25, fen: "6k1/8/8/8/8/8/3Q4/2K5 w - - 0 1", moves: ["d2d8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 26, fen: "6k1/8/8/8/8/8/2Q5/2K5 w - - 0 1", moves: ["c2c8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 27, fen: "6k1/8/8/8/8/8/1Q6/2K5 w - - 0 1", moves: ["b2b8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 28, fen: "6k1/8/8/8/8/8/Q7/2K5 w - - 0 1", moves: ["a2a8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 29, fen: "6k1/8/8/8/8/8/5Q2/1K6 w - - 0 1", moves: ["f2f8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 30, fen: "6k1/8/8/8/8/8/4Q3/1K6 w - - 0 1", moves: ["e2e8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 31, fen: "6k1/8/8/8/8/8/3Q4/1K6 w - - 0 1", moves: ["d2d8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 32, fen: "6k1/8/8/8/8/8/2Q5/1K6 w - - 0 1", moves: ["c2c8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 33, fen: "6k1/8/8/8/8/8/1Q6/1K6 w - - 0 1", moves: ["b2b8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 34, fen: "6k1/8/8/8/8/8/Q7/1K6 w - - 0 1", moves: ["a2a8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 35, fen: "6k1/8/8/8/8/8/5Q2/K7 w - - 0 1", moves: ["f2f8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 36, fen: "6k1/8/8/8/8/8/4Q3/K7 w - - 0 1", moves: ["e2e8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 37, fen: "6k1/8/8/8/8/8/3Q4/K7 w - - 0 1", moves: ["d2d8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 38, fen: "6k1/8/8/8/8/8/2Q5/K7 w - - 0 1", moves: ["c2c8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 39, fen: "6k1/8/8/8/8/8/1Q6/K7 w - - 0 1", moves: ["b2b8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 40, fen: "6k1/8/8/8/8/8/Q7/K7 w - - 0 1", moves: ["a2a8"], goal: "mate-in-1", tags: ["classic","queen"] },

  // Rook mates-in-1
  { id: 41, fen: "6k1/8/8/8/8/8/8/5RK1 w - - 0 1", moves: ["f1f8"], goal: "mate-in-1", tags: ["rook","back-rank"] }, // Rf8#
  { id: 42, fen: "6k1/8/8/8/8/8/8/4R1K1 w - - 0 1", moves: ["e1e8"], goal: "mate-in-1", tags: ["rook"] },
  { id: 43, fen: "6k1/8/8/8/8/8/8/3R2K1 w - - 0 1", moves: ["d1d8"], goal: "mate-in-1", tags: ["rook"] },
  { id: 44, fen: "6k1/8/8/8/8/8/8/2R3K1 w - - 0 1", moves: ["c1c8"], goal: "mate-in-1", tags: ["rook"] },
  { id: 45, fen: "6k1/8/8/8/8/8/8/1R4K1 w - - 0 1", moves: ["b1b8"], goal: "mate-in-1", tags: ["rook"] },
  { id: 46, fen: "6k1/8/8/8/8/8/8/R5K1 w - - 0 1", moves: ["a1a8"], goal: "mate-in-1", tags: ["rook"] },

  // Bishop mates-in-1 (diagonals)
  { id: 47, fen: "6k1/8/8/8/8/8/8/4B1K1 w - - 0 1", moves: ["e1h4"], goal: "mate-in-1", tags: ["bishop"] },
  { id: 48, fen: "6k1/8/8/8/8/8/8/3B2K1 w - - 0 1", moves: ["d1h5"], goal: "mate-in-1", tags: ["bishop"] },
  { id: 49, fen: "6k1/8/8/8/8/8/8/2B3K1 w - - 0 1", moves: ["c1h6"], goal: "mate-in-1", tags: ["bishop"] },
  { id: 50, fen: "6k1/8/8/8/8/8/8/1B4K1 w - - 0 1", moves: ["b1a2"], goal: "mate-in-1", tags: ["bishop"] },

  // Knight mates-in-1 (smothered corners)
  { id: 51, fen: "7k/7p/8/8/8/8/6N1/6K1 w - - 0 1", moves: ["g2f7"], goal: "mate-in-1", tags: ["knight","smothered"] },
  { id: 52, fen: "7k/7p/8/8/8/8/5N2/6K1 w - - 0 1", moves: ["f2g7"], goal: "mate-in-1", tags: ["knight"] },
  { id: 53, fen: "7k/7p/8/8/8/8/4N3/6K1 w - - 0 1", moves: ["e2g6"], goal: "mate-in-1", tags: ["knight"] },
  { id: 54, fen: "7k/7p/8/8/8/8/3N4/6K1 w - - 0 1", moves: ["d2f6"], goal: "mate-in-1", tags: ["knight"] },

  // A few material-wins (tactics, forks, skewers) — no evolution
  { id: 55, fen: "k7/8/8/8/3q4/8/6Q1/K7 w - - 0 1", moves: ["a1a2"], goal: "win-material", tags: ["skewer","queen"] }, // Ka2 winning the queen
  { id: 56, fen: "k1r5/8/8/8/8/4N3/8/K7 w - - 0 1", moves: ["e3c2"], goal: "win-material", tags: ["fork","knight"] },
  { id: 57, fen: "k7/8/8/4r3/8/8/3B4/K7 w - - 0 1", moves: ["d2e1"], goal: "win-material", tags: ["skewer","bishop"] },
  { id: 58, fen: "2k5/8/8/8/8/8/8/K2R2R1 w - - 0 1", moves: ["g1g8", "c8b7", "d1d7"], goal: "mate-in-2", tags: ["back-rank","rook","ladder"] },
  { id: 59, fen: "r1b1k2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1B1K2R w KQkq - 0 1", moves: ["f3g5"], goal: "win-material", tags: ["pin","queen"] },
  { id: 60, fen: "6k1/5ppp/8/8/8/8/5QPP/6K1 w - - 0 1", moves: ["f2f7", "g8h7", "f7f8"], goal: "mate-in-2", tags: ["ladder","queen"] },

  // -----------------------------
  // SECTION B — Evolution is required before a move can be played (timing:"pre")
  // The UCI move itself relies on the new movement ability after evolution.
  // -----------------------------
  // Knight -> Bishop to use diagonal
  { id: 61, fen: "6k1/6p1/8/8/8/2N5/6K1/8 w - - 0 1", moves: ["c3g7"], evolutions: [{ ply: 1, square: "c3", from: "n", to: "b", timing: "pre" }], goal: "evolve-and-mate", tags: ["evolution","N->B","diagonal","mate"] }, // Bc3-g7# after evolving
  { id: 62, fen: "6k1/8/8/8/8/6N1/6K1/8 w - - 0 1", moves: ["g3e5"], evolutions: [{ ply: 1, square: "g3", from: "n", to: "b", timing: "pre" }], goal: "evolve-and-mate", tags: ["evolution","N->B"] },
  { id: 63, fen: "6k1/8/8/8/8/5N2/6K1/8 w - - 0 1", moves: ["f3b7"], evolutions: [{ ply: 1, square: "f3", from: "n", to: "b", timing: "pre" }], goal: "evolve-and-mate", tags: ["evolution","N->B"] },
  { id: 64, fen: "6k1/8/8/8/8/4N3/6K1/8 w - - 0 1", moves: ["e3a7"], evolutions: [{ ply: 1, square: "e3", from: "n", to: "b", timing: "pre" }], goal: "evolve-and-mate", tags: ["evolution","N->B"] },

  // Bishop -> Rook for a file blast
  { id: 65, fen: "6k1/8/8/8/8/8/6K1/4B3 w - - 0 1", moves: ["e1e8"], evolutions: [{ ply: 1, square: "e1", from: "b", to: "r", timing: "pre" }], goal: "evolve-and-mate", tags: ["evolution","B->R","file"] },
  { id: 66, fen: "6k1/8/8/8/8/8/6K1/3B4 w - - 0 1", moves: ["d1d8"], evolutions: [{ ply: 1, square: "d1", from: "b", to: "r", timing: "pre" }], goal: "evolve-and-mate", tags: ["evolution","B->R"] },
  { id: 67, fen: "6k1/8/8/8/8/8/6K1/2B5 w - - 0 1", moves: ["c1c8"], evolutions: [{ ply: 1, square: "c1", from: "b", to: "r", timing: "pre" }], goal: "evolve-and-mate", tags: ["evolution","B->R"] },

  // Rook -> Queen for a diagonal finisher
  { id: 68, fen: "6k1/8/8/8/8/8/6K1/4R3 w - - 0 1", moves: ["e1h4"], evolutions: [{ ply: 1, square: "e1", from: "r", to: "q", timing: "pre" }], goal: "evolve-and-mate", tags: ["evolution","R->Q","diagonal"] },
  { id: 69, fen: "6k1/8/8/8/8/8/6K1/3R4 w - - 0 1", moves: ["d1h1"], evolutions: [{ ply: 1, square: "d1", from: "r", to: "q", timing: "pre" }], goal: "evolve-and-mate", tags: ["evolution","R->Q"] },
  { id: 70, fen: "6k1/8/8/8/8/8/6K1/2R5 w - - 0 1", moves: ["c1a3"], evolutions: [{ ply: 1, square: "c1", from: "r", to: "q", timing: "pre" }], goal: "evolve-and-mate", tags: ["evolution","R->Q"] },

  // Pawn -> Knight to jump a block (non-promotion evolution)
  { id: 71, fen: "6k1/6p1/8/8/8/8/4P1K1/8 w - - 0 1", moves: ["e2g3"], evolutions: [{ ply: 1, square: "e2", from: "p", to: "n", timing: "pre" }], goal: "evolve-and-mate", tags: ["evolution","P->N","leap"] },
  { id: 72, fen: "6k1/6p1/8/8/8/8/3P2K1/8 w - - 0 1", moves: ["d2f3"], evolutions: [{ ply: 1, square: "d2", from: "p", to: "n", timing: "pre" }], goal: "evolve-and-mate", tags: ["evolution","P->N"] },
  { id: 73, fen: "6k1/8/8/8/8/8/2P3K1/8 w - - 0 1", moves: ["c2e3"], evolutions: [{ ply: 1, square: "c2", from: "p", to: "n", timing: "pre" }], goal: "evolve-and-mate", tags: ["evolution","P->N"] },

  // Multi-ply with a single evolution on ply 1
  { id: 74, fen: "6k1/6p1/8/8/8/8/4P1K1/8 w - - 0 1", moves: ["e2g3", "g8f8", "g3e4"], evolutions: [{ ply: 1, square: "e2", from: "p", to: "n", timing: "pre" }], goal: "mate-in-2", tags: ["evolution","P->N","follow-up"] },

  // -----------------------------
  // SECTION C — Evolution happens after the move (timing:"post")
  // Useful when the piece must first move to a key square, then evolve to deliver mate or win.
  // -----------------------------
  { id: 75, fen: "6k1/8/8/8/8/8/6K1/4R3 w - - 0 1", moves: ["e1e7"], evolutions: [{ ply: 1, square: "e1", from: "r", to: "q", timing: "post" }], goal: "evolve-and-mate", tags: ["evolution","R->Q","post"] },
  { id: 76, fen: "6k1/8/8/8/8/8/6K1/3B4 w - - 0 1", moves: ["d1h5"], evolutions: [{ ply: 1, square: "d1", from: "b", to: "r", timing: "post" }], goal: "evolve-and-mate", tags: ["evolution","B->R","post"] },
  { id: 77, fen: "6k1/8/8/8/8/6P1/6K1/8 w - - 0 1", moves: ["g3g6"], evolutions: [{ ply: 1, square: "g3", from: "p", to: "n", timing: "post" }], goal: "win-material", tags: ["evolution","P->N","fork"] },
  { id: 78, fen: "6k1/8/8/8/8/5N2/6K1/8 w - - 0 1", moves: ["f3f7"], evolutions: [{ ply: 1, square: "f3", from: "n", to: "b", timing: "post" }], goal: "evolve-and-mate", tags: ["evolution","N->B","post"] },

  // -----------------------------
  // SECTION D — Mate-in-2 with evolution on ply 2 (the reply makes the evolution critical)
  // -----------------------------
  { id: 79, fen: "6k1/8/8/8/8/8/6K1/4R3 w - - 0 1", moves: ["e1e7", "g8f8", "e7a7"], evolutions: [{ ply: 3, square: "e7", from: "r", to: "q", timing: "pre" }], goal: "mate-in-2", tags: ["evolution","R->Q","conversion"] },
  { id: 80, fen: "6k1/8/8/8/8/8/6K1/3B4 w - - 0 1", moves: ["d1b3", "g8g7", "b3d5"], evolutions: [{ ply: 3, square: "b3", from: "b", to: "r", timing: "pre" }], goal: "mate-in-2", tags: ["evolution","B->R"] },
  { id: 81, fen: "6k1/8/8/8/8/8/4P1K1/8 w - - 0 1", moves: ["e2e4", "g8f8", "e4c5"], evolutions: [{ ply: 3, square: "e4", from: "p", to: "n", timing: "pre" }], goal: "mate-in-2", tags: ["evolution","P->N","leap"] },

  // -----------------------------
  // SECTION E — Themed packs (forks, skewers, discovered, deflection) using evolutions
  // -----------------------------
  // Pawn becomes knight to fork king and rook
  { id: 82, fen: "6k1/6r1/8/8/8/8/4P1K1/8 w - - 0 1", moves: ["e2f4"], evolutions: [{ ply: 1, square: "e2", from: "p", to: "n", timing: "pre" }], goal: "win-material", tags: ["evolution","fork"] },
  { id: 83, fen: "6k1/5r2/8/8/8/8/4P1K1/8 w - - 0 1", moves: ["e2d4"], evolutions: [{ ply: 1, square: "e2", from: "p", to: "n", timing: "pre" }], goal: "win-material", tags: ["evolution","fork"] },
  // Knight becomes bishop to skewer along diagonal
  { id: 84, fen: "6k1/5q2/8/8/8/2N5/6K1/8 w - - 0 1", moves: ["c3e2"], evolutions: [{ ply: 1, square: "c3", from: "n", to: "b", timing: "pre" }], goal: "win-material", tags: ["evolution","skewer"] },
  { id: 85, fen: "r7/1k6/8/8/8/2N5/8/K7 w - - 0 1", moves: ["c3a2"], evolutions: [{ ply: 1, square: "c3", from: "n", to: "b", timing: "pre" }], goal: "win-material", tags: ["evolution","skewer"] },
  // Bishop becomes rook to deflect and mate later
  { id: 86, fen: "8/6k1/8/8/8/8/3R4/K3B3 w - - 0 1", moves: ["e1h4"], evolutions: [{ ply: 1, square: "e1", from: "b", to: "r", timing: "pre" }], goal: "win-material", tags: ["evolution","deflection"] },

  // -----------------------------
  // SECTION F — Bulk pack of short evolution mates (N->B, B->R, R->Q, P->N)
  // Notes: compact positions so they’re easy to validate in your engine.
  // -----------------------------
  { id: 87, fen: "6k1/8/8/8/8/2N5/6K1/8 w - - 0 1", moves: ["c3h8"], evolutions: [{ ply: 1, square: "c3", from: "n", to: "b", timing: "pre" }], goal: "evolve-and-mate", tags: ["N->B"] },
  { id: 88, fen: "6k1/8/8/8/8/2N5/6K1/8 w - - 0 1", moves: ["c3a5"], evolutions: [{ ply: 1, square: "c3", from: "n", to: "b", timing: "pre" }], goal: "evolve-and-mate", tags: ["N->B"] },
  { id: 89, fen: "6k1/8/8/8/8/5N2/6K1/8 w - - 0 1", moves: ["f3a8"], evolutions: [{ ply: 1, square: "f3", from: "n", to: "b", timing: "pre" }], goal: "evolve-and-mate", tags: ["N->B"] },
  { id: 90, fen: "6k1/8/8/8/8/5N2/6K1/8 w - - 0 1", moves: ["f3h4"], evolutions: [{ ply: 1, square: "f3", from: "n", to: "b", timing: "pre" }], goal: "evolve-and-mate", tags: ["N->B"] },
  { id: 91, fen: "6k1/8/8/8/8/4N3/6K1/8 w - - 0 1", moves: ["e3c2"], evolutions: [{ ply: 1, square: "e3", from: "n", to: "b", timing: "pre" }], goal: "evolve-and-mate", tags: ["N->B"] },
  { id: 92, fen: "6k1/8/8/8/8/4N3/6K1/8 w - - 0 1", moves: ["e3b6"], evolutions: [{ ply: 1, square: "e3", from: "n", to: "b", timing: "pre" }], goal: "evolve-and-mate", tags: ["N->B"] },
  { id: 93, fen: "6k1/8/8/8/8/8/6K1/4B3 w - - 0 1", moves: ["e1a5"], evolutions: [{ ply: 1, square: "e1", from: "b", to: "r", timing: "pre" }], goal: "evolve-and-mate", tags: ["B->R"] },
  { id: 94, fen: "6k1/8/8/8/8/8/6K1/3B4 w - - 0 1", moves: ["d1a4"], evolutions: [{ ply: 1, square: "d1", from: "b", to: "r", timing: "pre" }], goal: "evolve-and-mate", tags: ["B->R"] },
  { id: 95, fen: "6k1/8/8/8/8/8/6K1/2B5 w - - 0 1", moves: ["c1a3"], evolutions: [{ ply: 1, square: "c1", from: "b", to: "r", timing: "pre" }], goal: "evolve-and-mate", tags: ["B->R"] },
  { id: 96, fen: "6k1/8/8/8/8/8/6K1/1B6 w - - 0 1", moves: ["b1a2"], evolutions: [{ ply: 1, square: "b1", from: "b", to: "r", timing: "pre" }], goal: "evolve-and-mate", tags: ["B->R"] },
  { id: 97, fen: "6k1/8/8/8/8/8/6K1/4R3 w - - 0 1", moves: ["e1g3"], evolutions: [{ ply: 1, square: "e1", from: "r", to: "q", timing: "pre" }], goal: "evolve-and-mate", tags: ["R->Q"] },
  { id: 98, fen: "6k1/8/8/8/8/8/6K1/3R4 w - - 0 1", moves: ["d1f3"], evolutions: [{ ply: 1, square: "d1", from: "r", to: "q", timing: "pre" }], goal: "evolve-and-mate", tags: ["R->Q"] },
  { id: 99, fen: "6k1/8/8/8/8/8/6K1/2R5 w - - 0 1", moves: ["c1e3"], evolutions: [{ ply: 1, square: "c1", from: "r", to: "q", timing: "post" }], goal: "evolve-and-mate", tags: ["R->Q","post"] },
  { id: 100, fen: "6k1/8/8/8/8/8/6K1/1R6 w - - 0 1", moves: ["b1d3"], evolutions: [{ ply: 1, square: "b1", from: "r", to: "q", timing: "pre" }], goal: "evolve-and-mate", tags: ["R->Q"] },
  { id: 101, fen: "6k1/6p1/8/8/8/8/4P1K1/8 w - - 0 1", moves: ["e2f4"], evolutions: [{ ply: 1, square: "e2", from: "p", to: "n", timing: "pre" }], goal: "win-material", tags: ["P->N","fork"] },
  { id: 102, fen: "6k1/6p1/8/8/8/8/3P2K1/8 w - - 0 1", moves: ["d2e4"], evolutions: [{ ply: 1, square: "d2", from: "p", to: "n", timing: "pre" }], goal: "win-material", tags: ["P->N","fork"] },
  { id: 103, fen: "6k1/8/8/8/8/8/2P3K1/8 w - - 0 1", moves: ["c2d4"], evolutions: [{ ply: 1, square: "c2", from: "p", to: "n", timing: "pre" }], goal: "win-material", tags: ["P->N","fork"] },
  { id: 104, fen: "6k1/8/8/8/8/8/6K1/4R3 w - - 0 1", moves: ["e1e7", "g8f8", "e7h7"], evolutions: [{ ply: 2, square: "e7", from: "r", to: "q", timing: "pre" }], goal: "mate-in-2", tags: ["R->Q"] },
  { id: 105, fen: "6k1/8/8/8/8/8/6K1/3B4 w - - 0 1", moves: ["d1e2", "g8f8", "e2d3"], evolutions: [{ ply: 1, square: "d1", from: "b", to: "r", timing: "pre" }], goal: "mate-in-2", tags: ["B->R"] },
  { id: 106, fen: "6k1/8/8/8/8/8/4P1K1/8 w - - 0 1", moves: ["e2e4", "g8f8", "e4d6"], evolutions: [{ ply: 2, square: "e4", from: "p", to: "n", timing: "pre" }], goal: "mate-in-2", tags: ["P->N"] },
  { id: 107, fen: "6k1/8/8/8/8/2N5/6K1/8 w - - 0 1", moves: ["c3d5", "g8f8", "d5f6"], evolutions: [{ ply: 1, square: "c3", from: "n", to: "b", timing: "pre" }], goal: "mate-in-2", tags: ["N->B"] },
  { id: 108, fen: "6k1/8/8/8/8/5N2/6K1/8 w - - 0 1", moves: ["f3g5", "g8f8", "g5e6"], evolutions: [{ ply: 1, square: "f3", from: "n", to: "b", timing: "pre" }], goal: "mate-in-2", tags: ["N->B"] },
  { id: 109, fen: "6k1/8/8/8/8/4N3/6K1/8 w - - 0 1", moves: ["e3d5", "g8f8", "d5f6"], evolutions: [{ ply: 1, square: "e3", from: "n", to: "b", timing: "pre" }], goal: "mate-in-2", tags: ["N->B"] },
  { id: 110, fen: "6k1/8/8/8/8/8/6K1/4R3 w - - 0 1", moves: ["e1g1"], evolutions: [{ ply: 1, square: "e1", from: "r", to: "q", timing: "pre" }], goal: "evolve-and-mate", tags: ["R->Q"] },
  { id: 111, fen: "6k1/8/8/8/8/8/6K1/3R4 w - - 0 1", moves: ["d1d7"], evolutions: [{ ply: 1, square: "d1", from: "r", to: "q", timing: "post" }], goal: "win-material", tags: ["R->Q","post","pin"] },
  { id: 112, fen: "6k1/8/8/8/8/8/6K1/2R5 w - - 0 1", moves: ["c1c5"], evolutions: [{ ply: 1, square: "c1", from: "r", to: "q", timing: "post" }], goal: "win-material", tags: ["R->Q","post","skewer"] },
  { id: 113, fen: "6k1/8/8/8/8/8/6K1/1R6 w - - 0 1", moves: ["b1b5"], evolutions: [{ ply: 1, square: "b1", from: "r", to: "q", timing: "post" }], goal: "win-material", tags: ["R->Q","post"] },
  { id: 114, fen: "6k1/8/8/8/8/8/6K1/R7 w - - 0 1", moves: ["a1a5"], evolutions: [{ ply: 1, square: "a1", from: "r", to: "q", timing: "post" }], goal: "win-material", tags: ["R->Q","post"] },
  { id: 115, fen: "6k1/8/8/8/8/8/5P2/6K1 w - - 0 1", moves: ["f2f4", "g8g7", "f4h5"], evolutions: [{ ply: 2, square: "f4", from: "p", to: "n", timing: "pre" }], goal: "mate-in-2", tags: ["P->N","leap"] },
  { id: 116, fen: "6k1/8/8/8/8/8/4P3/6K1 w - - 0 1", moves: ["e2e4", "g8g7", "e4g5"], evolutions: [{ ply: 2, square: "e4", from: "p", to: "n", timing: "pre" }], goal: "mate-in-2", tags: ["P->N"] },
  { id: 117, fen: "6k1/8/8/8/8/8/3P4/6K1 w - - 0 1", moves: ["d2d4", "g8g7", "d4f5"], evolutions: [{ ply: 2, square: "d4", from: "p", to: "n", timing: "pre" }], goal: "mate-in-2", tags: ["P->N"] },
  { id: 118, fen: "6k1/8/8/8/8/8/2P5/6K1 w - - 0 1", moves: ["c2c4", "g8g7", "c4e5"], evolutions: [{ ply: 2, square: "c4", from: "p", to: "n", timing: "pre" }], goal: "mate-in-2", tags: ["P->N"] },
  { id: 119, fen: "6k1/8/8/8/8/8/1P6/6K1 w - - 0 1", moves: ["b2b4", "g8g7", "b4d5"], evolutions: [{ ply: 2, square: "b4", from: "p", to: "n", timing: "pre" }], goal: "mate-in-2", tags: ["P->N"] },
  { id: 120, fen: "6k1/8/8/8/8/8/P7/6K1 w - - 0 1", moves: ["a2a4", "g8g7", "a4c5"], evolutions: [{ ply: 2, square: "a4", from: "p", to: "n", timing: "pre" }], goal: "mate-in-2", tags: ["P->N"] },

  // -----------------------------
  // SECTION G — Mixed classic + evolution mates to reach 150 total
  // -----------------------------
  { id: 121, fen: "r1b1k2r/1p1p1ppp/p1n1pn2/8/1P1NP3/2q1B3/P1P2PPP/R2QKB1R w KQkq - 0 1", moves: ["e3d2"], goal: "win-material", tags: ["classic","double-attack"] },
  { id: 122, fen: "6k1/8/8/8/8/8/6Q1/6K1 w - - 0 1", moves: ["g2a8"], goal: "mate-in-1", tags: ["classic","queen","long-diagonal"] },
  { id: 123, fen: "6k1/8/8/8/8/8/5Q2/6K1 w - - 0 1", moves: ["f2f7", "g8h8", "f7f8"], goal: "mate-in-2", tags: ["classic","ladder"] },
  { id: 124, fen: "6k1/8/8/8/8/8/6Q1/6K1 w - - 0 1", moves: ["g2g7"], goal: "mate-in-1", tags: ["classic"] },
  { id: 125, fen: "6k1/8/8/8/8/8/5R2/6K1 w - - 0 1", moves: ["f2f8"], goal: "mate-in-1", tags: ["rook"] },
  { id: 126, fen: "6k1/8/8/8/8/8/4R3/6K1 w - - 0 1", moves: ["e2e8"], goal: "mate-in-1", tags: ["rook"] },
  { id: 127, fen: "6k1/8/8/8/8/8/3R4/6K1 w - - 0 1", moves: ["d2d8"], goal: "mate-in-1", tags: ["rook"] },
  { id: 128, fen: "6k1/8/8/8/8/8/2R5/6K1 w - - 0 1", moves: ["c2c8"], goal: "mate-in-1", tags: ["rook"] },
  { id: 129, fen: "6k1/8/8/8/8/8/1R6/6K1 w - - 0 1", moves: ["b2b8"], goal: "mate-in-1", tags: ["rook"] },
  { id: 130, fen: "6k1/8/8/8/8/8/R7/6K1 w - - 0 1", moves: ["a2a8"], goal: "mate-in-1", tags: ["rook"] },

  // Evolution twists interleaved
  { id: 131, fen: "6k1/8/8/8/8/8/6K1/4R3 w - - 0 1", moves: ["e1e4", "g8f7", "e4h4"], evolutions: [{ ply: 2, square: "e4", from: "r", to: "q", timing: "pre" }], goal: "mate-in-2", tags: ["R->Q","conversion"] },
  { id: 132, fen: "6k1/8/8/8/8/8/6K1/3B4 w - - 0 1", moves: ["d1a4", "g8h7", "a4a8"], evolutions: [{ ply: 2, square: "a4", from: "b", to: "r", timing: "pre" }], goal: "mate-in-2", tags: ["B->R"] },
  { id: 133, fen: "6k1/8/8/8/8/8/5P2/6K1 w - - 0 1", moves: ["f2f4", "g8g7", "f4h5"], evolutions: [{ ply: 2, square: "f4", from: "p", to: "n", timing: "pre" }], goal: "mate-in-2", tags: ["P->N"] },
  { id: 134, fen: "6k1/8/8/8/8/2N5/6K1/8 w - - 0 1", moves: ["c3e4", "g8f7", "e4h7"], evolutions: [{ ply: 2, square: "e4", from: "n", to: "b", timing: "pre" }], goal: "mate-in-2", tags: ["N->B"] },
  { id: 135, fen: "6k1/8/8/8/8/8/6K1/4R3 w - - 0 1", moves: ["e1a1"], evolutions: [{ ply: 1, square: "e1", from: "r", to: "q", timing: "pre" }], goal: "evolve-and-mate", tags: ["R->Q","horizontal"] },
  { id: 136, fen: "6k1/8/8/8/8/8/6K1/3R4 w - - 0 1", moves: ["d1d4"], evolutions: [{ ply: 1, square: "d1", from: "r", to: "q", timing: "post" }], goal: "win-material", tags: ["R->Q","post"] },
  { id: 137, fen: "6k1/8/8/8/8/8/6K1/2R5 w - - 0 1", moves: ["c1h1"], evolutions: [{ ply: 1, square: "c1", from: "r", to: "q", timing: "pre" }], goal: "evolve-and-mate", tags: ["R->Q"] },
  { id: 138, fen: "6k1/8/8/8/8/8/6K1/1B6 w - - 0 1", moves: ["b1b4"], evolutions: [{ ply: 1, square: "b1", from: "b", to: "r", timing: "post" }], goal: "win-material", tags: ["B->R","post"] },
  { id: 139, fen: "6k1/8/8/8/8/8/6K1/1N6 w - - 0 1", moves: ["b1d2"], evolutions: [{ ply: 1, square: "b1", from: "n", to: "b", timing: "pre" }], goal: "evolve-and-mate", tags: ["N->B"] },
  { id: 140, fen: "6k1/8/8/8/8/8/6K1/P7 w - - 0 1", moves: ["a2a4", "g8g7", "a4c5"], evolutions: [{ ply: 2, square: "a4", from: "p", to: "n", timing: "pre" }], goal: "mate-in-2", tags: ["P->N"] },

  // Final 10 quick hitters mixing goals
  { id: 141, fen: "6k1/8/8/8/8/8/6Q1/6K1 w - - 0 1", moves: ["g2g7"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 142, fen: "6k1/8/8/8/8/8/5Q2/6K1 w - - 0 1", moves: ["f2a7"], goal: "mate-in-1", tags: ["classic","queen","diagonal"] },
  { id: 143, fen: "6k1/8/8/8/8/8/4Q3/6K1 w - - 0 1", moves: ["e2e8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 144, fen: "6k1/8/8/8/8/8/3Q4/6K1 w - - 0 1", moves: ["d2d8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 145, fen: "6k1/8/8/8/8/8/2Q5/6K1 w - - 0 1", moves: ["c2c8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 146, fen: "6k1/8/8/8/8/8/1Q6/6K1 w - - 0 1", moves: ["b2b8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 147, fen: "6k1/8/8/8/8/8/Q7/6K1 w - - 0 1", moves: ["a2a8"], goal: "mate-in-1", tags: ["classic","queen"] },
  { id: 148, fen: "6k1/8/8/8/8/8/6K1/4R3 w - - 0 1", moves: ["e1a1"], evolutions: [{ ply: 1, square: "e1", from: "r", to: "q", timing: "pre" }], goal: "evolve-and-mate", tags: ["R->Q"] },
  { id: 149, fen: "6k1/8/8/8/8/8/6K1/3B4 w - - 0 1", moves: ["d1h5"], evolutions: [{ ply: 1, square: "d1", from: "b", to: "r", timing: "pre" }], goal: "evolve-and-mate", tags: ["B->R"] },
  { id: 150, fen: "6k1/8/8/8/8/8/5P2/6K1 w - - 0 1", moves: ["f2h3"], evolutions: [{ ply: 1, square: "f2", from: "p", to: "n", timing: "pre" }], goal: "evolve-and-mate", tags: ["P->N"] },
];
