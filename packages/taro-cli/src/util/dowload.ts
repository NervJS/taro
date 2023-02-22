/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
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
      (err, _response, body) => {
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
  return new Promise<void>((resolve, reject) => {
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
