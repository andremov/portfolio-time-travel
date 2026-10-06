"use client";

import { useEffect, useState } from "react";

interface SuperFrameProps {
  src: string;
  onNavMessage?: (path: string) => void;
}

function SuperFrame({ src, onNavMessage }: SuperFrameProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!onNavMessage) return;

    let expectedOrigin: string;
    try {
      expectedOrigin = new URL(src).origin;
    } catch {
      return;
    }

    function handleMessage(event: MessageEvent<unknown>) {
      // Only the portfolio we embedded may drive the address bar.
      if (event.origin !== expectedOrigin) return;

      const data = event.data as Record<string, unknown> | null;
      if (
        typeof data === "object" &&
        data !== null &&
        data.type === "portfolio-nav" &&
        typeof data.path === "string"
      ) {
        onNavMessage?.(data.path);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onNavMessage, src]);

  return (
    <div className="relative h-screen w-full">
      {/*
        Behind the frame, not over it: a cached page can finish loading before
        hydration attaches onLoad, and a spinner on top would then never clear.
        Underneath, the page covers it as soon as it paints either way.
      */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
        </div>
      )}
      <iframe
        src={src}
        title="Portfolio preview"
        className="relative h-full w-full"
        referrerPolicy="no-referrer"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}

export default SuperFrame;
