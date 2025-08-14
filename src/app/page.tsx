
"use client";

import { useState } from 'react';
import ChessGame from '@/components/chess-game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown } from 'lucide-react';

type GameMode = 'vs-ai' | 'vs-player' | 'story';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  if (gameStarted && selectedMode) {
    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 font-body">
        <ChessGame initialGameMode={selectedMode} />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 font-body bg-gradient-to-br from-background to-secondary/20">
      <Card className="bg-card/60 backdrop-blur-sm w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2">
            <Crown className="w-10 h-10 text-primary" />
            <CardTitle className="font-headline text-5xl text-primary">
              Evolving Chess
            </CardTitle>
          </div>
          <CardDescription className="text-lg pt-2">
            A magical twist on a classic game. Where pieces evolve and every capture is a battle.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 items-center">
          <Select onValueChange={(value: GameMode) => setSelectedMode(value)}>
            <SelectTrigger className="w-full text-lg h-12">
              <SelectValue placeholder="Choose your game mode..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vs-ai">vs. AI</SelectItem>
              <SelectItem value="vs-player">vs. Player</SelectItem>
              <SelectItem value="story">Story Mode</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="lg"
            onClick={() => setGameStarted(true)}
            disabled={!selectedMode}
            className="w-full h-12 text-lg"
          >
            Start Game
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
