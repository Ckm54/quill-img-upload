import ReactQuill, { Quill } from "react-quill";
import ImageUploader from "quill-image-uploader";
import React from "react";
import "react-quill/dist/quill.snow.css";
import "quill-image-uploader/dist/quill.imageUploader.min.css";

Quill.register("modules/imageUploader", ImageUploader);

// Get these from cloudinary account
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const modules = {
  // Editor toolbar options
  toolbar: [["bold", "italic", "image"]],
  // Add upload function
  imageUploader: {
    upload: (file) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", `${CLOUDINARY_UPLOAD_PRESET}`);

        fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: "POST",
            body: formData,
          }
        )
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            resolve(result.url);
          })
          .catch((error) => {
            reject("Upload failed");
            console.error("Error:", error);
          });
      });
    },
  },
};

function App() {
  const [text, setText] = React.useState("");

  return (
    <>
      <ReactQuill
        theme="snow"
        placeholder="Enter product description"
        modules={modules}
        value={text}
        onChange={setText}
      />

      <button onClick={() => console.log(text)}>Submit</button>

      <div style={{ marginTop: "20px" }}>{text && JSON.stringify(text)}</div>
    </>
  );
}

export default App;
