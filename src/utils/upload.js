/* export default {
  createFileChunks: (file, pieces = 10) => {
    const chunks = [];
    const chunkSize = Math.ceil(file.size / pieces);
    for (let i = 0, pos = 0; i < pieces; i++ , pos += chunkSize) {
      chunks.push({ chunk: file.slice(pos, pos + chunkSize), hash: `${file.name}_${i}` });
    }
    return chunks;
  },

  uploadChunks: async (file) => {
    const chunks = this.createFileChunks(file);
    console.log(chunks);
  }
} */

class Uploader {
  createFileChunks = (file, pieces = 10) => {
    const chunks = [];
    const chunkSize = Math.ceil(file.size / pieces);
    for (let i = 0, pos = 0; i < pieces; i += 1, pos += chunkSize) {
      chunks.push({ chunk: file.slice(pos, pos + chunkSize), hash: `${file.name}_${i}` });
    }
    return chunks;
  };

  uploadChunks(file) {
    const chunks = this.createFileChunks(file);
    console.log(chunks);
  }
}

export default Uploader;
