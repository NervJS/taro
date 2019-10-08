import * as path from 'path'
import { CLIEngine } from 'eslint'
import * as glob from 'glob'

const ESLINT_CONFIG_PATH = path.join(__dirname, 'validatorEslintrc.js')

export default function ({ projectConfig }) {
  const appPath = process.cwd()
  const globPattern = glob.sync(path.join(appPath, '.eslintrc*'))
  let configFile = ESLINT_CONFIG_PATH
  if (globPattern.length) {
    configFile = globPattern[0]
  }
  const eslintCli = new CLIEngine({
    cwd: process.cwd(),
    useEslintrc: false,
    configFile
  })

  const sourceFiles = path.join(process.cwd(), projectConfig.sourceRoot, '**/*.{js,ts,jsx,tsx}')
  const report = eslintCli.executeOnFiles([sourceFiles])
  const formatter = eslintCli.getFormatter()

  return {
    desc: '检查 ESLint (以下为 ESLint 的输出)',
    raw: formatter(report.results)
  }
}
