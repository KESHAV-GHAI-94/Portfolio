'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import { Bold, Italic, List, ListOrdered, Quote, Heading2, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type TiptapEditorProps = {
  content: string;
  onChange: (content: string) => void;
};

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [uploading, setUploading] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: 'rounded-xl border border-neutral-800 max-w-full h-auto my-8',
        },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[280px] p-4 bg-black border border-t-0 border-neutral-800 rounded-b-md text-neutral-200 text-sm leading-relaxed'
      }
    }
  });

  // Update editor content when external content changes (like during edit load)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return; // cancelled
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        editor.chain().focus().setImage({ src: data.url }).run();
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className="w-full border border-neutral-800 rounded-md overflow-hidden flex flex-col">
      <div className="flex flex-wrap items-center gap-0.5 bg-neutral-950 p-2 border-b border-neutral-800">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'}`} title="Bold"><Bold size={16}/></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'}`} title="Italic"><Italic size={16}/></button>
        <div className="w-px h-4 bg-neutral-800 mx-1"/>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-1.5 rounded transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'}`} title="Heading"><Heading2 size={16}/></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'}`} title="Bullet List"><List size={16}/></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'}`} title="Ordered List"><ListOrdered size={16}/></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-1.5 rounded transition-colors ${editor.isActive('blockquote') ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'}`} title="Quote"><Quote size={16}/></button>
        <div className="w-px h-4 bg-neutral-800 mx-1"/>
        <button type="button" onClick={setLink} className={`p-1.5 rounded transition-colors ${editor.isActive('link') ? 'bg-neutral-800 text-blue-400' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'}`} title="Link"><LinkIcon size={16}/></button>
        <label className={`p-1.5 rounded cursor-pointer transition-colors text-neutral-500 hover:text-white hover:bg-neutral-900 flex items-center justify-center`} title="Upload Image">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16}/>}
          <input type="file" className="hidden" accept="image/*" onChange={addImage} disabled={uploading} />
        </label>
      </div>
      <EditorContent editor={editor} className="flex-1"/>
    </div>
  );
}
