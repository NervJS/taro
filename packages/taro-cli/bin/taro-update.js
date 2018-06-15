#!/usr/bin/env node
const program = require('commander')
const chalk = require('chalk')
const {getRootPath, getPkgItemByKey} = require('../src/util')
const ora = require('ora')
const exec = require('child_process').exec
const execSync = require('child_process').execSync

program.parse(process.argv)

const args = program.args

if (args.length === 0) {
  console.log(chalk.green('update all packages of taro'))
  var child = exec('npm i -g @tarojs/cli@latest')

  const spinner = ora('update packages...').start()

  child.stdout.on('data', function (data) {
    console.log(data)
    spinner.succeed(chalk.green('Compile successfully!\n'))
  })
  child.stderr.on('data', function (data) {
    console.log(data)
    spinner.fail(chalk.red('Compile failed!\n'))
  })
} else {
  // 输入的包属于taro-cli
  const depList = Object.keys(getPkgItemByKey('dependencies'))

  args.forEach((element) => {
    if (depList.indexOf(element) === -1) {
      console.log(chalk.red(`taro 的依赖包中没有${element}`))
      process.exit(1)
    }
  })

  const spinner = ora('update packages...').start()

  args.forEach((element) => {
    const output = execSync(`npm i ${element}@latest`, {cwd: getRootPath()})
      .toString()
    console.log('\r\n', chalk.green(output))
  })
  spinner.stop()
}
