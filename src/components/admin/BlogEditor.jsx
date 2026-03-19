import React, { useState, useEffect, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { Save, X, Image as ImageIcon, Bold, Italic, Strikethrough, List as ListIcon, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link as LinkIcon, Undo, Redo, Heading1, Heading2, Quote } from 'lucide-react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { ImageNode, $createImageNode, $isImageNode } from './ImageNode';
import { COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical';
import { $wrapNodeInElement } from '@lexical/utils';
import { $isRootNode } from 'lexical';
import { PASTE_COMMAND } from 'lexical';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $createParagraphNode,
  $getRoot,
  $insertNodes,
  RootNode
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';

export const INSERT_IMAGE_COMMAND = createCommand('INSERT_IMAGE_COMMAND');

// Theme configuration
const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  image: 'editor-image',
  link: 'editor-link text-blue-600 underline',
  text: {
    bold: 'editor-text-bold font-bold',
    italic: 'editor-text-italic italic',
    overflowed: 'editor-text-overflowed',
    hashtag: 'editor-text-hashtag',
    underline: 'editor-text-underline underline',
    strikethrough: 'editor-text-strikethrough line-through',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
    code: 'editor-text-code bg-gray-100 px-1 py-0.5 rounded font-mono text-sm',
  },
};


// Plugin to handle image insertion
function ImagesPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }

    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const imageNode = $createImageNode(payload);
        $insertNodes([imageNode]);
        if ($isRootNode(imageNode.getParentOrThrow())) {
          $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}


// Plugin to fix MS Word paste formatting
function WordPasteFixPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      PASTE_COMMAND,
      (event) => {
        const html = event.clipboardData?.getData("text/html");

        if (html && (html.includes('urn:schemas-microsoft-com:office:office') || html.includes('mso-') || html.includes('MsoListParagraph'))) {
            let cleanHtml = html;

            // 1. Remove the fake bullet symbol spans
            cleanHtml = cleanHtml.replace(/<span[^>]*style="[^"]*mso-list:Ignore[^"]*"[^>]*>.*?<\/span>/gis, '');

            // 2. Identify list paragraphs and convert them to li, keeping track of level attributes
            // MSO lists usually have style="mso-list: l0 level1 lfo1" where levelX is the indenting level.
            // A perfect conversion requires DOM manipulation, but regex can get us 95% there by extracting the level
            cleanHtml = cleanHtml.replace(/<p[^>]*style="[^"]*mso-list:[^"]*level(\d+)[^"]*"[^>]*>(.*?)<\/p>/gis, '<li data-mso-level="$1">$2</li>');
            cleanHtml = cleanHtml.replace(/<p[^>]*class="[^"]*MsoListParagraph[^"]*"[^>]*>(.*?)<\/p>/gis, '<li data-mso-level="1">$1</li>');

            // 3. Wrap adjacent <li> tags with <ul> so Lexical lists plugin parses it correctly.
            // To ensure perfect indenting, we can add CSS padding based on the level or wrap them in nested ULs.
            // Lexical's HTML parser is smart enough to handle padding-left on <li> tags if configured, but let's just output raw HTML structure
            // and let Lexical's $generateNodesFromDOM handle standard HTML correctly after stripping the garbage.
            cleanHtml = cleanHtml.replace(/(<li[^>]*>.*?<\/li>\s*)+/gis, match => `<ul>${match}</ul>`);

            // 4. Clean out problematic Word styles to fix the "huge line spacing"
            cleanHtml = cleanHtml.replace(/line-height:[^;"]+;?/gi, '');
            cleanHtml = cleanHtml.replace(/margin(?:-top|-bottom|-left|-right)?:[^;"]+;?/gi, '');
            cleanHtml = cleanHtml.replace(/mso-[a-z0-9-]+:[^;"]+;?/gi, '');
            cleanHtml = cleanHtml.replace(/style=""/gi, '');

            editor.update(() => {
                const parser = new DOMParser();
                const dom = parser.parseFromString(cleanHtml, 'text/html');

                // For "perfect indenting", we can manipulate the DOM before Lexical parses it.
                // Convert <li data-mso-level="X"> into nested structures
                const lists = dom.querySelectorAll('ul');
                lists.forEach(ul => {
                    const listItems = Array.from(ul.querySelectorAll('li'));
                    let currentLevel = 1;
                    let currentParent = ul;
                    let lastLi = null;

                    listItems.forEach(li => {
                        const levelStr = li.getAttribute('data-mso-level');
                        const level = levelStr ? parseInt(levelStr, 10) : 1;
                        li.removeAttribute('data-mso-level');

                        // Handle indenting nesting by padding the UL or LI. Lexical's list plugin respects nested ul > li > ul > li
                        // but a simpler way is to just set marginLeft or let Lexical automatically format it.
                        // Actually, if we just set the style padding, Lexical imports it as indenting block or list indent.
                        if (level > 1) {
                           li.style.marginLeft = `${(level - 1) * 20}px`;
                        }
                    });
                });

                const nodes = $generateNodesFromDOM(editor, dom);
                const selection = $getSelection();
                if (selection) {
                    selection.insertNodes(nodes);
                } else {
                    $getRoot().append(...nodes);
                }
            });

            return true;
        }
        return false;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}

// Initial HTML Plugin - converts initial HTML string into Lexical nodes
function InitialHtmlPlugin({ initialHtml }) {
  const [editor] = useLexicalComposerContext();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (initialHtml === undefined || isInitialized) return;

    editor.update(() => {
      if (initialHtml) {
          const parser = new DOMParser();
          const dom = parser.parseFromString(initialHtml, 'text/html');

          const nodes = $generateNodesFromDOM(editor, dom);
          const root = $getRoot();
          root.clear();
          root.select();
          $insertNodes(nodes);
      }
    });

    setIsInitialized(true);
  }, [editor, initialHtml, isInitialized]);

  return null;
}

// OnChange HTML Plugin - converts Lexical nodes back to HTML string
function OnChangeHtmlPlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const htmlString = $generateHtmlFromNodes(editor, null);
        onChange(htmlString);
      });
    });
  }, [editor, onChange]);

  return null;
}

