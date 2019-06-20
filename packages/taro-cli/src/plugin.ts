import * as fs from 'fs-extra'
import * as path from 'path'
import * as glob from 'glob'
import chalk from 'chalk'
import * as chokidar from 'chokidar'
import * as _ from 'lodash'

import * as Util from './util'
import {
  BUILD_TYPES,
  REG_SCRIPT,
  REG_STYLE,
  REG_FONT,
  REG_IMAGE,
  REG_MEDIA,
  REG_TYPESCRIPT,
  processTypeEnum,
  isWindows
} from './util/constants'

import { buildEntry } from './mini/entry'
import { buildPages, buildSinglePage } from './mini/page'
import { build as buildWeapp } from './mini'
import {
  getRealComponentsPathList,
  isFileToBePage,
  isComponentHasBeenBuilt,
  deleteHasBeenBuiltComponent,
  getDependencyTree,
  getBuildData,
  setAppConfig,
  setIsProduction,
  setBuildData
} from './mini/helper'
import { buildDepComponents, buildSingleComponent, getComponentsNamedMap } from './mini/component'
import { compileDepScripts, initCompileScripts } from './mini/compileScript'
import { compileDepStyles, initCompileStyles } from './mini/compileStyle'
import { IBuildConfig } from './util/types'

const PLUGIN_ROOT = 'plugin/'
const DOC_ROOT = 'doc/'
const NPM_DIR = 'npm/'
const PLUGIN_JSON = 'plugin.json'
const PLUGIN_MOCK_JSON = 'plugin-mock.json'

let isCopyingFiles = {}

