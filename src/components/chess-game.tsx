
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import type { PieceSymbol, Color } from 'chess.js';
import { generateChessMove } from '@/ai/flows/generate-chess-move';
import { getPieceDialogue } from '@/lib/dialogue-bank';
import { playMoveSound, playCaptureSound, playEvolveSound, playCheckSound, playGameOverSound, useTone } from '@/lib/sounds';
import { puzzles, type Puzzle } from '@/lib/story-mode';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import ChessBoard from '@/components/chess-board';
import { EvolutionDialog } from '@/components/evolution-dialog';
import { GameOverDialog } from '@/components/game-over-dialog';
import { BattleDialog } from '@/components/battle-dialog';
import { CheckDialog } from '@/components/check-dialog';
import { PuzzleDialog } from '@/components/puzzle-dialog';
import { Loader } from '@/components/ui/loader';
import { Crown, Swords, User, Users, BookOpen, Heart, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Move, type Square } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Grandmaster';
type EvolutionPromptInfo = { from: Square; to: Square; piece: PieceSymbol, color: Color, captured: PieceSymbol | undefined };
type GameOverInfo = { status: string; winner: 'White' | 'Black' | 'Draw' };
type GameMode = 'vs-ai' | 'vs-player' | 'story';

type PieceState = { hp: number; maxHp: number; };
type PieceHpMap = { [key in Square]?: PieceState };

const pieceTypeMap: Record<PieceSymbol, PieceInfo['type']> = {
    p: 'Pawn', n: 'Knight', b: 'Bishop', r: 'Rook', q: 'Queen', k: 'King'
};

const pieceHpConfig: Partial<Record<PieceSymbol, number>> = {
    p: 1, n: 2, b: 3, r: 4, q: 5, k: 10
};

const getEvolution = (piece: PieceSymbol): PieceSymbol | null => {
  const evolutionMap: Partial<Record<PieceSymbol, PieceSymbol>> = {
    p: 'n', n: 'b', b: 'r', r: 'q',
  };
  return evolutionMap[piece.toLowerCase() as PieceSymbol] || null;
};

type PieceInfo = {
    color: 'White' | 'Black',
    type: 'Pawn' | 'Knight' | 'Bishop' | 'Rook' | 'Queen' | 'King',
    hp: number,
    maxHp: number,
};

type BattlePromptInfo = {
    move: { from: Square; to: Square; promotion?: PieceSymbol };
    attacker: PieceInfo,
    defender: PieceInfo
};


const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Expert', 'Grandmaster'];


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

interface ChessGameProps {
  initialGameMode: GameMode;
}

