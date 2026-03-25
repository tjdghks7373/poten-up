"use client";

import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { theme } from "@/lib/theme";

const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [{
      types: ["textStyle"],
      attributes: {
        fontSize: {
          default: null,
          parseHTML: (el) => el.style.fontSize ?? null,
          renderHTML: (attrs) => attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
        },
      },
    }];
  },
  addCommands() {
    return {
      setFontSize: (size: string) => ({ chain }: { chain: () => unknown }) => {
        const c = chain() as { setMark: (name: string, attrs: object) => { run: () => boolean } };
        return c.setMark("textStyle", { fontSize: size }).run();
      },
    } as never;
  },
});

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"];

const COLORS = [
  "#1a1a1a", "#1e3a5f", "#2d5a8e", "#c8a96e",
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280",
];

const Wrapper = styled.div`
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  overflow: hidden;
  background: ${theme.colors.bg};

  &:focus-within {
    border-color: ${theme.colors.brand};
  }
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.5rem;
  background: ${theme.colors.white};
  border-bottom: 1px solid ${theme.colors.border};
  overflow-x: auto;

  &::-webkit-scrollbar { height: 3px; }
  &::-webkit-scrollbar-thumb { background: ${theme.colors.border}; border-radius: 9999px; }
`;

const ToolBtn = styled.button<{ $active?: boolean }>`
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-family: inherit;
  font-weight: 500;
  background: ${({ $active }) => $active ? theme.colors.brand : "transparent"};
  color: ${({ $active }) => $active ? theme.colors.white : theme.colors.fg};
  transition: all 0.15s;
  min-width: 28px;

  &:hover {
    background: ${({ $active }) => $active ? theme.colors.brandLight : theme.colors.border};
  }
`;

const Divider = styled.div`
  width: 1px;
  background: ${theme.colors.border};
  margin: 0.125rem 0.25rem;
  align-self: stretch;
`;

const Select = styled.select`
  padding: 0.25rem 0.375rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-family: inherit;
  color: ${theme.colors.fg};
  background: ${theme.colors.bg};
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${theme.colors.brand};
  }
`;

const ColorGrid = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
  flex-wrap: wrap;
`;

const ColorSwatch = styled.button<{ $color: string; $active: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 0.25rem;
  background: ${({ $color }) => $color};
  border: 2px solid ${({ $active }) => $active ? theme.colors.brand : "transparent"};
  outline: 1px solid rgba(0,0,0,0.15);
  transition: transform 0.1s;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.2);
  }
`;

const ColorInput = styled.input`
  width: 24px;
  height: 24px;
  border-radius: 0.25rem;
  border: 1px solid ${theme.colors.border};
  padding: 0;
  cursor: pointer;
  background: none;
  outline: none;
`;

const EditorArea = styled.div`
  .ProseMirror {
    padding: 0.75rem;
    min-height: 120px;
    outline: none;
    font-size: 0.875rem;
    color: ${theme.colors.fg};
    line-height: 1.7;
    font-family: inherit;

    p { margin: 0 0 0.5rem; }
    p:last-child { margin-bottom: 0; }

    h2 { font-size: 1.125rem; font-weight: 700; margin: 0.75rem 0 0.375rem; color: ${theme.colors.brand}; }
    h3 { font-size: 1rem; font-weight: 600; margin: 0.5rem 0 0.25rem; }

    ul, ol { padding-left: 1.5rem; margin: 0.375rem 0; }
    li { margin-bottom: 0.25rem; }

    strong { font-weight: 700; }
    em { font-style: italic; }
    u { text-decoration: underline; }

    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      color: ${theme.colors.muted};
      pointer-events: none;
      float: left;
      height: 0;
    }
  }
`;

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichEditor({ value, onChange, placeholder }: Props) {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontSize,
      Placeholder.configure({ placeholder: placeholder ?? "내용을 입력하세요..." }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const currentColor = editor.getAttributes("textStyle").color ?? "#1a1a1a";

  return (
    <Wrapper>
      <Toolbar>
        <ToolBtn type="button" $active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>B</ToolBtn>
        <ToolBtn type="button" $active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} style={{ fontStyle: "italic" }}>I</ToolBtn>
        <ToolBtn type="button" $active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} style={{ textDecoration: "underline" }}>U</ToolBtn>
        <Divider />
        <ToolBtn type="button" $active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolBtn>
        <ToolBtn type="button" $active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolBtn>
        <Divider />
        <Select
          value={editor.getAttributes("textStyle").fontSize ?? ""}
          onChange={(e) => {
            if (e.target.value) {
              const chain = editor!.chain().focus() as { setFontSize: (s: string) => { run: () => boolean } };
              chain.setFontSize(e.target.value).run();
            } else {
              editor!.chain().focus().unsetMark("textStyle").run();
            }
          }}
        >
          <option value="">크기</option>
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <Divider />
        <ColorInput
          ref={colorInputRef}
          type="color"
          value={currentColor}
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          title="글자 색상"
        />
        <Divider />
        <ToolBtn type="button" $active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>• 목록</ToolBtn>
        <ToolBtn type="button" $active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. 목록</ToolBtn>
        <Divider />
        <ToolBtn type="button" onClick={() => editor.chain().focus().undo().run()}>↩</ToolBtn>
        <ToolBtn type="button" onClick={() => editor.chain().focus().redo().run()}>↪</ToolBtn>
      </Toolbar>
      <EditorArea>
        <EditorContent editor={editor} />
      </EditorArea>
    </Wrapper>
  );
}
