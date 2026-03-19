import React, { useState, useEffect, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { Save, X, Image as ImageIcon, Bold, Italic, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link as LinkIcon, Undo, Redo } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

const MenuBar = ({ editor, uploadFile }) => {
    if (!editor) {
        return null;
    }

    const addImage = async () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const res = await uploadFile(file);
                    editor.chain().focus().setImage({ src: res.url }).run();
                } catch (err) {
                    console.error("Image upload failed", err);
                    alert("Failed to upload image.");
                }
            }
        };
        fileInput.click();
    };

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const activeClass = "bg-blue-100 text-blue-600";
    const baseClass = "p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors";

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-100 rounded-t-2xl">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={`${baseClass} ${editor.isActive('bold') ? activeClass : ''}`} title="Bold">
                <Bold size={18} />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={`${baseClass} ${editor.isActive('italic') ? activeClass : ''}`} title="Italic">
                <Italic size={18} />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={`${baseClass} ${editor.isActive('strike') ? activeClass : ''}`} title="Strikethrough">
                <Strikethrough size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`${baseClass} ${editor.isActive({ textAlign: 'left' }) ? activeClass : ''}`} title="Align Left">
                <AlignLeft size={18} />
            </button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`${baseClass} ${editor.isActive({ textAlign: 'center' }) ? activeClass : ''}`} title="Align Center">
                <AlignCenter size={18} />
            </button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`${baseClass} ${editor.isActive({ textAlign: 'right' }) ? activeClass : ''}`} title="Align Right">
                <AlignRight size={18} />
            </button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={`${baseClass} ${editor.isActive({ textAlign: 'justify' }) ? activeClass : ''}`} title="Justify">
                <AlignJustify size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${baseClass} ${editor.isActive('bulletList') ? activeClass : ''}`} title="Bullet List">
                <List size={18} />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${baseClass} ${editor.isActive('orderedList') ? activeClass : ''}`} title="Numbered List">
                <ListOrdered size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            <button type="button" onClick={setLink} className={`${baseClass} ${editor.isActive('link') ? activeClass : ''}`} title="Link">
                <LinkIcon size={18} />
            </button>
            <button type="button" onClick={addImage} className={baseClass} title="Image">
                <ImageIcon size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} className={baseClass} title="Undo">
                <Undo size={18} />
            </button>
            <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} className={baseClass} title="Redo">
                <Redo size={18} />
            </button>
        </div>
    );
};

const BlogEditor = ({ article, onClose }) => {
  const { addArticle, updateArticle, uploadFile } = useData();

  // Form State
  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [category, setCategory] = useState(article?.category || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(article?.cover_image || null);

  // Content State
  let initialHtml = '';
  if (article?.content) {
    try {
      const parsed = JSON.parse(article.content);
      if (typeof parsed === 'string') {
        initialHtml = parsed;
      }
    } catch (e) {
      initialHtml = article.content;
    }
  }

  // Initialize Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[400px] p-4 max-w-none',
      },
      transformPastedHTML(html) {
          // MS Word HTML cleanup logic hook
          // This ensures that when the user pastes from Word, we strip problematic layouts and convert fake lists to real ul/li before Tiptap parses it
          if (!html) return html;
          if (html.includes('urn:schemas-microsoft-com:office:office') || html.includes('mso-') || html.includes('MsoListParagraph')) {
              let cleanHtml = html;

              // 1. Remove the fake bullet symbol spans
              cleanHtml = cleanHtml.replace(/<span[^>]*style="[^"]*mso-list:Ignore[^"]*"[^>]*>.*?<\/span>/gis, '');

              // 2. Convert Word list paragraphs to semantic list items
              cleanHtml = cleanHtml.replace(/<p[^>]*class="[^"]*MsoListParagraph[^"]*"[^>]*>(.*?)<\/p>/gis, '<li>$1</li>');
              cleanHtml = cleanHtml.replace(/<p[^>]*style="[^"]*mso-list:[^"]*"[^>]*>(.*?)<\/p>/gis, '<li>$1</li>');

              // 3. Wrap adjacent <li> tags with <ul> so it parses correctly
              cleanHtml = cleanHtml.replace(/(<li>.*?<\/li>\s*)+/gis, match => `<ul>${match}</ul>`);

              // 4. Strip out Word's problematic inline layout styles
              cleanHtml = cleanHtml.replace(/line-height:[^;"]+;?/gi, '');
              cleanHtml = cleanHtml.replace(/margin(?:-top|-bottom|-left|-right)?:[^;"]+;?/gi, '');
              cleanHtml = cleanHtml.replace(/mso-[a-z0-9-]+:[^;"]+;?/gi, '');

              // Clean up empty style attributes left behind
              cleanHtml = cleanHtml.replace(/style=""/gi, '');

              return cleanHtml;
          }
          return html;
      },
    },
  });

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editor) {
        alert("Editor has not loaded yet.");
        return;
    }

    const content = editor.getHTML();

    // Upload Cover Image if changed
    let coverImageUrl = coverImagePreview;
    if (coverImage) {
        try {
            const uploadRes = await uploadFile(coverImage);
            coverImageUrl = uploadRes.url;
        } catch (e) {
             console.error("Cover image upload failed", e);
             alert("Cover image upload failed. Saving without new image.");
        }
    }

    const articleData = {
        title,
        slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        category,
        excerpt,
        cover_image: coverImageUrl,
        content: content,
        published_at: article ? article.published_at : new Date().toISOString()
    };

    let success;
    if (article) {
        success = await updateArticle(article.id, articleData);
    } else {
        success = await addArticle(articleData);
    }

    if (success) {
        onClose();
    } else {
        alert("Failed to save article.");
    }
  };

  return (
      <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{article ? 'Edit Article' : 'New Article'}</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
              {/* Metadata Section */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                          <input
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Slug (URL)</label>
                          <input
                              type="text"
                              value={slug}
                              onChange={(e) => setSlug(e.target.value)}
                              placeholder="auto-generated-if-empty"
                              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                          <select
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                              required
                          >
                              <option value="">Select Category...</option>
                              <option value="Technology">Technology</option>
                              <option value="Trade">Trade</option>
                              <option value="Economy">Economy</option>
                              <option value="Logistics">Logistics</option>
                              <option value="News">News</option>
                          </select>
                      </div>
                  </div>

                  <div className="space-y-4">
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Excerpt (Summary)</label>
                          <textarea
                              value={excerpt}
                              onChange={(e) => setExcerpt(e.target.value)}
                              rows={3}
                              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Cover Image</label>
                          <div className="flex items-center gap-4">
                              {coverImagePreview && (
                                  <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden">
                                      <img src={coverImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                  </div>
                              )}
                              <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                  <ImageIcon size={16} /> Choose File
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                      const file = e.target.files[0];
                                      if(file) {
                                          setCoverImage(file);
                                          setCoverImagePreview(URL.createObjectURL(file));
                                      }
                                  }} />
                              </label>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Editor Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col tiptap-wrapper">
                  <MenuBar editor={editor} uploadFile={uploadFile} />
                  <div className="flex-grow">
                      <EditorContent editor={editor} />
                  </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4">
                  <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                      Cancel
                  </button>
                  <button
                      type="submit"
                      className="px-8 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
                  >
                      <Save size={20} /> Save Article
                  </button>
              </div>
          </form>
      </div>
  );
};

export default BlogEditor;
