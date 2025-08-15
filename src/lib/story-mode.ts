
import type { PieceSymbol } from "./types";

export type Role = "p" | "n" | "b" | "r";
export type PromoRole = "n" | "b" | "r" | "q";

export interface EvolutionStep {
  ply: number;
  square: string;
  from: Role;
  to: PromoRole;
  timing: "pre" | "post";
}

export interface Puzzle {
  id: number;
  fen: string;
  moves: string[]; // UCI moves
  evolutions?: EvolutionStep[];
  goal: string;
  tags: string[];
  narrative?: string;
  hint?: string;
  lives?: number;
  title?: string;
}

export const puzzles: Puzzle[] = [
  // --- Level 1-5: The Basics of Checkmate (Mate in 1) ---
  {
    id: 1,
    title: "The Queen's Arrival",
    fen: "6k1/8/8/8/8/8/5Q2/6K1 w - - 0 1",
    moves: ["f2f8"],
    goal: "mate-in-1",
    tags: ["classic", "queen", "back-rank"],
    narrative: "Your Queen sees an opening. Seize the opportunity to strike the final blow!",
    hint: "The enemy king is trapped on the back rank. Can your queen deliver checkmate directly?",
    lives: 3
  },
  {
    id: 2,
    title: "The Rook's Power",
    fen: "6k1/8/8/8/8/8/8/R5K1 w - - 0 1",
    moves: ["a1a8"],
    goal: "mate-in-1",
    tags: ["classic", "rook", "back-rank"],
    narrative: "The enemy king is exposed. A straightforward assault with your Rook should end this.",
    hint: "Sometimes the most direct path is the best one. Where can the rook go to checkmate?",
    lives: 3
  },
  {
    id: 3,
    title: "The Knight's Leap",
    fen: "7k/7p/8/8/8/8/6N1/6K1 w - - 0 1",
    moves: ["g2f7"],
    goal: "mate-in-1",
    tags: ["classic", "knight", "smothered"],
    narrative: "The king thinks he is safe behind his pawn, but your Knight knows a different path.",
    hint: "The Knight's unique L-shaped move can attack squares that other pieces cannot.",
    lives: 3
  },
  {
    id: 4,
    title: "The Bishop's Snipe",
    fen: "6k1/8/8/8/8/8/8/1B4K1 w - - 0 1",
    moves: ["b1a2"],
    goal: "mate-in-1",
    tags: ["classic", "bishop", "diagonal"],
    narrative: "From across the board, your Bishop has a clear line of sight. End the battle.",
    hint: "Look for the long diagonal that leads directly to the enemy king.",
    lives: 3
  },
  {
    id: 5,
    title: "Two Rooks",
    fen: "8/6k1/8/8/8/8/R7/R5K1 w - - 0 1",
    moves: ["a7a8"],
    goal: "mate-in-1",
    tags: ["classic", "rook", "teamwork"],
    narrative: "With two rooks working together, the enemy king has nowhere to run.",
    hint: "One rook can cut off escape routes while the other delivers the final check.",
    lives: 3
  },
  // --- Level 6-10: Mate in 2 ---
  {
    id: 6,
    title: "The Ladder",
    fen: "2k5/8/8/8/8/8/8/K2R2R1 w - - 0 1",
    moves: ["g1g8", "c8b7", "d1d7"],
    goal: "mate-in-2",
    tags: ["classic", "rook", "ladder"],
    narrative: "Force the king into a corner, then deliver the final blow. A classic tactic.",
    hint: "Use one rook to force the king to move, then use the other to checkmate on the next turn.",
    lives: 3
  },
  {
    id: 7,
    title: "Queen's Sacrifice",
    fen: "1k6/1p6/8/8/8/8/6Q1/K7 w - - 0 1",
    moves: ["g2b7", "b8b7", "a1b2"],
    goal: "mate-in-2",
    tags: ["classic", "queen", "sacrifice"],
    narrative: "Sometimes, a great sacrifice is needed to achieve victory.",
    hint: "Sacrifice your Queen to draw the king out, then use your king to win. Wait, that's not right. The book must be wrong. Find the real mate!",
    lives: 3,
    // Note: The hint is a red herring. The actual mate is different.
    // The real solution is Qb7, then after Kxb7 it is stalemate. The student must find the *actual* mate-in-2.
    // Let's fix this puzzle to be a real mate in 2.
    // New setup:
    fen: "6k1/8/5Q2/8/8/8/8/K7 w - - 0 1",
    moves: ["f6e7", "g8h8", "e7f8"],
    narrative: "Lure the king into the perfect position, then strike.",
    hint: "Your first move should restrict the king's movement without giving check."
  },
  {
    id: 8,
    title: "Discovered Attack",
    fen: "5k2/8/8/8/8/2N1R3/8/K7 w - - 0 1",
    moves: ["c3d5", "f8f7", "e3f3"],
    goal: "mate-in-2",
    tags: ["classic", "knight", "discovered-attack"],
    narrative: "Move one piece to unleash the power of another. A deadly combination.",
    hint: "Move your Knight to a square that forces the king to move into the Rook's line of fire.",
    lives: 3
  },
  {
    id: 9,
    title: "Pawn Promotion",
    fen: "6k1/5P2/8/8/8/8/8/K7 w - - 0 1",
    moves: ["f7f8q", "g8f8", "a1b2"],
    goal: "mate-in-2",
    tags: ["classic", "pawn", "promotion"],
    narrative: "A lowly pawn reaches the end of its journey. What power will it become?",
    hint: "Promote your pawn to a Queen to force a checkmate.",
    lives: 3
  },
  {
    id: 10,
    title: "Smothered Mate",
    fen: "6k1/8/6N1/8/8/8/8/K7 w - - 0 1",
    moves: ["g6e7", "g8h8", "e7f8"],
    goal: "mate-in-2",
    tags: ["classic", "knight", "smothered"],
    narrative: "The king is trapped by his own pieces. A cunning Knight can deliver the final blow.",
    hint: "Use your Knight to force the king into the corner, then deliver a checkmate that he cannot escape from.",
    lives: 3
  },
  // --- Level 11-15: Introduction to Evolution ---
  {
    id: 11,
    title: "Pawn's First Leap",
    fen: "rnbqkbnr/pppp1ppp/8/8/3pP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
    moves: ["f1d3", "d4c3", "b1c3"],
    goal: "evolve-and-mate",
    tags: ["evolution", "P->N"],
    narrative: "Your pawn captures a piece and feels a surge of power, transforming into a Knight! Use its new abilities.",
    hint: "After capturing the pawn on c3, your pawn evolves. Use the new Knight to control the center.",
    lives: 2
  },
  {
    id: 12,
    title: "Knight to Bishop",
    fen: "r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
    moves: ["f1b5", "c6d4", "f3d4"],
    goal: "evolve-and-mate",
    tags: ["evolution", "N->B"],
    narrative: "Your Knight captures the enemy, evolving into a Bishop. A new path to victory opens up.",
    hint: "After your Knight captures on d4, it becomes a Bishop. Notice how it now controls a different set of squares.",
    lives: 2
  },
  {
    id: 13,
    title: "Bishop to Rook",
    fen: "rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4",
    moves: ["f3d4", "g8f6", "f1d3"],
    goal: "win-material",
    tags: ["evolution", "B->R"],
    narrative: "A simple capture transforms your Bishop into a mighty Rook. Control the open files!",
    hint: "This puzzle requires you to make a capture that evolves your bishop. Use the new Rook to dominate the board.",
    lives: 2
  },
  {
    id: 14,
    title: "Rook to Queen",
    fen: "rnbqk2r/ppppbppp/5n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 1 5",
    moves: ["c4f7", "e8f7", "f3e5"],
    goal: "win-material",
    tags: ["evolution", "R->Q"],
    narrative: "Your Rook makes a key capture and ascends to become a Queen, the most powerful piece on the board.",
    hint: "Sacrifice your Bishop to expose the king, then bring your Rook in for a capture and evolution.",
    lives: 2
  },
  {
    id: 15,
    title: "Chain Evolution",
    fen: "8/k7/8/8/8/8/p1K5/8 b - - 0 1",
    moves: ["a2a1n", "c2b2", "a1c2"],
    goal: "evolve-and-mate",
    tags: ["evolution", "P->N", "N->B"],
    narrative: "This requires multiple evolutions to succeed. Plan your moves carefully.",
    hint: "First, promote your pawn to a Knight to check the king. Then, use the Knight to capture and evolve again.",
    lives: 1
  },
  // --- Level 16-20: Advanced Tactics ---
  {
    id: 16,
    title: "The Windmill",
    fen: "6k1/5p1p/6p1/8/8/6r1/P4R2/K7 w - - 0 1",
    moves: ["f2f7", "g8f7", "a2a4"],
    goal: "win-material",
    tags: ["advanced", "rook", "windmill"],
    narrative: "Use a series of checks to pick off the enemy's defenses one by one.",
    hint: "A 'windmill' tactic involves a repeating pattern of check and capture.",
    lives: 2
  },
  {
    id: 17,
    title: "Deflection",
    fen: "6k1/5p2/6p1/7p/7P/8/5q2/K7 w - - 0 1",
    moves: ["a1b1", "f2f1", "b1c2"],
    goal: "win-material",
    tags: ["advanced", "queen", "deflection"],
    narrative: "Lure the enemy Queen away from her defensive duties to win material.",
    hint: "Force the queen to move, leaving a valuable piece undefended.",
    lives: 2
  },
  {
    id: 18,
    title: "Overloading",
    fen: "6k1/5p2/6p1/7p/7P/8/5q2/K7 w - - 0 1",
    moves: ["a1b1", "f2h4", "b1c2"],
    goal: "win-material",
    tags: ["advanced", "queen", "overloading"],
    narrative: "One piece can't do two jobs at once. Find the overloaded defender and exploit it.",
    hint: "Identify a piece that is defending two other pieces, then attack one of them.",
    lives: 2
  },
  {
    id: 19,
    title: "Clearance Sacrifice",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5",
    moves: ["f3e5", "c6e5", "d2d4"],
    goal: "win-material",
    tags: ["advanced", "sacrifice", "clearance"],
    narrative: "Sacrifice a piece to clear a path for a more powerful attack.",
    hint: "Give up your Knight to open up a line for your pawn to attack the Bishop.",
    lives: 2
  },
  {
    id: 20,
    title: "Zugzwang",
    fen: "8/8/8/8/8/p1k5/P1K5/8 w - - 0 1",
    moves: ["c2b1", "c3b4", "b1c2"],
    goal: "win-material",
    tags: ["advanced", "king", "zugzwang"],
    narrative: "Force your opponent into a position where any move they make will worsen their situation.",
    hint: "Triangulate with your king to put the opponent in Zugzwang, forcing them to give up the pawn.",
    lives: 1
  },
  // --- Level 21-25: Evolution Mastery ---
  {
    id: 21,
    title: "Knight's Path to Victory",
    fen: "8/8/8/8/4k3/8/3p4/3K4 b - - 0 1",
    moves: ["d2d1n", "d1c3", "e4d3"],
    goal: "evolve-and-mate",
    tags: ["evolution", "mastery", "P->N"],
    narrative: "Only by evolving into a Knight can this pawn secure the win. A true test of foresight.",
    hint: "Underpromoting to a Knight is the only way to win this endgame.",
    lives: 1
  },
  {
    id: 22,
    title: "The Evolved Fork",
    fen: "rnb1kbnr/pppp1ppp/8/4p3/6Pq/8/PPPPPP1P/RNBQKBNR w KQkq - 0 3",
    moves: ["f1h3", "h4g4", "h3g4"],
    goal: "evolve-and-mate",
    tags: ["evolution", "mastery", "B->R"],
    narrative: "Evolve your Bishop into a Rook to create a devastating fork.",
    hint: "After capturing on g4, your new Rook will be able to attack two pieces at once.",
    lives: 1
  },
  {
    id: 23,
    title: "The Long Road",
    fen: "8/8/8/8/8/k7/p7/K7 b - - 0 1",
    moves: ["a2a1n", "a1c2", "b2c2"],
    goal: "evolve-and-mate",
    tags: ["evolution", "mastery", "P->N", "N->B"],
    narrative: "This puzzle requires a promotion and then another evolution to checkmate the cornered king.",
    hint: "Promote to a Knight, then use it to capture and evolve into a Bishop for the final move.",
    lives: 1
  },
  {
    id: 24,
    title: "Positional Evolution",
    fen: "r3k2r/ppp1qppp/2np1n2/2b1p1B1/2B1P1b1/2NP1N2/PPP2PPP/R2Q1RK1 w kq - 2 8",
    moves: ["c3d5", "g4f3", "g5f6"],
    goal: "win-material",
    tags: ["evolution", "mastery", "N->B"],
    narrative: "Sometimes, evolving a piece is not for an immediate attack, but to improve your position for the long game.",
    hint: "Evolve your Knight into a Bishop to put pressure on the queen and control key diagonals.",
    lives: 2
  },
  {
    id: 25,
    title: "The Final Transformation",
    fen: "r1b1k2r/pppq1ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w kq - 1 7",
    moves: ["c4f7", "e8f7", "f3g5"],
    goal: "win-material",
    tags: ["evolution", "mastery", "B->R", "R->Q"],
    narrative: "Evolve a Bishop to a Rook, then the Rook to a Queen to completely dominate the board.",
    hint: "This multi-step evolution will leave you with a decisive material advantage.",
    lives: 1
  },
  // --- Level 26-30: Grandmaster Challenges ---
  {
    id: 26,
    title: "The Immortal Game",
    fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
    moves: ["f2f4", "e5f4", "f1c4"],
    goal: "win-material",
    tags: ["grandmaster", "classic", "sacrifice"],
    narrative: "A famous sequence from one of the most celebrated games in chess history. Can you find the path to victory?",
    hint: "This is the King's Gambit. It involves sacrificing a pawn for rapid development.",
    lives: 2
  },
  {
    id: 27,
    title: "Kasparov's Octopus",
    fen: "r2q1rk1/p2b1pbp/1pn1pnp1/2pp4/2PP4/1PN1PNP1/PB3PBP/R2Q1RK1 w - - 0 12",
    moves: ["d1e2", "c5d4", "e3d4"],
    goal: "win-material",
    tags: ["grandmaster", "kasparov", "knight"],
    narrative: "Garry Kasparov was known for his powerful Knights. Emulate his style to dominate the center.",
    hint: "A strong Knight on d5, supported by other pieces, can be a winning advantage.",
    lives: 2
  },
  {
    id: 28,
    title: "Fischer's Fury",
    fen: "r1bq1rk1/pp1n1pbp/2p1p1p1/3n4/3P4/2N1PNP1/PP3PBP/R1BQ1RK1 w - - 1 10",
    moves: ["e3e4", "d5c3", "b2c3"],
    goal: "win-material",
    tags: ["grandmaster", "fischer", "pawn-structure"],
    narrative: "Bobby Fischer was a master of pawn structures. Create a powerful pawn center to control the game.",
    hint: "Challenge the opponent's control of the center with your own pawns.",
    lives: 2
  },
  {
    id: 29,
    title: "The Evolutionary Endgame",
    fen: "8/8/8/4k3/8/8/1p1K4/8 b - - 0 1",
    moves: ["b2b1n", "d2c3", "b1d2"],
    goal: "evolve-and-mate",
    tags: ["grandmaster", "evolution", "endgame"],
    narrative: "In this difficult endgame, only a very specific evolution can secure the win. A true test of a grandmaster.",
    hint: "Promoting to a Queen would result in a stalemate. You must underpromote to a Knight.",
    lives: 1
  },
  {
    id: 30,
    title: "The Final Test",
    fen: "3r1k2/p4p2/1p2p3/2p5/2P5/1P2P3/P4PPP/3R2K1 w - - 0 1",
    moves: ["d1d8", "f8e7", "d8a8"],
    goal: "win-material",
    tags: ["grandmaster", "rook", "endgame"],
    narrative: "You have reached the final challenge. Use your knowledge of tactics and evolution to win this complex Rook endgame.",
    hint: "Activate your Rook and create threats that your opponent cannot defend against.",
    lives: 1
  }
];
