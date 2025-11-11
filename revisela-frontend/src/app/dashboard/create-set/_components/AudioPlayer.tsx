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
      <button onClick={togglePlay} className="flex-shrink-0">
        {playing ? <Pause size={20} /> : <Play size={20} />}
      </button>

      <div className="relative flex-1 h-2 bg-gray-300 rounded-full">
        {/* Progress filled */}
        <div
          className="absolute h-2 bg-teal-500 rounded-full"
          style={{ width: `${(progress / duration) * 100 || 0}%` }}
        ></div>

        {/* Draggable knob */}
        <div
          className="absolute w-4 h-4 bg-teal-500 rounded-full -top-1 -translate-x-1/2"
          style={{ left: `${(progress / duration) * 100 || 0}%` }}
        ></div>
      </div>

      {/* Hidden range input for seeking */}
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={progress}
        onChange={handleSeek}
        className="hidden"
      />

      {/* Hidden audio element */}
      <audio ref={audioRef} src={src} />
    </div>
  );
};

export default AudioPlayer;
