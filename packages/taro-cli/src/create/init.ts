import * as fs from 'fs-extra'
import * as path from 'path'
import * as chalk from 'chalk'
import { exec } from 'child_process'
import * as ora from 'ora'
import { IProjectConf } from './project'
import Creator from './creator'
import * as helper from '../util'

const CONFIG_DIR_NAME = 'config'
const TEMPLATE_CREATOR = 'template_creator.js'

const styleExtMap = {
  sass: 'scss',
  less: 'less',
  stylus: 'styl',
  none: 'css'
}

const doNotCopyFiles = [
  '.DS_Store',
  '.npmrc',
  TEMPLATE_CREATOR
]

export async function createApp (
  creater: Creator,
  params: IProjectConf,
  cb
) {
  const {
    projectName,
    projectDir,
    description,
    template,
    typescript,
    date,
    css
  } = params
  const logs = []
  // path
  const templatePath = creater.templatePath(template)
  const projectPath = path.join(projectDir, projectName)

  // npm & yarn
  const version = helper.getPkgVersion()
  const shouldUseYarn = helper.shouldUseYarn()
  const useNpmrc = !shouldUseYarn
  const yarnLockfilePath = path.join('yarn-lockfiles', `${version}-yarn.lock`)
  const useYarnLock = shouldUseYarn && fs.existsSync(creater.templatePath(template, yarnLockfilePath))

  if (useNpmrc) {
    creater.template(template, '.npmrc', path.join(projectPath, '.npmrc'))
    logs.push(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/.npmrc`)}`)
  }
  if (useYarnLock) {
    creater.template(template, yarnLockfilePath, path.join(projectPath, 'yarn.lock'))
    logs.push(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/yarn.lock`)}`)
  }

  const currentStyleExt = styleExtMap[css] || 'css'

  // 遍历出模板中所有文件
  const files = await helper.getAllFilesInFloder(templatePath, doNotCopyFiles)

  // 引入模板编写者的自定义逻辑
  const handlerPath = path.join(templatePath, TEMPLATE_CREATOR)
  let handler = {}
  let globalChangeExt = true
  if (fs.existsSync(handlerPath)) {
    handler = require(handlerPath).handler
  } else {
    // 模板库模板，直接创建，不需要改后缀
    globalChangeExt = false
  }

  // 为所有文件进行创建
  files.forEach(file => {
    const fileRePath = file.replace(templatePath, '')
    let externalConfig: any = null

    // 跑自定义逻辑，确定是否创建此文件
    if (typeof handler[fileRePath] === 'function') {
      externalConfig = handler[fileRePath](params)
      if (!externalConfig) return
    }

    let changeExt = globalChangeExt
    if (externalConfig && typeof externalConfig === 'object') {
      if (externalConfig.changeExt === false) {
        changeExt = false
      }
    }

    // 合并自定义 config
    const config = Object.assign({}, {
      description,
      projectName,
      version,
      css,
      cssExt: currentStyleExt,
      date,
      typescript,
      template
    }, externalConfig)

    // 处理 .js 和 .css 的后缀
    let destRePath = fileRePath
    if (
      typescript &&
      changeExt &&
      !destRePath.startsWith(`/${CONFIG_DIR_NAME}`) &&
      (path.extname(destRePath) === '.js' || path.extname(destRePath) === '.jsx')
    ) {
      destRePath = destRePath.replace('.js', '.ts')
    }
    if (changeExt && path.extname(destRePath).includes('.css')) {
      destRePath = destRePath.replace('.css', `.${currentStyleExt}`)
    }

    // 创建
    creater.template(template, fileRePath, path.join(projectPath, destRePath), config)
    logs.push(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${path.join(projectName, destRePath)}`)}`)
  })

  // fs commit
  creater.fs.commit(() => {
    // logs
    console.log()
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建项目: ${chalk.grey.bold(projectName)}`)}`)
    logs.forEach(log => console.log(log))
    console.log()

    // git init
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

    // packages install
    let command: string
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
