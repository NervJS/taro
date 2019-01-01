import * as fs from 'fs-extra'
import * as path from 'path'
import { performance } from 'perf_hooks'
import * as chokidar from 'chokidar'
import chalk from 'chalk'
import * as ejs from 'ejs'
import * as _ from 'lodash'
import * as shelljs from 'shelljs'
import * as klaw from 'klaw'

import * as Util from './util'
import * as npmProcess from './util/npm'
import CONFIG from './config'
import * as StyleProcess from './rn/styleProcess'
import { parseJSCode as transformJSCode } from './rn/transformJS'
import { PROJECT_CONFIG, processTypeEnum, REG_STYLE, REG_SCRIPTS, REG_TYPESCRIPT } from './util/constants'

const appPath = process.cwd()
const projectConfig = require(path.join(appPath, PROJECT_CONFIG))(_.merge)
const sourceDirName = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
const sourceDir = path.join(appPath, sourceDirName)
const tempDir = '.rn_temp'
const tempPath = path.join(appPath, tempDir)
const entryFilePath = Util.resolveScriptPath(path.join(sourceDir, CONFIG.ENTRY))
const entryFileName = path.basename(entryFilePath)
const pluginsConfig = projectConfig.plugins || {}

const pkgPath = path.join(__dirname, './rn/pkg')

const depTree: {
  [key: string]: string[]
} = {}

let isBuildingStyles = {}
const styleDenpendencyTree = {}

function isEntryFile (filePath) {
  return path.basename(filePath) === entryFileName
}

function compileDepStyles (filePath, styleFiles) {
  if (isBuildingStyles[filePath] || styleFiles.length === 0) {
    return Promise.resolve({})
  }
  isBuildingStyles[filePath] = true
  return Promise.all(styleFiles.map(async p => { // to css string
    const filePath = path.join(p)
    const fileExt = path.extname(filePath)
    Util.printLog(processTypeEnum.COMPILE, _.camelCase(fileExt).toUpperCase(), filePath)
    return StyleProcess.loadStyle({filePath, pluginsConfig})
  })).then(resList => { // postcss
    return Promise.all(resList.map(item => {
      return StyleProcess.postCSS({ ...item as { css: string, filePath: string }, projectConfig })
    }))
  }).then(resList => {
    const styleObjectEntire = {}
    resList.forEach(item => {
      const styleObject = StyleProcess.getStyleObject({css: item.css, filePath: item.filePath})
      // validate styleObject
      StyleProcess.validateStyle({styleObject, filePath: item.filePath})

      Object.assign(styleObjectEntire, styleObject)
      if (filePath !== entryFilePath) { // 非入口文件，合并全局样式
        Object.assign(styleObjectEntire, _.get(styleDenpendencyTree, [entryFilePath, 'styleObjectEntire'], {}))
      }
      styleDenpendencyTree[filePath] = {
        styleFiles,
        styleObjectEntire
      }
    })
    return JSON.stringify(styleObjectEntire, null, 2)
  }).then(css => {
    let tempFilePath = filePath.replace(sourceDir, tempPath)
    const basename = path.basename(tempFilePath, path.extname(tempFilePath))
    tempFilePath = path.join(path.dirname(tempFilePath), `${basename}_styles.js`)

    StyleProcess.writeStyleFile({css, tempFilePath})
  }).catch((e) => {
    throw new Error(e)
  })
}

function initProjectFile () {
  // generator app.json
  const appJsonObject = Object.assign({}, {
    expo: {
      sdkVersion: '27.0.0'
    }
  }, projectConfig.rn && projectConfig.rn.appJson)
  // generator .${tempPath}/package.json TODO JSON.parse 这种写法可能会有隐患
  const pkgTempObj = JSON.parse(
    ejs.render(
      fs.readFileSync(pkgPath, 'utf-8'), {
        projectName: projectConfig.projectName,
        version: Util.getPkgVersion()
      }
    ).replace(/(\r\n|\n|\r|\s+)/gm, '')
  )
  const dependencies = require(path.join(process.cwd(), 'package.json')).dependencies
  pkgTempObj.dependencies = Object.assign({}, pkgTempObj.dependencies, dependencies)
  // Copy bin/crna-entry.js ?
  const crnaEntryPath = path.join(path.dirname(npmProcess.resolveNpmSync('@tarojs/rn-runner')), 'src/bin/crna-entry.js')

  fs.writeFileSync(path.join(tempDir, 'app.json'), JSON.stringify(appJsonObject, null, 2))
  Util.printLog(processTypeEnum.GENERATE, 'app.json', path.join(tempPath, 'app.json'))
  fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify(pkgTempObj, null, 2))
  Util.printLog(processTypeEnum.GENERATE, 'package.json', path.join(tempPath, 'package.json'))
  fs.copySync(crnaEntryPath, path.join(tempDir, 'bin/crna-entry.js'))
  Util.printLog(processTypeEnum.COPY, 'crna-entry.js', path.join(tempPath, 'bin/crna-entry.js'))
}

