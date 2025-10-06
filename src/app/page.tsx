import { ChevronRight } from "lucide-react";

import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans flex flex-1 h-full items-center justify-center p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-1 flex-col items-center justify-center gap-[32px]">
        <div className="flex flex-col items-center justify-center font-mono text-sm/6 text-center sm:text-left">
          <p className="text-3xl font-semibold">Welcome to:</p>
          <p className="tracking-[-.01em]">
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              Taiwo Babarinde&apos;s
            </code>{" "}
            CRM test.
          </p>
        </div>

        <Link
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          href="/customers"
          rel="noopener noreferrer"
        >
          Click to proceed
          <ChevronRight className="animate-pulse" />
        </Link>
      </main>
    </div>
  );
}
