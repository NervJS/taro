import * as _ from 'lodash/fp'
import * as fs from 'fs-extra'
import * as path from 'path'
import { chalk } from '@tarojs/helper'

import { IErrorLine } from './interface'

const TEST_FRAMEWORKS = ['jest', 'mocha', 'ava', 'tape', 'jesmine', 'karma']
const LINTERS = ['eslint', 'jslint', 'tslint', 'jshint']
const README = ['readme', 'readme.md', 'readme.markdown']
const GITIGNORE = ['.gitignore']
const EDITORCONFIG = ['.editorconfig']


export default async function ({ appPath }) {
  const PROJECT_PACKAGE_PATH = path.join(appPath, 'package.json')
  const PROJECT_FOLDER_FILES = fs.readdirSync('./')
  if (!fs.existsSync(PROJECT_PACKAGE_PATH)) {
    console.log(chalk.red(`找不到${PROJECT_PACKAGE_PATH}，请确定当前目录是Taro项目根目录!`))
    process.exit(1)
  }
  const projectPackage = require(PROJECT_PACKAGE_PATH)
  const devDependencies = _.keysIn(_.get('devDependencies', projectPackage))

  const inDevDependencies = dependencies => (_.intersectionBy(_.toLower, devDependencies, dependencies)).length > 0
  const hasRecommandTestFrameworks = inDevDependencies(TEST_FRAMEWORKS)
  const hasRecommandLinters = inDevDependencies(LINTERS)

  const inProjectFolder = filenames => (_.intersectionBy(_.toLower, PROJECT_FOLDER_FILES, filenames)).length > 0
  const hasReadme = inProjectFolder(README)
  const hasGitignore = inProjectFolder(GITIGNORE)
  const hasEditorconfig = inProjectFolder(EDITORCONFIG)

  const errorLines: IErrorLine[] = []

  if (!hasRecommandTestFrameworks) {
    errorLines.push({
      desc: '没有检查到常见的测试依赖(jest/mocha/ava/tape/jesmine/karma), 配置测试可以帮助提升项目质量',
      valid: true,
      solution: '可以参考 https://github.com/NervJS/taro-ui-sample 项目, 其中已经包含了完整的测试配置与范例'
    })
  }
  if (!hasRecommandLinters) {
    errorLines.push({
      desc: '没有检查到常见的 linter (eslint/jslint/jshint/tslint), 配置 linter 可以帮助提升项目质量',
      valid: true,
      solution: 'Taro 还提供了定制的 ESLint 规则, 可以帮助开发者避免一些常见的问题. 使用 taro cli 创建新项目即可体验'
    })
  }
  if (!hasReadme) {
    errorLines.push({
      desc: '没有检查到 Readme (readme/readme.md/readme.markdown), 编写 Readme 可以方便其他人了解项目',
      valid: true
    })
  }
  if (!hasGitignore) {
    errorLines.push({
      desc: '没有检查到 .gitignore 配置, 配置 .gitignore 以避免将敏感信息或不必要的内容提交到代码仓库',
      valid: true
    })
  }
  if (!hasEditorconfig) {
    errorLines.push({
      desc: '没有检查到 .editconfig 配置, 配置 editconfig 以统一项目成员编辑器的代码风格',
      valid: true
    })
  }

  return {
    desc: '检查推荐内容',
    lines: errorLines
  }
}
