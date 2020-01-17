import React from 'react';
import { Progress } from 'antd';
import styles from './index.less';

const Demo = props => {
  const { list } = props;
  return list.map(item => (
    <div>
      <Progress
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
        percent={item.percent}
        status="active"
      />
      {item.chunkName}
    </div>
  ));
};

export default props => (
  <div className={styles.container}>
    <div id="components-progress-demo-gradient-line">
      <Demo {...props} />
    </div>
  </div>
);
