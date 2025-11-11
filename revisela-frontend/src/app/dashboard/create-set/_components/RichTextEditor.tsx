import { useRef, useState, useEffect } from "react";

interface RichTextEditorProps {
  value?: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ value = "", onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const toggleStyle = (style: "bold" | "italic" | "underline") => {
    document.execCommand(
      style === "bold"
        ? "bold"
        : style === "italic"
        ? "italic"
        : "underline",
      false
    );
    setActiveStyles((prev) => ({ ...prev, [style]: !prev[style] }));
    editorRef.current?.focus();
  };

  const handleInput = () => {
    onChange(editorRef.current?.innerHTML || "");
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex gap-2 mb-1">
        <button
          type="button"
          onClick={() => toggleStyle("bold")}
          className={`p-1 rounded ${activeStyles.bold ? "bg-gray-300" : ""}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => toggleStyle("italic")}
          className={`p-1 rounded ${activeStyles.italic ? "bg-gray-300" : ""}`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => toggleStyle("underline")}
          className={`p-1 rounded ${activeStyles.underline ? "bg-gray-300" : ""}`}
        >
          U
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="border border-gray-300 rounded p-2 min-h-[80px] focus:outline-none"
        suppressContentEditableWarning={true}
        onInput={handleInput}
      ></div>
    </div>
  );
}
