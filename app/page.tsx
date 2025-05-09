"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DadJokeGenerator() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Team Dad Joke Generators</h1>
        <p className="text-gray-600 mb-8">
          Choose your team theme to get started with your daily dad joke:
        </p>

        <div className="grid gap-4">
          <Link href="/purple" passHref>
            <Button className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-2 rounded-full shadow-md hover:shadow-lg transform transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0">
              Purple Finch Team
            </Button>
          </Link>

          <Link href="/white" passHref>
            <Button className="bg-gradient-to-r from-white-200 to-gray-300 hover:from-white-300 hover:to-gray-400 text-black px-8 py-2 rounded-full shadow-md hover:shadow-lg transform transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0">
              Snowy White Owl Team
            </Button>
          </Link>

          <Link href="/golden" passHref>
            <Button className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white px-8 py-2 rounded-full shadow-md hover:shadow-lg transform transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0">
              Golden Pheasant Team
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
