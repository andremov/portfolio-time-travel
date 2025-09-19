"use client";

function SuperFrame(props: { src: string }) {
  return (
    <iframe
      src={props.src}
      style={{
        height: "100vh",
        width: "100%",
      }}
    />
  );
}

export default SuperFrame;