async function processFile (filePath) {
  if (!fs.existsSync(filePath)) {
    return
  }
  const dirname = path.dirname(filePath)
  const distDirname = dirname.replace(sourceDir, tempDir)
  let distPath = path.format({dir: distDirname, base: path.basename(filePath)})
  const code = fs.readFileSync(filePath, 'utf-8')
  if (REG_STYLE.test(filePath)) {
    // do something
  } else if (REG_SCRIPTS.test(filePath)) {
    if (REG_TYPESCRIPT.test(filePath)) {
      distPath = distPath.replace(/\.(tsx|ts)(\?.*)?$/, '.js')
    }
    Util.printLog(processTypeEnum.COMPILE, _.camelCase(path.extname(filePath)).toUpperCase(), filePath)
    // transformJSCode
    const transformResult = transformJSCode({code, filePath, isEntryFile: isEntryFile(filePath), projectConfig})
    const jsCode = transformResult.code
    fs.ensureDirSync(distDirname)
    fs.writeFileSync(distPath, Buffer.from(jsCode))
    // compileDepStyles
    const styleFiles = transformResult.styleFiles
    depTree[filePath] = styleFiles
    await compileDepStyles(filePath, styleFiles)
  } else {
    fs.ensureDirSync(distDirname)
    fs.copySync(filePath, distPath)
    Util.printLog(processTypeEnum.COPY, _.camelCase(path.extname(filePath)).toUpperCase(), filePath)
  }
}

function buildTemp () {
  fs.ensureDirSync(path.join(tempPath, 'bin'))
  return new Promise((resolve, reject) => {
    klaw(sourceDir)
      .on('data', file => {
        if (!file.stats.isDirectory()) {
          processFile(file.path)
        }
      })
      .on('end', () => {
        initProjectFile()
        if (!fs.existsSync(path.join(tempPath, 'node_modules'))) {
          console.log()
          console.log(chalk.yellow('开始安装依赖~'))
          process.chdir(tempPath)
          let command
          if (Util.shouldUseYarn()) {
            command = 'yarn'
          } else if (Util.shouldUseCnpm()) {
            command = 'cnpm install'
          } else {
            command = 'npm install'
          }
          shelljs.exec(command, {silent: false})
        }
        resolve()
      })
  })
}

async function buildDist ({watch}) {
  const entry = {
    app: path.join(tempPath, entryFileName)
  }
  const rnConfig = projectConfig.rn || {}
  rnConfig.env = projectConfig.env
  rnConfig.defineConstants = projectConfig.defineConstants
  rnConfig.designWidth = projectConfig.designWidth
  rnConfig.entry = entry
  if (watch) {
    rnConfig.isWatch = true
  }
  rnConfig.projectDir = tempPath
  const rnRunner = await npmProcess.getNpmPkg('@tarojs/rn-runner')
  rnRunner(rnConfig)
}

async function perfWrap (callback, args?) {
  isBuildingStyles = {} // 清空
  // 后期可以优化，不编译全部
  const t0 = performance.now()
  await callback(args)
  const t1 = performance.now()
  Util.printLog(processTypeEnum.COMPILE, `编译完成，花费${Math.round(t1 - t0)} ms`)
}

function watchFiles () {
  const watcher = chokidar.watch(path.join(sourceDir), {
    ignored: /(^|[/\\])\../,
    persistent: true,
    ignoreInitial: true
  })

  watcher
    .on('ready', () => {
      console.log()
      console.log(chalk.gray('初始化完毕，监听文件修改中...'))
      console.log()
    })
    .on('add', filePath => {
      const relativePath = path.relative(appPath, filePath)
      Util.printLog(processTypeEnum.CREATE, '添加文件', relativePath)
      perfWrap(buildTemp)
    })
    .on('change', filePath => {
      const relativePath = path.relative(appPath, filePath)
      Util.printLog(processTypeEnum.MODIFY, '文件变动', relativePath)
      if (REG_SCRIPTS.test(filePath)) {
        perfWrap(processFile, filePath)
      }
      if (REG_STYLE.test(filePath)) {
        _.forIn(depTree, (styleFiles, jsFilePath) => {
          if (styleFiles.indexOf(filePath) > -1) {
            perfWrap(processFile, jsFilePath)
          }
        })
      }
    })
    .on('unlink', filePath => {
      const relativePath = path.relative(appPath, filePath)
      Util.printLog(processTypeEnum.UNLINK, '删除文件', relativePath)
      perfWrap(buildTemp)
    })
    .on('error', error => console.log(`Watcher error: ${error}`))
}

export async function build ({watch}) {
  fs.ensureDirSync(tempPath)
  const t0 = performance.now()
  await buildTemp()
  const t1 = performance.now()
  Util.printLog(processTypeEnum.COMPILE, `编译完成，花费${Math.round(t1 - t0)} ms`)
  await buildDist({watch})
  if (watch) {
    watchFiles()
  }
}
