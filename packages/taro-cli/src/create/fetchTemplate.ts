import { chalk, fs } from '@tarojs/helper'
import * as AdmZip from 'adm-zip'
import * as download from 'download-git-repo'
import * as ora from 'ora'
import * as path from 'path'
import * as request from 'request'

import { getTemplateSourceType, readDirWithFileTypes } from '../util'
import { TEMPLATE_CREATOR } from './init'

export interface ITemplates {
  name: string
  platforms?: string | string[]
  desc?: string
}

const TEMP_DOWNLOAD_FOLDER = 'taro-temp'

export default function fetchTemplate (templateSource: string, templateRootPath: string, clone?: boolean): Promise<ITemplates[]> {
  const type = getTemplateSourceType(templateSource)
  const tempPath = path.join(templateRootPath, TEMP_DOWNLOAD_FOLDER)
  let name: string
  let isFromUrl = false

  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async (resolve) => {
    // 下载文件的缓存目录
    if (fs.existsSync(tempPath)) await fs.remove(tempPath)
    await fs.mkdir(tempPath)

    const spinner = ora(`正在从 ${templateSource} 拉取远程模板...`).start()

    if (type === 'git') {
      name = path.basename(templateSource)
      download(templateSource, path.join(tempPath, name), { clone }, async error => {
        if (error) {
          console.log(error)
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
      // url 模板源，因为不知道来源名称，临时取名方便后续开发者从列表中选择
      name = 'from-remote-url'
      isFromUrl = true
      const zipPath = path.join(tempPath, name + '.zip')
      request
        .get(templateSource)
        .pipe(fs.createWriteStream(zipPath))
        .on('close', () => {
          // unzip
          const zip = new AdmZip(zipPath)
          zip.extractAllTo(path.join(tempPath, name), true)

          spinner.color = 'green'
          spinner.succeed(`${chalk.grey('拉取远程模板仓库成功！')}`)
          resolve()
        })
        .on('error', async err => {
          spinner.color = 'red'
          spinner.fail(chalk.red(`拉取远程模板仓库失败！\n${err}`))
          await fs.remove(tempPath)
          return resolve()
        })
    }
  }).then(async () => {
    const templateFolder = name ? path.join(tempPath, name) : ''

    // 下载失败，只显示默认模板
    if (!fs.existsSync(templateFolder)) return Promise.resolve([])

    const isTemplateGroup = !(
      fs.existsSync(path.join(templateFolder, 'package.json')) ||
      fs.existsSync(path.join(templateFolder, 'package.json.tmpl'))
    )

    if (isTemplateGroup) {
      // 模板组
      const files = readDirWithFileTypes(templateFolder)
        .filter(file => !file.name.startsWith('.') && file.isDirectory && file.name !== '__MACOSX')
        .map(file => file.name)
      await Promise.all(
        files.map(file => {
          const src = path.join(templateFolder, file)
          const dest = path.join(templateRootPath, file)
          return fs.move(src, dest, { overwrite: true })
        })
      )
      await fs.remove(tempPath)

      const res: ITemplates[] = files.map(name => {
        const creatorFile = path.join(templateRootPath, name, TEMPLATE_CREATOR)

        if (!fs.existsSync(creatorFile)) return { name }

        const { platforms = '', desc = '' } = require(creatorFile)

        return {
          name,
          platforms,
          desc
        }
      })
      return Promise.resolve(res)
    } else {
      // 单模板
      await fs.move(templateFolder, path.join(templateRootPath, name), { overwrite: true })
      await fs.remove(tempPath)

      let res: ITemplates = { name, desc: isFromUrl ? templateSource : '' }
      const creatorFile = path.join(templateRootPath, name, TEMPLATE_CREATOR)

      if (fs.existsSync(creatorFile)) {
        const { platforms = '', desc = '' } = require(creatorFile)

        res = {
          name,
          platforms,
          desc: desc || templateSource
        }
      }

      return Promise.resolve([res])
    }
  })
}
