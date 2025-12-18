import Image from "next/image";
import React, { useState } from "react";
import { X, Music } from "lucide-react";
import AudioPlayer from "./AudioPlayer";

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
            <Music size={24} />
          </button>
        )}
      </div>

      {/* Modal with blurred background */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 mx-4 flex flex-col items-center">
            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} strokeWidth={1} />
            </button>

            {/* Image in modal */}
            {imageUrl && (
              <div className="w-full flex justify-center mb-4">
                <Image
                  src={imageUrl}
                  alt="Full Preview"
                  width={500}
                  height={350}
                  className="rounded-lg object-contain"
                />
              </div>
            )}

            {/* Audio in modal */}
            {audioUrl && (
              <div className="w-full flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-[#F1F5F9] p-5 rounded-full">
                    <Music size={32} className="text-[#0890A8]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1E293B]">Audio Preview</h3>
                </div>

                <div className="w-full bg-[#F8FAFC] p-6 rounded-2xl border border-[#F1F5F9]">
                  <AudioPlayer src={audioUrl} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaDisplay;
