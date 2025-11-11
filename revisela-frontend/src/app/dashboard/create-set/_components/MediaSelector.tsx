import Image from 'next/image';
import { useState } from 'react';
import { CiImageOn, CiMusicNote1 } from 'react-icons/ci';

import {
  Image as ImageIcon,
  MoreHorizontal,
  Music,
  Trash,
  X,
} from 'lucide-react';

import AudioPlayer from './AudioPlayer';

type MediaSelectorProps = {
  id: string;
};

const MediaSelector = ({ id }: MediaSelectorProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setAudioUrl(null);
        setMenuOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const audioSrc = URL.createObjectURL(file);
      setAudioUrl(audioSrc);
      setImagePreview(null);
      setMenuOpen(false);
    }
  };

  const removeMedia = () => {
    setImagePreview(null);
    setAudioUrl(null);
    setMenuOpen(false);
  };

  return (
    <div>
      {!imagePreview && !audioUrl ? (
        <div className="flex flex-col text-gray-600">
          {/* Hidden image input */}
          <input
            type="file"
            accept="image/*"
            id={`file-upload-${id}`}
            className="hidden"
            onChange={handleImageChange}
          />
          <label htmlFor={`file-upload-${id}`} className="cursor-pointer">
            {' '}
            <CiImageOn size={20} />{' '}
          </label>
          {/* Hidden audio input */}
          <input
            type="file"
            accept="audio/*"
            id={`audio-upload-${id}`}
            className="hidden"
            onChange={handleAudioChange}
          />
          <label htmlFor={`audio-upload-${id}`} className="cursor-pointer">
            <CiMusicNote1 size={20} />
          </label>
        </div>
      ) : (
        <div className="relative w-20 h-11 border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
          {/* Image Preview */}
          {imagePreview && (
            <div
              className="w-full h-full cursor-pointer"
              onClick={() => setModalOpen(true)}
            >
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="rounded-md border object-contain"
              />
            </div>
          )}

          {/* Audio Icon */}
          {audioUrl && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="cursor-pointer"
            >
              <Music size={20} className="text-gray-600" />
            </button>
          )}

          {/* 3-dot menu */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="absolute -top-2 -right-2 bg-[#D9D9D9] text-[#444444] rounded-full p-1"
          >
            <MoreHorizontal size={16} />
          </button>

          {/* Popup menu */}
          {menuOpen && (
            <div className="absolute right-0 top-5 w-40 py-1 bg-white rounded-lg shadow-md z-10">
              <label
                htmlFor={`change-image-${id}`}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                <ImageIcon size={14} />
                Image
              </label>
              <input
                type="file"
                id={`change-image-${id}`}
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              <label
                htmlFor={`change-audio-${id}`}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                <Music size={14} />
                Audio
              </label>
              <input
                type="file"
                id={`change-audio-${id}`}
                accept="audio/*"
                className="hidden"
                onChange={handleAudioChange}
              />

              <button
                type="button"
                onClick={removeMedia}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-sm text-red-500"
              >
                <Trash size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal with blurred background */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative rounded-lg max-w-lg w-full mt-20">
            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 border-2 border-[#444444] rounded-full bg-white"
            >
              <X size={20} />
            </button>

            {/* Image preview */}
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Full Preview"
                width={500}
                height={350}
                className="rounded-md object-contain mx-auto"
              />
            )}

            {/* Audio preview */}
            {audioUrl && (
              <div className="mt-12 bg-white p-10 space-y-5">
                {' '}
                <div className="flex justify-center items-center gap-2 text-2xl ">
                  <CiMusicNote1 />
                  <p>Audio Preview</p>
                </div>
                {/* <AudioPlayer src={audioUrl} /> */}
                <audio controls className="w-full">
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

export default MediaSelector;
