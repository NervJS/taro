import * as fs from 'fs-extra'
import * as path from 'path'
import { exec, spawn, spawnSync, execSync, SpawnSyncOptions } from 'child_process'
import { performance } from 'perf_hooks'
import * as chokidar from 'chokidar'
import * as _ from 'lodash'
import * as klaw from 'klaw'
import { TogglableOptions, IOption } from '@tarojs/taro/types/compile'
import {
  PROJECT_CONFIG,
  processTypeEnum,
  REG_STYLE,
  REG_SCRIPTS,
  REG_TYPESCRIPT,
  BUILD_TYPES,
  resolveScriptPath,
  printLog,
  shouldUseYarn,
  shouldUseCnpm,
  chalk
} from '@tarojs/helper'

import { getPkgVersion, checkCliAndFrameworkVersion } from './util'
import CONFIG from './config'
import * as StyleProcess from './rn/styleProcess'
import { parseJSCode as transformJSCode } from './rn/transformJS'
import { convertToJDReact } from './jdreact/convert_to_jdreact'
import { IBuildOptions } from './util/types'
// import { Error } from 'tslint/lib/error'

let isBuildingStyles = {}
const styleDenpendencyTree = {}

const depTree: {
  [key: string]: string[]
} = {}

const TEMP_DIR_NAME = 'rn_temp'
const BUNDLE_DIR_NAME = 'bundle'

class Compiler {
  projectConfig
  h5Config
  routerConfig
  appPath: string
  routerMode: string
  customRoutes: {
    [key: string]: string
  }
  routerBasename: string
  sourcePath: string
  sourceDir: string
  // tempDir: string
  // bundleDir: string
  tempPath: string
  entryFilePath: string
  entryFileName: string
  entryBaseName: string
  babel: TogglableOptions
  csso: TogglableOptions
  uglify: TogglableOptions
  sass: IOption
  less: IOption
  stylus: IOption
  plugins: any[]
  rnConfig
  hasJDReactOutput: boolean
  // babelConfig: any
  // pxTransformConfig
  // pathAlias

  constructor (appPath) {
    this.appPath = appPath
    this.projectConfig = require(path.join(appPath, PROJECT_CONFIG))(_.merge)
    const sourceDirName = this.projectConfig.sourceRoot || CONFIG.SOURCE_DIR
    this.sourceDir = path.join(appPath, sourceDirName)
    this.entryFilePath = resolveScriptPath(path.join(this.sourceDir, CONFIG.ENTRY))
    this.entryFileName = path.basename(this.entryFilePath)
    this.entryBaseName = path.basename(this.entryFilePath, path.extname(this.entryFileName))
    this.babel = this.projectConfig.babel
    this.csso = this.projectConfig.csso
    this.uglify = this.projectConfig.uglify
    this.plugins = this.projectConfig.plugins
    this.sass = this.projectConfig.sass
    this.stylus = this.projectConfig.stylus
    this.less = this.projectConfig.less
    this.rnConfig = this.projectConfig.rn || {}
    // this.babelConfig = this.projectConfig.plugins.babel // 用来配置 babel

    // 直接输出编译后代码到指定目录
    if (this.rnConfig.outPath) {
      this.tempPath = path.resolve(this.appPath, this.rnConfig.outPath)
      if (!fs.existsSync(this.tempPath)) {
        throw new Error(`outPath ${this.tempPath} 不存在`)
      }
      this.hasJDReactOutput = true
    } else {
      this.tempPath = path.join(appPath, TEMP_DIR_NAME)
      this.hasJDReactOutput = false
    }
  }

  isEntryFile (filePath) {
    return path.basename(filePath) === this.entryFileName
  }