export async function build (appPath: string, { watch, platform }: IBuildConfig) {
  switch (platform) {
    case BUILD_TYPES.WEAPP:
      buildWxPlugin(appPath, { watch })
      break
    case BUILD_TYPES.ALIPAY:
      await buildWeapp(appPath, { watch, adapter: BUILD_TYPES.ALIPAY })
      buildAlipayPlugin()
      break
    default:
      console.log(chalk.red('输入插件类型错误，目前只支持 weapp/alipay 插件类型'))
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
  initCompileScripts()
  initCompileStyles()
  isCopyingFiles = {}

  const {
    appPath,
    sourceDirName,
    sourceDir,
    outputDir,
    outputFilesTypes,
    entryFilePath,
    entryFileName,
    appConfig
  } = getBuildData()
  const pluginDir = path.join(sourceDir, PLUGIN_ROOT)
  const pluginPath = path.join(appPath, PLUGIN_ROOT)
  const docDir = path.join(pluginDir, DOC_ROOT)
  const docPath = path.join(appPath, DOC_ROOT)

  const watcher = chokidar.watch(sourceDir, {
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
        outputFilePath = filePath.replace(sourceDir, outputDir)
      }

      const extname = path.extname(filePath)
      if (REG_SCRIPT.test(extname) || REG_TYPESCRIPT.test(extname)) {
        const pluginJsonPath = path.join(pluginDir, PLUGIN_JSON)
        if (!fs.existsSync(pluginDir) || !fs.existsSync(pluginJsonPath)) {
          return console.log(chalk.red('缺少 plugin.json!'))
        }
        const pluginJson = fs.readJSONSync(pluginJsonPath)
        const pages = pluginJson.pages
        const main = pluginJson.main || ''

        if (entryFilePath === filePath) {
          Util.printLog(processTypeEnum.MODIFY, '入口文件', `${sourceDirName}/${entryFileName}.js`)
          const config = await buildEntry()
          // TODO 此处待优化
          if ((Util.checksum(JSON.stringify(config.pages)) !== Util.checksum(JSON.stringify(appConfig.pages))) ||
            (Util.checksum(JSON.stringify(config.subPackages || config['subpackages'] || {})) !== Util.checksum(JSON.stringify(appConfig.subPackages || appConfig['subpackages'] || {})))) {
            setAppConfig(config)
            await buildPages()
          }
        } else if (isWxPluginPage(Object.values(pages), filePath) || isFileToBePage(filePath)) {
          filePath = filePath.replace(extname, '')
          filePath = filePath.replace(path.join(sourceDir) + path.sep, '')
          filePath = filePath.split(path.sep).join('/')
          Util.printLog(processTypeEnum.MODIFY, '页面文件', `${sourceDirName}/${filePath}`)
          await buildSinglePage(filePath)
        } else if (isComponentHasBeenBuilt(filePath)) {
          let outputShowFilePath = filePath.replace(appPath + path.sep, '')
          outputShowFilePath = outputShowFilePath.split(path.sep).join('/')
          Util.printLog(processTypeEnum.MODIFY, '组件文件', outputShowFilePath)
          deleteHasBeenBuiltComponent(filePath)
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
          dependencyTree.forEach(dependencyTreeItem => {
            const scripts = dependencyTreeItem.script || []
            if (scripts.indexOf(filePath) >= 0) {
              isImported = true
            }
          })

          let modifySource = filePath.replace(appPath + path.sep, '')
          modifySource = modifySource.split(path.sep).join('/')

          if (isImported || filePath.includes(path.join(pluginDir, main))) {
            Util.printLog(processTypeEnum.MODIFY, 'JS文件', modifySource)
            await Promise.all(compileDepScripts([filePath], true, true))
          } else {
            Util.printLog(processTypeEnum.WARNING, 'JS文件', `${modifySource} 没有被引用到，不会被编译`)
          }
        }
      } else if (REG_STYLE.test(extname)) {
        const dependencyTree = getDependencyTree()
        const includeStyleJSPath: { filePath: string, styles: any[] }[] = []
        dependencyTree.forEach((dependencyTreeItem, key) => {
          const styles = dependencyTreeItem['style'] || []
          styles.forEach(item => {
            if (item === filePath) {
              includeStyleJSPath.push({
                filePath: key,
                styles
              })
            }
          })
        })

        if (includeStyleJSPath.length) {
          await Promise.all(includeStyleJSPath.map(async item => {
            let outputWXSSPath = item.filePath.replace(path.extname(item.filePath), outputFilesTypes.STYLE)
            let modifySource = outputWXSSPath.replace(appPath + path.sep, '')
            modifySource = modifySource.split(path.sep).join('/')
            Util.printLog(processTypeEnum.MODIFY, '样式文件', modifySource)

            outputWXSSPath = outputWXSSPath.replace(sourceDir, outputDir)
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
            Util.printLog(processTypeEnum.GENERATE, '样式文件', modifyOutput)
          }))
        } else {
          let outputWXSSPath = filePath.replace(path.extname(filePath), outputFilesTypes.STYLE)
          let modifySource = outputWXSSPath.replace(appPath + path.sep, '')
          modifySource = modifySource.split(path.sep).join('/')
          Util.printLog(processTypeEnum.MODIFY, '样式文件', modifySource)
          outputWXSSPath = outputWXSSPath.replace(sourceDir, outputDir)
          if (isWindows) {
            await new Promise((resolve, reject) => {
              setTimeout(async () => {
                await compileDepStyles(outputWXSSPath, [filePath])
                resolve()
              }, 300)
            })
          } else {
            await compileDepStyles(outputWXSSPath, [filePath])
          }
          let modifyOutput = outputWXSSPath.replace(appPath + path.sep, '')
          modifyOutput = modifyOutput.split(path.sep).join('/')
          Util.printLog(processTypeEnum.GENERATE, '样式文件', modifyOutput)
        }
      } else {
        if (isCopyingFiles[outputFilePath]) return
        isCopyingFiles[outputFilePath] = true

        let modifyOutput = outputFilePath.replace(appPath + path.sep, '')
        modifyOutput = modifyOutput.split(path.sep).join('/')
        Util.printLog(processTypeEnum.COPY, '文件', modifyOutput)

        if (!fs.existsSync(filePath)) {
          let modifySrc = filePath.replace(appPath + path.sep, '')
          modifySrc = modifySrc.split(path.sep).join('/')
          Util.printLog(processTypeEnum.ERROR, '文件', `${modifySrc} 不存在`)
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
      const names = glob.sync(`${outputDir}/${PLUGIN_ROOT}/**/*`)
      if (names.length) {
        const jsNames = glob.sync(`${outputDir}/${PLUGIN_ROOT}/{,!(npm)/**/}*.js`)
        const ioPromises = jsNames.map(async name => {
          const content = fs.readFileSync(name).toString()

          let isShouldBeWritten
          let replacement = content.replace(/['|"]((\.\.\/)+)npm\/.+?['|"]/g, (str, $1) => {
            isShouldBeWritten = true
            return $1 === '../' ? str.replace('../', './') : str.replace('../', '')
          })

          const REG_PLUGIN_DEPS = RegExp(`['|"](/${PLUGIN_ROOT}.+)['|"]`, 'g')
          replacement = replacement.replace(REG_PLUGIN_DEPS, (str, $1) => {
            if (REG_FONT.test($1) || REG_IMAGE.test($1) || REG_MEDIA.test($1)) {
              return str.replace(RegExp(`^['|"]/${PLUGIN_ROOT}`, 'g'), str => str.replace(`${PLUGIN_ROOT}`, ''))
            }
            return str
          })

          if (isShouldBeWritten) await fs.writeFile(name, replacement)
        })
        await Promise.all(ioPromises)

        await Promise.all(names.map(async from => {
          if (fs.existsSync(from) && fs.statSync(from).isFile()) {
            const to = from.replace(outputDir, appPath)
            fs.ensureDirSync(path.dirname(to))
            await fs.copyFile(from, to)
          }
        }))
        const tempPluginPath = path.join(outputDir, PLUGIN_ROOT)
        Util.emptyDirectory(tempPluginPath)
        fs.rmdirSync(tempPluginPath)
      }
      // 迁移 npm 到 plugin 目录
      Util.emptyDirectory(path.join(pluginPath, NPM_DIR))
      // fs.rmdirSync(tempPluginPath)
      fs.copySync(path.join(outputDir, NPM_DIR), path.join(pluginPath, NPM_DIR))

      initCompileScripts()
      initCompileStyles()
      isCopyingFiles = {}
    })
}

function isWxPluginPage (pages, filePath) {
  return pages.findIndex(page => filePath.includes(page)) >= 0
}

async function buildWxPlugin (appPath, { watch }) {
  const {
    sourceDir,
    outputDir
  } = setBuildData(appPath, BUILD_TYPES.WEAPP)
  const pluginDir = path.join(sourceDir, PLUGIN_ROOT)
  const pluginPath = path.join(appPath, PLUGIN_ROOT)
  const docDir = path.join(pluginDir, DOC_ROOT)
  const docPath = path.join(appPath, DOC_ROOT)

  setIsProduction(process.env.NODE_ENV === 'production' || !watch)

  fs.existsSync(pluginPath) && Util.emptyDirectory(pluginPath)
  fs.existsSync(docPath) && Util.emptyDirectory(docPath)
  // 编译调试项目
  await buildWeapp(appPath, { adapter: BUILD_TYPES.WEAPP, envHasBeenSet: true })

  const pluginJsonPath = path.join(pluginDir, PLUGIN_JSON)
  if (!fs.existsSync(pluginDir) || !fs.existsSync(pluginJsonPath)) {
    return console.log(chalk.red('缺少 plugin.json!'))
  }
  const pluginJson = fs.readJSONSync(pluginJsonPath)
  const components = pluginJson.publicComponents
  const pages: { [key: string]: any } = pluginJson.pages
  const main = pluginJson.main

  // 编译插件页面
  if (pages && Object.keys(pages).length) {
    Util.printLog(processTypeEnum.COMPILE, '插件页面')
    const pagesPromises = Object.values(pages).map(page => buildSinglePage(path.join(PLUGIN_ROOT, page)))
    await Promise.all(pagesPromises)
  }

  // 编译插件组件
  if (components && Object.keys(components).length) {
    Util.printLog(processTypeEnum.COMPILE, '插件组件')
    const componentList: any[] = []
    for (const component in components) {
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
    Util.printLog(processTypeEnum.COMPILE, '插件 JS')
    await Promise.all(compileDepScripts([path.join(pluginDir, main)], true, true))
  }

  // 把 plugin 目录挪到根目录
  fs.moveSync(path.join(outputDir, PLUGIN_ROOT), pluginPath)
  // 把 npm 拷贝一份到 plugin 目录
  fs.copySync(path.join(outputDir, NPM_DIR), path.join(pluginPath, NPM_DIR))
  // 把 doc 目录拷贝到根目录
  fs.existsSync(docDir) && fs.copySync(docDir, docPath)
  // 拷贝 plugin.json
  compilePluginJson(pluginJson, path.join(pluginPath, PLUGIN_JSON))

  // plugin 文件夹内对 npm 的引用路径修改
  const names = glob.sync('plugin/{,!(npm)/**/}*.js')
  const ioPromises = names.map(name => {
    const content = fs.readFileSync(name).toString()

    let isShouldBeWritten
    let replacement = content.replace(/['|"]((\.\.\/)+)npm\/.+?['|"]/g, (str, $1) => {
      isShouldBeWritten = true
      return $1 === '../' ? str.replace('../', './') : str.replace('../', '')
    })

    const REG_PLUGIN_DEPS = RegExp(`['|"](/${PLUGIN_ROOT}.+)['|"]`, 'g')
    replacement = replacement.replace(REG_PLUGIN_DEPS, (str, $1) => {
      if (REG_FONT.test($1) || REG_IMAGE.test($1) || REG_MEDIA.test($1)) {
        return str.replace(RegExp(`^['|"]/${PLUGIN_ROOT}`, 'g'), str => str.replace(`${PLUGIN_ROOT}`, ''))
      }
      return str
    })

    if (isShouldBeWritten) fs.writeFileSync(path.join(appPath, name), replacement)
  })
  await Promise.all(ioPromises)

  watch && wxPluginWatchFiles()
}

function buildAlipayPlugin () {
  const {
    sourceDir,
    outputDir
  } = getBuildData()
  const pluginJson = path.join(sourceDir, PLUGIN_JSON)
  const pluginMockJson = path.join(sourceDir, PLUGIN_MOCK_JSON)

  if (fs.existsSync(pluginJson)) {
    fs.copyFileSync(pluginJson, path.join(outputDir, PLUGIN_JSON))
  }
  if (fs.existsSync(pluginMockJson)) {
    fs.copyFileSync(pluginMockJson, path.join(outputDir, PLUGIN_MOCK_JSON))
  }
}
