import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);

  const handleImageUpload = (blobInfo, progress) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', '/api/upload');

    const user = JSON.parse(localStorage.getItem('diadem_currentUser'));
    if (user && user.token) {
        xhr.setRequestHeader('Authorization', `Bearer ${user.token}`);
    }

    xhr.upload.onprogress = (e) => {
      progress(e.loaded / e.total * 100);
    };

    xhr.onload = () => {
      if (xhr.status === 403) {
        reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
        return;
      }

      if (xhr.status < 200 || xhr.status >= 300) {
        reject('HTTP Error: ' + xhr.status);
        return;
      }

      const json = JSON.parse(xhr.responseText);

      if (!json || typeof json.url !== 'string') {
        reject('Invalid JSON: ' + xhr.responseText);
        return;
      }

      resolve(json.url);
    };

    xhr.onerror = () => {
      reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
    };

    const formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());

    xhr.send(formData);
  });

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-300">
      <Editor
        apiKey="y25huj6e01nnlwoo9naw9zjuwislr07f17419pr6ups9u41l"
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={(newValue) => onChange(newValue)}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | image | help',
          content_style: `
            body { font-family:Helvetica,Arial,sans-serif; font-size:14px; }
            ul { list-style-type: disc; list-style-position: outside; padding-left: 2.5em; margin: 1em 0; }
            ol { list-style-type: decimal; list-style-position: outside; padding-left: 2.5em; margin: 1em 0; }
            li { margin-bottom: 0.5em; padding-left: 0; }
            ul ul { list-style-type: circle; }
            ul ul ul { list-style-type: square; }
            p { margin-bottom: 1em; }
            h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; font-weight: bold; line-height: 1.2; }
            h1 { font-size: 2em; }
            h2 { font-size: 1.5em; }
            h3 { font-size: 1.17em; }
            a { color: #3b82f6; text-decoration: underline; }
            blockquote { border-left: 4px solid #e5e7eb; margin-left: 0; padding-left: 1em; font-style: italic; color: #6b7280; }
            img { max-width: 100%; height: auto; display: block; margin: 1em 0; }
            table { border-collapse: collapse; width: 100%; margin: 1em 0; }
            td, th { border: 1px solid #ddd; padding: 8px; }
          `,
          images_upload_handler: handleImageUpload,
          placeholder: placeholder
        }}
      />
    </div>
  );
};

export default RichTextEditor;
