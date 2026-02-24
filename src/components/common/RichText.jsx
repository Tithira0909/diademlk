import React from 'react';
import { PortableText } from '@portabletext/react';
import { urlFor } from '../../services/sanityService';

// Define custom components for Portable Text rendering
const components = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <figure className="my-8">
          <img
            src={urlFor(value).width(800).fit('max').auto('format').url()}
            alt={value.alt || 'Article Image'}
            className="rounded-lg shadow-sm mx-auto"
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    code: ({ value }) => (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 font-mono text-sm">
        <code>{value.code}</code>
      </pre>
    ),
    table: ({ value }) => {
        // Portable Text usually handles tables via plugins or custom types.
        // Assuming a standard table structure if passed: { rows: [ { cells: [] } ] }
        if (!value.rows) return null;
        return (
            <div className="overflow-x-auto my-6">
                <table className="min-w-full border border-gray-200">
                    <tbody>
                        {value.rows.map((row, i) => (
                            <tr key={i} className={i === 0 ? "bg-gray-50 font-bold" : "border-t border-gray-100"}>
                                {row.cells.map((cell, j) => (
                                    <td key={j} className="px-4 py-2 border border-gray-200">{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
  },
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold mt-6 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-bold mt-6 mb-3">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 my-6 bg-gray-50 italic text-gray-700 rounded-r">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-indigo-600 hover:text-indigo-800 underline transition-colors"
        >
          {children}
        </a>
      );
    },
  },
};

const RichText = ({ content }) => {
  return (
    <div className="portable-content">
      <PortableText value={content} components={components} />
    </div>
  );
};

export default RichText;
