import React, { useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';

// Register fonts
const Font = Quill.import('formats/font');
Font.whitelist = ['', 'roboto', 'lato', 'montserrat'];
Quill.register(Font, true);

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'font': Font.whitelist }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']                                         // remove formatting button
    ]
  }), []);

  const formats = [
    'font',
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image'
  ];

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="h-64 mb-12"
      />
    </div>
  );
};

export default RichTextEditor;
