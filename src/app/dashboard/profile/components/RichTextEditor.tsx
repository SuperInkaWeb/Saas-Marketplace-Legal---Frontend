"use client";

import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: placeholder || "Cuenta tu experiencia y tu enfoque principal...",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"]
          ]
        }
      });

      quillRef.current.on("text-change", () => {
        const content = quillRef.current?.root.innerHTML;
        if (content === "<p><br></p>") {
          onChange("");
        } else {
          onChange(content || "");
        }
      });
    }
  }, [onChange, placeholder]);

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      if (!value && quillRef.current.root.innerHTML === "<p><br></p>") return;
      
      const selection = quillRef.current.getSelection();
      quillRef.current.clipboard.dangerouslyPasteHTML(value || "");
      if (selection) {
        quillRef.current.setSelection(selection.index, selection.length);
      }
    }
  }, [value]);

  return (
    <div className={`relative bg-white rounded-b-lg ${className || ""}`}>
      <div ref={editorRef} className="h-64 sm:h-80 text-base" />
      <style dangerouslySetInnerHTML={{__html: `
        .ql-toolbar.ql-snow {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-color: #e2e8f0;
          background-color: #f8fafc;
        }
        .ql-container.ql-snow {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: #e2e8f0;
          font-family: inherit;
        }
        .ql-editor {
          font-size: 1rem;
          line-height: 1.6;
          color: #334155;
        }
        .ql-editor.ql-blank::before {
          font-style: normal;
          color: #94a3b8;
        }
      `}} />
    </div>
  );
}
