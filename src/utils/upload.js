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

  calculateHash = fileChunkList => {
    return new Promise(resolve => {
      let worker = new Worker("/hash.js");
      worker.postMessage({ fileChunkList });
      worker.onmessage = e => {
        const { percentage, hash } = e.data;
        console.log(`Hash progress: ${percentage}`);
        if (hash) {
          resolve(hash);
          worker = null;
        }
      };
    });
  }

  async uploadChunks({ file, pieces = 10, onProgress }) {
    const fname = file.name;
    const chunks = this.createFileChunks(file, pieces);
    const fileHash = await this.calculateHash(chunks);
    const requestList = chunks
      .map(({ chunk, hash }) => {
        const formData = new FormData();
        formData.append('hash', hash);
        formData.append('fileHash', fileHash);
        formData.append('fileName', fname);
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
          .post('http://localhost:7001/api/merge', { filename: `${fileHash}.${fname.split('.')[1]}` })
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