  compileDepStyles (filePath, styleFiles) {
    if (isBuildingStyles[filePath] || styleFiles.length === 0) {
      return Promise.resolve({})
    }
    isBuildingStyles[filePath] = true
    return Promise.all(styleFiles.map(async p => { // to css string
      const filePath = path.join(p)
      const fileExt = path.extname(filePath)
      printLog(processTypeEnum.COMPILE, _.camelCase(fileExt).toUpperCase(), filePath)
      return StyleProcess.loadStyle({
        filePath,
        pluginsConfig: {
          sass: this.sass,
          less: this.less,
          stylus: this.stylus
        }
      }, this.appPath)
    })).then(resList => { // postcss
      return Promise.all(resList.map(item => {
        return StyleProcess.postCSS({...item as { css: string, filePath: string }, projectConfig: this.projectConfig})
      }))
    }).then(resList => {
      const styleObjectEntire = {}
      resList.forEach(item => {
        const styleObject = StyleProcess.getStyleObject({css: item.css, filePath: item.filePath})
        // validate styleObject
        StyleProcess.validateStyle({styleObject, filePath: item.filePath})

        Object.assign(styleObjectEntire, styleObject)
        if (filePath !== this.entryFilePath) { // 非入口文件，合并全局样式
          Object.assign(styleObjectEntire, _.get(styleDenpendencyTree, [this.entryFilePath, 'styleObjectEntire'], {}))
        }
        styleDenpendencyTree[filePath] = {
          styleFiles,
          styleObjectEntire
        }
      })
      return JSON.stringify(styleObjectEntire, null, 2)
    }).then(css => {
      let tempFilePath = filePath.replace(this.sourceDir, this.tempPath)
      const basename = path.basename(tempFilePath, path.extname(tempFilePath))
      tempFilePath = path.join(path.dirname(tempFilePath), `${basename}_styles.js`)

      StyleProcess.writeStyleFile({css, tempFilePath})
    }).catch((e) => {
      throw new Error(e)
    })
  }

  initProjectFile () {
    // generator app.json
    const appJsonObject = Object.assign({
      name: _.camelCase(require(path.join(this.appPath, 'package.json')).name)
    }, this.rnConfig.appJson)

    const indexJsStr = `
    import {AppRegistry} from 'react-native';
    import App from './${this.entryBaseName}';
    import {name as appName} from './app.json';

    AppRegistry.registerComponent(appName, () => App);`

    fs.writeFileSync(path.join(this.tempPath, 'index.js'), indexJsStr)
    printLog(processTypeEnum.GENERATE, 'index.js', path.join(this.tempPath, 'index.js'))
    fs.writeFileSync(path.join(this.tempPath, 'app.json'), JSON.stringify(appJsonObject, null, 2))
    printLog(processTypeEnum.GENERATE, 'app.json', path.join(this.tempPath, 'app.json'))
    return Promise.resolve()
  }

  async processFile (filePath) {
    if (!fs.existsSync(filePath)) {
      return
    }
    const dirname = path.dirname(filePath)
    const distDirname = dirname.replace(this.sourceDir, this.tempPath)
    let distPath = path.format({dir: distDirname, base: path.basename(filePath)})
    const code = fs.readFileSync(filePath, 'utf-8')
    if (REG_STYLE.test(filePath)) {
      // do something
    } else if (REG_SCRIPTS.test(filePath)) {
      if (/\.jsx(\?.*)?$/.test(filePath)) {
        distPath = distPath.replace(/\.jsx(\?.*)?$/, '.js')
      }
      if (REG_TYPESCRIPT.test(filePath)) {
        distPath = distPath.replace(/\.(tsx|ts)(\?.*)?$/, '.js')
      }
      printLog(processTypeEnum.COMPILE, _.camelCase(path.extname(filePath)).toUpperCase(), filePath)
      // transformJSCode
      const transformResult = transformJSCode({
        code, filePath, isEntryFile: this.isEntryFile(filePath), projectConfig: this.projectConfig
      })
      const jsCode = transformResult.code
      fs.ensureDirSync(distDirname)
      fs.writeFileSync(distPath, Buffer.from(jsCode))
      printLog(processTypeEnum.GENERATE, _.camelCase(path.extname(filePath)).toUpperCase(), distPath)
      // compileDepStyles
      const styleFiles = transformResult.styleFiles
      depTree[filePath] = styleFiles
      await this.compileDepStyles(filePath, styleFiles)
    } else {
      fs.ensureDirSync(distDirname)
      printLog(processTypeEnum.COPY, _.camelCase(path.extname(filePath)).toUpperCase(), filePath)
      fs.copySync(filePath, distPath)
      printLog(processTypeEnum.GENERATE, _.camelCase(path.extname(filePath)).toUpperCase(), distPath)
    }
  }

