import React, { useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
    const editor = useRef(null);

    const config = useMemo(() => {
        const user = JSON.parse(localStorage.getItem('diadem_currentUser'));
        const token = user?.token;

        return {
            readonly: false, // all options from https://xdsoft.net/jodit/doc/
            placeholder: placeholder || 'Start typing...',
            height: 400,
            toolbarButtonSize: 'middle',
            buttons: [
                'source', '|',
                'bold', 'italic', 'underline', 'strikethrough', '|',
                'ul', 'ol', '|',
                'outdent', 'indent', '|',
                'font', 'fontsize', 'brush', 'paragraph', '|',
                'image', 'table', 'link', '|',
                'align', 'undo', 'redo', '|',
                'hr', 'eraser', 'fullsize'
            ],
            uploader: {
                insertImageAsBase64URI: false,
                url: '/api/upload',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                format: 'json',
                prepareData: (data) => data,
                process: (resp) => {
                    // Backend returns { url: "..." }
                    // Map to Jodit expected format: { files: ["url"] }
                    return {
                        files: [resp.url],
                        path: resp.url,
                        baseurl: '',
                        error: resp.error,
                        msg: resp.message
                    };
                },
                defaultHandlerSuccess: function (data) {
                     // Custom handler to insert image
                     if (data.files && data.files.length) {
                         this.selection.insertImage(data.files[0]);
                     }
                },
                error: (e) => {
                    console.error("Upload Error:", e);
                }
            }
        };
    }, [placeholder]);

    return (
        <div className="bg-white rounded-lg overflow-hidden border border-gray-300 jodit-container">
            <JoditEditor
                ref={editor}
                value={value}
                config={config}
                tabIndex={1} // tabIndex of textarea
                onBlur={newContent => onChange(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={() => {}}
            />
        </div>
    );
};

export default RichTextEditor;
