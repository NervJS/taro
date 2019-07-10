import * as fs from 'fs-extra'
import * as path from 'path'
import { exec } from 'child_process'
import chalk from 'chalk'
import * as ora from 'ora'
import axios from 'axios'
import * as AdmZip from 'adm-zip'
import Project from './project'
import { TemplateSourceType } from '../util'

const TEMP_DOWNLOAD_FLODER = 'taro-temp'

export default function fetchTemplate (creater: Project, type: TemplateSourceType): Promise<any> {
  const { templateSource } = creater.conf
  const templateRootPath = creater.templatePath('')
  const tempPath = path.join(templateRootPath, TEMP_DOWNLOAD_FLODER)
  let name: string

  return new Promise(async (resolve, reject) => {
    // 下载文件的缓存目录
    if (fs.existsSync(tempPath)) await fs.remove(tempPath)
    await fs.mkdir(tempPath)

    const spinner = ora(`正在从 ${templateSource} 拉取远程模板...`).start()

    if (type === 'git') {
      // git clone
      name = path.basename(templateSource, '.git')
      exec(`git clone ${templateSource} ${path.join(tempPath, name)}`, async error => {
        if (error) {
          spinner.color = 'red'
          spinner.fail(chalk.red('拉取远程模板仓库失败！'))
          await fs.remove(tempPath)
          return resolve()
        }
        spinner.color = 'green'
        spinner.succeed(`${chalk.grey('拉取远程模板仓库成功！')}`)
        resolve()
      })
    } else if (type === 'url') {
      axios.get(templateSource, {
        responseType: 'stream'
      })
        .then(response => {
          const zipPath = path.join(tempPath, 'temp.zip')
          const ws = fs.createWriteStream(zipPath)
          response.data.pipe(ws)
          ws.on('close', () => {
            // unzip
            const zip = new AdmZip(zipPath)
            zip.extractAllTo(tempPath, true)
            const files = fs.readdirSync(tempPath, { withFileTypes: true })
              .filter((file: fs.Dirent) => !file.name.startsWith('.') && file.isDirectory())
            if (files.length !== 1) {
              spinner.color = 'red'
              spinner.fail(chalk.red(`拉取远程模板仓库失败！\n${new Error('远程模板源组织格式错误')}`))
              return resolve()
            }

            name = files[0].name
            spinner.color = 'green'
            spinner.succeed(`${chalk.grey('拉取远程模板仓库成功！')}`)
            resolve()
          })
        })
        .catch(async err => {
          spinner.color = 'red'
          spinner.fail(chalk.red(`拉取远程模板仓库失败！\n${err}`))
          await fs.remove(tempPath)
          return resolve()
        })
    }
  })
    .then(async () => {
      const templateFloder = name ? path.join(tempPath, name) : ''

      // 下载失败，只显示默认模板
      if (!fs.existsSync(templateFloder)) return Promise.resolve([])

      const isTemplateGroup = !fs.existsSync(path.join(templateFloder, 'package.json'))

      if (isTemplateGroup) {
        // 模板组
        const files: string[] = fs.readdirSync(templateFloder, { withFileTypes: true })
          .filter((file: fs.Dirent) => !file.name.startsWith('.') && file.isDirectory())
          .map((file: fs.Dirent) => file.name)
        await Promise.all(files.map(file => {
          const src = path.join(templateFloder, file)
          const dest = path.join(templateRootPath, file)
          return fs.move(src, dest, { overwrite: true })
        }))
        await fs.remove(tempPath)
        return Promise.resolve(files)
      } else {
        // 单模板
        await fs.move(templateFloder, path.join(templateRootPath, name), { overwrite: true })
        await fs.remove(tempPath)
        return Promise.resolve([name])
      }
    })
}
