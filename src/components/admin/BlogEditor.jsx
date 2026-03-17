import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Save, X, Image as ImageIcon } from 'lucide-react';
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import {
  FormattingToolbar,
  FormattingToolbarController,
  BlockTypeSelect,
  BasicTextStyleButton,
  ColorStyleButton,
  NestBlockButton,
  UnnestBlockButton,
  CreateLinkButton,
  TextAlignButton,
} from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

const BlogEditor = ({ article, onClose }) => {
  const { addArticle, updateArticle, uploadFile } = useData();

  // Form State
  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [category, setCategory] = useState(article?.category || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(article?.cover_image || null);

  // Initialize BlockNote editor
  // We use the article.content as initial content if it exists
  const initialContent = article?.content ? JSON.parse(article.content) : undefined;

  const editor = useCreateBlockNote({
    initialContent: initialContent,
    uploadFile: async (file) => {
       try {
           const result = await uploadFile(file);
           return result.url;
       } catch(e) {
           console.error("Image upload failed", e);
           return "https://via.placeholder.com/150"; // Fallback
       }
    },
    pasteHandler: (context) => {
      const { event, editor, defaultPasteHandler } = context;

      const html = event.clipboardData?.getData("text/html");

      // Handle word paste issue where bullets aren't appearing correctly and line spacing is huge
      // Check if it's from MS Word
      if (html && (html.includes('urn:schemas-microsoft-com:office:office') || html.includes('mso-') || html.includes('MsoListParagraph'))) {
        let cleanHtml = html;

        // 1. Remove the fake bullet symbol spans
        cleanHtml = cleanHtml.replace(/<span[^>]*style="[^"]*mso-list:Ignore[^"]*"[^>]*>.*?<\/span>/gi, '');

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

        // Use the editor to paste our cleaned HTML safely
        try {
           editor._tiptapEditor.commands.insertContent(cleanHtml);
           // We handled the paste event, return true to prevent default
           return true;
        } catch(err) {
           console.error("Failed to insert cleaned HTML", err);
           // Fall back to default
        }
      }

      // Call default paste handler for everything else
      return defaultPasteHandler();
    }
  });

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get content from BlockNote
    const content = JSON.stringify(editor.document);

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
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px] flex flex-col">
                  <div className="p-4 border-b border-gray-100 bg-gray-50">
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Content Editor</span>
                  </div>
                  <div className="p-4 flex-grow">
                     <BlockNoteView editor={editor} theme={"light"} formattingToolbar={false}>
                        <FormattingToolbarController
                            formattingToolbar={() => (
                                <FormattingToolbar>
                                    <BlockTypeSelect key={"blockTypeSelect"} />
                                    <BasicTextStyleButton basicTextStyle={"bold"} key={"boldStyleButton"} />
                                    <BasicTextStyleButton basicTextStyle={"italic"} key={"italicStyleButton"} />
                                    <BasicTextStyleButton basicTextStyle={"underline"} key={"underlineStyleButton"} />
                                    <BasicTextStyleButton basicTextStyle={"strike"} key={"strikeStyleButton"} />
                                    <TextAlignButton textAlignment={"left"} key={"textAlignLeftButton"} />
                                    <TextAlignButton textAlignment={"center"} key={"textAlignCenterButton"} />
                                    <TextAlignButton textAlignment={"right"} key={"textAlignRightButton"} />
                                    <TextAlignButton textAlignment={"justify"} key={"textAlignJustifyButton"} />
                                    <ColorStyleButton key={"colorStyleButton"} />
                                    <NestBlockButton key={"nestBlockButton"} />
                                    <UnnestBlockButton key={"unnestBlockButton"} />
                                    <CreateLinkButton key={"createLinkButton"} />
                                </FormattingToolbar>
                            )}
                        />
                     </BlockNoteView>
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
