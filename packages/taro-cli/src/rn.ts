import * as fs from 'fs-extra'
import * as path from 'path'
import { exec, spawn, spawnSync, execSync, SpawnSyncOptions } from 'child_process'
import { performance } from 'perf_hooks'
import * as chokidar from 'chokidar'
import chalk from 'chalk'
import * as ejs from 'ejs'
import * as _ from 'lodash'
import * as klaw from 'klaw'

import * as Util from './util'
import CONFIG from './config'
import * as StyleProcess from './rn/styleProcess'
import { parseJSCode as transformJSCode } from './rn/transformJS'
import { PROJECT_CONFIG, processTypeEnum, REG_STYLE, REG_SCRIPTS, REG_TYPESCRIPT, BUILD_TYPES } from './util/constants'
import { convertToJDReact } from './jdreact/convert_to_jdreact'
import { IBuildConfig } from './util/types'

const pkgTmpl = `{
  "name":"<%= projectName %>",
  "dependencies": {
    "@tarojs/components-rn": "^<%= version %>",
    "@tarojs/taro-rn": "^<%= version %>",
    "@tarojs/taro-router-rn": "^<%= version %>",
    "@tarojs/taro-redux-rn": "^<%= version %>",
    "react": "16.3.1",
    "react-native": "0.55.4",
    "redux": "^4.0.0",
    "tslib": "^1.8.0"
  }
}
`

let isBuildingStyles = {}
let styleDenpendencyTree = {}

const depTree: {
  [key: string]: string[]
} = {}

