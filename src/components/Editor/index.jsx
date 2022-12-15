import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic/build/ckeditor";
import MyCustomUploadAdapterPlugin from "../../utils/uploadImageCK";
import "./index.scss";

function EditorBlog({ onChangeEditor, data }) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={data}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChangeEditor({ data });
      }}
      config={{
        extraPlugins: [MyCustomUploadAdapterPlugin],
        placeholder: "Viết bài blog của bạn tại đây...",
        removePlugins: [
          "wsc,scayt",
          "Table",
          "Outdent",
          "Indent",
          "MediaEmbed",
        ],
      }}
    />
  );
}

export default EditorBlog;
