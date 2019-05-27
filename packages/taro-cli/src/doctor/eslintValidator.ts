import * as path from 'path'
import * as _ from 'lodash'
import { CLIEngine } from 'eslint'

const ESLINT_CONFIG_PATH = path.join(__dirname, 'validatorEslintrc.js')

export default function ({ projectConfig }) {
  const eslintCli = new CLIEngine({
    cwd: process.cwd(),
    useEslintrc: false,
    configFile: ESLINT_CONFIG_PATH
  })

  const sourceFiles = path.join(process.cwd(), projectConfig.sourceRoot, '**/*.{js,ts,jsx,tsx}')
  const report = eslintCli.executeOnFiles([sourceFiles])
  const formatter = eslintCli.getFormatter()

  return {
    desc: '检查 ESLint (以下为 ESLint 的输出)',
    raw: formatter(report.results)
  }
}
