/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import * as fs from 'fs-extra'
import * as path from 'path'
import * as request from 'request'

const GITHUB_API = 'https://api.github.com/'
const GITHUB = 'https://github.com/'

export function getGithubRepoLatestReleaseVersion (repoName: string) {
  const latestReleaseApi = `${GITHUB_API}repos/${repoName}/releases/latest`
  const p = new Promise((resolve) => {
    request(
      {
        url: latestReleaseApi,
        headers: {
          'User-Agent': 'Awesome-Octocat-App'
        }
      },
      (err, response, body) => {
        if (err) {
          throw new Error('快应用容器版本请求失败，请重试！')
        }
        const res = JSON.parse(body)
        resolve(res.tag_name)
      }
    )
  })
  return p
}

export async function downloadGithubRepoLatestRelease (repoName: string, appPath: string, dest: string) {
  const latestTagName = await getGithubRepoLatestReleaseVersion(repoName)
  return new Promise((resolve, reject) => {
    const downloadUrl = `${GITHUB}${repoName}/archive/${latestTagName}.zip`
    const downloadTemp = 'download_temp.zip'
    request({
      url: downloadUrl,
      headers: {
        'User-Agent': 'Awesome-Octocat-App'
      }
    })
      .on('error', reject)
      .on('complete', () => {
        const downloadTempPath = path.join(appPath, downloadTemp)
        if (fs.existsSync(downloadTempPath)) {
          fs.moveSync(downloadTempPath, path.join(dest, downloadTemp))
          resolve()
        }
      })
      .pipe(fs.createWriteStream(downloadTemp))
  })
}