  /**
   * @description 编译文件，安装依赖
   * @returns {Promise}
   */
  buildTemp () {
    return new Promise((resolve, reject) => {
      const filePaths: string[] = []
      this.processFile(this.entryFilePath).then(() => {
        klaw(this.sourceDir)
          .on('data', file => {
            if (!file.stats.isDirectory()) {
              filePaths.push(file.path)
            }
          })
          .on('error', (err, item) => {
            console.log(err.message)
            console.log(item.path)
          })
          .on('end', () => {
            Promise.all(filePaths.filter(f => f !== this.entryFilePath).map(filePath => this.processFile(filePath)))
              .then(() => {
                if (!this.hasJDReactOutput) {
                  this.initProjectFile()
                  resolve()
                } else {
                  resolve()
                }
              })
          })
      })
    })
  }

  buildBundle () {
    fs.ensureDirSync(TEMP_DIR_NAME)
    process.chdir(TEMP_DIR_NAME)
    // 通过 jdreact  构建 bundle
    if (this.rnConfig.bundleType === 'jdreact') {
      console.log()
      console.log(chalk.green('生成JDReact 目录：'))
      console.log()
      convertToJDReact({
        tempPath: this.tempPath, entryBaseName: this.entryBaseName
      })
      return
    }
    // 默认打包到 bundle 文件夹
    fs.ensureDirSync(BUNDLE_DIR_NAME)
    execSync(
      `node ../node_modules/react-native/local-cli/cli.js bundle --entry-file ./${TEMP_DIR_NAME}/index.js --bundle-output ./${BUNDLE_DIR_NAME}/index.bundle --assets-dest ./${BUNDLE_DIR_NAME} --dev false`,
      {stdio: 'inherit'})
  }

  async perfWrap (callback, args?) {
    isBuildingStyles = {} // 清空
    // 后期可以优化，不编译全部
    const t0 = performance.now()
    await callback(args)
    const t1 = performance.now()
    printLog(processTypeEnum.COMPILE, `编译完成，花费${Math.round(t1 - t0)} ms`)
    console.log()
  }

  watchFiles () {
    const watcher = chokidar.watch(path.join(this.sourceDir), {
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
        const relativePath = path.relative(this.appPath, filePath)
        printLog(processTypeEnum.CREATE, '添加文件', relativePath)
        this.perfWrap(this.buildTemp.bind(this))
      })
      .on('change', filePath => {
        const relativePath = path.relative(this.appPath, filePath)
        printLog(processTypeEnum.MODIFY, '文件变动', relativePath)
        if (REG_SCRIPTS.test(filePath)) {
          this.perfWrap(this.processFile.bind(this), filePath)
        }
        if (REG_STYLE.test(filePath)) {
          _.forIn(depTree, (styleFiles, jsFilePath) => {
            if (styleFiles.indexOf(filePath) > -1) {
              this.perfWrap(this.processFile.bind(this), jsFilePath)
            }
          })
        }
      })
      .on('unlink', filePath => {
        const relativePath = path.relative(this.appPath, filePath)
        printLog(processTypeEnum.UNLINK, '删除文件', relativePath)
        this.perfWrap(this.buildTemp.bind(this))
      })
      .on('error', error => console.log(`Watcher error: ${error}`))
  }
}

function hasRNDep (appPath) {
  const pkgJson = require(path.join(appPath, 'package.json'))
  return Boolean(pkgJson.dependencies['react-native'])
}

function updatePkgJson (appPath) {
  const version = getPkgVersion()
  const RNDep = `{
    "@tarojs/components-rn": "^${version}",
    "@tarojs/taro-rn": "^${version}",
    "@tarojs/taro-router-rn": "^${version}",
    "@tarojs/taro-redux-rn": "^${version}",
    "react": "16.8.0",
    "react-native": "0.59.9",
    "redux": "^4.0.0",
    "tslib": "^1.8.0"
  }
  `
  return new Promise((resolve, reject) => {
    const pkgJson = require(path.join(appPath, 'package.json'))
    // 未安装 RN 依赖,则更新 pkgjson,并重新安装依赖
    if (!hasRNDep(appPath)) {
      pkgJson.dependencies = Object.assign({}, pkgJson.dependencies, JSON.parse(RNDep.replace(/(\r\n|\n|\r|\s+)/gm, '')))
      fs.writeFileSync(path.join(appPath, 'package.json'), JSON.stringify(pkgJson, null, 2))
      printLog(processTypeEnum.GENERATE, 'package.json', path.join(appPath, 'package.json'))
      installDep(appPath).then(() => {
        resolve()
      })
    } else {
      resolve()
    }
  })
}

