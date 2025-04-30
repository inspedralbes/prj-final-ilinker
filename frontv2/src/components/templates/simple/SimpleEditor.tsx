"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import HardBreak from '@tiptap/extension-hard-break'
import Typography from '@tiptap/extension-typography'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import React, { useRef, useEffect } from 'react'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Palette,
} from 'lucide-react'
import '@/styles/tiptap.scss'

interface SimpleEditorProps {
  content: string
  onChange: (html: string) => void
}

export const SimpleEditor: React.FC<SimpleEditorProps> = ({ content, onChange }) => {
  const colorTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null!);

  useEffect(() => {
    return () => {
      if (colorTimeoutRef.current) {
        clearTimeout(colorTimeoutRef.current);
      }
    };
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph.configure({
        HTMLAttributes: {
          class: 'editor-paragraph',
        },
      }),
      HardBreak.configure({
        keepMarks: true,
        HTMLAttributes: { class: 'my-hard-break' },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'bullet-list',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'ordered-list',
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: 'list-item',
        },
      }),
      Typography,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image,
      Color.configure({
        types: ['textStyle'],
      }),
      TextStyle,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none mx-auto',
      },
    },
  })

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="border-b p-2 flex gap-2 flex-wrap bg-gray-50">
        <div className="flex items-center gap-1 px-1">
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
            title="Negrita"
          >
            <Bold className="w-5 h-5" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
            title="Cursiva"
          >
            <Italic className="w-5 h-5" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className={`p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 ${editor?.isActive('strike') ? 'bg-gray-200' : ''}`}
            title="Tachado"
          >
            <Strikethrough className="w-5 h-5" />
          </button>
        </div>

        <div className="w-px bg-gray-300 mx-1" />

        <div className="flex items-center gap-1 px-1">
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 ${editor?.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
            title="Encabezado 1"
          >
            <Heading1 className="w-5 h-5" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 ${editor?.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
            title="Encabezado 2"
          >
            <Heading2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 ${editor?.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
            title="Encabezado 3"
          >
            <Heading3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}
            className={`p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 ${editor?.isActive('heading', { level: 4 }) ? 'bg-gray-200' : ''}`}
            title="Encabezado 4"
          >
            <Heading4 className="w-5 h-5" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 5 }).run()}
            className={`p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 ${editor?.isActive('heading', { level: 5 }) ? 'bg-gray-200' : ''}`}
            title="Encabezado 5"
          >
            <Heading5 className="w-5 h-5" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 6 }).run()}
            className={`p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 ${editor?.isActive('heading', { level: 6 }) ? 'bg-gray-200' : ''}`}
            title="Encabezado 6"
          >
            <Heading6 className="w-5 h-5" />
          </button>
        </div>

        <div className="w-px bg-gray-300 mx-1" />

        <div className="flex items-center gap-1 px-1">
          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 ${editor?.isActive('bulletList') ? 'bg-gray-200' : ''}`}
            title="Lista con viñetas"
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 ${editor?.isActive('orderedList') ? 'bg-gray-200' : ''}`}
            title="Lista numerada"
          >
            <ListOrdered className="w-5 h-5" />
          </button>
        </div>

        <div className="w-px bg-gray-300 mx-1" />

        <div className="flex items-center gap-1 px-1">
          <button
            onClick={() => editor?.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 ${editor?.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
            title="Alinear a la izquierda"
          >
            <AlignLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 ${editor?.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
            title="Centrar"
          >
            <AlignCenter className="w-5 h-5" />
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 ${editor?.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
            title="Alinear a la derecha"
          >
            <AlignRight className="w-5 h-5" />
          </button>
        </div>

        <div className="w-px bg-gray-300 mx-1" />

        <div className="relative" title="Color de texto">
          <button
            className="p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 flex items-center gap-1"
            style={{
              borderBottom: editor?.getAttributes('textStyle').color
                ? `2px solid ${editor?.getAttributes('textStyle').color}`
                : 'none'
            }}
          >
            <Palette className="w-5 h-5" />
          </button>
          <input
            type="color"
            className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
            value={editor?.getAttributes('textStyle').color || '#000000'}
            onChange={(e) => {
              if (colorTimeoutRef.current) {
                clearTimeout(colorTimeoutRef.current);
              }
              colorTimeoutRef.current = setTimeout(() => {
                editor?.chain().focus().setColor(e.target.value).run();
              }, 100);
            }}
          />
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
