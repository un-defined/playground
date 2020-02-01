// https://juejin.im/post/5dff8a26e51d4558105420ed

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { Upload, Button, Icon, Progress } from 'antd';
import styles from './index.less';
import Uploader from '@/utils/upload';
import ProgressGradientLine from './ProgressGradientLine';

const up = new Uploader();

class UploadPage extends Component {
  static LENGTH = 10;

  state = {
    fileList: [],
    uploading: false,
    uplist: [],
    totalPercent: 0,
  };

  handleUpload = async () => {
    const file = this.state.fileList[0];
    await up.uploadChunks({
      file,
      pieces: this.LENGTH,
      onProgress: this.handleProgress.bind(this, file),
    });
  };

  handleProgress(file, idx, loaded, total) {
    this.setState(prevState => {
      const uplist = prevState.uplist.slice();
      const percent = parseInt(String((loaded / total) * 100), 10);
      typeof uplist[idx] === 'object'
        ? Object.assign(uplist[idx], { percent, loaded })
        : (uplist[idx] = {
            loaded,
            chunkName: `${file.name}-${idx}`,
            percent,
            size: total,
          });
      const totalPercent = (uplist.reduce((prev, cur) => prev + cur.loaded, 0) / file.size) * 100;

      return { uplist, totalPercent };
    });
  }

  render() {
    const { uploading, fileList } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };
    return (
      <PageHeaderWrapper content="这是一个新页面，从这里进行开发！" className={styles.main}>
        <div
          style={{
            paddingTop: 100,
            textAlign: 'center',
          }}
        >
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> Click to Upload
            </Button>
          </Upload>
          <Button
            type="primary"
            onClick={this.handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{
              marginTop: 16,
            }}
          >
            {uploading ? 'Uploading' : 'Start Upload'}
          </Button>
        </div>
        <Progress percent={this.state.totalPercent} />
        <ProgressGradientLine list={this.state.uplist} />
      </PageHeaderWrapper>
    );
  }
}

export default UploadPage;
