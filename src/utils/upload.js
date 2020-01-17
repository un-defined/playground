import axios from 'axios';

class Uploader {
  createFileChunks = (file, pieces) => {
    const chunks = [];
    const chunkSize = Math.ceil(file.size / pieces);
    for (let i = 0, pos = 0; i < pieces; i++, pos += chunkSize) {
      chunks.push({ chunk: file.slice(pos, pos + chunkSize), hash: `${file.name}_${i}` });
    }
    return chunks;
  };

  async uploadChunks({ file, pieces = 10, onProgress }) {
    const fname = file.name;
    const chunks = this.createFileChunks(file, pieces);
    // console.log(chunks);
    const requestList = chunks
      .map(({ chunk, hash }) => {
        const formData = new FormData();
        formData.append('hash', hash);
        formData.append('filename', fname);
        formData.append('chunk', chunk);
        return formData;
      })
      .map(async (data, idx) =>
        axios({
          method: 'post',
          url: 'http://localhost:7001/api/upload',
          data,
          onUploadProgress: progressEvent => {
            const { loaded, total } = progressEvent;
            if (onProgress) {
              onProgress(idx, loaded, total);
            }
          },
        }),
      );

    await Promise.all(requestList)
      .then(values => {
        console.log(values);
        axios
          .post('http://localhost:7001/api/merge', { filename: fname })
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.error(err);
          });
      })
      .catch(err => {
        console.warn(err);
      });
  }
}

export default Uploader;
