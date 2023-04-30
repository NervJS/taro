import { chalk, fs } from '@tarojs/helper'
import { exec } from 'child_process'
import * as ora from 'ora'
import * as path from 'path'

import packagesManagement from '../config/packagesManagement'
import { getAllFilesInFolder, getPkgVersion } from '../util'
import Creator from './creator'
import { changeDefaultNameInTemplate } from './editTemplate'

import type { IPageConf } from './page'
import type { IProjectConf } from './project'

const CONFIG_DIR_NAME = 'config'
export const TEMPLATE_CREATOR = 'template_creator.js'

const styleExtMap = {
  sass: 'scss',
  less: 'less',
  stylus: 'styl',
  none: 'css'
}
enum TemplateType {
  rn = 'react-native'
}
const doNotCopyFiles = ['.DS_Store', '.npmrc', TEMPLATE_CREATOR]

function createFiles (
  creator: Creator,
  files: string[],
  handler,
  options: (IProjectConf | IPageConf) & {
    templatePath: string
    projectPath: string
    pageName: string
    period: string
    version?: string
    isCustomTemplate?: boolean
  }
): string[] {
  const {
    description,
    projectName,
    version,
    css,
    date,
    typescript,
    template,
    templatePath,
    projectPath,
    pageName,
    framework,
    compiler,
    isCustomTemplate
  } = options
  const logs: string[] = []
  // 模板库模板，直接创建，不需要改后缀
  const globalChangeExt = Boolean(handler)
  const currentStyleExt = styleExtMap[css] || 'css'

  files.forEach(async file => {
    // fileRePath startsWith '/'
    let fileRePath = file.replace(templatePath, '').replace(new RegExp(`\\${path.sep}`, 'g'), '/')

    let externalConfig: any = null

    const isVueFramework = /^vue/.test(framework)
    if (isVueFramework && file.endsWith('.jsx')) {
      return
    }

    if (!isVueFramework && file.endsWith('.vue')) {
      return
    }

    // 跑自定义逻辑，确定是否创建此文件
    if (handler && typeof handler[fileRePath] === 'function') {
      externalConfig = handler[fileRePath](options)
      if (!externalConfig) return
    }

    let changeExt = globalChangeExt
    if (externalConfig && typeof externalConfig === 'object') {
      if (externalConfig.changeExt === false) {
        changeExt = false
      }
    }

    // 合并自定义 config
    const config = Object.assign(
      {},
      {
        description,
        projectName,
        version,
        css,
        cssExt: currentStyleExt,
        date,
        typescript,
        template,
        pageName,
        framework,
        compiler
      },
      externalConfig
    )

    let destRePath = fileRePath

    // createPage 创建页面模式
    if (config.setPageName) {
      destRePath = config.setPageName
    }
    destRePath = destRePath.replace(/^\//, '')
    // 处理 .js 和 .css 的后缀
    if (
      typescript &&
      changeExt &&
      !destRePath.startsWith(`${CONFIG_DIR_NAME}`) &&
      (path.extname(destRePath) === '.js' || path.extname(destRePath) === '.jsx') &&
      !(destRePath.endsWith('babel.config.js') || destRePath.endsWith('.eslintrc.js'))
    ) {
      destRePath = destRePath.replace('.js', '.ts')
    }
    if (changeExt && path.extname(destRePath).includes('.css')) {
      destRePath = destRePath.replace('.css', `.${currentStyleExt}`)
    }

    if (isCustomTemplate) fileRePath = path.join(templatePath, fileRePath)

    // 创建
    creator.template(template, fileRePath, path.join(projectPath, destRePath), config)

    const destinationPath = creator.destinationPath(path.join(projectPath, destRePath))

    logs.push(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${destinationPath}`)}`)
  })
  return logs
}

export async function createPage (creator: Creator, params: IPageConf, cb) {
  const { projectDir, template, pageName, isCustomTemplate, customTemplatePath } = params

  // path
  let templatePath

  if(isCustomTemplate) {
    templatePath = customTemplatePath
  } else {
    templatePath = creator.templatePath(template)
  }

  if (!fs.existsSync(templatePath)) return console.log(chalk.red(`创建页面错误：找不到模板${templatePath}`))

  // 引入模板编写者的自定义逻辑
  const handlerPath = path.join(templatePath, TEMPLATE_CREATOR)
  const basePageFiles = fs.existsSync(handlerPath) ? require(handlerPath).basePageFiles : []
  const files = Array.isArray(basePageFiles) ? basePageFiles : []
  const handler = fs.existsSync(handlerPath) ? require(handlerPath).handler : null

  const logs = createFiles(creator, files, handler, {
    ...params,
    templatePath,
    projectPath: projectDir,
    pageName,
    isCustomTemplate,
    period: 'createPage'
  })

  creator.fs.commit(() => {
    // logs
    console.log()
    logs.forEach(log => console.log(log))
    console.log()
    typeof cb === 'function' && cb()
  })
}

export async function createApp (creator: Creator, params: IProjectConf, cb) {
  const { projectName, projectDir, template, autoInstall = true, framework, npm } = params
  const logs: string[] = []
  // path
  const projectPath = path.join(projectDir, projectName)
  const templatePath = creator.templatePath(template)

  // npm & yarn
  const version = getPkgVersion()

  // 遍历出模板中所有文件
  const files = await getAllFilesInFolder(templatePath, doNotCopyFiles)

  // 引入模板编写者的自定义逻辑
  const handlerPath = path.join(templatePath, TEMPLATE_CREATOR)
  const handler = fs.existsSync(handlerPath) ? require(handlerPath).handler : null

  // 为所有文件进行创建
  logs.push(
    ...createFiles(creator, files, handler, {
      ...params,
      framework,
      version,
      templatePath,
      projectPath,
      pageName: 'index',
      period: 'createApp'
    })
  )

  // fs commit
  creator.fs.commit(async () => {
    // logs
    console.log()
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建项目: ${chalk.grey.bold(projectName)}`)}`)
    logs.forEach(log => console.log(log))

    // 当选择 rn 模板时，替换默认项目名
    if (template === TemplateType.rn) {
      await changeDefaultNameInTemplate({ projectName, templatePath, projectPath })
    }
    console.log()

    // git init
    const gitInitSpinner = ora(`cd ${chalk.cyan.bold(projectName)}, 执行 ${chalk.cyan.bold('git init')}`).start()
    process.chdir(projectPath)
    const gitInit = exec('git init')
    gitInit.on('close', code => {
      if (code === 0) {
        gitInitSpinner.color = 'green'
        gitInitSpinner.succeed(gitInit.stdout!.read())
      } else {
        gitInitSpinner.color = 'red'
        gitInitSpinner.fail(gitInit.stderr!.read())
      }
    })

    const callSuccess = () => {
      console.log(chalk.green(`创建项目 ${chalk.green.bold(projectName)} 成功！`))
      console.log(chalk.green(`请进入项目目录 ${chalk.green.bold(projectName)} 开始工作吧！😝`))
      if (typeof cb === 'function') {
        cb()
      }
    }

    if (autoInstall) {
      // packages install
      const command: string = packagesManagement[npm].command

      const installSpinner = ora(`执行安装项目依赖 ${chalk.cyan.bold(command)}, 需要一会儿...`).start()
      const child = exec(command, (error) => {
        if (error) {
          installSpinner.color = 'red'
          installSpinner.fail(chalk.red('安装项目依赖失败，请自行重新安装！'))
          console.log(error)
        } else {
          installSpinner.color = 'green'
          installSpinner.succeed('安装成功')
        }
        callSuccess()
      })

      child.stdout!.on('data', function (data) {
        installSpinner.stop()
        console.log(data.replace(/\n$/, ''))
        installSpinner.start()
      })
      child.stderr!.on('data', function (data) {
        installSpinner.warn(data.replace(/\n$/, ''))
        installSpinner.start()
      })
    } else {
      callSuccess()
    }
  })
}
