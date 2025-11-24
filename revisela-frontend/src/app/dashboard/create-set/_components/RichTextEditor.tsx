import { useRef, useEffect, useState } from "react";

interface RichTextEditorProps {
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ value = "", onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
      checkIfEmpty();
    }
  }, [value]);

  const checkIfEmpty = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText.trim();
      setIsEmpty(text === '');
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      checkIfEmpty();
    }
  };

  return (
    <div className="relative w-full">
      <div
        ref={editorRef}
        contentEditable
        className={`focus:outline-none border border-gray-300 focus:border-[#0890A8] break-words ${className}`}
        suppressContentEditableWarning={true}
        onInput={handleInput}
        style={{ minHeight: '1.5em', maxWidth: '100%', overflowWrap: 'break-word' }}
      />
      {isEmpty && placeholder && (
        <div className="absolute top-0 left-0 pointer-events-none text-gray-400 p-2 ">
          {placeholder}
        </div>
      )}
    </div>
  );
}
