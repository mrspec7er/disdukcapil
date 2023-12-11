"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "@/app/components/text-content.css";

const TextContent = ({ content }: { content: string }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
  });

  return (
    <div className="content">
      <EditorContent editor={editor} />
    </div>
  );
};

export default TextContent;
