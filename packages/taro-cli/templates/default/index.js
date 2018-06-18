const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const shelljs = require('shelljs')
const ora = require('ora')

module.exports = function (creater, params, helper, cb) {
  const { projectName, description, template, typescript, date, src } = params
  const configDirName = 'config'
  const cwd = process.cwd()
  const projectPath = path.join(cwd, projectName)
  const sourceDir = path.join(projectPath, src)
  const configDir = path.join(projectPath, configDirName)
  const version = helper.getPkgVersion()
  const useNpmrc = helper.shouldUseYarn() === false

  fs.mkdirSync(projectPath)
  fs.mkdirSync(sourceDir)
  fs.mkdirSync(configDir)
  fs.mkdirSync(path.join(sourceDir, 'pages'))

  creater.template(template, 'pkg', path.join(projectPath, 'package.json'), {
    description,
    projectName,
    version
  })
  creater.template(template, 'project', path.join(projectPath, 'project.config.json'), {
    description,
    projectName
  })
  creater.template(template, 'gitignore', path.join(projectPath, '.gitignore'))
  if (useNpmrc) creater.template(template, 'npmrc', path.join(projectPath, '.npmrc'))
  creater.template(template, 'editorconfig', path.join(projectPath, '.editorconfig'))
  creater.template(template, 'eslintrc', path.join(projectPath, '.eslintrc'))
  creater.template(template, 'indexhtml', path.join(sourceDir, 'index.html'))
  if (typescript) {
    creater.template(template, 'appjs', path.join(sourceDir, 'app.tsx'))
  } else {
    creater.template(template, 'appjs', path.join(sourceDir, 'app.js'))
  }
  creater.template(template, 'scss', path.join(sourceDir, 'app.scss'))
  creater.template(template, path.join(configDirName, 'index'), path.join(configDir, 'index.js'), {
    date,
    projectName
  })
  creater.template(template, path.join(configDirName, 'dev'), path.join(configDir, 'dev.js'))
  creater.template(template, path.join(configDirName, 'prod'), path.join(configDir, 'prod.js'))
  if (typescript) {
    creater.template(template, 'pagejs', path.join(sourceDir, 'pages', 'index', 'index.tsx'))
  } else {
    creater.template(template, 'pagejs', path.join(sourceDir, 'pages', 'index', 'index.js'))
  }
  creater.template(template, 'scss', path.join(sourceDir, 'pages', 'index', 'index.scss'))
  creater.fs.commit(() => {
    console.log()
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建项目: ${chalk.grey.bold(projectName)}`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建配置目录: ${projectName}/${configDirName}`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建源码目录: ${projectName}/${src}`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建页面目录: ${projectName}/${src}/pages`)}`)
    if (typescript) {
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建页面 JS 文件: ${projectName}/${src}/pages/index/index.tsx`)}`)
    } else {
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建页面 JS 文件: ${projectName}/${src}/pages/index/index.js`)}`)
    }
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建页面 SCSS 文件: ${projectName}/${src}/pages/index/index.scss`)}`)
    if (typescript) {
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/app.tsx`)}`)
    } else {
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/app.js`)}`)
    }
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/app.scss`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/index.html`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${configDirName}/index.js`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${configDirName}/dev.js`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${configDirName}/prod.js`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/.editorconfig`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/.gitignore`)}`)
    if (useNpmrc) console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/.npmrc`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/package.json`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/.eslintrc`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/project.config.json`)}`)
    console.log()
    const gitInitSpinner = ora(`cd ${chalk.cyan.bold(projectName)}, 执行 ${chalk.cyan.bold('git init')}`).start()
    process.chdir(projectName)
    const gitInit = shelljs.exec('git init', { silent: true })
    if (gitInit.code === 0) {
      gitInitSpinner.color = 'green'
      gitInitSpinner.succeed(gitInit.stdout)
    } else {
      gitInitSpinner.color = 'red'
      gitInitSpinner.fail(gitInit.stderr)
    }
    // install
    let command
    if (helper.shouldUseYarn()) {
      command = 'yarn install'
    } else if (helper.shouldUseCnpm()) {
      command = 'cnpm install'
    } else {
      command = 'npm install'
    }
    const installSpinner = ora(`执行安装项目依赖 ${chalk.cyan.bold(command)}, 需要一会儿...`).start()
    const install = shelljs.exec(command, { silent: true })
    if (install.code === 0) {
      installSpinner.color = 'green'
      installSpinner.succeed('安装成功')
      console.log(`${install.stderr}${install.stdout}`)
    } else {
      installSpinner.color = 'red'
      installSpinner.fail(chalk.red('安装项目依赖失败，请自行重新安装！'))
      console.log(`${install.stderr}${install.stdout}`)
    }
    console.log(chalk.green(`创建项目 ${chalk.green.bold(projectName)} 成功！`))
    console.log(chalk.green(`请进入项目目录 ${chalk.green.bold(projectName)} 开始工作吧！😝`))
    if (typeof cb === 'function') {
      cb()
    }
  })
}
