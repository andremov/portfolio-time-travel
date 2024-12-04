"use client";

import { useRef, useState, useEffect } from "react";

function SuperFrame(props: { src: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState("1200px"); // Default height

  useEffect(() => {
    const adjustIframeHeight = () => {
      if (iframeRef.current) {
        const iframeDocument =
          iframeRef.current.contentDocument ??
          iframeRef.current.contentWindow?.document;
        if (iframeDocument) {
          const height = iframeDocument.body.scrollHeight;
          setIframeHeight(`${height}px`);
        }
      }
    };

    // Add an event listener for iframe load
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", adjustIframeHeight);
    }

    // Cleanup event listener on component unmount
    return () => {
      if (iframe) {
        iframe.removeEventListener("load", adjustIframeHeight);
      }
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={props.src}
      style={{
        width: "100%",
        height: iframeHeight,
        border: "1px solid #ccc",
      }}
    />
  );
}

export default SuperFrame;
