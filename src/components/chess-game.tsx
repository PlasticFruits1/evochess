
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import type { PieceSymbol, Color, Move as ChessMove } from 'chess.js';
import { generateChessMove } from '@/ai/flows/generate-chess-move';
import { playMoveSound, playCaptureSound, playEvolveSound, playCheckSound, playGameOverSound, useTone } from '@/lib/sounds';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import ChessBoard from '@/components/chess-board';
import { EvaluationBar } from '@/components/evaluation-bar';
import { EvolutionDialog } from '@/components/evolution-dialog';
import { GameOverDialog } from '@/components/game-over-dialog';
import { Loader } from '@/components/ui/loader';
import { Crown, Swords, User, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Move, type Square, type Piece } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Grandmaster';
type EvolutionPromptInfo = { from: Square; to: Square; piece: PieceSymbol, color: Color, captured: PieceSymbol | undefined };
type GameOverInfo = { status: string; winner: 'White' | 'Black' | 'Draw' };
type GameMode = 'vs-ai' | 'vs-player';


const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Expert', 'Grandmaster'];

const getEvolution = (piece: PieceSymbol): PieceSymbol | null => {
  const evolutionMap: Partial<Record<PieceSymbol, PieceSymbol>> = {
    p: 'n', n: 'b', b: 'r', r: 'q',
  };
  return evolutionMap[piece.toLowerCase() as PieceSymbol] || null;
};

const capturedPieces = (game: Chess, color: Color) => {
    const history = game.history({verbose: true});
    const captured = [];
    for (const move of history) {
      if(move.captured && move.color !== color) {
        captured.push(move.captured);
      }
    }
    return captured;
};

const pieceValues: Record<PieceSymbol, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

const calculateMaterialAdvantage = (game: Chess): number => {
  let whiteScore = 0;
  let blackScore = 0;
  game.board().forEach(row => {
    row.forEach(piece => {
      if (piece) {
        const value = pieceValues[piece.type];
        if (piece.color === 'w') {
          whiteScore += value;
        } else {
          blackScore += value;
        }
      }
    });
  });
  const advantage = whiteScore - blackScore;
  // Clamp advantage between -10 and 10 for the evaluation bar
  return Math.max(-10, Math.min(10, advantage));
};

