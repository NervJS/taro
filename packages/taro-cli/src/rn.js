const fs = require('fs-extra')
const path = require('path')
const {performance} = require('perf_hooks')
const chokidar = require('chokidar')
const chalk = require('chalk')
const vfs = require('vinyl-fs')
const ejs = require('ejs')
const Vinyl = require('vinyl')
const through2 = require('through2')
const _ = require('lodash')
const shelljs = require('shelljs')

const Util = require('./util')
const npmProcess = require('./util/npm')
const CONFIG = require('./config')
const {getPkgVersion} = require('./util')
const StyleProcess = require('./rn/styleProcess')
const {transformJSCode} = require('./rn/transformJS')

const appPath = process.cwd()
const projectConfig = require(path.join(appPath, Util.PROJECT_CONFIG))(_.merge)
const sourceDirName = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
const sourceDir = path.join(appPath, sourceDirName)
const tempDir = '.rn_temp'
const tempPath = path.join(appPath, tempDir)
const entryFilePath = Util.resolveScriptPath(path.join(sourceDir, CONFIG.ENTRY))
const entryFileName = path.basename(entryFilePath)
const pluginsConfig = projectConfig.plugins || {}

const pkgPath = path.join(__dirname, './rn/pkg')

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
    Util.printLog(Util.pocessTypeEnum.COMPILE, _.camelCase(fileExt).toUpperCase(), filePath)
    return StyleProcess.loadStyle({filePath, pluginsConfig})
  })).then(resList => { // postcss
    return Promise.all(resList.map(item => {
      return StyleProcess.postCSS({...item, projectConfig})
    }))
  }).then(resList => {
    let styleObjectEntire = {}
    resList.forEach(item => {
      let styleObject = StyleProcess.getStyleObject(item.css)
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

function initProjectFile (cb) {
  // generator app.json
  const appJsonObject = Object.assign({}, projectConfig.rn && projectConfig.rn.appJson, {
    expo: {
      sdkVersion: '27.0.0'
    }
  })
  const appJson = new Vinyl({
    path: 'app.json',
    contents: Buffer.from(JSON.stringify(appJsonObject, null, 2))
  })
  // generator .${tempPath}/package.json TODO JSON.parse 这种写法可能会有隐患
  const pkgTempObj = JSON.parse(
    ejs.render(
      fs.readFileSync(pkgPath, 'utf-8'), {
        projectName: projectConfig.projectName,
        version: getPkgVersion()
      }
    ).replace(/(\r\n|\n|\r|\s+)/gm, '')
  )
  const dependencies = require(path.join(process.cwd(), 'package.json')).dependencies
  pkgTempObj.dependencies = Object.assign({}, pkgTempObj.dependencies, dependencies)
  const pkg = new Vinyl({
    path: 'package.json',
    contents: Buffer.from(JSON.stringify(pkgTempObj, null, 2))
  })
  // Copy bin/crna-entry.js ?
  const crnaEntryPath = path.join(path.dirname(npmProcess.resolveNpmSync('@tarojs/rn-runner')), 'src/bin/crna-entry.js')
  const crnaEntryCode = fs.readFileSync(crnaEntryPath).toString()
  const crnaEntry = new Vinyl({
    path: 'bin/crna-entry.js',
    contents: Buffer.from(crnaEntryCode)
  })
  this.push(appJson)
  Util.printLog(Util.pocessTypeEnum.GENERATE, 'app.json', path.join(tempPath, 'app.json'))
  this.push(pkg)
  Util.printLog(Util.pocessTypeEnum.GENERATE, 'package.json', path.join(tempPath, 'package.json'))
  this.push(crnaEntry)
  Util.printLog(Util.pocessTypeEnum.COPY, 'crna-entry.js', path.join(tempPath, 'bin/crna-entry.js'))
  cb()
}

function buildTemp () {
  // fs.emptyDirSync(tempPath)
  fs.ensureDirSync(path.join(tempPath, 'bin'))
  return new Promise((resolve, reject) => {
    vfs.src(path.join(sourceDir, '**'))
      .pipe(through2.obj(async function (file, enc, cb) {
        if (file.isNull() || file.isStream()) {
          return cb(null, file)
        }
        const filePath = file.path
        let code = file.contents.toString()
        if (Util.REG_STYLE.test(filePath)) {
          return cb()
        }
        if (Util.REG_SCRIPTS.test(filePath)) {
          if (Util.REG_TYPESCRIPT.test(filePath)) {
            file.path = file.path.replace(/\.(tsx|ts)(\?.*)?$/, '.js')
          }
          Util.printLog(Util.pocessTypeEnum.COMPILE, _.camelCase(path.extname(filePath)).toUpperCase(), filePath)
          // transformJSCode
          let transformResult = transformJSCode({code, filePath, isEntryFile: isEntryFile(filePath), projectConfig})
          const jsCode = transformResult.code
          const styleFiles = transformResult.styleFiles
          // compileDepStyles
          await compileDepStyles(filePath, styleFiles)
          file.contents = Buffer.from(jsCode)
        }
        this.push(file)
        cb()
      }, initProjectFile))
      .pipe(vfs.dest(path.join(tempPath)))
      .on('end', () => {
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
  }).catch(e => {
    throw e
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

async function processFiles (filePath) {
  isBuildingStyles = {} // 清空
  // 后期可以优化，不编译全部
  let t0 = performance.now()
  await buildTemp()
  let t1 = performance.now()
  Util.printLog(Util.pocessTypeEnum.COMPILE, `编译完成，花费${Math.round(t1 - t0)} ms`)
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
      Util.printLog(Util.pocessTypeEnum.CREATE, '添加文件', relativePath)
      processFiles(filePath)
    })
    .on('change', filePath => {
      const relativePath = path.relative(appPath, filePath)
      Util.printLog(Util.pocessTypeEnum.MODIFY, '文件变动', relativePath)
      processFiles(filePath)
    })
    .on('unlink', filePath => {
      const relativePath = path.relative(appPath, filePath)
      Util.printLog(Util.pocessTypeEnum.UNLINK, '删除文件', relativePath)
      processFiles(filePath)
    })
    .on('error', error => console.log(`Watcher error: ${error}`))
}

async function build ({watch}) {
  fs.ensureDirSync(tempPath)
  let t0 = performance.now()
  await buildTemp()
  let t1 = performance.now()
  Util.printLog(Util.pocessTypeEnum.COMPILE, `编译完成，花费${Math.round(t1 - t0)} ms`)
  await buildDist({watch})
  if (watch) {
    watchFiles()
  }
}

module.exports = {build}
