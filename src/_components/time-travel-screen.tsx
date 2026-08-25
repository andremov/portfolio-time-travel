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
    <div>
      <SpaceBackground>
        <div className="space-title">
          <span>Time Travel</span>
        </div>
        <div className="grid w-full grid-cols-4 px-10">
          {history.map((entry) => (
            <button
              key={entry.name}
              className="group mx-4 my-12 flex flex-col items-center"
              onClick={() => doTimeTravel(entry.slug)}
              aria-label={`Travel to ${entry.name} portfolio (${entry.date})`}
            >
              <Wormhole />
              <span className="font-[Lato] text-3xl font-bold text-white/30 transition group-hover:text-white/80">
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
