/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')

const CompLibrary = require('../../core/CompLibrary')

const Container = CompLibrary.Container

const CWD = process.cwd()

const versions = require(`${CWD}/versions.json`)

function Versions (props) {
  const { config: siteConfig } = props
  const latestVersion = versions[0]
  const repoUrl = `https://github.com/${siteConfig.organizationName}/${
    siteConfig.projectName
  }`
  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer versionsContainer">
        <div className="post">
          <header className="postHeader">
            <h1>{siteConfig.title} 版本</h1>
          </header>
          <h3 id="latest">当前版本 (Stable)</h3>
          <p>Taro 当前最新的版本</p>
          <table className="versions">
            <tbody>
              <tr>
                <th>{latestVersion}</th>
                <td>
                  <a
                    href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/README.html`}
                  >
                  文档
                  </a>
                </td>
                <td>
                  <a href={`${repoUrl}/releases/tag/v${latestVersion}`}>
                  更新日志
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <h3 id="rc">最新进度</h3>
          <p>你能够在这里看到最新的文档和未发布的代码。</p>
          <table className="versions">
            <tbody>
              <tr>
                <th>master</th>
                <td>
                  <a
                    href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${
                      props.language
                    }next/README.html`}>
                  文档
                  </a>
                </td>
                <td>
                  <a href={repoUrl}>源码</a>
                </td>
              </tr>
            </tbody>
          </table>
          <h3 id="archive">历史版本</h3>
          <p>
            你能够找到之前发布的版本
          </p>
          <table className="versions">
            <tbody>
              {versions.length > 0 && versions.map(version => version !== latestVersion && (
                <tr key={version}>
                  <th>
                    {version === versions[versions.length - 1] ? '<=' : ''}{version}
                  </th>
                  <td>
                    <a
                      href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${props.language}/${version}/README.html`}
                    >
                    文档
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            去{' '}
            <a href={`${repoUrl}/releases`}> GitHub </a>
            查看历史版本进度
          </p>
        </div>
      </Container>
    </div>
  )
}

Versions.title = 'Versions'

module.exports = Versions
