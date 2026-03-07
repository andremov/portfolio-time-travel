import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-4 text-lg text-white/60">This timeline doesn&apos;t exist.</p>
        <Link href="/" className="mt-6 inline-block text-white/40 underline hover:text-white/80">
          Return to the present
        </Link>
      </div>
    </div>
  );
}
