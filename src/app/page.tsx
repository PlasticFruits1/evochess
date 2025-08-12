import ChessGame from '@/components/chess-game';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background font-body">
      <ChessGame />
    </main>
  );
}
