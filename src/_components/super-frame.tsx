"use client";

import { useState } from "react";

function SuperFrame(props: { src: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative h-screen w-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
        </div>
      )}
      <iframe
        src={props.src}
        title="Portfolio preview"
        className="h-full w-full"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}

export default SuperFrame;
