
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import type { PieceSymbol, Square, Color } from 'chess.js';
import { generateChessMove } from '@/ai/flows/generate-chess-move';
import { playMoveSound, playCaptureSound, playEvolveSound, playCheckSound, playGameOverSound, useTone } from '@/lib/sounds';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import ChessBoard from '@/components/chess-board';
import { EvolutionDialog } from '@/components/evolution-dialog';
import { Loader } from '@/components/ui/loader';
import { Crown, Swords } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Move } from '@/lib/types';

type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Grandmaster';
type EvolutionMove = { to: Square; piece: PieceSymbol, color: Color };

const getEvolution = (piece: PieceSymbol): PieceSymbol | null => {
  const evolutionMap: Partial<Record<PieceSymbol, PieceSymbol>> = {
    p: 'b', b: 'n', n: 'r', r: 'q',
  };
  return evolutionMap[piece.toLowerCase() as PieceSymbol] || null;
};

export default function ChessGame() {
  useTone(); // Initialize audio context on user interaction
  const [game, setGame] = useState(new Chess());
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [playerColor] = useState<Color>('w');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [status, setStatus] = useState("White's turn to move.");
  const [evolutionPrompt, setEvolutionPrompt] = useState<EvolutionMove | null>(null);
  const [lastMove, setLastMove] = useState<{ from: Square, to: Square } | null>(null);
  const [shiningPiece, setShiningPiece] = useState<Square | null>(null);
  const { toast } = useToast();
  
  const isGameOver = useMemo(() => game.isGameOver(), [game]);
  const validMoves = useMemo(() => game.moves({ verbose: true }) as Move[], [game]);

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
  }, [game, updateStatus]);

  const triggerAiMove = useCallback(async () => {
    if (isGameOver || game.turn() === playerColor) return;

    setIsAiThinking(true);
    try {
      const fen = game.fen();
      const response = await generateChessMove({ boardState: fen, difficulty });
      
      const gameWithNextMove = new Chess(fen);
      const move = gameWithNextMove.move(response.move);

      if (move) {
        setLastMove({ from: move.from, to: move.to });
        if (move.captured) {
            playCaptureSound();
        } else {
            playMoveSound();
        }
        setGame(new Chess(gameWithNextMove.fen()));
      } else {
        console.error("AI generated an invalid move:", response.move);
        toast({
            title: "AI Error",
            description: `The AI tried an invalid move (${response.move}). A random move was played instead.`,
            variant: "destructive"
        })
        const moves = game.moves();
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        const newGame = new Chess(game.fen());
        newGame.move(randomMove);
        setGame(new Chess(newGame.fen()));
      }
    } catch (error) {
      console.error("AI move failed, falling back to random move:", error);
      toast({
        title: "AI Error",
        description: `An error occurred while generating the AI move. A random move was played instead.`,
        variant: "destructive"
      })
      const moves = game.moves();
      if (moves.length > 0) {
        const move = moves[Math.floor(Math.random() * moves.length)];
        const newGame = new Chess(game.fen());
        newGame.move(move);
        setGame(new Chess(newGame.fen()));
      }
    }
    setIsAiThinking(false);
  }, [game, difficulty, playerColor, isGameOver, toast]);

  useEffect(() => {
    if (game.turn() !== playerColor && !isGameOver && !evolutionPrompt) {
      const timer = setTimeout(triggerAiMove, 500);
      return () => clearTimeout(timer);
    }
  }, [game, playerColor, isGameOver, triggerAiMove, evolutionPrompt]);


  const handleMove = (from: Square, to: Square) => {
    if (isGameOver || game.turn() !== playerColor || isAiThinking || evolutionPrompt) return;

    const gameCopy = new Chess(game.fen());
    const moveResult = gameCopy.move({ from, to, promotion: 'q' });

    if (!moveResult) {
      return;
    }

    setLastMove({ from, to });
    
    const wasCapture = !!moveResult.captured;
    const canEvolve = !!getEvolution(moveResult.piece);
    
    // Apply the move immediately
    setGame(new Chess(gameCopy.fen()));
    
    if (wasCapture && canEvolve) {
      playCaptureSound();
      // Set prompt for evolution, the game state is already updated with the move
      setEvolutionPrompt({ to: moveResult.to, piece: moveResult.piece, color: moveResult.color });
      return;
    } else if (wasCapture) {
      playCaptureSound();
    }
    else {
      playMoveSound();
    }
  };
  
  const handleEvolution = (evolve: boolean) => {
    if (!evolutionPrompt) return;
    
    if (evolve) {
      const { to, piece, color } = evolutionPrompt;
      const newPieceType = getEvolution(piece);
      
      if (newPieceType) {
        const newGame = new Chess(game.fen());
        newGame.put({ type: newPieceType, color: color }, to);
        playEvolveSound();
        setShiningPiece(to);
        setTimeout(() => setShiningPiece(null), 2000);
        setGame(new Chess(newGame.fen()));
      }
    }
    
    setEvolutionPrompt(null);
  };
  
  const handleNewGame = () => {
    setGame(new Chess());
    setStatus("New game started. White's turn.");
    setLastMove(null);
    setEvolutionPrompt(null);
    setIsAiThinking(false);
    setShiningPiece(null);
  };
  
  const capturedPieces = (color: Color) => {
    const history = game.history({verbose: true});
    const captured = [];
    for (const move of history) {
      if(move.captured && move.color !== color) {
        captured.push(move.captured);
      }
    }
    return captured;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto p-4">
      <div className="lg:col-span-2">
        <ChessBoard
          board={game.board()}
          onMove={handleMove}
          turn={game.turn()}
          lastMove={lastMove}
          shiningPiece={shiningPiece}
          validMoves={validMoves}
        />
      </div>

      <div className="flex flex-col gap-6">
        <Card className="bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary flex items-center gap-2">
              <Crown /> Evolving Chess
            </CardTitle>
            <CardDescription>A magical twist on a classic game.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="text-center font-semibold text-lg text-foreground/80 h-10 flex items-center justify-center p-2 rounded-md bg-secondary/50">
              {isAiThinking ? <div className="flex items-center gap-2"><Loader /> AI is thinking...</div> : status}
            </div>
            <Button onClick={handleNewGame} variant="secondary" size="lg">New Game</Button>
            <Select value={difficulty} onValueChange={(value: Difficulty) => setDifficulty(value)} disabled={isAiThinking || evolutionPrompt !== null || isGameOver}>
              <SelectTrigger className="w-full">
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
             <div className="text-center mt-2 text-sm text-muted-foreground font-body">
                {lastMove ? `Last Move: ${lastMove.from}-${lastMove.to}` : "Make your first move to begin."}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center gap-2"><Swords /> Captured Pieces</CardTitle>
            </CardHeader>
            <CardContent>
                <h3 className="font-bold text-muted-foreground mb-2">White's Captures (Black pieces)</h3>
                 <div className="flex flex-wrap gap-1 min-h-[30px]">
                    {capturedPieces('w').map((p, i) => <span key={i} className='text-xl'>{pieceToUnicode(p, 'b')}</span>)}
                </div>
                <h3 className="font-bold text-muted-foreground mt-4 mb-2">Black's Captures (White pieces)</h3>
                 <div className="flex flex-wrap gap-1 min-h-[30px]">
                    {capturedPieces('b').map((p, i) => <span key={i} className='text-xl'>{pieceToUnicode(p, 'w')}</span>)}
                </div>
            </CardContent>
        </Card>
      </div>
      
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


function pieceToUnicode(piece: PieceSymbol, color: Color) {
    const map: Record<PieceSymbol, string> = {
        'p': '♙',
        'n': '♘',
        'b': '♗',
        'r': '♖',
        'q': '♕',
        'k': '♔'
    };
    const unicode = map[piece.toLowerCase() as PieceSymbol];
    const blackUnicodeMap: Record<string, string> = {
        '♙': '♟',
        '♘': '♞',
        '♗': '♝',
        '♖': '♜',
        '♕': '♛',
        '♔': '♚'
    };
    return color === 'w' ? unicode : blackUnicodeMap[unicode];
}

    
