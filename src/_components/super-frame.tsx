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

    function handleMessage(event: MessageEvent<unknown>) {
      const data = event.data as Record<string, unknown> | null;
      if (
        typeof data === "object" &&
        data !== null &&
        data.type === "portfolio-nav" &&
        typeof data.path === "string"
      ) {
        onNavMessage!(data.path);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onNavMessage]);

  return (
    <div className="relative h-screen w-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
        </div>
      )}
      <iframe
        src={src}
        title="Portfolio preview"
        className="h-full w-full"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        referrerPolicy="no-referrer"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}

export default SuperFrame;
