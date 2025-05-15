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
import Link from '@tiptap/extension-link'
import React, { useRef, useEffect, useState } from 'react'
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
    Unlink,
    Link as LinkIcon,
    ImageUp,
    X, AlertCircle
} from 'lucide-react'
import '@/styles/tiptap.scss'
// import Image from '@tiptap/extension-image'
import { ResizableImage } from '@/contexts/ResizableImage'
import { Button } from "@/components/ui/button";


interface SimpleEditorProps {
    content: string
    onChange: (html: string) => void
}

export const SimpleEditor: React.FC<SimpleEditorProps> = ({ content, onChange }) => {
    const colorTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null!);

    const [showImageMenu, setShowImageMenu] = useState(false);
    const [showLinkMenu, setShowLinkMenu] = useState(false);

    const [imageUrl, setImageUrl] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [linkWord, setLinkWord] = useState('');

    const imageInputRef = useRef<HTMLInputElement>(null);
    const imageButtonRef = useRef<HTMLButtonElement>(null);
    const imageMenuRef = useRef<HTMLDivElement>(null);

    const MAX_IMAGE_SIZE_MB = 2;
    const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
    const MAX_BASE64_LENGTH = 1000000; // Ajusta según el límite real de tu base de datos
    const [errosMsg, setErrorMsg] = useState('');


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
            ResizableImage.configure({
                inline: true,
                allowBase64: true,
            }),
            Typography,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Color.configure({
                types: ['textStyle'],
            }),
            TextStyle,
            Link.configure({
                openOnClick: true,
                linkOnPaste: true,
                HTMLAttributes: {
                    class: 'text-blue-500 underline',
                    rel: 'noopener noreferrer',
                    target: '_blank',
                },
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none mx-auto p-4',
            },
        },

        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },

        immediatelyRender: false,

    })

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setSelectedFileName(file.name);
            // Si hay URL, la limpiamos para dar prioridad al archivo
            setImageUrl('');
        }
    };


    function isValidUrl(url: string): boolean {
        try {
            const parsed = new URL(url);
            return ['http:', 'https:'].includes(parsed.protocol);
        } catch (e) {
            return false;
        }
    }


    const addImage = () => {
        if (editor) {
            // Si hay un archivo seleccionado, lo procesamos
            if (selectedFile && selectedFile.size <= MAX_IMAGE_SIZE_BYTES) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target?.result as string;

                    if (result.length > MAX_BASE64_LENGTH) {
                        setErrorMsg('La imagen es demasiado grande para guardarse en la base de datos.');
                        return;
                    }

                    editor.chain().focus().setImage({
                        src: result,
                        alt: imageAlt || selectedFileName
                    }).run();

                    console.log(selectedFile)

                    // Limpiar todo después de insertar
                    setShowImageMenu(false);
                    setSelectedFile(null);
                    setSelectedFileName('');
                    setImageAlt('');
                    setErrorMsg('')

                    // Reset the file input
                    if (imageInputRef.current) {
                        imageInputRef.current.value = '';
                    }
                };
                reader.readAsDataURL(selectedFile);
            }
            // Si hay una URL, la usamos
            else if (imageUrl) {
                editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run();
                setShowImageMenu(false);
                setImageUrl('');
                setImageAlt('');
            } else {
                setErrorMsg(`La imagen excede el tamaño máximo de ${MAX_IMAGE_SIZE_MB}MB.`);
            }
        }
    }

    const addLink = () => {
        if (!editor) return;

        // Si no se proporciona URL, quitamos el enlace
        if (linkWord === null) return;
        if (linkWord === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            setShowLinkMenu(false);
            return;
        }

        console.log("COSAS", isValidUrl(linkWord))

        if (isValidUrl(linkWord)) {
            // Solo aplicar si es un enlace válido
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkWord }).run();
            setShowLinkMenu(false);
            setErrorMsg('')
            setLinkWord('');
        } else {
            setErrorMsg('No es un link valido');
            return;
        }

    }


    return (
        <div className="border rounded-lg overflow-hidden relative">
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

                <div className="w-px bg-gray-300 mx-1" />

                <div className="flex items-center gap-1 px-1 relative">
                    <button
                        title="Añadir enlace"
                        onClick={() => setShowLinkMenu(!showLinkMenu)}
                        className="p-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
                    >
                        <LinkIcon className="w-5 h-5" />
                    </button>

                    <button
                        title="Eliminar enlace"
                        onClick={() => editor?.chain().focus().unsetLink().run()}
                        className="p-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
                    >
                        <Unlink className="w-5 h-5" />
                    </button>

                    <button
                        ref={imageButtonRef}
                        onClick={() => setShowImageMenu(!showImageMenu)}
                        className={`p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 ${showImageMenu ? 'bg-gray-200' : ''}`}
                        title="Insertar imagen"
                    >
                        <ImageUp className="w-5 h-5" />
                    </button>

                </div>
            </div>

            <EditorContent editor={editor} />

            {/* Modal de inserción de imagen */}
            {showImageMenu && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div
                        ref={imageMenuRef}
                        className="bg-white rounded-lg shadow-xl p-4 max-w-md w-full mx-4"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Insertar imagen</h3>
                            <button
                                onClick={() => setShowImageMenu(false)}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL de la imagen</label>
                                <input
                                    type="text"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full border p-2 rounded-md"
                                />
                            </div>

                            <div className="text-center relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-2 bg-white text-sm text-gray-500">O</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={() => imageInputRef.current?.click()}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                                >
                                    Seleccionar imagen de tu dispositivo
                                </button>
                                {selectedFileName && (
                                    <>
                                        {errosMsg && (
                                            <div
                                                className="flex items-center p-2 mb-2 bg-red-50 text-red-700 rounded border border-red-200">
                                                <AlertCircle size={16} className="mr-2" />
                                                <span className="text-sm">{errosMsg}</span>
                                            </div>
                                        )}

                                        <div
                                            className="text-sm bg-blue-50 border border-blue-100 p-2 rounded flex items-center">

                                            <span className="truncate flex-1">{selectedFileName}</span>
                                            <button
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    setSelectedFileName('');
                                                    setErrorMsg('')
                                                    if (imageInputRef.current) {
                                                        imageInputRef.current.value = '';
                                                    }
                                                }}
                                                className="ml-2 text-gray-500 hover:text-gray-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        <div className="flex justify-end mt-6 space-x-2">
                            <Button
                                onClick={() => {
                                    setShowImageMenu(false);
                                    setErrorMsg('');
                                    setSelectedFile(null);
                                    setSelectedFileName('');
                                    setImageAlt('');
                                }}
                                className="px-4 py-2 border border-gray-300 bg-gray-300 rounded-md hover:bg-gray-400 text-black transition-colors"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={() => {
                                    addImage();
                                }}
                                className="px-4 py-2 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!imageUrl && !selectedFile}
                            >
                                Insertar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {showLinkMenu && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div
                        className="bg-white rounded-lg shadow-xl p-4 max-w-md w-full mx-4"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Insertar link</h3>
                            <button
                                onClick={() => setShowLinkMenu(false)}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link a vincular</label>

                                {errosMsg && (
                                    <div
                                        className="flex items-center p-2 mb-2 bg-red-50 text-red-700 rounded border border-red-200">
                                        <AlertCircle size={16} className="mr-2" />
                                        <span className="text-sm">{errosMsg}</span>
                                    </div>
                                )}

                                <input
                                    type="text"
                                    placeholder="https://ejemplo.com/"
                                    value={linkWord}
                                    onChange={(e) => setLinkWord(e.target.value)}
                                    className="w-full border p-2 rounded-md"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-2">
                            <Button
                                onClick={() => {
                                    setShowLinkMenu(false)
                                    setErrorMsg('');
                                    setLinkWord('')
                                }}
                                className="px-4 py-2 border border-gray-300 bg-gray-400 rounded-md hover:bg-gray-450 text-black transition-colors"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={() => {
                                    addLink();
                                }}
                                className="px-4 py-2 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!linkWord}
                            >
                                Vincular
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}