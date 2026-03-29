import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { Save, X, Image as ImageIcon } from 'lucide-react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import TextAlignmentTune from 'editorjs-text-alignment-blocktune';
import Paragraph from '@editorjs/paragraph';

const BlogEditor = ({ article, onClose }) => {
  const { addArticle, updateArticle, uploadFile } = useData();

  // Form State
  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [category, setCategory] = useState(article?.category || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(article?.cover_image || null);

  // Editor State
  const editorRef = useRef(null);

  useEffect(() => {
    let initialData = { time: new Date().getTime(), blocks: [] };

    if (article?.content) {
      try {
         const parsed = JSON.parse(article.content);
         if (parsed && typeof parsed === 'object' && parsed.blocks) {
             initialData = parsed;
         } else if (typeof parsed === 'string') {
             // Handle legacy HTML by throwing it into a single raw HTML block or paragraph
             initialData.blocks.push({
                 type: 'paragraph',
                 data: { text: parsed }
             });
         }
      } catch (e) {
          // Assume raw HTML string
          initialData.blocks.push({
             type: 'paragraph',
             data: { text: article.content }
          });
      }
    }

    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: 'editorjs-container',
        data: initialData,
        autofocus: true,
        tools: {
          textAlignment: {
            class: TextAlignmentTune,
          },
          paragraph: {
             class: Paragraph,
             inlineToolbar: true,
             tunes: ['textAlignment'],
          },
          header: {
            class: Header,
            inlineToolbar: true,
            tunes: ['textAlignment'],
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile: async (file) => {
                  try {
                    const res = await uploadFile(file);
                    return {
                      success: 1,
                      file: {
                        url: res.url
                      }
                    };
                  } catch (e) {
                    console.error("Upload Error", e);
                    return { success: 0 };
                  }
                }
              }
            }
          }
        },
        tunes: ['textAlignment'],
        onReady: () => {
           // To perfectly handle MS Word paste which is requested by the user, Editor.js natively tries to handle lists and paragraphs.
           // However, Word's MSO properties often break lists on mobile by adding excessive styles or rendering lists as dots.
           // Since EditorJS converts raw pasted HTML into blocks, we can intercept the paste event globally on the container
           // and sanitize the clipboard data *before* EditorJS parses it into blocks.

           const container = document.getElementById('editorjs-container');
           if (container) {
               container.addEventListener('paste', (e) => {
                   const html = e.clipboardData?.getData("text/html");
                   if (html && (html.includes('urn:schemas-microsoft-com:office:office') || html.includes('mso-') || html.includes('MsoListParagraph'))) {
                       e.preventDefault();
                       e.stopPropagation();

                       let cleanHtml = html;

                       // 1. Remove the fake bullet symbol spans
                       cleanHtml = cleanHtml.replace(/<span[^>]*style="[^"]*mso-list:Ignore[^"]*"[^>]*>.*?<\/span>/gis, '');

                       // 2. Identify list paragraphs and convert them to <li>.
                       cleanHtml = cleanHtml.replace(/<p[^>]*class="[^"]*MsoListParagraph[^"]*"[^>]*>(.*?)<\/p>/gis, '<li>$1</li>');
                       cleanHtml = cleanHtml.replace(/<p[^>]*style="[^"]*mso-list:[^"]*"[^>]*>(.*?)<\/p>/gis, '<li>$1</li>');

                       // 3. Wrap adjacent <li> tags with <ul>
                       cleanHtml = cleanHtml.replace(/(<li>.*?<\/li>\s*)+/gis, match => `<ul>${match}</ul>`);

                       // 4. Clean out problematic Word styles to fix the "huge line spacing"
                       cleanHtml = cleanHtml.replace(/line-height:[^;"]+;?/gi, '');
                       cleanHtml = cleanHtml.replace(/margin(?:-top|-bottom|-left|-right)?:[^;"]+;?/gi, '');
                       cleanHtml = cleanHtml.replace(/mso-[a-z0-9-]+:[^;"]+;?/gi, '');
                       cleanHtml = cleanHtml.replace(/style=""/gi, '');

                       // Push the cleaned HTML back into the clipboard event manually
                       // Unfortunately, we can't easily modify the clipboard data and re-dispatch.
                       // Instead, we can use EditorJS's blocks API to insert the raw HTML directly, which EditorJS parses using its paste configuration.

                       // To prevent overwriting the whole document, we must convert the clean HTML into blocks
                       // and insert them sequentially after the current block.
                       const parser = new DOMParser();
                       const doc = parser.parseFromString(cleanHtml, 'text/html');
                       const newBlocks = [];

                       Array.from(doc.body.childNodes).forEach(node => {
                           if (node.nodeName === 'P') {
                               newBlocks.push({
                                   type: 'paragraph',
                                   data: { text: node.innerHTML }
                               });
                           } else if (node.nodeName === 'UL' || node.nodeName === 'OL') {
                               const items = Array.from(node.querySelectorAll('li')).map(li => li.innerHTML);
                               if (items.length > 0) {
                                   newBlocks.push({
                                       type: 'list',
                                       data: {
                                           style: node.nodeName === 'UL' ? 'unordered' : 'ordered',
                                           items: items
                                       }
                                   });
                               }
                           } else if (node.nodeName.match(/^H[1-6]$/)) {
                               newBlocks.push({
                                   type: 'header',
                                   data: {
                                       text: node.innerHTML,
                                       level: parseInt(node.nodeName.replace('H', ''), 10)
                                   }
                               });
                           } else if (node.nodeType === 3 && node.textContent.trim().length > 0) {
                               newBlocks.push({
                                   type: 'paragraph',
                                   data: { text: node.textContent.trim() }
                               });
                           }
                       });

                       const currentIndex = editor.blocks.getCurrentBlockIndex();
                       const insertIndex = currentIndex >= 0 ? currentIndex + 1 : editor.blocks.getBlocksCount();

                       if (newBlocks.length > 0) {
                           editor.blocks.insertMany(newBlocks, insertIndex);
                       }
                   }
               }, true);
           }
        }
      });
      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current) {
        const editor = editorRef.current;
        editorRef.current = null;
        editor.isReady
          .then(() => {
            editor.destroy();
          })
          .catch(e => console.error('EditorJS cleanup error', e));
      }
    };
  }, [article, uploadFile]);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editorRef.current) return;

    let contentData;
    try {
        contentData = await editorRef.current.save();
    } catch (e) {
        console.error('EditorJS save failed', e);
        return;
    }

    // Upload Cover Image if changed
    let coverImageUrl = coverImagePreview;
    if (coverImage) {
        try {
            const uploadRes = await uploadFile(coverImage);
            coverImageUrl = uploadRes.url;
        } catch (err) {
             console.error("Cover image upload failed", err);
             alert("Cover image upload failed. Saving without new image.");
        }
    }

    let finalSlug = slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    if (!article && !slug) {
        // If it's a new article and the user didn't explicitly provide a custom slug, append a random string to ensure uniqueness
        const randomStr = Math.random().toString(36).substring(2, 8);
        finalSlug = `${finalSlug}-${randomStr}`;
    }

    const articleData = {
        title,
        slug: finalSlug,
        category,
        excerpt,
        cover_image: coverImageUrl,
        content: JSON.stringify(contentData),
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
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col relative min-h-[400px]">
                  <div className="p-4 border-b border-gray-100 bg-gray-50">
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Content Editor</span>
                  </div>
                  <div id="editorjs-container" className="flex-grow p-4 prose prose-blue max-w-none focus:outline-none"></div>
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
