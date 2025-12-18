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
        className="flex-shrink-0 text-gray-700 hover:text-teal-600 transition-colors"
      >
        {playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
      </button>

      <div className="relative flex-1 group">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={handleSeek}
          className="absolute inset-0 w-full h-1 opacity-0 cursor-pointer z-10"
        />
        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-400 group-hover:bg-[#0890A8] transition-colors"
            style={{ width: `${(progress / duration) * 100 || 0}%` }}
          />
        </div>
        <div
          className="absolute top-2 -translate-y-1/2 w-3 h-3 bg-gray-600 group-hover:bg-[#0890A8] rounded-full shadow-sm pointer-events-none transition-colors"
          style={{ left: `${(progress / duration) * 100 || 0}%`, transform: `translate(-50%, -50%)` }}
        />
      </div>

      <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} />
    </div>
  );
};

export default AudioPlayer;
