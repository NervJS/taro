const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const glob = require('glob')
const chalk = require('chalk')
const chokidar = require('chokidar')
const _ = require('lodash')
const Util = require('./util')
const CONFIG = require('./config')
const {
  buildEntry,
  buildPages,
  build: buildWeapp,
  buildSinglePage,
  getRealComponentsPathList,
  buildDepComponents,
  buildSingleComponent,
  compileDepScripts,
  compileDepStyles,
  isFileToBePage,
  getHasBeenBuiltComponents,
  spliceHasBeenBuiltComponents,
  getDependencyTree,
  getAppConfig,
  setAppConfig,
  getComponentsNamedMap,
  setEnv,
  resetIsBuildingScripts,
  resetIsBuildingStyles
} = require('./weapp')

const appPath = process.cwd()
const PLUGIN_ROOT = 'plugin/'
const DOC_ROOT = 'doc/'
const NPM_DIR = 'npm/'
const PLUGIN_JSON = 'plugin.json'
const configDir = require(path.join(appPath, Util.PROJECT_CONFIG))(_.merge)
const sourceDirName = configDir.sourceRoot || CONFIG.SOURCE_DIR
const outputDirName = configDir.outputRoot || CONFIG.OUTPUT_DIR
const srcPath = path.join(appPath, sourceDirName)
const outputPath = path.join(appPath, outputDirName)
const pluginDir = path.join(srcPath, PLUGIN_ROOT)
const pluginPath = path.join(appPath, PLUGIN_ROOT)
const docDir = path.join(pluginDir, DOC_ROOT)
const docPath = path.join(appPath, DOC_ROOT)
const isWindows = os.platform() === 'win32'
let isCopyingFiles = {}
let buildAdapter = Util.BUILD_TYPES.WEAPP
let outputFilesTypes = Util.MINI_APP_FILES[buildAdapter]
const entryFilePath = Util.resolveScriptPath(path.join(srcPath, CONFIG.ENTRY))
const entryFileName = path.basename(entryFilePath)

function build ({ watch, platform }) {
  setEnv(watch)
  switch (platform) {
    case Util.BUILD_TYPES.WEAPP:
      buildWxPlugin({ watch })
      break
    default:
      console.log(chalk.red('输入插件类型错误，目前只支持 weapp 插件类型'))
      break
  }
}

function compilePluginJson (pluginJson, pluginPath) {
  if (typeof pluginJson.main === 'string') {
    pluginJson.main = pluginJson.main.replace(/.tsx$/, '.js')
  }
  fs.writeJSONSync(pluginPath, pluginJson)
}

