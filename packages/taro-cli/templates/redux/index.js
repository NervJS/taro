const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const shelljs = require('shelljs')
const ora = require('ora')

module.exports = function (creater, params, helper, cb) {
  const { projectName, description, template, typescript, date, src, css } = params
  const configDirName = 'config'
  const cwd = process.cwd()
  const projectPath = path.join(cwd, projectName)
  const sourceDir = path.join(projectPath, src)
  const configDir = path.join(projectPath, configDirName)
  const constantsDir = path.join(sourceDir, 'constants')
  const actionsDir = path.join(sourceDir, 'actions')
  const reducersDir = path.join(sourceDir, 'reducers')
  const storeDir = path.join(sourceDir, 'store')
  const version = helper.getPkgVersion()
  const yarnLockfilePath = path.join('yarn-lockfiles', `${version}-yarn.lock`)
  const shouldUseYarn = helper.shouldUseYarn()
  const useNpmrc = shouldUseYarn === false
  const useYarnLock = shouldUseYarn && fs.existsSync(creater.templatePath(template, yarnLockfilePath))
  let appCSSName
  let pageCSSName
  const styleExtMap = {
    sass: 'scss',
    less: 'less',
    stylus: 'styl',
    none: 'css'
  }
  const currentStyleExt = styleExtMap[css] || 'css'

  fs.mkdirSync(projectPath)
  fs.mkdirSync(sourceDir)
  fs.mkdirSync(configDir)
  fs.mkdirSync(path.join(sourceDir, 'pages'))
  fs.mkdirSync(constantsDir)
  fs.mkdirSync(actionsDir)
  fs.mkdirSync(reducersDir)
  fs.mkdirSync(storeDir)

  creater.template(template, 'pkg', path.join(projectPath, 'package.json'), {
    description,
    projectName,
    version,
    css,
    typescript
  })
  creater.template(template, 'project', path.join(projectPath, 'project.config.json'), {
    description,
    projectName
  })
  creater.template(template, 'gitignore', path.join(projectPath, '.gitignore'))
  creater.template(template, 'editorconfig', path.join(projectPath, '.editorconfig'))
  creater.template(template, 'eslintrc', path.join(projectPath, '.eslintrc'), {
    typescript
  })
  creater.template(template, 'indexhtml', path.join(sourceDir, 'index.html'))
  if (typescript) {
    creater.template(template, 'appjs', path.join(sourceDir, 'app.tsx'), {
      css: currentStyleExt,
      typescript: true
    })
    creater.template(template, 'tsconfigjson', path.join(projectPath, 'tsconfig.json'))
    creater.template(template, 'globaldts', path.join(projectPath, 'global.d.ts'))
  } else {
    creater.template(template, 'appjs', path.join(sourceDir, 'app.js'), {
      css: currentStyleExt
    })
  }
  switch (css) {
    case 'sass':
      appCSSName = 'app.scss'
      pageCSSName = 'index.scss'
      break
    case 'less':
      appCSSName = 'app.less'
      pageCSSName = 'index.less'
      break
    case 'stylus':
      appCSSName = 'app.styl'
      pageCSSName = 'index.styl'
      break
    default:
      appCSSName = 'app.css'
      pageCSSName = 'index.css'
      break
  }
  creater.template(template, 'scss', path.join(sourceDir, appCSSName))
  creater.template(template, 'scss', path.join(sourceDir, 'pages', 'index', pageCSSName))
  creater.template(template, path.join(configDirName, 'index'), path.join(configDir, 'index.js'), {
    date,
    projectName
  })
  creater.template(template, path.join(configDirName, 'dev'), path.join(configDir, 'dev.js'))
  creater.template(template, path.join(configDirName, 'prod'), path.join(configDir, 'prod.js'))
  if (typescript) {
    creater.template(template, 'pagejs', path.join(sourceDir, 'pages', 'index', 'index.tsx'), {
      css: currentStyleExt,
      typescript: true
    })
    creater.template(template, path.join('actions', 'counterjs'), path.join(sourceDir, 'actions', 'counter.ts'))
    creater.template(template, path.join('constants', 'counterjs'), path.join(sourceDir, 'constants', 'counter.ts'))
    creater.template(template, path.join('reducers', 'counterjs'), path.join(sourceDir, 'reducers', 'counter.ts'))
    creater.template(template, path.join('reducers', 'indexjs'), path.join(sourceDir, 'reducers', 'index.ts'))
    creater.template(template, path.join('store', 'indexjs'), path.join(sourceDir, 'store', 'index.ts'))
  } else {
    creater.template(template, 'pagejs', path.join(sourceDir, 'pages', 'index', 'index.js'), {
      css: currentStyleExt
    })
    creater.template(template, path.join('actions', 'counterjs'), path.join(sourceDir, 'actions', 'counter.js'))
    creater.template(template, path.join('constants', 'counterjs'), path.join(sourceDir, 'constants', 'counter.js'))
    creater.template(template, path.join('reducers', 'counterjs'), path.join(sourceDir, 'reducers', 'counter.js'))
    creater.template(template, path.join('reducers', 'indexjs'), path.join(sourceDir, 'reducers', 'index.js'))
    creater.template(template, path.join('store', 'indexjs'), path.join(sourceDir, 'store', 'index.js'))
  }
  if (useNpmrc) creater.template(template, 'npmrc', path.join(projectPath, '.npmrc'))
  if (useYarnLock) creater.template(template, yarnLockfilePath, path.join(projectPath, 'yarn.lock'))
  creater.fs.commit(() => {
    console.log()
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建项目: ${chalk.grey.bold(projectName)}`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建配置目录: ${projectName}/${configDirName}`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建源码目录: ${projectName}/${src}`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建页面目录: ${projectName}/${src}/pages`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建 actions 目录: ${projectName}/${src}/actions`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建 constants 目录: ${projectName}/${src}/constants`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建 reducers 目录: ${projectName}/${src}/reducers`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建 store 目录: ${projectName}/${src}/store`)}`)
    if (typescript) {
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建页面 TS 文件: ${projectName}/${src}/pages/index/index.tsx`)}`)
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建 action counter TS 文件: ${projectName}/${src}/actions/counter.ts`)}`)
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建 constant counter TS 文件: ${projectName}/${src}/constants/counter.ts`)}`)
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建 reducer counter TS 文件: ${projectName}/${src}/reducers/counter.ts`)}`)
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建 reducer 入口 TS 文件: ${projectName}/${src}/reducers/index.ts`)}`)
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建 store TS 文件: ${projectName}/${src}/store/index.ts`)}`)
    } else {
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建页面 JS 文件: ${projectName}/${src}/pages/index/index.js`)}`)
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建 action counter JS 文件: ${projectName}/${src}/actions/counter.js`)}`)
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建 constant counter JS 文件: ${projectName}/${src}/constants/counter.js`)}`)
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建 reducer counter JS 文件: ${projectName}/${src}/reducers/counter.js`)}`)
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建 reducer 入口 JS 文件: ${projectName}/${src}/reducers/index.js`)}`)
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建 store JS 文件: ${projectName}/${src}/store/index.js`)}`)
    }
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建页面 ${currentStyleExt.toLocaleUpperCase()} 文件: ${projectName}/${src}/pages/index/${pageCSSName}`)}`)
    if (typescript) {
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/app.tsx`)}`)
    } else {
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/app.js`)}`)
    }
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/${appCSSName}`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/index.html`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${configDirName}/index.js`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${configDirName}/dev.js`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${configDirName}/prod.js`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/.editorconfig`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/.gitignore`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/package.json`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/.eslintrc`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/project.config.json`)}`)
    if (useNpmrc) console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/.npmrc`)}`)
    if (useYarnLock) console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/yarn.lock`)}`)
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
    if (shouldUseYarn) {
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
