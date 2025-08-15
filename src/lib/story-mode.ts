
import type { PieceSymbol } from "./types";

export type Role = "p" | "n" | "b" | "r";
export type PromoRole = "n" | "b" | "r" | "q";

export interface Puzzle {
  id: number;
  title: string;
  fen: string;
  moves: string[]; // UCI moves
  goal: string;
  tags: string[];
  narrative?: string;
  hint?: string;
  lives?: number;
}

export const puzzles: Puzzle[] = [
  // --- Section 1: The Basics (Mate in 1) ---
  {
    id: 1,
    title: "The Queen's Arrival",
    fen: "6k1/8/8/8/8/8/5Q2/6K1 w - - 0 1",
    moves: ["f2f8"],
    goal: "Mate in 1",
    tags: ["classic", "queen", "back-rank"],
    narrative: "Your Queen sees an opening. Seize the opportunity to strike the final blow!",
    hint: "The enemy king is trapped on the back rank. Can your queen deliver checkmate directly?",
    lives: 3
  },
  {
    id: 2,
    title: "Rook's Power Play",
    fen: "8/k7/8/8/8/8/8/R5K1 w - - 0 1",
    moves: ["a1a7"],
    goal: "Mate in 1",
    tags: ["classic", "rook", "back-rank"],
    narrative: "The enemy king is exposed. A straightforward assault with your Rook should end this.",
    hint: "Sometimes the most direct path is the best one. Where can the rook go to checkmate?",
    lives: 3
  },
  {
    id: 3,
    title: "Knight's Angle",
    fen: "6k1/8/6N1/8/8/8/8/6K1 w - - 0 1",
    moves: ["g6e7"],
    goal: "Mate in 1",
    tags: ["classic", "knight"],
    narrative: "The king thinks he is safe, but your Knight knows a different path.",
    hint: "The Knight's unique L-shaped move can attack squares that other pieces cannot.",
    lives: 3
  },
  {
    id: 4,
    title: "Bishop's Snipe",
    fen: "5k2/8/8/8/8/8/B7/7K w - - 0 1",
    moves: ["a2d5"],
    goal: "Mate in 1",
    tags: ["classic", "bishop", "diagonal"],
    narrative: "From across the board, your Bishop has a clear line of sight. End the battle.",
    hint: "Look for the long diagonal that leads directly to the enemy king.",
    lives: 3
  },
  {
    id: 5,
    title: "Two Rook Ladder",
    fen: "8/8/k7/8/8/8/R7/R5K1 w - - 0 1",
    moves: ["a2a6"],
    goal: "Mate in 1",
    tags: ["classic", "rook", "teamwork"],
    narrative: "With two rooks working together, the enemy king has nowhere to run.",
    hint: "One rook can cut off escape routes while the other delivers the final check.",
    lives: 3
  },
  // --- Section 2: Mate in 2 ---
  {
    id: 6,
    title: "The Lure",
    fen: "r1b2rk1/pp3ppp/2n1pn2/q2p4/3P1B2/P1Q1PN2/1P3PPP/2R1KB1R b Kk - 0 12",
    moves: ["a5c3", "c1c3"],
    goal: "Win Material",
    tags: ["classic", "queen-trade", "tactic"],
    narrative: "Sometimes, trading your most powerful piece can lead to a better position.",
    hint: "Lure the rook to c3, then what can you do?",
    lives: 3,
  },
  {
    id: 7,
    title: "Discovered Attack",
    fen: "1r3k2/5p2/5R2/8/8/4N3/5K2/8 w - - 0 1",
    moves: ["e3f5", "b8b2", "f2g3"],
    goal: "Mate in 2",
    tags: ["classic", "knight", "discovered-attack"],
    narrative: "Move one piece to unleash the power of another. A deadly combination.",
    hint: "Move your Knight to a square that forces the king to move into the Rook's line of fire.",
    lives: 3,
  },
  {
    id: 8,
    title: "Pawn Promotion",
    fen: "5k2/P7/8/8/8/8/8/1K6 w - - 0 1",
    moves: ["a7a8q", "f8e7", "a8e8"],
    goal: "Mate in 2",
    tags: ["classic", "pawn", "promotion"],
    narrative: "A lowly pawn reaches the end of its journey. What power will it become?",
    hint: "Promote your pawn to a Queen to force a checkmate.",
    lives: 3
  },
  {
    id: 9,
    title: "Smothered Mate",
    fen: "rnb1kbnr/pp3ppp/2pp4/4p1q1/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 5",
    moves: ["f3g5"],
    goal: "Win Material",
    tags: ["classic", "knight", "smothered"],
    narrative: "The king is trapped by his own pieces. A cunning Knight can deliver the final blow.",
    hint: "The queen is undefended.",
    lives: 3
  },
  {
    id: 10,
    title: "The Windmill",
    fen: "6k1/5p1p/6p1/8/8/6r1/P4R2/K7 w - - 0 1",
    moves: ["f2f7", "g8f7", "a2a4"],
    goal: "Win Material",
    tags: ["advanced", "rook", "windmill"],
    narrative: "Use a series of checks to pick off the enemy's defenses one by one.",
    hint: "A 'windmill' tactic involves a repeating pattern of check and capture.",
    lives: 2
  },
  // --- Section 3: Introduction to Evolution ---
  {
    id: 11,
    title: "Pawn's First Leap",
    fen: "rnbqkbnr/pppp1ppp/8/4p3/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
    moves: ["d4e5"],
    goal: "Evolve and Win",
    tags: ["evolution", "P->N"],
    narrative: "Your pawn captures a piece and feels a surge of power, transforming into a Knight! Use its new abilities.",
    hint: "Capture the pawn on e5 to evolve. The new knight will control key squares.",
    lives: 2,
  },
  {
    id: 12,
    title: "Knight to Bishop",
    fen: "r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
    moves: ["f3d4"],
    goal: "Evolve and Win",
    tags: ["evolution", "N->B"],
    narrative: "Your Knight captures the enemy, evolving into a Bishop. A new path to victory opens up.",
    hint: "After your Knight captures on d4, it becomes a Bishop. Notice how it now controls a different set of squares.",
    lives: 2
  },
  {
    id: 13,
    title: "Bishop to Rook",
    fen: "rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4",
    moves: ["f3d4"],
    goal: "Evolve and Win",
    tags: ["evolution", "B->R"],
    narrative: "A simple capture transforms your Bishop into a mighty Rook. Control the open files!",
    hint: "This puzzle requires you to make a capture that evolves your bishop. Use the new Rook to dominate the board.",
    lives: 2,
  },
  {
    id: 14,
    title: "Rook to Queen",
    fen: "rnbqk2r/ppppbppp/5n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 1 5",
    moves: ["c4f7", "e8f7", "f3e5"],
    goal: "Evolve and Win",
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
    goal: "Evolve and Mate",
    tags: ["evolution", "P->N", "N->B"],
    narrative: "This requires multiple evolutions to succeed. Plan your moves carefully.",
    hint: "First, promote your pawn to a Knight to check the king. Then, use the Knight to capture and evolve again.",
    lives: 1
  },
  // --- Section 4: Advanced Tactics ---
  {
    id: 16,
    title: "Deflection",
    fen: "6k1/5p2/6p1/7p/7P/8/5q2/K7 w - - 0 1",
    moves: ["a1b1", "f2f1", "b1c2"],
    goal: "Win Material",
    tags: ["advanced", "queen", "deflection"],
    narrative: "Lure the enemy Queen away from her defensive duties to win material.",
    hint: "Force the queen to move, leaving a valuable piece undefended.",
    lives: 2,
  },
  {
    id: 17,
    title: "Overloading",
    fen: "r1bq1rk1/1p2bppp/p1np1n2/4p3/4P3/1NN1B3/PPPQBPPP/R3K2R w KQ - 4 10",
    moves: ["c3d5"],
    goal: "Win Material",
    tags: ["advanced", "knight", "overloading"],
    narrative: "One piece can't do two jobs at once. Find the overloaded defender and exploit it.",
    hint: "The knight on f6 is defending both e5 and d5.",
    lives: 2
  },
  {
    id: 18,
    title: "Clearance Sacrifice",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5",
    moves: ["f3e5", "c6e5", "d2d4"],
    goal: "Win Material",
    tags: ["advanced", "sacrifice", "clearance"],
    narrative: "Sacrifice a piece to clear a path for a more powerful attack.",
    hint: "Give up your Knight to open up a line for your pawn to attack the Bishop.",
    lives: 2
  },
  {
    id: 19,
    title: "Zugzwang",
    fen: "8/8/8/8/8/p1k5/P1K5/8 w - - 0 1",
    moves: ["c2b1", "c3b4", "b1c2"],
    goal: "Win Material",
    tags: ["advanced", "king", "zugzwang"],
    narrative: "Force your opponent into a position where any move they make will worsen their situation.",
    hint: "Triangulate with your king to put the opponent in Zugzwang, forcing them to give up the pawn.",
    lives: 1
  },
  {
    id: 20,
    title: "The Knight's Tour",
    fen: "8/8/8/4k3/8/8/3p4/3K4 b - - 0 1",
    moves: ["d2d1n", "d1c3", "e4d3"],
    goal: "Evolve and Win",
    tags: ["evolution", "mastery", "P->N"],
    narrative: "Only by evolving into a Knight can this pawn secure the win. A true test of foresight.",
    hint: "Underpromoting to a Knight is the only way to win this endgame.",
    lives: 1
  },
  // --- Section 5: Evolution Mastery ---
  {
    id: 21,
    title: "The Evolved Fork",
    fen: "rnb1kbnr/pppp1ppp/8/4p3/6Pq/8/PPPPPP1P/RNBQKBNR w KQkq - 0 3",
    moves: ["f1h3", "h4g4", "h3g4"],
    goal: "Evolve and Win",
    tags: ["evolution", "mastery", "B->R"],
    narrative: "Evolve your Bishop into a Rook to create a devastating fork.",
    hint: "After capturing on g4, your new Rook will be able to attack two pieces at once.",
    lives: 1
  },
  {
    id: 22,
    title: "The Long Road",
    fen: "8/8/8/8/8/k7/p7/K7 b - - 0 1",
    moves: ["a2a1n", "a1c2", "b2c2"],
    goal: "Evolve and Mate",
    tags: ["evolution", "mastery", "P->N", "N->B"],
    narrative: "This puzzle requires a promotion and then another evolution to checkmate the cornered king.",
    hint: "Promote to a Knight, then use it to capture and evolve into a Bishop for the final move.",
    lives: 1
  },
  {
    id: 23,
    title: "Positional Evolution",
    fen: "r3k2r/ppp1qppp/2np1n2/2b1p1B1/2B1P1b1/2NP1N2/PPP2PPP/R2Q1RK1 w kq - 2 8",
    moves: ["c3d5", "g4f3", "g5f6"],
    goal: "Win Material",
    tags: ["evolution", "mastery", "N->B"],
    narrative: "Sometimes, evolving a piece is not for an immediate attack, but to improve your position for the long game.",
    hint: "Evolve your Knight into a Bishop to put pressure on the queen and control key diagonals.",
    lives: 2
  },
  {
    id: 24,
    title: "The Final Transformation",
    fen: "r1b1k2r/pppq1ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w kq - 1 7",
    moves: ["c4f7", "e8f7", "f3g5"],
    goal: "Win Material",
    tags: ["evolution", "mastery", "B->R", "R->Q"],
    narrative: "Evolve a Bishop to a Rook, then the Rook to a Queen to completely dominate the board.",
    hint: "This multi-step evolution will leave you with a decisive material advantage.",
    lives: 1
  },
  {
    id: 25,
    title: "The Immortal Game",
    fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
    moves: ["f2f4", "e5f4", "f1c4"],
    goal: "Win Material",
    tags: ["grandmaster", "classic", "sacrifice"],
    narrative: "A famous sequence from one of the most celebrated games in chess history. Can you find the path to victory?",
    hint: "This is the King's Gambit. It involves sacrificing a pawn for rapid development.",
    lives: 2
  },
  // --- Section 6: Grandmaster Challenges ---
  {
    id: 26,
    title: "Kasparov's Octopus",
    fen: "r2q1rk1/p2b1pbp/1pn1pnp1/2pp4/2PP4/1PN1PNP1/PB3PBP/R2Q1RK1 w - - 0 12",
    moves: ["d1e2", "c5d4", "e3d4"],
    goal: "Win Material",
    tags: ["grandmaster", "kasparov", "knight"],
    narrative: "Garry Kasparov was known for his powerful Knights. Emulate his style to dominate the center.",
    hint: "A strong Knight on d5, supported by other pieces, can be a winning advantage.",
    lives: 2
  },
  {
    id: 27,
    title: "Fischer's Fury",
    fen: "r1bq1rk1/pp1n1pbp/2p1p1p1/3n4/3P4/2N1PNP1/PP3PBP/R1BQ1RK1 w - - 1 10",
    moves: ["e3e4", "d5c3", "b2c3"],
    goal: "Win Material",
    tags: ["grandmaster", "fischer", "pawn-structure"],
    narrative: "Bobby Fischer was a master of pawn structures. Create a powerful pawn center to control the game.",
    hint: "Challenge the opponent's control of the center with your own pawns.",
    lives: 2
  },
  {
    id: 28,
    title: "The Evolutionary Endgame",
    fen: "8/8/8/4k3/8/8/1p1K4/8 b - - 0 1",
    moves: ["b2b1n", "d2c3", "b1d2"],
    goal: "Evolve and Mate",
    tags: ["grandmaster", "evolution", "endgame"],
    narrative: "In this difficult endgame, only a very specific evolution can secure the win. A true test of a grandmaster.",
    hint: "Promoting to a Queen would result in a stalemate. You must underpromote to a Knight.",
    lives: 1
  },
  {
    id: 29,
    title: "The Final Test",
    fen: "3r1k2/p4p2/1p2p3/2p5/2P5/1P2P3/P4PPP/3R2K1 w - - 0 1",
    moves: ["d1d8", "f8e7", "d8a8"],
    goal: "Win Material",
    tags: ["grandmaster", "rook", "endgame"],
    narrative: "You have reached the final challenge. Use your knowledge of tactics and evolution to win this complex Rook endgame.",
    hint: "Activate your Rook and create threats that your opponent cannot defend against.",
    lives: 1
  },
  {
    id: 30,
    title: "A parting gift",
    fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    moves: ["g1f3"],
    goal: "Make a move",
    tags: ["opening"],
    narrative: "Thank you for playing Evolving Chess. We hope you enjoyed the journey.",
    hint: "There is no wrong answer here. Play your favorite opening move.",
    lives: 1
  }
];
