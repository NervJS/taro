const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const shelljs = require('shelljs')
const ora = require('ora')

module.exports = function (creater, params, helper, cb) {
  const { projectName, description, template, typescript, date, src, css } = params
  const configDirName = 'config'
  const clientDirName = 'client'
  const cloudDirName = 'cloud'
  const cwd = process.cwd()
  const projectPath = path.join(cwd, projectName)
  const projectClientPath = path.join(projectPath, clientDirName)
  const projectCloudPath = path.join(projectPath, cloudDirName)
  const sourceDir = path.join(projectClientPath, src)
  const configDir = path.join(projectClientPath, configDirName)
  const version = helper.getPkgVersion()
  const yarnLockfilePath = path.join(clientDirName, 'yarn-lockfiles', `${version}-yarn.lock`)
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
  fs.mkdirSync(projectClientPath)
  fs.mkdirSync(projectCloudPath)
  fs.mkdirSync(sourceDir)
  fs.mkdirSync(configDir)
  fs.mkdirSync(path.join(sourceDir, 'pages'))

  creater.template(template, path.join(clientDirName, 'pkg'), path.join(projectClientPath, 'package.json'), {
    description,
    projectName,
    version,
    css,
    typescript
  })
  creater.template(template, path.join(clientDirName, 'project'), path.join(projectPath, 'project.config.json'), {
    description,
    projectName
  })
  creater.template(template, path.join(clientDirName, 'gitignore'), path.join(projectClientPath, '.gitignore'))
  creater.template(template, path.join(clientDirName, 'editorconfig'), path.join(projectClientPath, '.editorconfig'))
  creater.template(template, path.join(clientDirName, 'eslintrc'), path.join(projectClientPath, '.eslintrc'), {
    typescript
  })
  creater.template(template, path.join(clientDirName, 'indexhtml'), path.join(projectClientPath, 'index.html'))
  if (typescript) {
    creater.template(template, path.join(clientDirName, 'appjs'), path.join(sourceDir, 'app.tsx'), {
      css: currentStyleExt,
      typescript: true
    })
    creater.template(template, path.join(clientDirName, 'tsconfigjson'), path.join(projectClientPath, 'tsconfig.json'))
    creater.template(template, path.join(clientDirName, 'globaldts'), path.join(projectClientPath, 'global.d.ts'))
  } else {
    creater.template(template, path.join(clientDirName, 'appjs'), path.join(sourceDir, 'app.js'), {
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
  creater.template(template, path.join(clientDirName, 'scss'), path.join(sourceDir, appCSSName))
  creater.template(template, path.join(clientDirName, 'scss'), path.join(sourceDir, 'pages', 'index', pageCSSName))
  creater.template(template, path.join(clientDirName, configDirName, 'index'), path.join(configDir, 'index.js'), {
    date,
    projectName
  })
  creater.template(template, path.join(clientDirName, configDirName, 'dev'), path.join(configDir, 'dev.js'))
  creater.template(template, path.join(clientDirName, configDirName, 'prod'), path.join(configDir, 'prod.js'))

  if (typescript) {
    creater.template(template, path.join(clientDirName, 'pagejs'), path.join(sourceDir, 'pages', 'index', 'index.tsx'), {
      css: currentStyleExt,
      typescript: true
    })
    creater.template(template, path.join(clientDirName, 'components', 'login', 'index'), path.join(sourceDir, 'components', 'login', 'index.weapp.tsx'), {
      css: currentStyleExt,
      typescript: true
    })
  } else {
    creater.template(template, path.join(clientDirName, 'pagejs'), path.join(sourceDir, 'pages', 'index', 'index.weapp.js'), {
      css: currentStyleExt
    })
    creater.template(template, path.join(clientDirName, 'components', 'login', 'index'), path.join(sourceDir, 'components', 'login', 'index.weapp.js'), {
      css: currentStyleExt
    })
  }

  creater.template(template, path.join(cloudDirName, 'functions', 'login', 'index'), path.join(projectPath, cloudDirName, 'functions', 'login', 'index.js'))
  creater.template(template, path.join(cloudDirName, 'functions', 'login', 'pkg'), path.join(projectPath, cloudDirName, 'functions', 'login', 'package.json'))

  if (useNpmrc) creater.template(template, path.join(clientDirName, 'npmrc'), path.join(projectClientPath, '.npmrc'))
  if (useYarnLock) creater.template(template, yarnLockfilePath, path.join(projectClientPath, 'yarn.lock'))
  creater.fs.commit(() => {
    console.log()
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建项目: ${chalk.grey.bold(projectName)}`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建小程序端目录: ${projectName}/${clientDirName}`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建云开发目录: ${projectName}/${cloudDirName}`)}`)

    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建配置目录: ${projectName}/${clientDirName}/${configDirName}`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建源码目录: ${projectName}/${clientDirName}/${src}`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建页面目录: ${projectName}/${clientDirName}/${src}/pages`)}`)
    if (typescript) {
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建页面 TS 文件: ${projectName}/${clientDirName}/${src}/pages/index/index.tsx`)}`)
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建页面目录: ${projectName}/${clientDirName}/${src}/components/login/index.weapp.tsx`)}`)
    } else {
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建页面 JS 文件: ${projectName}/${clientDirName}/${src}/pages/index/index.js`)}`)
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建页面目录: ${projectName}/${clientDirName}/${src}/components/login/index.weapp.js`)}`)
    }
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建页面 ${currentStyleExt.toLocaleUpperCase()} 文件: ${projectName}/${clientDirName}/${src}/pages/index/${pageCSSName}`)}`)
    if (typescript) {
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${clientDirName}/${src}/app.tsx`)}`)
    } else {
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${clientDirName}/${src}/app.js`)}`)
    }
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${clientDirName}/${src}/${appCSSName}`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${clientDirName}/${src}/index.html`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${clientDirName}/${configDirName}/index.js`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${clientDirName}/${configDirName}/dev.js`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${clientDirName}/${configDirName}/prod.js`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${clientDirName}/.editorconfig`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${clientDirName}/.gitignore`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${clientDirName}/package.json`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${clientDirName}/.eslintrc`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${cloudDirName}/functions/login/index.js`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${cloudDirName}/functions/login/package.json`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/project.config.json`)}`)
    if (useNpmrc) console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${clientDirName}/.npmrc`)}`)
    if (useYarnLock) console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${clientDirName}/yarn.lock`)}`)
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
    const install = shelljs.cd('client').exec(command, { silent: true })
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