export default function ChessGame() {
  useTone(); // Initialize audio context on user interaction
  const [game, setGame] = useState(new Chess());
  const [gameMode, setGameMode] = useState<GameMode>('vs-ai');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [playerColor, setPlayerColor] = useState<Color>('w');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [status, setStatus] = useState("White's turn to move.");
  const [evolutionPrompt, setEvolutionPrompt] = useState<EvolutionPromptInfo | null>(null);
  const [gameOverInfo, setGameOverInfo] = useState<GameOverInfo | null>(null);
  const [lastMove, setLastMove] = useState<{ from: Square, to: Square } | null>(null);
  const [shiningPiece, setShiningPiece] = useState<Square | null>(null);
  const { toast } = useToast();
  
  const [evaluation, setEvaluation] = useState<number>(0);

  const isGameOver = useMemo(() => game.isGameOver(), [game]);
  const validMoves = useMemo(() => game.moves({ verbose: true }) as Move[], [game]);
  const fen = useMemo(() => game.fen(), [game]);

  const isPlayerTurn = useMemo(() => {
    if (gameMode === 'vs-player') return true;
    return game.turn() === playerColor;
  }, [game, gameMode, playerColor]);

   useEffect(() => {
    setEvaluation(calculateMaterialAdvantage(game));
  }, [fen, game]);
  
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

  const playRandomMove = useCallback(() => {
    const moves = game.moves({verbose: true});
    if (moves.length > 0) {
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      const gameCopy = new Chess(game.fen());
      gameCopy.move(randomMove);
      const newGame = new Chess(gameCopy.fen());
      setGame(newGame);
      setLastMove({ from: randomMove.from, to: randomMove.to });
    }
  }, [game]);

  const triggerAiMove = useCallback(async (currentFen: string) => {
    if (isGameOver || game.turn() === playerColor || isAiThinking || evolutionPrompt || gameMode === 'vs-player') return;

    setIsAiThinking(true);
    try {
      const response = await generateChessMove({ boardState: currentFen, difficulty });
      
      const gameCopy = new Chess(currentFen);
      const legalMoves = gameCopy.moves({verbose: true});
      const isMoveLegal = legalMoves.some(m => m.from + m.to === response.move || m.from + m.to + (m.promotion || '') === response.move);
      
      let moveResult: ChessMove | null = null;
      if (isMoveLegal) {
        moveResult = gameCopy.move(response.move);
      }
      
      if (moveResult) {
        setLastMove({ from: moveResult.from, to: moveResult.to });
        if (moveResult.captured) {
            playCaptureSound();
        } else {
            playMoveSound();
        }
        const newGame = new Chess(gameCopy.fen());
        setGame(newGame);
      } else {
         toast({
            title: "AI Error",
            description: `The AI suggested an invalid move (${response.move}). A random move was played instead.`,
            variant: "destructive"
          });
          playRandomMove();
      }
    } catch (error) {
      console.error("AI move failed, falling back to random move:", error);
      toast({
        title: "AI Error",
        description: `An AI error occurred. A random move was played instead.`,
        variant: "destructive"
      });
      playRandomMove();
    } finally {
        setIsAiThinking(false);
    }
  }, [game, difficulty, playerColor, isGameOver, toast, evolutionPrompt, gameMode, playRandomMove, isAiThinking]);

  useEffect(() => {
    updateStatus();
    if (gameMode === 'vs-ai' && game.turn() !== playerColor && !isGameOver && !isAiThinking && !evolutionPrompt) {
      const timer = setTimeout(() => triggerAiMove(game.fen()), 500);
      return () => clearTimeout(timer);
    }
  }, [game, playerColor, isGameOver, triggerAiMove, isAiThinking, evolutionPrompt, updateStatus, gameMode]);

  const handleMove = (from: Square, to: Square) => {
    if (isGameOver || isAiThinking || evolutionPrompt) return;
    if (gameMode === 'vs-ai' && !isPlayerTurn) return;

    const gameCopy = new Chess(game.fen());
    const moveResult = gameCopy.move({ from, to, promotion: 'q' });

    if (!moveResult) {
      return;
    }
    
    setLastMove({ from, to });
    const wasCapture = !!moveResult.captured;
    const canEvolve = !!getEvolution(moveResult.piece);
    
    if (wasCapture && canEvolve) {
      playCaptureSound();
      setEvolutionPrompt({
        from,
        to,
        piece: moveResult.piece,
        color: moveResult.color,
        captured: moveResult.captured
      });
      const newGame = new Chess(gameCopy.fen());
      setGame(newGame);
    } else {
       if (wasCapture) {
        playCaptureSound();
      } else {
        playMoveSound();
      }
      const newGame = new Chess(gameCopy.fen());
      setGame(newGame);
    }
  };

  const handleEvolution = (evolve: boolean) => {
    if (!evolutionPrompt) return;
    
    const { to, piece, color } = evolutionPrompt;
    
    if (evolve) {
      const newPieceType = getEvolution(piece);
      
      if (newPieceType) {
        const gameCopy = new Chess(game.fen()); 
        gameCopy.put({ type: newPieceType, color: color }, to);
        playEvolveSound();
        setShiningPiece(to);
        setTimeout(() => setShiningPiece(null), 2000); // Shine duration
        const newGame = new Chess(gameCopy.fen());
        setGame(newGame);
      }
    }
    setEvolutionPrompt(null);
  };

  const handleNewGame = useCallback(() => {
    const newGame = new Chess();
    setGame(newGame);
    
    if (gameMode === 'vs-ai') {
      const newPlayerColor = Math.random() > 0.5 ? 'w' : 'b';
      setPlayerColor(newPlayerColor);
      if (newPlayerColor === 'b') {
        const fen = newGame.fen();
        const timer = setTimeout(() => triggerAiMove(fen), 500);
        return () => clearTimeout(timer);
      }
    } else {
      setPlayerColor('w');
    }

    setStatus("New game started. White's turn.");
    setLastMove(null);
    setEvolutionPrompt(null);
    setGameOverInfo(null);
    setIsAiThinking(false);
    setShiningPiece(null);
  }, [gameMode, triggerAiMove]);

  useEffect(() => {
    handleNewGame();
  }, [gameMode, handleNewGame]);


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

  return (
    <div className="flex justify-center items-center gap-8 w-full max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        <div className="lg:col-span-2 flex justify-center items-start">
          <div className="w-full max-w-[65vh] lg:max-w-[calc(100vh-12rem)]">
            <ChessBoard
              board={game.board()}
              onMove={handleMove}
              turn={game.turn()}
              lastMove={lastMove}
              shiningPiece={shiningPiece}
              validMoves={validMoves}
              playerColor={playerColor}
              isPlayerTurn={isPlayerTurn}
              gameMode={gameMode}
            />
          </div>
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
               {gameMode === 'vs-ai' ? (
                  <div className="flex items-center justify-center gap-2 text-lg font-semibold p-2 rounded-md bg-secondary/50">
                    <User /> You are playing as 
                    <span className={cn("font-bold", playerColor === 'w' ? 'text-stone-50' : 'text-stone-900', 'drop-shadow-lg')}>{playerColor === 'w' ? 'White' : 'Black'}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-lg font-semibold p-2 rounded-md bg-secondary/50">
                    <Users /> Player vs. Player
                  </div>
                )}
              <div className="text-center font-semibold text-lg text-foreground/80 h-10 flex items-center justify-center p-2 rounded-md bg-secondary/50">
                {isAiThinking ? <div className="flex items-center gap-2"><Loader /> AI is thinking...</div> : status}
              </div>
               {gameMode === 'vs-ai' && (
                <EvaluationBar
                  evaluation={evaluation}
                />
              )}
              <Button onClick={handleNewGame} variant="secondary" size="lg">New Game</Button>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <Label htmlFor="game-mode">Game Mode</Label>
                    <Select value={gameMode} onValueChange={(value: GameMode) => setGameMode(value)} disabled={isAiThinking || evolutionPrompt !== null || isGameOver}>
                      <SelectTrigger id="game-mode">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vs-ai">vs. AI</SelectItem>
                        <SelectItem value="vs-player">vs. Player</SelectItem>
                      </SelectContent>
                    </Select>
                 </div>
                 <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                   <Select value={difficulty} onValueChange={(value: Difficulty) => setDifficulty(value)} disabled={isAiThinking || evolutionPrompt !== null || isGameOver || gameMode === 'vs-player'}>
                    <SelectTrigger id="difficulty">
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
              </div>

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
                      {capturedPieces(game, 'w').map((p, i) => <span key={i} className='text-xl'>{pieceToUnicode(p, 'b')}</span>)}
                  </div>
                  <h3 className="font-bold text-muted-foreground mt-4 mb-2">Black's Captures (White pieces)</h3>
                   <div className="flex flex-wrap gap-1 min-h-[30px]">
                      {capturedPieces(game, 'b').map((p, i) => <span key={i} className='text-xl'>{pieceToUnicode(p, 'w')}</span>)}
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
          canIncreaseDifficulty={difficulties.indexOf(difficulty) < difficulties.length - 1 && gameMode === 'vs-ai'}
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
