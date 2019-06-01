const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const { exec } = require('child_process')
const ora = require('ora')

module.exports = function (creater, params, helper, cb) {
  const { projectName, projectDir, description, template, typescript, date, src, css } = params
  const configDirName = 'config'
  const projectPath = path.join(projectDir, projectName)
  const sourceDir = path.join(projectPath, src)
  const configDir = path.join(projectPath, configDirName)
  const version = helper.getPkgVersion()
  const yarnLockfilePath = path.join('yarn-lockfiles', `${version}-yarn.lock`)
  const shouldUseYarn = helper.shouldUseYarn()
  const useNpmrc = shouldUseYarn === false
  const useYarnLock = shouldUseYarn && fs.existsSync(creater.templatePath(template, yarnLockfilePath))
  let appCSSName
  let pageCSSName
  let avatarCSSName
  let listCSSName
  let listItemCSSName
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
      avatarCSSName = 'avatar.scss'
      listCSSName = 'list.scss'
      listItemCSSName = 'listItem.scss'
      break
    case 'less':
      appCSSName = 'app.less'
      pageCSSName = 'index.less'
      avatarCSSName = 'avatar.less'
      listCSSName = 'list.less'
      listItemCSSName = 'listItem.less'
      break
    case 'stylus':
      appCSSName = 'app.styl'
      pageCSSName = 'index.styl'
      avatarCSSName = 'avatar.styl'
      listCSSName = 'list.styl'
      listItemCSSName = 'listItem.styl'
      break
    default:
      appCSSName = 'app.css'
      pageCSSName = 'index.css'
      avatarCSSName = 'avatar.css'
      listCSSName = 'list.css'
      listItemCSSName = 'listItem.css'
      break
  }
  creater.template(template, 'scss', path.join(sourceDir, appCSSName))
  creater.template(template, 'scss', path.join(sourceDir, 'pages', 'index', pageCSSName))
  creater.template(template, 'scss', path.join(sourceDir, 'plugin', 'components', 'avatar', avatarCSSName))
  creater.template(template, 'scss', path.join(sourceDir, 'plugin', 'components', 'listItem', listItemCSSName))
  creater.template(template, 'scss', path.join(sourceDir, 'plugin', 'pages', 'list', listCSSName))
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
    creater.template(template, 'avatarjs', path.join(sourceDir, 'plugin', 'components', 'avatar', 'avatar.tsx'), {
      css: currentStyleExt,
      typescript: true
    })
    creater.template(template, 'listItemjs', path.join(sourceDir, 'plugin', 'components', 'listItem', 'listItem.tsx'), {
      css: currentStyleExt,
      typescript: true
    })
    creater.template(template, 'listjs', path.join(sourceDir, 'plugin', 'pages', 'list', 'list.tsx'), {
      css: currentStyleExt,
      typescript: true
    })
    creater.template(template, 'pluginjs', path.join(sourceDir, 'plugin', 'index.tsx'))
    creater.template(template, 'pluginjson', path.join(sourceDir, 'plugin', 'plugin.json'), {
      typescript: true
    })
  } else {
    creater.template(template, 'pagejs', path.join(sourceDir, 'pages', 'index', 'index.js'), {
      css: currentStyleExt
    })
    creater.template(template, 'avatarjs', path.join(sourceDir, 'plugin', 'components', 'avatar', 'avatar.js'), {
      css: currentStyleExt
    })
    creater.template(template, 'listItemjs', path.join(sourceDir, 'plugin', 'components', 'listItem', 'listItem.js'), {
      css: currentStyleExt
    })
    creater.template(template, 'listjs', path.join(sourceDir, 'plugin', 'pages', 'list', 'list.js'), {
      css: currentStyleExt
    })
    creater.template(template, 'pluginjs', path.join(sourceDir, 'plugin', 'index.js'))
    creater.template(template, 'pluginjson', path.join(sourceDir, 'plugin', 'plugin.json'))
  }
  creater.template(template, 'jpeg', path.join(sourceDir, 'plugin', 'doc', 'example.jpeg'))
  creater.template(template, 'plugindoc', path.join(sourceDir, 'plugin', 'doc', 'README.md'))
  if (useNpmrc) creater.template(template, 'npmrc', path.join(projectPath, '.npmrc'))
  if (useYarnLock) creater.template(template, yarnLockfilePath, path.join(projectPath, 'yarn.lock'))
  creater.fs.commit(() => {
    console.log()
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建项目: ${chalk.grey.bold(projectName)}`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建配置目录: ${projectName}/${configDirName}`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建源码目录: ${projectName}/${src}`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建调试页面目录: ${projectName}/${src}/pages`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建插件目录: ${projectName}/${src}/plugin`)}`)
    if (typescript) {
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建调试页面 JS 文件: ${projectName}/${src}/pages/index/index.tsx`)}`)
    } else {
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建调试页面 JS 文件: ${projectName}/${src}/pages/index/index.js`)}`)
    }
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建调试页面 ${currentStyleExt.toLocaleUpperCase()} 文件: ${projectName}/${src}/pages/index/${pageCSSName}`)}`)
    if (typescript) {
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/app.tsx`)}`)
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/plugin/index.tsx`)}`)
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/plugin/components/avatar/avatar.tsx`)}`)
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/plugin/components/listItem/listItem.tsx`)}`)
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/plugin/pages/list/list.tsx`)}`)
    } else {
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/app.js`)}`)
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/plugin/index.js`)}`)
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/plugin/components/avatar/avatar.js`)}`)
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/plugin/components/listItem/listItem.js`)}`)
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/plugin/pages/list/list.js`)}`)
    }
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/plugin/components/avatar/${avatarCSSName}`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/plugin/components/listItem/${listItemCSSName}`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/plugin/pages/list/${listCSSName}`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/${appCSSName}`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/index.html`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/plugin/plugin.json`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/plugin/doc/example.jpeg`)}`)
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/${src}/plugin/doc/README.md`)}`)
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
    const install = exec(command)
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
