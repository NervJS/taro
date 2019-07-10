import * as _ from 'lodash/fp'
import * as fs from 'fs-extra'
import * as path from 'path'
import chalk from 'chalk'

import { IErrorLine } from './interface'

const ABILITYXML = ['ability.xml']

export default async function ({ appPath }) {
  const PROJECT_PACKAGE_PATH = path.join(appPath, 'package.json')
  const PROJECT_FOLDER_FILES = fs.readdirSync('./')
  if (!fs.existsSync(PROJECT_PACKAGE_PATH)) {
    console.log(chalk.red(`找不到${PROJECT_PACKAGE_PATH}，请确定当前目录是Taro项目根目录!`))
    process.exit(1)
  }

  const inProjectFolder = filenames => (_.intersectionBy(_.toLower, PROJECT_FOLDER_FILES, filenames)).length > 0
  const hasAbilityXML = inProjectFolder(ABILITYXML)

  const errorLines: IErrorLine[] = []

  if (!hasAbilityXML) {
    errorLines.push({
      desc: '没有检查到 ability.xml, 编写 ability.xml可以让其他应用方便地叫起应用内服务',
      valid: true
    })
  }

  return {
    desc: '检查原子化服务规范',
    lines: errorLines
  }
}
