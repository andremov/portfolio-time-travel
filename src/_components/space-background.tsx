export default function SpaceBackground({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="star-bkg z-0 min-h-full w-full flex flex-col items-center justify-center gap-8 px-6 py-20 lg:px-28">
      <div className="stars1" aria-hidden="true"></div>
      <div className="stars2" aria-hidden="true"></div>
      <div className="stars3" aria-hidden="true"></div>
      {children}
    </div>
  );
}
