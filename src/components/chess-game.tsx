"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import type { PieceSymbol, Square, Color } from 'chess.js';
import { generateChessMove } from '@/ai/flows/generate-chess-move';
import { playMoveSound, playCaptureSound, playEvolveSound, playCheckSound, playGameOverSound, useTone } from '@/lib/sounds';

import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import ChessBoard from '@/components/chess-board';
import { EvolutionDialog } from '@/components/evolution-dialog';
import { Loader } from '@/components/ui/loader';

type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Grandmaster';
type EvolutionMove = { from: Square; to: Square; piece: PieceSymbol, captured: PieceSymbol };
type LastMove = { from: Square; to: Square; };

const getEvolution = (piece: PieceSymbol): PieceSymbol | null => {
  const evolutionMap: Partial<Record<PieceSymbol, PieceSymbol>> = {
    p: 'b', b: 'n', n: 'r', r: 'q',
  };
  return evolutionMap[piece.toLowerCase() as PieceSymbol] || null;
};

export default function ChessGame() {
  useTone(); // Initialize audio context on user interaction
  const [game, setGame] = useState(new Chess());
  const [board, setBoard] = useState(game.board());
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [playerColor] = useState<Color>('w');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [status, setStatus] = useState("White's turn to move.");
  const [evolutionPrompt, setEvolutionPrompt] = useState<EvolutionMove | null>(null);
  const [lastMove, setLastMove] = useState<LastMove | null>(null);
  const [shiningPiece, setShiningPiece] = useState<Square | null>(null);
  
  const isGameOver = useMemo(() => game.isGameOver(), [game]);

  const updateStatus = useCallback(() => {
    let newStatus = game.turn() === 'w' ? "White's turn." : "Black's turn.";
    if (isGameOver) {
      if (game.isCheckmate()) {
        newStatus = `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins.`;
        playGameOverSound();
      } else if (game.isDraw()) {
        newStatus = "Draw!";
        playGameOverSound();
      } else {
        newStatus = "Game Over.";
      }
    } else if (game.inCheck()) {
      newStatus = `Check! ${newStatus}`;
      playCheckSound();
    }
    setStatus(newStatus);
  }, [game, isGameOver]);

  useEffect(() => {
    updateStatus();
  }, [board, updateStatus]);

  const triggerAiMove = useCallback(async () => {
    if (isGameOver || game.turn() === playerColor) return;

    setIsAiThinking(true);
    try {
      const fen = game.fen();
      const response = await generateChessMove({ boardState: fen, difficulty });
      const move = game.move(response.move, { sloppy: true });
      if (move) {
        setLastMove({ from: move.from, to: move.to });
        playMoveSound();
      }
    } catch (error) {
      console.error("AI move failed:", error);
      // Fallback to a random move if AI fails
      const moves = game.moves();
      const move = moves[Math.floor(Math.random() * moves.length)];
      game.move(move);
    }
    
    setBoard(game.board());
    setIsAiThinking(false);
  }, [game, difficulty, playerColor, isGameOver]);

  useEffect(() => {
    if (game.turn() !== playerColor && !isGameOver) {
      const timer = setTimeout(triggerAiMove, 500);
      return () => clearTimeout(timer);
    }
  }, [game, playerColor, isGameOver, triggerAiMove, board]);


  const handleMove = (from: Square, to: Square) => {
    if (isGameOver || game.turn() !== playerColor) return;
    
    let moveResult = null;
    try {
      const gameCopy = new Chess(game.fen());
      moveResult = gameCopy.move({ from, to, promotion: 'q' });
      if (!moveResult) return;
      
      setLastMove({ from, to });
      
      if (moveResult.captured) {
        playCaptureSound();
        const evolvingPiece = moveResult.piece;
        if (getEvolution(evolvingPiece)) {
          setEvolutionPrompt({ from, to, piece: evolvingPiece, captured: moveResult.captured });
          // Don't update game state yet, wait for user choice
          return;
        }
      } else {
        playMoveSound();
      }
      
      game.move({ from, to, promotion: 'q' });
      setBoard(game.board());

    } catch (e) {
      console.log("Invalid move", e);
      return;
    }
  };
  
  const handleEvolution = (evolve: boolean) => {
    if (!evolutionPrompt) return;
    
    const { from, to, piece } = evolutionPrompt;
    
    game.move({ from, to, promotion: 'q' });
    
    if (evolve) {
      const newPieceType = getEvolution(piece);
      if (newPieceType) {
        const color = game.get(to)?.color;
        if (color) {
          game.put({ type: newPieceType, color }, to);
          playEvolveSound();
          setShiningPiece(to);
          setTimeout(() => setShiningPiece(null), 2000);
        }
      }
    }
    
    setBoard(game.board());
    setEvolutionPrompt(null);
  };
  
  const handleNewGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setBoard(newGame.board());
    setStatus("New game started. White's turn.");
    setLastMove(null);
    setEvolutionPrompt(null);
    setIsAiThinking(false);
    setShiningPiece(null);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-4xl mx-auto">
      <h1 className="text-4xl sm:text-5xl font-headline text-primary">Evolving Chess</h1>
      <Card className="w-full p-4 sm:p-6 shadow-xl bg-card/80 backdrop-blur-sm rounded-2xl">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
             <div className="flex items-center gap-4">
              <Button onClick={handleNewGame} variant="outline">New Game</Button>
              <Select value={difficulty} onValueChange={(value: Difficulty) => setDifficulty(value)} disabled={isAiThinking || isGameOver}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                  <SelectItem value="Grandmaster">Grandmaster</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-center font-semibold text-lg text-foreground/80 h-10 flex items-center justify-center">
              {isAiThinking ? <div className="flex items-center gap-2"><Loader /> AI is thinking...</div> : status}
            </div>
          </div>

          <div className="relative">
            <ChessBoard
              board={board}
              onMove={handleMove}
              turn={game.turn()}
              lastMove={lastMove}
              shiningPiece={shiningPiece}
              validMoves={game.moves({ verbose: true })}
            />
          </div>
        
          <div className="text-center mt-4 text-sm text-muted-foreground font-body">
              {lastMove ? `Last Move: ${lastMove.from}-${lastMove.to}` : "Make your first move to begin."}
          </div>
        </CardContent>
      </Card>
      
      {evolutionPrompt && (
        <EvolutionDialog
          open={!!evolutionPrompt}
          piece={evolutionPrompt.piece}
          onEvolve={handleEvolution}
        />
      )}
    </div>
  );
}
