import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const images_upload_handler = (blobInfo, progress) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', '/api/upload');

    // Add Authorization header
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
        value={value}
        onEditorChange={(content) => onChange(content)}
        init={{
          height: 400,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks fontfamily fontsize | ' +
            'bold italic underline strikethrough | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'link image media table | charmap emoticons | removeformat | help',
          content_style: `
            body { font-family:Helvetica,Arial,sans-serif; font-size:14px }
            ul { list-style-type: disc; padding-left: 20px; }
            ol { list-style-type: decimal; padding-left: 20px; }
            ul ul, ol ul { list-style-type: circle; padding-left: 20px; }
            ol ol, ul ol { list-style-type: lower-alpha; padding-left: 20px; }
            li { margin: 5px 0; }
          `,
          font_family_formats: 'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Lato=lato, sans-serif; Montserrat=montserrat, sans-serif; Roboto=roboto, sans-serif; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
          placeholder: placeholder,
          images_upload_handler: images_upload_handler,
          automatic_uploads: true,
          file_picker_types: 'image',
        }}
      />
    </div>
  );
};

export default RichTextEditor;
