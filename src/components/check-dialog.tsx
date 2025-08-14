
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
import { ShieldAlert, Skull } from "lucide-react";

interface CheckDialogProps {
  open: boolean;
  isCheckmate: boolean;
  onClose: () => void;
}

export function CheckDialog({ open, isCheckmate, onClose }: CheckDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-3xl text-destructive flex items-center justify-center gap-2">
            {isCheckmate ? <Skull /> : <ShieldAlert />}
            {isCheckmate ? "Checkmate!" : "Check!"}
          </AlertDialogTitle>
          <AlertDialogDescription className="font-body text-lg pt-2 text-center">
            {isCheckmate
              ? "The King has fallen. The game is over."
              : "Your King is under attack! You must move out of check."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={onClose} className="bg-primary hover:bg-primary/90 text-primary-foreground mx-auto">
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

    