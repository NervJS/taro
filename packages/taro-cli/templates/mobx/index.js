const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const { exec } = require('child_process')
const ora = require('ora')

const styleExtMap = {
  sass: 'scss',
  less: 'less',
  stylus: 'styl',
  none: 'css'
}

exports.createPage = function (creator, params, cb) {
  const { page, projectDir, src, template, typescript, css } = params
  let pageCSSName
  const sourceDir = path.join(projectDir, src)
  const currentStyleExt = styleExtMap[css] || 'css'
  switch (css) {
    case 'sass':
      pageCSSName = `${page}.scss`
      break
    case 'less':
      pageCSSName = `${page}.less`
      break
    case 'stylus':
      pageCSSName = `${page}.styl`
      break
    default:
      pageCSSName = `${page}.css`
      break
  }
  creator.template(template, 'scss', path.join(sourceDir, 'pages', page, pageCSSName))
  if (typescript) {
    creator.template(template, 'pagejs', path.join(sourceDir, 'pages', page, `${page}.tsx`), {
      css: currentStyleExt,
      typescript: true,
      pageName: page
    })
  } else {
    creator.template(template, 'pagejs', path.join(sourceDir, 'pages', page, `${page}.js`), {
      css: currentStyleExt,
      pageName: page
    })
  }
  creator.fs.commit(() => {
    if (typeof cb === 'function') {
      cb()
    }
  })
}

exports.createApp = function (creator, params, helper, cb) {
  const { projectName, projectDir, description, template, typescript, date, src, css } = params
  const configDirName = 'config'
  const projectPath = path.join(projectDir, projectName)
  const sourceDir = path.join(projectPath, src)
  const configDir = path.join(projectPath, configDirName)
  const version = helper.getPkgVersion()
  const yarnLockfilePath = path.join('yarn-lockfiles', `${version}-yarn.lock`)
  const shouldUseYarn = helper.shouldUseYarn()
  const useNpmrc = shouldUseYarn === false
  const useYarnLock = shouldUseYarn && fs.existsSync(creator.templatePath(template, yarnLockfilePath))
  let appCSSName
  let pageCSSName

  const currentStyleExt = styleExtMap[css] || 'css'
  params.page = 'index'

  fs.ensureDirSync(projectPath)
  fs.ensureDirSync(sourceDir)
  fs.ensureDirSync(configDir)
  fs.ensureDirSync(path.join(sourceDir, 'pages'))

  creator.template(template, 'pkg', path.join(projectPath, 'package.json'), {
    description,
    projectName,
    version,
    css,
    typescript,
    template
  })
  creator.template(template, 'project', path.join(projectPath, 'project.config.json'), {
    description,
    projectName
  })
  creator.template(template, 'gitignore', path.join(projectPath, '.gitignore'))
  creator.template(template, 'editorconfig', path.join(projectPath, '.editorconfig'))
  creator.template(template, 'eslintrc', path.join(projectPath, '.eslintrc'))
  creator.template(template, 'indexhtml', path.join(sourceDir, 'index.html'))
  if (typescript) {
    creator.template(template, 'appjs', path.join(sourceDir, 'app.tsx'), {
      css: currentStyleExt,
      typescript: true
    })
    creator.template(template, 'tsconfigjson', path.join(projectPath, 'tsconfig.json'))
    creator.template(template, 'globaldts', path.join(projectPath, 'global.d.ts'))
  } else {
    creator.template(template, 'appjs', path.join(sourceDir, 'app.js'), {
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
  creator.template(template, 'scss', path.join(sourceDir, appCSSName))
  creator.template(template, path.join(configDirName, 'index'), path.join(configDir, 'index.js'), {
    date,
    projectName
  })
  exports.createPage(creator, {
    page: 'index',
    projectDir: projectPath,
    src,
    template,
    typescript,
    css
  })
  creator.template(template, path.join(configDirName, 'dev'), path.join(configDir, 'dev.js'))
  creator.template(template, path.join(configDirName, 'prod'), path.join(configDir, 'prod.js'))
  if (useNpmrc) creator.template(template, 'npmrc', path.join(projectPath, '.npmrc'))
  if (useYarnLock) creator.template(template, yarnLockfilePath, path.join(projectPath, 'yarn.lock'))
  creator.fs.commit(() => {
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
    process.chdir(projectPath)
    const gitInit = exec('git init')
    gitInit.on('close', code => {
      if (code === 0) {
        gitInitSpinner.color = 'green'
        gitInitSpinner.succeed(gitInit.stdout.read())
      } else {
        gitInitSpinner.color = 'red'
        gitInitSpinner.fail(gitInit.stderr.read())
      }
    })
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
    exec(command, (error, stdout, stderr) => {
      if (error) {
        installSpinner.color = 'red'
        installSpinner.fail(chalk.red('安装项目依赖失败，请自行重新安装！'))
        console.log(error)
      } else {
        installSpinner.color = 'green'
        installSpinner.succeed('安装成功')
        console.log(`${stderr}${stdout}`)
      }
      console.log(chalk.green(`创建项目 ${chalk.green.bold(projectName)} 成功！`))
      console.log(chalk.green(`请进入项目目录 ${chalk.green.bold(projectName)} 开始工作吧！😝`))
      if (typeof cb === 'function') {
        cb()
      }
    })
  })
}