function installDep (path: string) {
  return new Promise((resolve, reject) => {
    console.log()
    console.log(chalk.yellow('开始安装依赖~'))
    process.chdir(path)
    let command
    if (shouldUseYarn()) {
      command = 'yarn'
    } else if (shouldUseCnpm()) {
      command = 'cnpm install'
    } else {
      command = 'npm install'
    }
    exec(command, (err, stdout, stderr) => {
      if (err) reject()
      else {
        console.log(stdout)
        console.log(stderr)
      }
      resolve()
    })
  })
}

export { Compiler }

export async function build (appPath: string, buildConfig: IBuildOptions) {
  const {watch, port} = buildConfig
  process.env.TARO_ENV = BUILD_TYPES.RN
  await checkCliAndFrameworkVersion(appPath, BUILD_TYPES.RN)
  const compiler = new Compiler(appPath)
  fs.ensureDirSync(compiler.tempPath)
  const t0 = performance.now()

  if (!hasRNDep(appPath)) {
    await updatePkgJson(appPath)
  }
  try {
    await compiler.buildTemp()
  } catch (e) {
    throw e
  }
  const t1 = performance.now()
  printLog(processTypeEnum.COMPILE, `编译完成，花费${Math.round(t1 - t0)} ms`)
  // rn 配置添加onlyTaroToRn字段,支持项目构建只编译不打包
  if (compiler.rnConfig.onlyTaroToRn) return
  if (watch) {
    compiler.watchFiles()
    if (!compiler.hasJDReactOutput) {
      startServerInNewWindow({port, appPath})
    }
  } else {
    compiler.buildBundle()
  }
}

/**
 * @description run packager server
 * copy from react-native/local-cli/runAndroid/runAndroid.js
 */
function startServerInNewWindow ({port = 8081, appPath}) {
  // set up OS-specific filenames and commands
  const isWindows = /^win/.test(process.platform)
  const scriptFile = isWindows
    ? 'launchPackager.bat'
    : 'launchPackager.command'
  const packagerEnvFilename = isWindows ? '.packager.bat' : '.packager.env'
  const portExportContent = isWindows
    ? `set RCT_METRO_PORT=${port}`
    : `export RCT_METRO_PORT=${port}`

  // set up the launchpackager.(command|bat) file
  const scriptsDir = path.resolve(appPath, './node_modules', 'react-native', 'scripts')
  const launchPackagerScript = path.resolve(scriptsDir, scriptFile)
  const procConfig: SpawnSyncOptions = {cwd: scriptsDir}
  const terminal = process.env.REACT_TERMINAL

  // set up the .packager.(env|bat) file to ensure the packager starts on the right port
  const packagerEnvFile = path.join(
    appPath,
    'node_modules',
    'react-native',
    'scripts',
    packagerEnvFilename
  )

  // ensure we overwrite file by passing the 'w' flag
  fs.writeFileSync(packagerEnvFile, portExportContent, {
    encoding: 'utf8',
    flag: 'w'
  })

  if (process.platform === 'darwin') {
    if (terminal) {
      return spawnSync(
        'open',
        ['-a', terminal, launchPackagerScript],
        procConfig
      )
    }
    return spawnSync('open', [launchPackagerScript], procConfig)
  } else if (process.platform === 'linux') {
    if (terminal) {
      return spawn(
        terminal,
        ['-e', 'sh ' + launchPackagerScript],
        procConfig
      )
    }
    return spawn('sh', [launchPackagerScript], procConfig)
  } else if (/^win/.test(process.platform)) {
    procConfig.stdio = 'ignore'
    return spawn(
      'cmd.exe',
      ['/C', launchPackagerScript],
      procConfig
    )
  } else {
    console.log(
      chalk.red(
        `Cannot start the packager. Unknown platform ${process.platform}`
      )
    )
  }
}
