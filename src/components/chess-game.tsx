
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import type { PieceSymbol, Square, Color } from 'chess.js';
import { generateChessMove } from '@/ai/flows/generate-chess-move';
import { evaluateBoard } from '@/ai/flows/evaluate-board';
import { playMoveSound, playCaptureSound, playEvolveSound, playCheckSound, playGameOverSound, useTone } from '@/lib/sounds';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import ChessBoard from '@/components/chess-board';
import { EvolutionDialog } from '@/components/evolution-dialog';
import { GameOverDialog } from '@/components/game-over-dialog';
import { Loader } from '@/components/ui/loader';
import { Crown, Swords } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Move } from '@/lib/types';
import { EvaluationBar } from '@/components/evaluation-bar';

type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Grandmaster';
type EvolutionPromptInfo = { from: Square; to: Square; piece: PieceSymbol, color: Color, captured: PieceSymbol | undefined };
type GameOverInfo = { status: string; winner: 'White' | 'Black' | 'Draw' };


const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Expert', 'Grandmaster'];

const getEvolution = (piece: PieceSymbol): PieceSymbol | null => {
  const evolutionMap: Partial<Record<PieceSymbol, PieceSymbol>> = {
    p: 'n', n: 'b', b: 'r', r: 'q',
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
  const [evolutionPrompt, setEvolutionPrompt] = useState<EvolutionPromptInfo | null>(null);
  const [gameOverInfo, setGameOverInfo] = useState<GameOverInfo | null>(null);
  const [lastMove, setLastMove] = useState<{ from: Square, to: Square } | null>(null);
  const [shiningPiece, setShiningPiece] = useState<Square | null>(null);
  const [evaluation, setEvaluation] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const { toast } = useToast();
  
  const isGameOver = useMemo(() => game.isGameOver(), [game]);
  const validMoves = useMemo(() => game.moves({ verbose: true }) as Move[], [game]);

  const updateStatus = useCallback(() => {
    let newStatus = game.turn() === 'w' ? "White's turn." : "Black's turn.";
    if (isGameOver) {
      playGameOverSound();
      if (game.isCheckmate()) {
        const winner = game.turn() === 'w' ? 'Black' : 'White';
        newStatus = `Checkmate! ${winner} wins.`;
        setGameOverInfo({ status: newStatus, winner });
      } else if (game.isDraw()) {
        newStatus = "Draw!";
        setGameOverInfo({ status: newStatus, winner: 'Draw' });
      } else {
        newStatus = "Game Over.";
        setGameOverInfo({ status: newStatus, winner: 'Draw' });
      }
    } else if (game.inCheck()) {
      newStatus = `Check! ${newStatus}`;
      playCheckSound();
    }
    setStatus(newStatus);
  }, [game, isGameOver]);

  const updateEvaluation = useCallback(async (fen: string) => {
    setIsEvaluating(true);
    try {
      const response = await evaluateBoard({ boardState: fen });
      setEvaluation(response.evaluation);
    } catch (error) {
      console.error("Evaluation failed:", error);
      // Don't show a toast for this, as it's a background task.
    } finally {
      setIsEvaluating(false);
    }
  }, []);

  useEffect(() => {
    updateStatus();
    if (!isGameOver) {
      updateEvaluation(game.fen());
    }
  }, [game, updateStatus, isGameOver, updateEvaluation]);

  const triggerAiMove = useCallback(async () => {
    if (isGameOver || game.turn() === playerColor || evolutionPrompt) return;

    setIsAiThinking(true);
    try {
      const fen = game.fen();
      const response = await generateChessMove({ boardState: fen, difficulty });
      
      const gameCopy = new Chess(fen);
      const move = gameCopy.move(response.move);

      if (move) {
        setLastMove({ from: move.from, to: move.to });
        if (move.captured) {
            playCaptureSound();
        } else {
            playMoveSound();
        }
        setGame(new Chess(gameCopy.fen()));
      } else {
         throw new Error(`Invalid move from AI: ${response.move}`);
      }
    } catch (error) {
      console.error("AI move failed, falling back to random move:", error);
      toast({
        title: "AI Error",
        description: `An error occurred while generating the AI move. A random move was played instead.`,
        variant: "destructive"
      });
      const moves = game.moves();
      if (moves.length > 0) {
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        const newGame = new Chess(game.fen());
        newGame.move(randomMove);
        setGame(new Chess(newGame.fen()));
        setLastMove(null);
      }
    } finally {
        setIsAiThinking(false);
    }
  }, [game, difficulty, playerColor, isGameOver, toast, evolutionPrompt]);

  useEffect(() => {
    if (game.turn() !== playerColor && !isGameOver && !evolutionPrompt && !gameOverInfo) {
      const timer = setTimeout(triggerAiMove, 500);
      return () => clearTimeout(timer);
    }
  }, [game, playerColor, isGameOver, triggerAiMove, evolutionPrompt, gameOverInfo]);


  const handleMove = (from: Square, to: Square) => {
    if (isGameOver || game.turn() !== playerColor || isAiThinking || evolutionPrompt) return;

    const gameCopy = new Chess(game.fen());
    const moveResult = gameCopy.move({ from, to, promotion: 'q' });

    if (!moveResult) {
      return;
    }
    
    // Update the board with the move immediately.
    setGame(new Chess(gameCopy.fen()));
    setLastMove({ from, to });

    const wasCapture = !!moveResult.captured;
    const canEvolve = !!getEvolution(moveResult.piece);

    if (wasCapture && canEvolve) {
      playCaptureSound();
      // Set the evolution prompt *after* updating the game state with the move.
      setEvolutionPrompt({
        from,
        to,
        piece: moveResult.piece,
        color: moveResult.color,
        captured: moveResult.captured
      });
    } else {
      if (wasCapture) {
        playCaptureSound();
      } else {
        playMoveSound();
      }
    }
  };

  const handleEvolution = (evolve: boolean) => {
    if (!evolutionPrompt) return;
    
    const { to, piece, color } = evolutionPrompt;
    setEvolutionPrompt(null); // Close dialog immediately

    if (evolve) {
      const newPieceType = getEvolution(piece);
      
      if (newPieceType) {
        const gameCopy = new Chess(game.fen());
        gameCopy.put({ type: newPieceType, color: color }, to);
        playEvolveSound();
        setShiningPiece(to);
        setTimeout(() => setShiningPiece(null), 2000); // Shine duration
        setGame(new Chess(gameCopy.fen()));
      }
    }
  };

  const handleNewGame = () => {
    setGame(new Chess());
    setStatus("New game started. White's turn.");
    setLastMove(null);
    setEvolutionPrompt(null);
    setGameOverInfo(null);
    setIsAiThinking(false);
    setShiningPiece(null);
    setEvaluation(0);
  };

  const handleRematch = () => {
    handleNewGame();
  };

  const handleIncreaseDifficulty = () => {
    const currentIndex = difficulties.indexOf(difficulty);
    if (currentIndex < difficulties.length - 1) {
      setDifficulty(difficulties[currentIndex + 1]);
    }
    handleNewGame();
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
  };

  return (
    <div className="flex justify-center items-start gap-8 w-full max-w-7xl mx-auto p-4">
       <EvaluationBar evaluation={evaluation} isEvaluating={isEvaluating} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">
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
              </Header>
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
      </div>
      
      {evolutionPrompt && (
        <EvolutionDialog
          open={!!evolutionPrompt}
          piece={evolutionPrompt.piece}
          onEvolve={handleEvolution}
        />
      )}

      {gameOverInfo && (
        <GameOverDialog
          open={!!gameOverInfo}
          status={gameOverInfo.status}
          onRematch={handleRematch}
          onIncreaseDifficulty={handleIncreaseDifficulty}
          canIncreaseDifficulty={difficulties.indexOf(difficulty) < difficulties.length - 1}
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
