import * as path from 'path'

import * as _ from 'lodash/fp'
import * as ora from 'ora'

export default (ctx) => {
  ctx.registerCommand({
    name: 'doctor',
    async fn () {
      const { validators } = require('../../doctor')
      const { abilityXMLValidator } = require('../../doctor/abilityXMLValidator')
      const { appPath, configPath } = ctx.paths
      const { fs, chalk, PROJECT_CONFIG } = ctx.helper

      if (!configPath ||!fs.existsSync(configPath)) {
        console.log(chalk.red(`找不到项目配置文件${PROJECT_CONFIG}，请确定当前目录是 Taro 项目根目录!`))
        process.exit(1)
      }
      const QUICKAPP_CONF_PATH = path.join(appPath, 'project.quickapp.json')
      if (fs.existsSync(QUICKAPP_CONF_PATH)) {
        validators.push(abilityXMLValidator)
      }

      const NOTE_ALL_RIGHT = chalk.green('[✓] ')
      const NOTE_VALID = chalk.yellow('[!] ')
      const NOTE_INVALID = chalk.red('[✗] ')

      const titleChalk = chalk.hex('#aaa')
      const lineChalk = chalk.hex('#fff')
      const solutionChalk = chalk.hex('#999')

      function printReport (reports) {
        _.forEach(report => {
          console.log('\n' + titleChalk(report.desc))

          if (report.raw) {
            console.log(report.raw)
            return
          }

          if (_.getOr(0, 'lines.length', report) === 0) {
            console.log(`  ${NOTE_ALL_RIGHT}没有发现问题`)
            return
          }

          _.forEach(line => {
            console.log(
              '  ' +
              (line.valid ? NOTE_VALID : NOTE_INVALID) +
              lineChalk(line.desc)
            )
            if (line.solution) {
              console.log('      ' + solutionChalk(line.solution))
            }
          }, report.lines)
        }, reports)
      }

      const spinner = ora('正在诊断项目...').start()
      const reportsP = _.map(validator => validator({
        appPath,
        projectConfig: ctx.initialConfig,
        configPath
      }), validators)
      const reports = await Promise.all(reportsP as any)
      spinner.succeed('诊断完成')
      printReport(reports)
    }
  })
}
