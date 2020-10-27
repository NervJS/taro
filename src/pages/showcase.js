

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useEffect } from 'react';

import Layout from '@theme/Layout';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';


function Showcase() {
  useEffect(() => {
    let appscript = document.querySelector('#appscript');
    if (appscript) {
      window.location.reload();
      return
    }
    const script = document.createElement('script');
    script.src = 'https://nervjs.github.io/taro-user-cases/index.js';
    script.id = 'appscript'
    !document.userCases && document.body.appendChild(script);
  }, [])
  return (
    <Layout
      permalink="/showcase"
      description="Taro 案例页，微信小程序、H5、支付宝小程序、百度小程序、移动端应用、QQ小程序、字节跳动小程序、京东小程序, 如果你也使用 Taro，提交你的案例让我们知道你，以便更好地为你服务，同时也让更多的人了解 Taro 的能力">
      <div className="container margin-vert--xl">
        <p className="tip">提交案例，只需二维码和简单的信息，既展示你的作品，也给使用 Taro 的小伙伴信心，给 Taro 贡献者以鼓励，<a href="https://github.com/NervJS/taro-user-cases/edit/master/index.js">点击提交案例</a></p>
        <div className="app" id="app"></div>
      </div>
    </Layout>
  );
}

export default Showcase;
