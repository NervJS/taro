import * as fs from 'fs-extra'
import * as path from 'path'
import { exec } from 'child_process'
import * as chalk from 'chalk'
import * as ora from 'ora'
import Project from './project'

const TEMP_DOWNLOAD_FLODER = 'taro-temp'

export default async function fetchTemplate (creater: Project, cb) {
  const { templateSource, gitAddress, template } = creater.conf
  const templateRootPath = creater.templatePath('')
  const templatePath = template ? creater.templatePath(template) : ''

  if (templateSource === 'default') {
    creater.conf.template = 'default'
    cb()
  } else if (templateSource === 'git') {
    if (fs.existsSync(templatePath)) {
      await fs.remove(templatePath)
      // return console.log(`${chalk.grey('模板已缓存可直接使用')}`)
    }

    const tempPath = path.join(templateRootPath, TEMP_DOWNLOAD_FLODER)
    if (fs.existsSync(tempPath)) await fs.remove(tempPath)
    await fs.mkdir(tempPath)

    const spinner = ora(`git clone ${gitAddress}`).start()

    exec(`git clone ${gitAddress} ${tempPath}`, async error => {
      if (error) {
        spinner.color = 'red'
        spinner.fail(chalk.red('拉取远程模板仓库失败！'))
        await fs.remove(tempPath)
        return console.log(error)
      }
      spinner.color = 'green'
      spinner.succeed(`${chalk.grey('git clone done')}`)

      if (!fs.existsSync(path.join(tempPath, template))) {
        console.log(chalk.red('git 仓库不存在此模板！'))
        await fs.remove(tempPath)
        return
      }

      await fs.move(path.join(tempPath, template), templatePath)
      await fs.remove(tempPath)
      typeof cb === 'function' && cb()
    })
  }
}
