import React, { useEffect } from 'react';

/**
 * Taro介绍 - 新闻资讯
 *
 * 羚珑内容分发 SDK 接入文档详见：
 * http://tls-pre.jd.com/distribute-sdk-docs/docs/
 */

function Index() {
  const newsStyle = {
    width: '100%',
    height: '400px',
    cursor: 'pointer',
  };

  useEffect(() => {
    // 注册资源位
    window.LRT.register({
      zoneId: '1485579794201481218',  // 羚珑专区id
      debug: false, // 是否开启debug模式
      positionId: '1485796590212263937', // 必传参数，资源位id
      type: 'img', // 资源位类型
      containerId: 'news', // 注册资源位成功后，资源位预览图的 DOM 节点
      backupUrl: 'https://img20.360buyimg.com/img/jfs/t1/220737/13/10934/81315/61dd7009Ead9f1ca0/81f28ce8f80dce8e.jpg',  // 兜底图
      backupLink: 'www.baidu.com',  // 兜底链接
      onClick (e, { url }) {
        // 点击时的回调
        window.open(url);
      },
    });
  }, []);

  return (
    <div id="news" style={newsStyle}></div>
  );
}

export default Index
