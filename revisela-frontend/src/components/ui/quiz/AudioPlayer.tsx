import { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";

type AudioPlayerProps = {
  src: string;
};

const AudioPlayer = ({ src }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setAudioDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Number(e.target.value);
    setProgress(Number(e.target.value));
  };

  return (
    <div className="flex items-center gap-4 w-full">
      <button
        type="button"
        onClick={togglePlay}
        className="flex-shrink-0 text-[#334155] hover:text-black transition-colors focus:outline-none"
      >
        {playing ? (
          <Pause size={24} fill="currentColor" />
        ) : (
          <Play size={24} fill="currentColor" />
        )}
      </button>

      <div className="relative flex-1 group flex items-center h-1">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={handleSeek}
          className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer z-10 -top-1.5"
        />
        <div className="h-0.5 w-full bg-[#E2E8F0] relative rounded-full">
          <div
            className="absolute top-1/2 w-3.5 h-3.5 bg-[#475569] rounded-full shadow-sm"
            style={{
              left: `${(progress / duration) * 100 || 0}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
      </div>

      <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} />
    </div>
  );
};

export default AudioPlayer;
