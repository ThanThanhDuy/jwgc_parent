import blogService from "../services/blog";

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  async upload() {
    const file = await this.loader.file;
    const res = await blogService.uploadImage(file);
    if (res && res.StatusCode === 200) {
      return {
        default: res.Data.Path,
      };
    }
  }
}

export default function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}
// new Promise((resolve, reject) => {
//   const toBase64 = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });

//   return toBase64(file).then((cFile) => {
//     resolve({
//       default: cFile,
//     });
//   });
// })
