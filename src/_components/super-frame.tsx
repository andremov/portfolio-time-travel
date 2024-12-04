"use client";

import { useRef, useState, useEffect } from "react";

function SuperFrame(props: { src: string }) {
  return (
    <iframe
      src={props.src}
      style={{
        height: "102vh",
        width: "100%",
      }}
    />
  );
}

export default SuperFrame;
