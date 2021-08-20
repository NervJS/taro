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
import * as ora from 'ora'
import * as AdmZip from 'adm-zip'
import * as download from 'download-git-repo'
import * as request from 'request'
import { chalk } from '@tarojs/helper'
import { TEMPLATE_CREATOR } from './init'

import { getTemplateSourceType, readDirWithFileTypes } from '../util'

export interface ITemplates {
  name: string,
  platforms?: string | string[]
  desc?: string
}

const TEMP_DOWNLOAD_FLODER = 'taro-temp'

export default function fetchTemplate (templateSource: string, templateRootPath: string, clone?: boolean): Promise<ITemplates[]> {
  const type = getTemplateSourceType(templateSource)
  const tempPath = path.join(templateRootPath, TEMP_DOWNLOAD_FLODER)
  let name: string

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
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
      const zipPath = path.join(tempPath, 'temp.zip')
      request
        .get(templateSource)
        .on('close', () => {
          // unzip
          const zip = new AdmZip(zipPath)
          zip.extractAllTo(tempPath, true)
          const files = readDirWithFileTypes(tempPath).filter(
            file => !file.name.startsWith('.') && file.isDirectory && file.name !== '__MACOSX'
          )
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
        .on('error', async err => {
          spinner.color = 'red'
          spinner.fail(chalk.red(`拉取远程模板仓库失败！\n${err}`))
          await fs.remove(tempPath)
          return resolve()
        })
        .pipe(fs.createWriteStream(zipPath))
    }
  }).then(async () => {
    const templateFloder = name ? path.join(tempPath, name) : ''

    // 下载失败，只显示默认模板
    if (!fs.existsSync(templateFloder)) return Promise.resolve([])

    const isTemplateGroup = !fs.existsSync(path.join(templateFloder, 'package.json'))

    if (isTemplateGroup) {
      // 模板组
      const files = readDirWithFileTypes(templateFloder)
        .filter(file => !file.name.startsWith('.') && file.isDirectory && file.name !== '__MACOSX')
        .map(file => file.name)
      await Promise.all(
        files.map(file => {
          const src = path.join(templateFloder, file)
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
      await fs.move(templateFloder, path.join(templateRootPath, name), { overwrite: true })
      await fs.remove(tempPath)

      let res: ITemplates = { name }
      const creatorFile = path.join(templateRootPath, name, TEMPLATE_CREATOR)

      if (fs.existsSync(creatorFile)) {
        const { platforms = '', desc = '' } = require(creatorFile)

        res = {
          name,
          platforms,
          desc
        }
      }

      return Promise.resolve([res])
    }
  })
}
