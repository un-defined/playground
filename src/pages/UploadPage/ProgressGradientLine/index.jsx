import React from 'react';
import { Progress, Table } from 'antd';
import styles from './index.less';

const columns = [
  {
    title: "切片Hash",
    dataIndex: "hash",
  },
  {
    title: "切片大小(KB)",
    dataIndex: "size",
    render: size => Math.round(size/1000),
  },
  {
    title: "进度",
    dataIndex: "progress",
    render: percent => <Progress
      strokeColor={{
        '0%': '#108ee9',
        '100%': '#87d068',
      }}
      percent={percent}
      status="active"
    />
  }
];

const ProgressTable = props => 
  <Table size="middle" columns={columns} pagination={false} dataSource={
    props.list.filter(item => !!item).map((item, idx) => ({
      key: idx,
      hash: item.chunkName,
      size: item.size,
      progress: item.percent,
    }))
  } />

export default props => (
  <div className={styles.container}>
    <div id="components-progress-demo-gradient-line">
      <ProgressTable {...props} />
    </div>
  </div>
);
