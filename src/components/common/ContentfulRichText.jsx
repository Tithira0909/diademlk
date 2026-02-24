import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';

const options = {
  renderMark: {
    [MARKS.BOLD]: text => <span className="font-bold">{text}</span>,
    [MARKS.ITALIC]: text => <span className="italic">{text}</span>,
    [MARKS.UNDERLINE]: text => <span className="underline">{text}</span>,
    [MARKS.CODE]: text => (
      <code className="bg-gray-100 p-1 rounded font-mono text-sm text-red-600">{text}</code>
    ),
  },
  renderNode: {
    [BLOCKS.HEADING_1]: (node, children) => <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>,
    [BLOCKS.HEADING_2]: (node, children) => <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>,
    [BLOCKS.HEADING_3]: (node, children) => <h3 className="text-2xl font-bold mt-6 mb-3">{children}</h3>,
    [BLOCKS.HEADING_4]: (node, children) => <h4 className="text-xl font-bold mt-6 mb-3">{children}</h4>,
    [BLOCKS.HEADING_5]: (node, children) => <h5 className="text-lg font-bold mt-4 mb-2">{children}</h5>,
    [BLOCKS.HEADING_6]: (node, children) => <h6 className="text-base font-bold mt-4 mb-2">{children}</h6>,

    [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-4 leading-relaxed">{children}</p>,

    [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
    [BLOCKS.OL_LIST]: (node, children) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>,
    [BLOCKS.LIST_ITEM]: (node, children) => <li className="pl-1">{children}</li>,

    [BLOCKS.QUOTE]: (node, children) => (
      <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 my-6 bg-gray-50 italic text-gray-700 rounded-r">
        {children}
      </blockquote>
    ),

    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const { title, file } = node.data.target.fields;
      if (!file) return null;
      return (
        <figure className="my-8">
            <img
            src={`https:${file.url}?w=800&q=80`} // Optimize with Contentful Image API
            alt={title || 'Content Image'}
            className="rounded-lg shadow-sm mx-auto w-full h-auto object-cover max-w-3xl"
            loading="lazy"
            />
            {title && (
            <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
                {title}
            </figcaption>
            )}
        </figure>
      );
    },

    [INLINES.HYPERLINK]: (node, children) => (
      <a
        href={node.data.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 hover:text-indigo-800 underline transition-colors"
      >
        {children}
      </a>
    ),
  },
};

const ContentfulRichText = ({ content }) => {
  if (!content) return null;
  return (
    <div className="contentful-content">
      {documentToReactComponents(content, options)}
    </div>
  );
};

export default ContentfulRichText;
