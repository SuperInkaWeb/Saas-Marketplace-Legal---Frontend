"use client";

import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export function RichTextEditor({ value, onChange, placeholder, readOnly = false }: RichTextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!quillRef.current) {
      quillRef.current = new Quill(containerRef.current, {
        theme: "snow",
        readOnly: readOnly,
        placeholder: placeholder || "Escriba aquí...",
        modules: {
          toolbar: readOnly ? false : [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['clean']
          ],
        },
      });

      quillRef.current.on("text-change", () => {
        const html = quillRef.current?.root.innerHTML;
        if (html) {
          onChange(html);
        }
      });
    }
  }, [placeholder, readOnly]);

  useEffect(() => {
    if (quillRef.current) {
      const currentHtml = quillRef.current.root.innerHTML;
      if (value !== currentHtml && value) {
        // Prevent cursor jumping by only updating if different
        const delta = quillRef.current.clipboard.convert({ html: value });
        quillRef.current.setContents(delta, "silent");
      }
    }
  }, [value]);

  return (
    <div className={`rich-text-editor-container ${readOnly ? 'read-only' : 'border border-slate-200 rounded-xl overflow-hidden bg-white'}`}>
      <style>{`
        .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 0.75rem 0.75rem 0 0;
          padding: 12px;
        }
        .ql-container.ql-snow {
          border: none;
          min-height: 400px;
          border-radius: 0 0 0.75rem 0.75rem;
          font-family: inherit;
          font-size: 1rem;
        }
        .ql-editor {
          min-height: 400px;
        }
        .read-only .ql-container.ql-snow {
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          min-height: auto;
          background: white;
        }
        .read-only .ql-editor {
          min-height: auto;
          padding: 24px;
        }
      `}</style>
      <div ref={containerRef} />
    </div>
  );
}
