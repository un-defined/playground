import axios from 'axios';

class Uploader {
  createFileChunks = (file, pieces = 10) => {
    const chunks = [];
    const chunkSize = Math.ceil(file.size / pieces);
    for (let i = 0, pos = 0; i < pieces; i++, pos += chunkSize) {
      chunks.push({ chunk: file.slice(pos, pos + chunkSize), hash: `${file.name}_${i}` });
    }
    return chunks;
  };

  async uploadChunks(file) {
    const fname = file.name;
    const chunks = this.createFileChunks(file);
    console.log(chunks);
    const requestList = chunks
      .map(({ chunk, hash }) => {
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('hash', hash);
        formData.append('filename', fname);
        return formData;
      })
      .map(async data =>
        axios({
          method: 'post',
          url: '/server/api/upload',
          data,
        }),
      );

    await Promise.all(requestList)
      .then(values => {
        console.log(values);
      })
      .catch(err => {
        console.warn(err);
      });

    await axios.post('/server/api/merge', { filename: fname });
  }
}

export default Uploader;
