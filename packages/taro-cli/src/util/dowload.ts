import * as fs from 'fs-extra'
import * as path from 'path'
import * as request from 'request'

const GITHUB_API = 'https://api.github.com/'
const GITHUB = 'https://github.com/'

export function getGithubRepoLatestReleaseVersion (repoName) {
  const latestReleaseApi = `${GITHUB_API}repos/${repoName}/releases/latest`
  const p = new Promise((resolve, reject) => {
    request({
      url: latestReleaseApi,
      headers: {
        'User-Agent': 'Awesome-Octocat-App'
      }
    }, (err, response, body) => {
      if (err) {
        throw new Error('快应用容器版本请求失败，请重试！')
      }
      const res = JSON.parse(body)
      resolve(res.tag_name)
    })
  })
  return p
}

export async function downloadGithubRepoLatestRelease (repoName, dest) {
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
      const downloadTempPath = path.join(process.cwd(), downloadTemp)
      if (fs.existsSync(downloadTempPath)) {
        fs.moveSync(downloadTempPath, path.join(dest, downloadTemp))
        resolve()
      }
    })
    .pipe(fs.createWriteStream(downloadTemp))
  })
}
