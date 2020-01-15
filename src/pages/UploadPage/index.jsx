import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { Upload, Button, Icon } from 'antd';
import styles from './index.less';
import Uploader from '@/utils/upload';

const up = new Uploader();

class UploadPage extends Component {
  static LENGTH = 10;

  state = {
    fileList: [],
    uploading: false,
  };

  handleUpload = async () => {
    const file = this.state.fileList[0];
    console.log(await up.uploadChunks(file));
  };

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
            style={{ marginTop: 16 }}
          >
            {uploading ? 'Uploading' : 'Start Upload'}
          </Button>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default UploadPage;