function wxPluginWatchFiles () {
  console.log()
  console.log(chalk.gray('监听文件修改中...'))
  console.log()
  resetIsBuildingScripts()
  resetIsBuildingStyles()
  isCopyingFiles = {}

  const watcher = chokidar.watch(srcPath, {
    ignored: /(^|[/\\])\../,
    persistent: true,
    ignoreInitial: true
  })
  watcher
    .on('addDir', dirPath => {
      console.log(dirPath)
    })
    .on('add', filePath => {
      console.log(filePath)
    })
    .on('change', async filePath => {
      let outputFilePath
      if (filePath.includes(docDir)) {
        outputFilePath = filePath.replace(docDir, docPath)
      } else if (filePath.includes(pluginDir)) {
        outputFilePath = filePath.replace(pluginDir, pluginPath)
      } else {
        outputFilePath = filePath.replace(srcPath, outputPath)
      }

      const extname = path.extname(filePath)
      if (Util.REG_SCRIPT.test(extname) || Util.REG_TYPESCRIPT.test(extname)) {
        const pluginJsonPath = path.join(pluginDir, PLUGIN_JSON)
        if (!fs.existsSync(pluginDir) || !fs.existsSync(pluginJsonPath)) {
          return console.log(chalk.red('缺少 plugin.json!'))
        }
        const pluginJson = fs.readJSONSync(pluginJsonPath)
        const pages = pluginJson.pages
        const main = pluginJson.main || ''

        if (entryFilePath === filePath) {
          Util.printLog(Util.pocessTypeEnum.MODIFY, '入口文件', `${sourceDirName}/${entryFileName}.js`)
          const config = await buildEntry()
          const appConfig = getAppConfig()
          // TODO 此处待优化
          if ((Util.checksum(JSON.stringify(config.pages)) !== Util.checksum(JSON.stringify(appConfig.pages))) ||
            (Util.checksum(JSON.stringify(config.subPackages || config.subpackages || {})) !== Util.checksum(JSON.stringify(appConfig.subPackages || appConfig.subpackages || {})))) {
            setAppConfig(config)
            await buildPages()
          }
        } else if (isWxPluginPage(Object.values(pages), filePath) || isFileToBePage(filePath)) {
          filePath = filePath.replace(extname, '')
          filePath = filePath.replace(path.join(srcPath) + path.sep, '')
          filePath = filePath.split(path.sep).join('/')
          Util.printLog(Util.pocessTypeEnum.MODIFY, '页面文件', `${sourceDirName}/${filePath}`)
          await buildSinglePage(filePath)
        } else if (isWxPluginComp(getHasBeenBuiltComponents(), filePath)) {
          let outoutShowFilePath = filePath.replace(appPath + path.sep, '')
          outoutShowFilePath = outoutShowFilePath.split(path.sep).join('/')
          Util.printLog(Util.pocessTypeEnum.MODIFY, '组件文件', outoutShowFilePath)

          const hasbeenBuiltIndex = getHasBeenBuiltComponents().indexOf(filePath)
          spliceHasBeenBuiltComponents(hasbeenBuiltIndex)

          const componentsNamedMap = getComponentsNamedMap()
          if (isWindows) {
            await new Promise((resolve, reject) => {
              setTimeout(async () => {
                await buildSingleComponent(Object.assign({
                  path: filePath
                }, componentsNamedMap[filePath]))
                resolve()
              }, 300)
            })
          } else {
            await buildSingleComponent(Object.assign({
              path: filePath
            }, componentsNamedMap[filePath]))
          }
        } else {
          const dependencyTree = getDependencyTree()
          let isImported = false
          for (const key in dependencyTree) {
            const scripts = dependencyTree[key].script || []
            if (scripts.indexOf(filePath) >= 0) {
              isImported = true
            }
          }

          let modifySource = filePath.replace(appPath + path.sep, '')
          modifySource = modifySource.split(path.sep).join('/')

          if (isImported || filePath.includes(path.join(pluginDir, main))) {
            Util.printLog(Util.pocessTypeEnum.MODIFY, 'JS文件', modifySource)
            await Promise.all(compileDepScripts([filePath], true))
          } else {
            Util.printLog(Util.pocessTypeEnum.WARNING, 'JS文件', `${modifySource} 没有被引用到，不会被编译`)
          }
        }
      } else if (Util.REG_STYLE.test(extname)) {
        const dependencyTree = getDependencyTree()
        const includeStyleJSPath = []
        for (const key in dependencyTree) {
          const styles = dependencyTree[key]['style'] || []
          styles.forEach(item => {
            if (item === filePath) {
              includeStyleJSPath.push({
                filePath: key,
                styles
              })
            }
          })
        }

        if (includeStyleJSPath.length) {
          await Promise.all(includeStyleJSPath.map(async item => {
            let outputWXSSPath = null
            outputWXSSPath = item.filePath.replace(path.extname(item.filePath), outputFilesTypes.STYLE)
            let modifySource = outputWXSSPath.replace(appPath + path.sep, '')
            modifySource = modifySource.split(path.sep).join('/')
            Util.printLog(Util.pocessTypeEnum.MODIFY, '样式文件', modifySource)

            outputWXSSPath = outputWXSSPath.replace(srcPath, outputPath)
            if (isWindows) {
              await new Promise((resolve, reject) => {
                setTimeout(async () => {
                  await compileDepStyles(outputWXSSPath, item.styles)
                  resolve()
                }, 300)
              })
            } else {
              await compileDepStyles(outputWXSSPath, item.styles)
            }

            let modifyOutput = outputWXSSPath.replace(appPath + path.sep, '')
            modifyOutput = modifyOutput.split(path.sep).join('/')
            Util.printLog(Util.pocessTypeEnum.GENERATE, '样式文件', modifyOutput)
          }))
        } else {
          let outputWXSSPath = filePath.replace(path.extname(filePath), outputFilesTypes.STYLE)
          let modifySource = outputWXSSPath.replace(appPath + path.sep, '')
          modifySource = modifySource.split(path.sep).join('/')
          Util.printLog(Util.pocessTypeEnum.MODIFY, '样式文件', modifySource)
          outputWXSSPath = outputWXSSPath.replace(srcPath, outputPath)
          if (isWindows) {
            await new Promise((resolve, reject) => {
              setTimeout(async () => {
                await compileDepStyles(outputWXSSPath, [filePath], false)
                resolve()
              }, 300)
            })
          } else {
            await compileDepStyles(outputWXSSPath, [filePath], false)
          }
          let modifyOutput = outputWXSSPath.replace(appPath + path.sep, '')
          modifyOutput = modifyOutput.split(path.sep).join('/')
          Util.printLog(Util.pocessTypeEnum.GENERATE, '样式文件', modifyOutput)
        }
      } else {
        if (isCopyingFiles[outputFilePath]) return
        isCopyingFiles[outputFilePath] = true

        let modifyOutput = outputFilePath.replace(appPath + path.sep, '')
        modifyOutput = modifyOutput.split(path.sep).join('/')
        Util.printLog(Util.pocessTypeEnum.COPY, '文件', modifyOutput)

        if (!fs.existsSync(filePath)) {
          let modifySrc = filePath.replace(appPath + path.sep, '')
          modifySrc = modifySrc.split(path.sep).join('/')
          Util.printLog(Util.pocessTypeEnum.ERROR, '文件', `${modifySrc} 不存在`)
        } else {
          fs.ensureDir(path.dirname(outputFilePath))
          if (filePath === outputFilePath) {
            return
          }
          fs.copySync(filePath, outputFilePath)
        }
      }

      // 如果 output/plugin 里有新编译出的文件，
      // 先把 js 里对 npm 的引用修改，然后把所有文件迁移到插件目录
      // 最后删除 output/plugin
      const names = glob.sync(`${outputPath}/${PLUGIN_ROOT}/**/*`)
      if (names.length) {
        const jsNames = glob.sync(`${outputPath}/${PLUGIN_ROOT}/!(npm)/**/*.js`)
        const ioPromises = jsNames.map(async name => {
          let content = await fs.readFile(name)
          content = content.toString()
          let shouldWrite
          const replacement = content.replace(/['|"](\.\.\/)+npm\/.+?['|"]/g, str => {
            shouldWrite = true
            return str.replace('../', '')
          })
          if (shouldWrite) await fs.writeFile(name, replacement)
        })
        await Promise.all(ioPromises)

        await Promise.all(names.map(async from => {
          if (fs.existsSync(from) && fs.statSync(from).isFile()) {
            const to = from.replace(outputPath, appPath)
            fs.ensureDirSync(path.dirname(to))
            await fs.copyFile(from, to)
          }
        }))
        const tempPluginPath = path.join(outputPath, PLUGIN_ROOT)
        Util.emptyDirectory(tempPluginPath)
        fs.rmdirSync(tempPluginPath)
      }
      // 迁移 npm 到 plugin 目录
      Util.emptyDirectory(path.join(pluginPath, NPM_DIR))
      // fs.rmdirSync(tempPluginPath)
      fs.copySync(path.join(outputPath, NPM_DIR), path.join(pluginPath, NPM_DIR))

      resetIsBuildingScripts()
      resetIsBuildingStyles()
      isCopyingFiles = {}
    })
}

