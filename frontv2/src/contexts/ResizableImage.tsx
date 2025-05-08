import { mergeAttributes, Node } from '@tiptap/core'
import Image from '@tiptap/extension-image'

export const ResizableImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: 'auto',
                parseHTML: element => element.getAttribute('width') || element.style.width,
                renderHTML: attributes => {
                    if (!attributes.width) {
                        return {}
                    }
                    return {
                        width: attributes.width,
                        style: `width: ${attributes.width};`
                    }
                },
            },
            height: {
                default: 'auto',
                parseHTML: element => element.getAttribute('height') || element.style.height,
                renderHTML: attributes => {
                    if (!attributes.height) {
                        return {}
                    }
                    return {
                        height: attributes.height,
                        style: `height: ${attributes.height};`
                    }
                },
            },
        }
    },
})
