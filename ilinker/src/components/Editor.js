'use client'

import { useEffect, useState } from 'react'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Heading from '@tiptap/extension-heading'
import Placeholder from '@tiptap/extension-placeholder'

export default function Editor() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Heading.configure({ levels: [1, 2, 3] }),
      Placeholder.configure({ placeholder: 'Escribe aquí o usa "/" para insertar elementos...' }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      console.log(editor.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return

    const handler = (event) => {
      if (event.key === '/' && editor.isFocused) {
        setIsMenuVisible(true)
      } else if (event.key !== '/') {
        setIsMenuVisible(false)
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [editor])

  return (
    <div className="border p-4 rounded-lg relative">
      {isMenuVisible && editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} pluginKey="menu">
          <div className="bg-white border shadow-sm px-2 py-1 rounded text-sm flex gap-2">
            <button onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
            <button onClick={() => {
              const url = window.prompt('URL de la imagen')
              if (url) {
                editor.chain().focus().setImage({ src: url }).run()
              }
            }}>🖼️</button>

            {/* Encabezados */}
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
          </div>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />
    </div>
  )
}
