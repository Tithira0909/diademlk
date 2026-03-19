import { DecoratorNode } from 'lexical';
import React from 'react';

export class ImageNode extends DecoratorNode {
  __src;
  __altText;
  __width;
  __height;

  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__key,
    );
  }

  static importJSON(serializedNode) {
    const { altText, height, src, width } = serializedNode;
    const node = $createImageNode({
      altText,
      height,
      src,
      width,
    });
    return node;
  }

  exportDOM() {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__altText);
    if (this.__width) element.setAttribute('width', this.__width.toString());
    if (this.__height) element.setAttribute('height', this.__height.toString());
    return { element };
  }

  static importDOM() {
    return {
      img: (node) => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(src, altText, width, height, key) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
  }

  exportJSON() {
    return {
      altText: this.__altText,
      height: this.__height,
      src: this.__src,
      type: 'image',
      version: 1,
      width: this.__width,
    };
  }

  createDOM(config) {
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM() {
    return false;
  }

  getSrc() {
    return this.__src;
  }

  getAltText() {
    return this.__altText;
  }

  decorate() {
    return (
      <img
        src={this.__src}
        alt={this.__altText}
        style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '0.5rem',
            margin: '1rem 0'
        }}
      />
    );
  }
}

export function $createImageNode({ altText, height, src, width }) {
  return new ImageNode(src, altText, width, height);
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}

function convertImageElement(domNode) {
  if (domNode instanceof HTMLImageElement) {
    const { alt, src, width, height } = domNode;
    const node = $createImageNode({
      altText: alt,
      height: height || undefined,
      src,
      width: width || undefined,
    });
    return { node };
  }
  return null;
}
