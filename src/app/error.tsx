"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="mt-4 text-lg text-white/60">A temporal anomaly has occurred.</p>
        <button
          onClick={reset}
          className="mt-6 rounded bg-white/10 px-4 py-2 text-white/80 hover:bg-white/20"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
