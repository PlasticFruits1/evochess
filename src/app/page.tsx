import ChessGame from '@/components/chess-game';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 font-body">
      <ChessGame />
    </main>
  );
}