function isWxPluginPage (pages, filePath) {
  return pages.findIndex(page => filePath.includes(page)) >= 0
}

function isWxPluginComp (components, filePath) {
  return components.indexOf(filePath) >= 0
}

async function buildWxPlugin ({ watch }) {
  fs.existsSync(pluginPath) && Util.emptyDirectory(pluginPath)
  fs.existsSync(docPath) && Util.emptyDirectory(docPath)
  // 编译调试项目
  await buildWeapp({ adapter: Util.BUILD_TYPES.WEAPP, envHasBeenSet: true })

  const pluginJsonPath = path.join(pluginDir, PLUGIN_JSON)
  if (!fs.existsSync(pluginDir) || !fs.existsSync(pluginJsonPath)) {
    return console.log(chalk.red('缺少 plugin.json!'))
  }
  const pluginJson = fs.readJSONSync(pluginJsonPath)
  const components = pluginJson.publicComponents
  const pages = pluginJson.pages
  const main = pluginJson.main

  // 编译插件页面
  if (pages && Object.keys(pages).length) {
    Util.printLog(Util.pocessTypeEnum.COMPILE, '插件页面')
    const pagesPromises = Object.values(pages).map(page => buildSinglePage(path.join(PLUGIN_ROOT, page)))
    await Promise.all(pagesPromises)
  }

  // 编译插件组件
  if (components && Object.keys(components).length) {
    Util.printLog(Util.pocessTypeEnum.COMPILE, '插件组件')
    const componentList = []
    for (let component in components) {
      const componentPath = components[component]
      componentList.push({
        path: /^(\.|\/)/.test(componentPath) ? componentPath : '.' + path.sep + componentPath,
        name: component,
        type: 'default'
      })
    }
    const realComponentsPathList = getRealComponentsPathList(pluginJsonPath, componentList)
    await buildDepComponents(realComponentsPathList)
  }

  // 编译插件 main.js
  if (main) {
    Util.printLog(Util.pocessTypeEnum.COMPILE, '插件 JS')
    await Promise.all(compileDepScripts([path.join(pluginDir, main)], true))
  }

  // 把 plugin 目录挪到根目录
  fs.moveSync(path.join(outputPath, PLUGIN_ROOT), pluginPath)
  // 把 npm 拷贝一份到 plugin 目录
  fs.copySync(path.join(outputPath, NPM_DIR), path.join(pluginPath, NPM_DIR))
  // 把 doc 目录拷贝到根目录
  fs.existsSync(docDir) && fs.copySync(docDir, docPath)
  // 拷贝 plugin.json
  compilePluginJson(pluginJson, path.join(pluginPath, PLUGIN_JSON))

  // plugin 文件夹内对 npm 的引用路径修改
  const names = glob.sync('plugin/!(npm)/**/*.js')
  const ioPromises = names.map(async name => {
    let content = await fs.readFile(name)
    content = content.toString()
    let shouldWrite
    const replacement = content.replace(/['|"](\.\.\/)+npm\/.+?['|"]/g, str => {
      shouldWrite = true
      return str.replace('../', '')
    })
    if (shouldWrite) await fs.writeFile(path.join(appPath, name), replacement)
  })
  await Promise.all(ioPromises)

  watch && wxPluginWatchFiles()
}

module.exports = {
  build
}
