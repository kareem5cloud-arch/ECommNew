"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect, useState } from "react";
interface PropsDescription {
  setDescription: (data: string) => void;
  Description: string;
  setDescriptionShow: (data: boolean) => void;
}
export default function DescriptionTextArea({
  setDescription,
  Description,
  setDescriptionShow,
}: PropsDescription) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: Description || "",

    editorProps: {
      attributes: {
        class:
          "tiptap w-full min-h-[180px] sm:min-h-[220px] md:min-h-[250px] max-h-[400px] overflow-y-auto border border-gray-200 bg-gray-50 rounded-md px-3 py-2 sm:px-4 sm:py-3 shadow-md focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;

    if (Description !== editor.getHTML()) {
      editor.commands.setContent(Description || "");
    }
  }, [Description, editor]);
  const handleConfirm = () => {
    if (!editor) return;

    const content = editor.getHTML();

    setDescription(String(content));
    setDescriptionShow(false);
  };
  return (
    <>
      {/* <MenuBar editor={editor} /> */}
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />

      <button
        type="button"
        onClick={handleConfirm}
        className="mt-3 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Confirm
      </button>
    </>
  );
}
