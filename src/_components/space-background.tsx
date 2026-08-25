export default function SpaceBackground({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="star-bkg fixed inset-0 z-0 flex flex-col items-center justify-between px-28 py-20">
      <div className="stars1" aria-hidden="true"></div>
      <div className="stars2" aria-hidden="true"></div>
      <div className="stars3" aria-hidden="true"></div>
      {children}
    </div>
  );
}
