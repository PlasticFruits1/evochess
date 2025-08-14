
"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dices, Swords } from "lucide-react";
import { Loader } from "./ui/loader";


type PieceInfo = {
    color: 'White' | 'Black',
    type: 'Pawn' | 'Knight' | 'Bishop' | 'Rook' | 'Queen' | 'King',
    hp: number,
    maxHp: number,
}

interface BattleDialogProps {
  open: boolean;
  attacker?: PieceInfo;
  defender?: PieceInfo;
  dialogue?: { attackerLine: string; defenderLine: string; };
  isLoading: boolean;
  onProceed: () => void;
  onRoll: () => void;
  diceResult: { roll: number, remainingHp: number } | null;
}

function pieceToUnicode(piece: PieceInfo) {
    const map = {
        'Pawn': '♙',
        'Knight': '♘',
        'Bishop': '♗',
        'Rook': '♖',
        'Queen': '♕',
        'King': '♔'
    };
    const unicode = map[piece.type];
    const blackUnicodeMap: Record<string, string> = {
        '♙': '♟',
        '♘': '♞',
        '♗': '♝',
        '♖': '♜',
        '♕': '♛',
        '♔': '♚'
    };
    return piece.color === 'White' ? unicode : blackUnicodeMap[unicode];
}


export function BattleDialog({ open, attacker, defender, dialogue, isLoading, onProceed, onRoll, diceResult }: BattleDialogProps) {

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-3xl text-primary flex items-center gap-2">
            <Swords /> A Battle Begins!
          </AlertDialogTitle>
          <AlertDialogDescription className="font-body text-lg pt-2">
            The pieces face off on the checkered field.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
                <Loader />
                <p className="text-muted-foreground">Words are exchanged...</p>
            </div>
        )}

        {!isLoading && dialogue && attacker && defender && (
            <div className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                    <span className="text-4xl">{pieceToUnicode(attacker)}</span>
                    <div className="bg-secondary p-3 rounded-lg flex-1">
                        <p className="font-bold">{attacker.type} ({attacker.hp}/{attacker.maxHp} HP)</p>
                        <p className="italic">"{dialogue.attackerLine}"</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4 flex-row-reverse">
                    <span className="text-4xl">{pieceToUnicode(defender)}</span>
                    <div className="bg-muted p-3 rounded-lg flex-1 text-right">
                        <p className="font-bold">{defender.type} ({defender.hp}/{defender.maxHp} HP)</p>
                        <p className="italic">"{dialogue.defenderLine}"</p>
                    </div>
                </div>
            </div>
        )}
        
        {diceResult && (
          <div className="text-center py-4 space-y-2">
            <p className="text-2xl font-bold">You rolled a <span className="text-primary">{diceResult.roll}</span>!</p>
            {diceResult.remainingHp > 0 ? (
                <p>The defender survives with {diceResult.remainingHp} HP remaining.</p>
            ) : (
                <p>A fatal blow! The defender is vanquished.</p>
            )}
          </div>
        )}


        <AlertDialogFooter>
          {!diceResult ? (
            <Button onClick={onRoll} disabled={isLoading} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                <Dices className="mr-2" />
                {isLoading ? "Awaiting..." : "Roll for Damage!"}
            </Button>
          ) : (
            <Button onClick={onProceed} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Continue
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