export default function ChessGame({ initialGameMode }: ChessGameProps) {
  useTone(); // Initialize audio context on user interaction
  const [game, setGame] = useState(new Chess());
  const [pieceHp, setPieceHp] = useState<PieceHpMap>({});
  const [gameMode, setGameMode] = useState<GameMode>(initialGameMode);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [playerColor, setPlayerColor] = useState<Color>('w');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [status, setStatus] = useState("White's turn to move.");
  const [evolutionPrompt, setEvolutionPrompt] = useState<EvolutionPromptInfo | null>(null);
  const [battlePrompt, setBattlePrompt] = useState<BattlePromptInfo | null>(null);
  const [battleDialogue, setBattleDialogue] = useState<{ attackerLine: string; defenderLine: string } | null>(null);
  const [recentlyUsedDialogue, setRecentlyUsedDialogue] = useState<Record<string, number[]>>({});
  const [diceResult, setDiceResult] = useState<{ attackerRoll: number, defenderRoll: number, damage: number, remainingHp: number } | null>(null);
  const [gameOverInfo, setGameOverInfo] = useState<GameOverInfo | null>(null);
  const [lastMove, setLastMove] = useState<{ from: Square, to: Square } | null>(null);
  const [shiningPiece, setShiningPiece] = useState<Square | null>(null);
  const [checkInfo, setCheckInfo] = useState<{ show: boolean, isCheckmate: boolean }>({ show: false, isCheckmate: false });
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [puzzleState, setPuzzleState] = useState<{ showDialog: boolean; puzzle: Puzzle | null }>({ showDialog: false, puzzle: null });
  const [lives, setLives] = useState(3);
  const [currentPly, setCurrentPly] = useState(0);
  const [showPuzzleFailure, setShowPuzzleFailure] = useState(false);
  const { toast } = useToast();

  const fen = game.fen();
  const isGameOver = useMemo(() => game.isGameOver(), [fen]);
  const validMoves = useMemo(() => game.moves({ verbose: true }) as Move[], [fen]);
  const currentPuzzle = useMemo(() => gameMode === 'story' ? puzzles[currentPuzzleIndex] : null, [gameMode, currentPuzzleIndex]);

  const isPlayerTurn = useMemo(() => {
    if (isAiThinking || evolutionPrompt || battlePrompt) return false;
    if (gameMode === 'vs-player') return true;
    return game.turn() === playerColor;
  }, [game.turn(), gameMode, playerColor, isAiThinking, evolutionPrompt, battlePrompt]);

  const updateStatus = useCallback(() => {
    if (gameMode === 'story' && currentPuzzle) {
        setStatus(`Level ${currentPuzzleIndex + 1}: ${currentPuzzle.goal.replace(/-/g, ' ')}`);
        return;
    }
    
    let newStatus = game.turn() === 'w' ? "White's turn." : "Black's turn.";
    if (isGameOver) {
      playGameOverSound();
      if (game.isCheckmate()) {
        const winner = game.turn() === 'w' ? 'Black' : 'White';
        newStatus = `Checkmate! ${winner} wins.`;
        setGameOverInfo({ status: newStatus, winner });
        setCheckInfo({ show: true, isCheckmate: true });
      } else if (game.isDraw()) {
        newStatus = "Draw!";
        setGameOverInfo({ status: newStatus, winner: 'Draw' });
      } else {
        newStatus = "Game Over.";
        const history = game.history({verbose: true});
        const lastMove = history[history.length - 1];
        if (lastMove && lastMove.captured === 'k') {
          const winner = lastMove.color === 'w' ? 'White' : 'Black';
          newStatus = `The ${winner === 'White' ? 'Black' : 'White'} King has been defeated! ${winner} wins.`;
          setGameOverInfo({ status: newStatus, winner });
        } else {
          setGameOverInfo({ status: newStatus, winner: 'Draw' });
        }
      }
    } else if (game.inCheck()) {
      newStatus = `Check! ${newStatus}`;
      playCheckSound();
      setCheckInfo({ show: true, isCheckmate: false });
    }
    setStatus(newStatus);
  }, [game, isGameOver, gameMode, currentPuzzle, currentPuzzleIndex]);

  const checkPuzzleCompletion = useCallback((gameInstance: Chess) => {
    if (gameMode !== 'story' || !currentPuzzle) return;
  
    const isMate = gameInstance.isCheckmate();
    const goal = currentPuzzle.goal;
    let puzzleWon = false;
  
    if (goal.startsWith('mate-in-') && isMate) {
        puzzleWon = true;
    } else if (goal === 'win-material' && currentPly >= currentPuzzle.moves.length) {
        // Simple check for material win, can be improved
        puzzleWon = true;
    } else if (goal === 'evolve-and-mate' && isMate) {
        puzzleWon = true;
    }


    if (puzzleWon) {
      const nextLevelIndex = currentPuzzleIndex + 1;
      if (nextLevelIndex < puzzles.length) {
        setTimeout(() => {
          setCurrentPuzzleIndex(nextLevelIndex);
          setPuzzleState({ showDialog: true, puzzle: puzzles[nextLevelIndex] });
        }, 1500); // Delay to see the winning move
      } else {
        setGameOverInfo({ status: "Congratulations! You have completed all challenges!", winner: 'White' });
      }
    }
  }, [gameMode, currentPuzzle, currentPly, currentPuzzleIndex]);

  const executeMove = (from: Square, to: Square, promotion?: PieceSymbol) => {
    const gameCopy = new Chess(game.fen());
    const moveResult = gameCopy.move({ from, to, promotion });

    if (!moveResult) {
      console.error("Invalid move:", {from, to, promotion});
      toast({
          title: "Invalid Move",
          description: `The move from ${from} to ${to} could not be executed.`,
          variant: "destructive"
      });
      return null;
    };

    // HP state update
    const newHpMap = { ...pieceHp };
    const pieceState = newHpMap[from];
    if (pieceState) {
        delete newHpMap[from];
        newHpMap[to] = pieceState;
    }

    setLastMove({ from, to });

    const wasCapture = !!moveResult.captured;
    const canEvolve = !!getEvolution(moveResult.piece);
    const isAiMove = gameMode === 'vs-ai' && moveResult.color !== playerColor;

    setPieceHp(newHpMap);
    
    if (wasCapture && canEvolve) {
        playCaptureSound();
        if (isAiMove) {
            const newGame = new Chess(gameCopy.fen());
            setGame(newGame);
            setTimeout(() => applyEvolution(to, moveResult.piece, moveResult.color), 500);
        } else {
             setEvolutionPrompt({
                from,
                to,
                piece: moveResult.piece,
                color: moveResult.color,
                captured: moveResult.captured
            });
            const newGame = new Chess(gameCopy.fen());
            setGame(newGame);
        }
    } else {
        if (wasCapture) {
            playCaptureSound();
        } else {
            playMoveSound();
        }
        const newGame = new Chess(gameCopy.fen());
        setGame(newGame);
        return { game: newGame, move: moveResult };
    }
    return { game: gameCopy, move: moveResult };
  };
  
  const handleStoryMove = (from: Square, to: Square) => {
    if (!currentPuzzle) return;
  
    const gameCopy = new Chess(game.fen());
    const nextMoveUci = `${from}${to}`;
    const promotionPiece = gameCopy.get(from).type === 'p' && (to[1] === '8' || to[1] === '1') ? 'q' : undefined;
    const uciWithPromotion = `${nextMoveUci}${promotionPiece || ''}`;
    const expectedMove = currentPuzzle.moves[currentPly];

    if (uciWithPromotion === expectedMove || nextMoveUci === expectedMove) {
      const moveResult = gameCopy.move({ from, to, promotion: promotionPiece });
      
      if (!moveResult) {
        // This case should ideally not be reached if logic is correct
        console.error("Move validation failed in story mode.");
        return;
      }

      const finalGame = new Chess(gameCopy.fen());
      setGame(finalGame);
      setLastMove({ from, to });
      const newPly = currentPly + 1;
      setCurrentPly(newPly);
  
      const opponentPly = newPly;
      if (opponentPly < currentPuzzle.moves.length) {
        const opponentMoveUci = currentPuzzle.moves[opponentPly];
        const fromSq = opponentMoveUci.slice(0, 2) as Square;
        const toSq = opponentMoveUci.slice(2, 4) as Square;
        const promotion = opponentMoveUci.length === 5 ? opponentMoveUci.slice(4) as PieceSymbol : undefined;
        
        setTimeout(() => {
          const gameAfterOpponentMove = new Chess(finalGame.fen());
          gameAfterOpponentMove.move({ from: fromSq, to: toSq, promotion });
          setGame(gameAfterOpponentMove);
          setLastMove({ from: fromSq, to: toSq });
          setCurrentPly(prev => prev + 1);
          checkPuzzleCompletion(gameAfterOpponentMove);
        }, 750);
      } else {
          checkPuzzleCompletion(finalGame);
      }
  
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setShowPuzzleFailure(true);
      } else {
        toast({
          title: "Incorrect Move!",
          description: `That's not the right path. ${newLives} ${newLives === 1 ? 'life' : 'lives'} remaining.`,
          variant: "destructive"
        });
        // Board state does not change, giving reset effect
      }
    }
  };


  const handleMove = useCallback((from: Square, to: Square) => {
    if (isGameOver || isAiThinking || evolutionPrompt || battlePrompt) return;
    
    if (gameMode === 'story') {
        handleStoryMove(from, to);
        return;
    }

    const gameCopy = new Chess(game.fen());
    const move = gameCopy.moves({verbose: true}).find(m => m.from === from && m.to === to)
    
    if (!move) return;

    if (move.captured && gameMode !== 'story') {
        const attackerPiece = game.get(move.from);
        const defenderPiece = game.get(move.to);

        if (!attackerPiece || !defenderPiece) return;

        const attackerHpState = pieceHp[move.from] ?? { hp: pieceHpConfig[attackerPiece.type] ?? 0, maxHp: pieceHpConfig[attackerPiece.type] ?? 0 };
        const defenderHpState = pieceHp[move.to] ?? { hp: pieceHpConfig[defenderPiece.type] ?? 0, maxHp: pieceHpConfig[defenderPiece.type] ?? 0 };

        const attacker: PieceInfo = {
            color: move.color === 'w' ? 'White' : 'Black',
            type: pieceTypeMap[move.piece],
            hp: attackerHpState.hp,
            maxHp: pieceHpConfig[attackerPiece.type] ?? 0,
        };

        const defender: PieceInfo = {
            color: defenderPiece.color === 'w' ? 'White' : 'Black',
            type: pieceTypeMap[defenderPiece.type],
            hp: defenderHpState.hp,
            maxHp: pieceHpConfig[defenderPiece.type] ?? 0,
        };
        
        const { dialogue, usedIndices } = getPieceDialogue(attacker.type, defender.type, recentlyUsedDialogue);
        setBattleDialogue(dialogue);
        setRecentlyUsedDialogue(usedIndices);

        setBattlePrompt({ move: {from, to, promotion: move.promotion}, attacker, defender });
    } else {
        executeMove(from, to, move.promotion);
    }
  }, [game.fen(), isGameOver, isAiThinking, evolutionPrompt, battlePrompt, gameMode, pieceHp, recentlyUsedDialogue, lives, toast, handleStoryMove, currentPuzzle, currentPly, checkPuzzleCompletion]);
  
  const playRandomMove = useCallback(() => {
    const moves = game.moves({verbose: true});
    if (moves.length > 0) {
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      handleMove(randomMove.from, randomMove.to);
    }
  }, [game, handleMove]);

  const triggerAiMove = useCallback(async (currentFen: string) => {
    if (isGameOver || game.turn() === playerColor || isAiThinking || evolutionPrompt || battlePrompt || gameMode !== 'vs-ai') return;

    setIsAiThinking(true);
    try {
      const response = await generateChessMove({ boardState: currentFen, difficulty });
      
      const gameCopy = new Chess(currentFen);
      const legalMoves = gameCopy.moves({verbose: true});
      const isMoveLegal = legalMoves.some(m => m.from + m.to === response.move || m.from + m.to + (m.promotion || '') === response.move);
      
      if (isMoveLegal) {
          const from = response.move.slice(0, 2) as Square;
          const to = response.move.slice(2, 4) as Square;
          handleMove(from, to);
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
  }, [difficulty, playerColor, isGameOver, toast, evolutionPrompt, battlePrompt, gameMode, playRandomMove, isAiThinking, handleMove]);


  useEffect(() => {
    updateStatus();
    if (gameMode === 'vs-ai' && game.turn() !== playerColor && !isGameOver && !isAiThinking && !evolutionPrompt && !battlePrompt) {
      const timer = setTimeout(() => triggerAiMove(fen), 500);
      return () => clearTimeout(timer);
    }
  }, [fen, playerColor, isGameOver, triggerAiMove, isAiThinking, evolutionPrompt, battlePrompt, updateStatus, gameMode]);


  const applyEvolution = (to: Square, piece: PieceSymbol, color: Color) => {
    const newPieceType = getEvolution(piece);
    if (!newPieceType) return;
    
    const gameCopy = new Chess(game.fen());
    gameCopy.put({ type: newPieceType, color: color }, to);
    playEvolveSound();

    const newHp = pieceHpConfig[newPieceType];
    if (newHp) {
      const newHpMap = { ...pieceHp };
      newHpMap[to] = { hp: newHp, maxHp: newHp };
      setPieceHp(newHpMap);
    }

    setShiningPiece(to);
    setTimeout(() => setShiningPiece(null), 2000); // Shine duration
    const newGame = new Chess(gameCopy.fen());
    setGame(newGame);
    checkPuzzleCompletion(newGame);
  };

  const handleRoll = () => {
      if (!battlePrompt) return;
      
      const attackerRoll = Math.floor(Math.random() * 6) + 1;
      const defenderRoll = Math.floor(Math.random() * 6) + 1;
      const damage = Math.max(0, attackerRoll - defenderRoll);

      const defenderSquare = battlePrompt.move.to;
      const defenderCurrentHp = pieceHp[defenderSquare]?.hp ?? 0;
      const remainingHp = defenderCurrentHp - damage;

      setDiceResult({ attackerRoll, defenderRoll, damage, remainingHp });

      if (remainingHp <= 0) {
        const newHpMap = { ...pieceHp };
        delete newHpMap[defenderSquare];
        setPieceHp(newHpMap);
      } else {
        const newHpMap = { ...pieceHp };
        if (newHpMap[defenderSquare]) {
            newHpMap[defenderSquare] = { ...newHpMap[defenderSquare]!, hp: remainingHp };
            setPieceHp(newHpMap);
        }
      }
  };

  const handleBattleProceed = () => {
      if (!battlePrompt || !diceResult) return;
      
      if (diceResult.remainingHp <= 0) {
        executeMove(battlePrompt.move.from, battlePrompt.move.to, battlePrompt.move.promotion);
      } else {
        const gameCopy = new Chess(game.fen());
        const tokens = gameCopy.fen().split(" ");
        tokens[1] = game.turn() === "w" ? "b" : "w";
        gameCopy.load(tokens.join(" "));
        setGame(gameCopy);
        playMoveSound();
      }

      setBattlePrompt(null);
      setBattleDialogue(null);
      setDiceResult(null);
  }

  const handleEvolution = (evolve: boolean) => {
    if (!evolutionPrompt) return;
    
    const { to, piece, color } = evolutionPrompt;
    
    if (evolve) {
      applyEvolution(to, piece, color);
    }
    setEvolutionPrompt(null);
  };

  const resetGameState = useCallback(() => {
      const newGame = new Chess();
      setGame(newGame);
      setLastMove(null);
      setEvolutionPrompt(null);
      setBattlePrompt(null);
      setBattleDialogue(null);
      setRecentlyUsedDialogue({});
      setDiceResult(null);
      setGameOverInfo(null);
      setIsAiThinking(false);
      setShiningPiece(null);
      setCheckInfo({ show: false, isCheckmate: false });
      setCurrentPuzzleIndex(0);
      setPuzzleState({ showDialog: false, puzzle: null });
      setShowPuzzleFailure(false);
      setCurrentPly(0);
  }, []);

  const handleNewGame = useCallback(() => {
    resetGameState();
    
    if (gameMode === 'vs-ai') {
      const newPlayerColor = playerColor === 'w' ? 'b' : 'w';
      setPlayerColor(newPlayerColor);
      setStatus("New game started. White's turn.");
    } else {
      setPlayerColor('w');
    }

    const newGame = new Chess();
    const initialHp: PieceHpMap = {};
    newGame.board().forEach((row) => {
        row.forEach((piece) => {
            if (piece) {
                const hp = pieceHpConfig[piece.type];
                if (hp) {
                    initialHp[piece.square] = { hp, maxHp: hp };
                }
            }
        })
    });
    setPieceHp(initialHp);

    if (gameMode === 'story') {
        const firstPuzzle = puzzles[0];
        setPuzzleState({ showDialog: true, puzzle: firstPuzzle });
    }

  }, [gameMode, playerColor, resetGameState]);

  const startPuzzle = () => {
    const puzzle = puzzles[currentPuzzleIndex];
    if (!puzzle) return;
    const newGame = new Chess(puzzle.fen);
    const turn = newGame.turn();
    setGame(newGame);
    setPieceHp({}); // Puzzles don't use HP
    setPlayerColor(turn);
    setLives(puzzle.lives ?? 3);
    setCurrentPly(0);
    setPuzzleState({ showDialog: false, puzzle: null });
    updateStatus();
  };

  useEffect(() => {
    handleNewGame();
  }, [gameMode, handleNewGame]);

  useEffect(() => {
    updateStatus();
  }, [fen, updateStatus]);


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

  const showHint = () => {
    if (gameMode !== 'story') return;
    const puzzle = puzzles[currentPuzzleIndex];
    if (puzzle && puzzle.hint) {
        toast({
            title: `Hint for Level ${currentPuzzleIndex + 1}`,
            description: puzzle.hint,
        });
    } else {
       toast({
            title: "No Hint Available",
            description: "Keep trying, you can solve it!",
        });
    }
  };

  const restartPuzzle = () => {
    setShowPuzzleFailure(false);
    startPuzzle();
  }


  return (
    <div className="flex justify-center items-center gap-8 w-full max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        <div className="lg:col-span-2 flex justify-center items-start">
          <div className="w-full max-w-[65vh] lg:max-w-[calc(100vh-12rem)]">
            <ChessBoard
              board={game.board()}
              pieceHp={pieceHp}
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
               {gameMode === 'vs-ai' && (
                  <div className="flex items-center justify-center gap-2 text-lg font-semibold p-2 rounded-md bg-secondary/50">
                    <User /> You are playing as 
                    <span className={cn("font-bold", playerColor === 'w' ? 'text-stone-50' : 'text-stone-900', 'drop-shadow-lg')}>{playerColor === 'w' ? 'White' : 'Black'}</span>
                  </div>
                )}
                {gameMode === 'vs-player' && (
                  <div className="flex items-center justify-center gap-2 text-lg font-semibold p-2 rounded-md bg-secondary/50">
                    <Users /> Player vs. Player
                  </div>
                )}
                 {gameMode === 'story' && puzzles[currentPuzzleIndex] && (
                    <div className="flex flex-col gap-2 text-lg font-semibold p-2 rounded-md bg-secondary/50">
                        <div className="flex items-center justify-center gap-2">
                           <BookOpen /> Story Mode: {puzzles[currentPuzzleIndex].title}
                        </div>
                        <div className="flex justify-around items-center text-base">
                            <div className="flex items-center gap-2">
                                <Heart className="text-destructive" />
                                <span>Lives: {lives}</span>
                            </div>
                            <Button size="sm" variant="outline" onClick={showHint}><Lightbulb className="mr-2" /> Hint</Button>
                        </div>
                    </div>
                )}

              <div className="text-center font-semibold text-lg text-foreground/80 h-10 flex items-center justify-center p-2 rounded-md bg-secondary/50">
                {isAiThinking ? <div className="flex items-center gap-2"><Loader /> AI is thinking...</div> : status}
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                 <Button onClick={() => window.location.reload()} variant="secondary" size="lg">Change Mode</Button>
                 {gameMode === 'vs-ai' && (
                    <>
                    <Label htmlFor="difficulty">AI Difficulty</Label>
                    <Select value={difficulty} onValueChange={(value: Difficulty) => setDifficulty(value)} disabled={isAiThinking || evolutionPrompt !== null || isGameOver || !!battlePrompt}>
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
                    </>
                 )}
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

      {battlePrompt && (
        <BattleDialog
            open={!!battlePrompt}
            attacker={battlePrompt.attacker}
            defender={battlePrompt.defender}
            dialogue={battleDialogue ?? undefined}
            isLoading={!battleDialogue}
            onRoll={handleRoll}
            onProceed={handleBattleProceed}
            diceResult={diceResult}
        />
      )}

      {puzzleState.showDialog && puzzleState.puzzle && (
        <PuzzleDialog
            open={puzzleState.showDialog}
            puzzle={puzzleState.puzzle}
            levelNumber={currentPuzzleIndex + 1}
            onStart={startPuzzle}
        />
      )}

       {showPuzzleFailure && (
            <AlertDialog open={showPuzzleFailure}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Challenge Failed</AlertDialogTitle>
                        <AlertDialogDescription>
                            You've run out of lives for this challenge. Would you like to try again?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={restartPuzzle}>Restart Challenge</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}

      {checkInfo.show && (
        <CheckDialog
          open={checkInfo.show}
          isCheckmate={checkInfo.isCheckmate}
          onClose={() => setCheckInfo({ show: false, isCheckmate: false })}
        />
      )}
      
      {gameOverInfo && !checkInfo.isCheckmate && (
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
