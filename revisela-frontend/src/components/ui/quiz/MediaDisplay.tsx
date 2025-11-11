import Image from "next/image";
import React, { useState } from "react";
import { CiMusicNote1 } from "react-icons/ci";
import { X } from "lucide-react";

interface MediaDisplayProps {
  imageUrl?: string | null;
  audioUrl?: string | null;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ imageUrl, audioUrl }) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (!imageUrl && !audioUrl) return null;

  return (
    <div className="">
      {/* Preview container */}
      <div className="relative w-20 h-11 border border-gray-200 rounded-md overflow-hidden flex items-center justify-center bg-gray-50 cursor-pointer">
        {imageUrl && (
          <div className="w-full h-full" onClick={() => setModalOpen(true)}>
            <Image
              src={imageUrl}
              alt="Media"
              fill
              className="object-contain"
            />
          </div>
        )}
        {audioUrl && !imageUrl && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center text-gray-600"
          >
            <CiMusicNote1 size={24} />
          </button>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative rounded-lg max-w-lg w-full p-4">
            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 border-2 border-[#444444] rounded-full bg-white"
            >
              <X size={20} />
            </button>

            {/* Image in modal */}
            {imageUrl && (
              <Image
                src={imageUrl}
                alt="Full Preview"
                width={500}
                height={350}
                className="rounded-md object-contain mx-auto"
              />
            )}

            {/* Audio in modal */}
            {audioUrl && (
              <div className="mt-6 bg-white p-4 rounded-md">
                <div className="flex justify-center items-center gap-2 text-lg">
                  <CiMusicNote1 />
                  <p>Audio Preview</p>
                </div>
                <audio controls className="w-full mt-2">
                  <source src={audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaDisplay;
