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
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={(newValue) => onChange(newValue)}
        init={{
          height: 600,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
            'directionality', 'paste'
          ],
          toolbar: 'undo redo | blocks fontfamily fontsize | ' +
            'bold italic underline strikethrough | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'lineheight | forecolor backcolor | removeformat | image media link table | code fullscreen preview',
          font_family_formats: 'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Lato=lato, sans-serif; Montserrat=montserrat, sans-serif; Roboto=roboto, sans-serif; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
          content_style: `
            @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Montserrat:wght@400;700&family=Roboto:wght@400;700&display=swap');
            body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height: 1.6; color: #333; }
            ul { list-style-type: disc; list-style-position: outside; padding-left: 2.5em; margin: 1em 0; }
            ol { list-style-type: decimal; list-style-position: outside; padding-left: 2.5em; margin: 1em 0; }
            li { margin-bottom: 0.5em; padding-left: 0; }
            ul ul { list-style-type: circle; }
            ul ul ul { list-style-type: square; }
            p { margin-bottom: 1em; white-space: pre-wrap; }
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
          placeholder: placeholder,
          paste_data_images: true,
          browser_spellcheck: true,
          contextmenu: false,
          paste_as_text: false, // Allow rich content paste from Word
          smart_paste: true // Enhanced pasting
        }}
      />
    </div>
  );
};

export default RichTextEditor;