const Toolbar = ({ uploadFile }) => {
  const [editor] = useLexicalComposerContext();

  const insertLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url === null) return;
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  }, [editor]);

  const baseClass = "p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors";

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 rounded-t-2xl">
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} className={baseClass} title="Bold">
        <Bold size={18} />
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} className={baseClass} title="Italic">
        <Italic size={18} />
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')} className={baseClass} title="Strikethrough">
        <Strikethrough size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')} className={baseClass} title="Align Left">
        <AlignLeft size={18} />
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')} className={baseClass} title="Align Center">
        <AlignCenter size={18} />
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')} className={baseClass} title="Align Right">
        <AlignRight size={18} />
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')} className={baseClass} title="Justify">
        <AlignJustify size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <button type="button" onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} className={baseClass} title="Bullet List">
        <ListIcon size={18} />
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} className={baseClass} title="Numbered List">
        <ListOrdered size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <button type="button" onClick={insertLink} className={baseClass} title="Link">
        <LinkIcon size={18} />
      </button>
      <button type="button" onClick={async () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const res = await uploadFile(file);
                    editor.dispatchCommand(INSERT_IMAGE_COMMAND, { altText: 'Image', src: res.url });
                } catch (err) {
                    console.error("Image upload failed", err);
                    alert("Failed to upload image.");
                }
            }
        };
        fileInput.click();
      }} className={baseClass} title="Image">
        <ImageIcon size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <button type="button" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} className={baseClass} title="Undo">
        <Undo size={18} />
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} className={baseClass} title="Redo">
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
  const [contentHtml, setContentHtml] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let html = '';
    const initContent = async () => {
      if (article?.content) {
        try {
          const parsed = JSON.parse(article.content);
          if (typeof parsed === 'string') {
            html = parsed;
          } else if (Array.isArray(parsed) && parsed.length > 0) {
            html = '<p>Error loading legacy content. This article was saved using an unsupported editor format. Please copy the original text from your source document and paste it here.</p>';
          }
        } catch (e) {
          // Already raw HTML string
          html = article.content;
        }
      }
      setContentHtml(html);
      setIsInitializing(false);
    };
    initContent();
  }, [article]);

  const initialConfig = {
    namespace: 'BlogEditor',
    theme,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
      ImageNode,
    ],
    onError(error) {
      console.error(error);
    },
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

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
        content: contentHtml, // Save the generated HTML string directly
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
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col lexical-wrapper relative min-h-[400px]">
                  {isInitializing ? (
                      <div className="flex items-center justify-center flex-grow text-gray-500">Loading editor...</div>
                  ) : (
                      <LexicalComposer initialConfig={initialConfig}>
                        <Toolbar uploadFile={uploadFile} />
                        <div className="relative flex-grow">
                          <RichTextPlugin
                            contentEditable={<ContentEditable className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[400px] p-4 max-w-none" />}
                            placeholder={<div className="absolute top-4 left-4 text-gray-400 pointer-events-none">Enter some rich text...</div>}
                            ErrorBoundary={LexicalErrorBoundary}
                          />
                          <HistoryPlugin />
                          <AutoFocusPlugin />
                          <ListPlugin />
                          <LinkPlugin />
                          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                          <InitialHtmlPlugin initialHtml={contentHtml} />
                          <OnChangeHtmlPlugin onChange={setContentHtml} />
                          <WordPasteFixPlugin />
                          <ImagesPlugin />
                        </div>
                      </LexicalComposer>
                  )}
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
