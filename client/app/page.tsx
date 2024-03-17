import { Board } from "@/lib/components/board";

export default function Home() {
  return (
    <main className="m-0 p-0 flex flex-col items-center justify-center min-h-[100vh] bg-[#f0f0f0]">
      <h1 className='text-red-300'>Welcome to Connect-Five Game!</h1>
      <Board />
    </main>
  );
}
