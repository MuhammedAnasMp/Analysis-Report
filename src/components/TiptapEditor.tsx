import './styles.scss'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import type { Editor } from '@tiptap/react'
import ToolbarButton from './ToolbarButton'
import { ArrowUturnLeftIcon, ArrowUturnRightIcon } from '@heroicons/react/24/solid'


const extensions = [
  StarterKit,
  TextStyle,
]

function MenuBar({ editor }: { editor: Editor }) {

  const editorState = useEditorState({
    editor,
    selector: ctx => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
        isBlockquote: ctx.editor.isActive('blockquote') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      }
    },
  })

  return (

    <div className="flex flex-wrap gap-2 mb-4">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editorState.isBold}
        disabled={!editorState.canBold}
      >
        Bold
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editorState.isItalic}
        disabled={!editorState.canItalic}
      >
        Italic
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editorState.isStrike}
        disabled={!editorState.canStrike}
      >
        Strike
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editorState.isCode}
        disabled={!editorState.canCode}
      >
        Code
      </ToolbarButton>

      <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().run()}>Clear marks</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().clearNodes().run()}>Clear nodes</ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        isActive={editorState.isParagraph}
      >
        Paragraph
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editorState.isHeading1}
      >
        H1
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editorState.isHeading2}
      >
        H2
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editorState.isHeading3}
      >
        H3
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        isActive={editorState.isHeading4}
      >
        H4
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        isActive={editorState.isHeading5}
      >
        H5
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        isActive={editorState.isHeading6}
      >
        H6
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editorState.isBulletList}
      >
        Bullet list
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editorState.isOrderedList}
      >
        Ordered list
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editorState.isCodeBlock}
      >
        Important
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editorState.isBlockquote}
      >
        Blockquote
      </ToolbarButton>

      <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>Horizontal Line</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setHardBreak().run()}>New Row</ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editorState.canUndo}
      >
        <ArrowUturnLeftIcon height={15} width={15}   />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editorState.canRedo}
      >
        <ArrowUturnRightIcon height={15} widths={15} />
      </ToolbarButton>
    </div>

  )
}

interface TipTapEditorProps {
  name: string;
  error: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ name, onChange , error }) => {
  const editor = useEditor({
    extensions,
    content: '',
    onUpdate({ editor }) {
      const html = editor.getHTML()

      if (onChange) {
        const syntheticEvent = {
          target: {
            name,
            value: html,
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>

        onChange(syntheticEvent)
      }
    },
  })

  return (
    <div >
      <MenuBar editor={editor} />
      <EditorContent className={`${error &&  ' border-red-700 dark:border-red-700 rounded-md focus:outline-none '} border border-gray-200  dark:border-neutral-700 rounded-md `} editor={editor} />
    </div>
  )
}

export default TipTapEditor;