const TEMP_DIR_NAME = '.rn_temp'
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
  pluginsConfig
  rnConfig
  // pxTransformConfig
  // pathAlias

  constructor (appPath) {
    this.appPath = appPath
    this.tempPath = path.join(appPath, TEMP_DIR_NAME)
    this.projectConfig = require(path.join(appPath, PROJECT_CONFIG))(_.merge)
    const sourceDirName = this.projectConfig.sourceRoot || CONFIG.SOURCE_DIR
    this.sourceDir = path.join(appPath, sourceDirName)
    this.entryFilePath = Util.resolveScriptPath(path.join(this.sourceDir, CONFIG.ENTRY))
    this.entryFileName = path.basename(this.entryFilePath)
    this.entryBaseName = path.basename(this.entryFilePath, path.extname(this.entryFileName))
    this.pluginsConfig = this.projectConfig.plugins || {}
    this.rnConfig = this.projectConfig.rn || {}
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
      Util.printLog(processTypeEnum.COMPILE, _.camelCase(fileExt).toUpperCase(), filePath)
      return StyleProcess.loadStyle({filePath, pluginsConfig: this.pluginsConfig}, this.appPath)
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
      name: _.camelCase(require(path.join(process.cwd(), 'package.json')).name)
    }, this.rnConfig.appJson)
    // generator .${tempPath}/package.json TODO JSON.parse 这种写法可能会有隐患
    const pkgTempObj = JSON.parse(
      ejs.render(pkgTmpl, {
          projectName: _.camelCase(this.projectConfig.projectName),
          version: Util.getPkgVersion()
        }
      ).replace(/(\r\n|\n|\r|\s+)/gm, '')
    )
    const dependencies = require(path.join(process.cwd(), 'package.json')).dependencies
    pkgTempObj.dependencies = Object.assign({}, pkgTempObj.dependencies, dependencies)

    const indexJsStr = `
  import {AppRegistry} from 'react-native';
  import App from './${this.entryBaseName}';
  import {name as appName} from './app.json';

  AppRegistry.registerComponent(appName, () => App);`

    fs.writeFileSync(path.join(TEMP_DIR_NAME, 'index.js'), indexJsStr)
    Util.printLog(processTypeEnum.GENERATE, 'index.js', path.join(this.tempPath, 'index.js'))
    fs.writeFileSync(path.join(TEMP_DIR_NAME, 'app.json'), JSON.stringify(appJsonObject, null, 2))
    Util.printLog(processTypeEnum.GENERATE, 'app.json', path.join(this.tempPath, 'app.json'))
    fs.writeFileSync(path.join(TEMP_DIR_NAME, 'package.json'), JSON.stringify(pkgTempObj, null, 2))
    Util.printLog(processTypeEnum.GENERATE, 'package.json', path.join(this.tempPath, 'package.json'))
  }

  async processFile (filePath) {
    if (!fs.existsSync(filePath)) {
      return
    }
    const dirname = path.dirname(filePath)
    const distDirname = dirname.replace(this.sourceDir, TEMP_DIR_NAME)
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
      const transformResult = transformJSCode({
        code, filePath, isEntryFile: this.isEntryFile(filePath), projectConfig: this.projectConfig
      })
      const jsCode = transformResult.code
      fs.ensureDirSync(distDirname)
      fs.writeFileSync(distPath, Buffer.from(jsCode))
      // compileDepStyles
      const styleFiles = transformResult.styleFiles
      depTree[filePath] = styleFiles
      await this.compileDepStyles(filePath, styleFiles)
    } else {
      fs.ensureDirSync(distDirname)
      fs.copySync(filePath, distPath)
      Util.printLog(processTypeEnum.COPY, _.camelCase(path.extname(filePath)).toUpperCase(), filePath)
    }
  }

  /**
   * @description 编译文件，安装依赖
   * @returns {Promise}
   */
  buildTemp () {
    fs.ensureDirSync(path.join(this.tempPath, 'bin'))
    return new Promise((resolve, reject) => {
      klaw(this.sourceDir)
        .on('data', file => {
          if (!file.stats.isDirectory()) {
            this.processFile(file.path)
          }
        })
        .on('end', () => {
          this.initProjectFile()
          if (!fs.existsSync(path.join(this.tempPath, 'node_modules'))) {
            console.log()
            console.log(chalk.yellow('开始安装依赖~'))
            process.chdir(this.tempPath)
            let command
            if (Util.shouldUseYarn()) {
              command = 'yarn'
            } else if (Util.shouldUseCnpm()) {
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
          } else {
            resolve()
          }
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
      `node node_modules/react-native/local-cli/cli.js bundle --entry-file ./index.js --bundle-output ./${BUNDLE_DIR_NAME}/index.bundle --assets-dest ./${BUNDLE_DIR_NAME}`,
      {stdio: 'inherit'})
  }

  async perfWrap (callback, args?) {
    isBuildingStyles = {} // 清空
    // 后期可以优化，不编译全部
    const t0 = performance.now()
    await callback(args)
    const t1 = performance.now()
    Util.printLog(processTypeEnum.COMPILE, `编译完成，花费${Math.round(t1 - t0)} ms`)
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
        Util.printLog(processTypeEnum.CREATE, '添加文件', relativePath)
        this.perfWrap(this.buildTemp.bind(this))
      })
      .on('change', filePath => {
        const relativePath = path.relative(this.appPath, filePath)
        Util.printLog(processTypeEnum.MODIFY, '文件变动', relativePath)
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
        Util.printLog(processTypeEnum.UNLINK, '删除文件', relativePath)
        this.perfWrap(this.buildTemp.bind(this))
      })
      .on('error', error => console.log(`Watcher error: ${error}`))
  }
}

export { Compiler }

export async function build (appPath: string, buildConfig: IBuildConfig) {
  const tempPath = path.join(appPath, TEMP_DIR_NAME)
  const {watch} = buildConfig
  process.env.TARO_ENV = BUILD_TYPES.RN
  fs.ensureDirSync(tempPath)
  const compiler = new Compiler(appPath)
  const t0 = performance.now()
  await compiler.buildTemp()
  const t1 = performance.now()
  Util.printLog(processTypeEnum.COMPILE, `编译完成，花费${Math.round(t1 - t0)} ms`)

  if (watch) {
    compiler.watchFiles()
    startServerInNewWindow({tempPath})
  } else {
    compiler.buildBundle()
  }
}

/**
 * @description run packager server
 * copy from react-native/local-cli/runAndroid/runAndroid.js
 */
function startServerInNewWindow ({port = 8081,tempPath}) {
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
  const scriptsDir = path.resolve(tempPath, './node_modules', 'react-native', 'scripts')
  const launchPackagerScript = path.resolve(scriptsDir, scriptFile)
  const procConfig: SpawnSyncOptions = {cwd: scriptsDir}
  const terminal = process.env.REACT_TERMINAL

  // set up the .packager.(env|bat) file to ensure the packager starts on the right port
  const packagerEnvFile = path.join(
    tempPath,
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
