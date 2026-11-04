interface BootProps {
  restart: boolean;
  sleep: boolean;
  setBooting: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}

// Progress bar ticks once per frame (~16 ms). Browsers clamp setInterval to
// >= 4 ms anyway, so the old 1 ms / +0.15% setting meant ~667 re-renders and
// ~3 s of artificial delay. 16 ms / +1.5% gives the same look in ~1 s.
const loadingInterval = 16;
const loadingStep = 1.5;
const bootingInterval = 300;

export default function Boot({ restart, sleep, setBooting }: BootProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(0);

  useEffect(() => {
    if (restart && !sleep) setLoading(true);
  }, [restart, sleep]);

  useInterval(
    () => {
      if (percent >= 100) return; // already finished; finish timer is pending
      const newPercent = percent + loadingStep;
      if (newPercent >= 100) {
        setPercent(100);
        setTimeout(() => {
          setBooting(false);
          setLoading(false);
        }, bootingInterval);
      } else setPercent(newPercent);
    },
    loading ? loadingInterval : null
  );

  const handleClick = () => {
    if (sleep) setBooting(false);
    else if (restart || loading) return;
    else setLoading(true);
  };

  return (
    <div className="size-full bg-black flex-center" onClick={handleClick}>
      <div className="i-fa-brands:apple text-white -mt-4 size-20 sm:size-24" />
      {loading && (
        <div
          className="absolute top-1/2 inset-x-0 w-56 h-1 sm:h-1.5 bg-gray-500 rounded overflow-hidden"
          m="t-16 sm:t-24 x-auto"
        >
          <span
            className="absolute top-0 bg-white h-full rounded-sm"
            style={{
              width: `${percent.toString()}%`
            }}
          />
        </div>
      )}
      {!restart && !loading && (
        <div
          pos="absolute top-1/2 inset-x-0"
          m="t-16 sm:t-20 x-auto"
          text="sm gray-200 center"
        >
          Click to {sleep ? "wake up" : "boot"}
        </div>
      )}
    </div>
  );
}
