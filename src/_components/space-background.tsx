export default function SpaceBackground({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="star-bkg fixed left-0 top-0 z-0 flex h-screen w-screen flex-col items-center justify-between px-28 py-20">
      <div className="stars1"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      {children}
    </div>
  );
}
