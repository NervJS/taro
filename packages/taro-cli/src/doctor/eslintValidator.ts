import * as path from 'path'
import * as _ from 'lodash'
import { CLIEngine } from 'eslint'

import { PROJECT_CONFIG } from '../util/constants'

const projectConfPath = path.join(process.cwd(), PROJECT_CONFIG)
const projectConf = require(projectConfPath)(_.merge)

const ESLINT_CONFIG_PATH = path.join(__dirname, 'validatorEslintrc.js')

export default function () {
  const eslintCli = new CLIEngine({
    cwd: process.cwd(),
    useEslintrc: false,
    configFile: ESLINT_CONFIG_PATH
  })

  const sourceFiles = path.join(process.cwd(), projectConf.sourceRoot, '**/*.{js,ts,jsx,tsx}')
  const report = eslintCli.executeOnFiles([sourceFiles])
  const formatter = eslintCli.getFormatter()

  return {
    desc: '检查 ESLint (以下为 ESLint 的输出)',
    raw: formatter(report.results)
  }
}
