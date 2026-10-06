import SpaceBackground from "./space-background";
import Wormhole from "./wormhole";

interface TimeTravelScreenProps {
  doTimeTravel: (slug: string) => void;
  history: { name: string; slug: string; date: string; link: string }[];
}

export default function TimeTravelScreen({
  doTimeTravel,
  history,
}: TimeTravelScreenProps) {
  return (
    // SpaceBackground can't be fixed itself: .star-bkg makes it relative so
    // it also works as the trigger's fill. This wrapper covers the viewport,
    // and scrolls when the grid is taller than the window.
    <div className="fixed inset-0 overflow-y-auto">
      <SpaceBackground>
        <div className="space-title">
          <span>Time Travel</span>
        </div>
        <div className="grid w-full grid-cols-4 lg:px-10">
          {history.map((entry) => (
            <button
              key={entry.name}
              className="group mx-2 my-6 flex flex-col items-center lg:mx-4 lg:my-12"
              onClick={() => doTimeTravel(entry.slug)}
              aria-label={`Travel to ${entry.name} portfolio (${entry.date})`}
            >
              <Wormhole />
              <span className="font-[Lato] text-xl font-bold lg:text-3xl text-white/30 transition group-hover:text-white/80">
                {entry.name}
              </span>
              <span className="text-base font-medium text-white/10 transition group-hover:text-white/50">
                {entry.date}
              </span>
            </button>
          ))}
        </div>
      </SpaceBackground>
    </div>
  );
}
