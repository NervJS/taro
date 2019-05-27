import * as path from 'path'

import * as chokidar from 'chokidar'
import chalk from 'chalk'

import {
  REG_TYPESCRIPT,
  REG_SCRIPT,
  REG_STYLE,
  processTypeEnum,
  NODE_MODULES_REG,
  isWindows,
  BUILD_TYPES
} from '../util/constants'
import {
  printLog,
  checksum
} from '../util'

import { initCompileStyles, compileDepStyles } from './compileStyle'
import { initCompileScripts, compileDepScripts } from './compileScript'
import {
  initCopyFiles,
  getBuildData,
  setAppConfig,
  isComponentHasBeenBuilt,
  deleteHasBeenBuiltComponent,
  copyFilesFromSrcToOutput,
  getDependencyTree,
  isFileToBePage
} from './helper'
import { buildEntry } from './entry'
import { buildPages, buildSinglePage } from './page'
import { buildSingleComponent, getComponentsNamedMap } from './component'

export function watchFiles () {
  console.log()
  console.log(chalk.gray('监听文件修改中...'))
  console.log()
  initCompileStyles()
  initCompileScripts()
  initCopyFiles()
  const {
    sourceDir,
    outputDir,
    sourceDirName,
    projectConfig,
    outputFilesTypes,
    appConfig,
    nodeModulesPath,
    npmOutputDir,
    entryFileName,
    entryFilePath,
    buildAdapter,
    appPath
  } = getBuildData()
  const dependencyTree = getDependencyTree()
  const isQuickApp = buildAdapter === BUILD_TYPES.QUICKAPP
  const watcherPaths = [path.join(sourceDir)].concat(projectConfig.watcher || [])
  const watcher = chokidar.watch(watcherPaths, {
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
      const extname = path.extname(filePath)
      const componentsNamedMap = getComponentsNamedMap()
      // 编译JS文件
      if (REG_SCRIPT.test(extname) || REG_TYPESCRIPT.test(extname)) {
        if (entryFilePath === filePath) {
          printLog(processTypeEnum.MODIFY, '入口文件', `${sourceDirName}/${entryFileName}.js`)
          const config = await buildEntry()
          // TODO 此处待优化
          if ((checksum(JSON.stringify(config.pages)) !== checksum(JSON.stringify(appConfig.pages))) ||
            (checksum(JSON.stringify(config.subPackages || config['subpackages'] || {})) !== checksum(JSON.stringify(appConfig.subPackages || appConfig['subpackages'] || {})))) {
            setAppConfig(config)
            await buildPages()
          }
        } else {
          const filePathWithoutExt = filePath.replace(extname, '')
          if (isFileToBePage(filePath)) { // 编译页面
            filePath = filePathWithoutExt
            filePath = filePath.replace(path.join(sourceDir) + path.sep, '')
            filePath = filePath.split(path.sep).join('/')
            printLog(processTypeEnum.MODIFY, '页面文件', `${sourceDirName}/${filePath}`)
            await buildSinglePage(filePath)
          } else if (isComponentHasBeenBuilt(filePath)) { // 编译组件
            let outoutShowFilePath = filePath.replace(appPath + path.sep, '')
            outoutShowFilePath = outoutShowFilePath.split(path.sep).join('/')
            printLog(processTypeEnum.MODIFY, '组件文件', outoutShowFilePath)
            deleteHasBeenBuiltComponent(filePath)

            if (isWindows) {
              await new Promise((resolve, reject) => {
                setTimeout(async () => {
                  await buildSingleComponent(Object.assign({
                    path: filePath
                  }, componentsNamedMap.get(filePath)))
                  resolve()
                }, 300)
              })
            } else {
              await buildSingleComponent(Object.assign({
                path: filePath
              }, componentsNamedMap.get(filePath)))
            }
          } else {
            let isImported = false
            dependencyTree.forEach((dependencyTreeItem) => {
              if (dependencyTreeItem) {
                const scripts = dependencyTreeItem.script
                if (scripts.indexOf(filePath) >= 0) {
                  isImported = true
                }
              }
            })
            let modifySource = filePath.replace(appPath + path.sep, '')
            modifySource = modifySource.split(path.sep).join('/')
            if (isImported) {
              printLog(processTypeEnum.MODIFY, 'JS文件', modifySource)
              await compileDepScripts([filePath], !isQuickApp)
            } else {
              printLog(processTypeEnum.WARNING, 'JS文件', `${modifySource} 没有被引用到，不会被编译`)
            }
          }
        }
      } else if (REG_STYLE.test(extname)) {
        const includeStyleJSPath: any[] = []
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
          includeStyleJSPath.forEach(async item => {
            let outputWXSSPath = item.filePath.replace(path.extname(item.filePath), outputFilesTypes.STYLE)
            let modifySource = outputWXSSPath.replace(appPath + path.sep, '')
            modifySource = modifySource.split(path.sep).join('/')
            printLog(processTypeEnum.MODIFY, '样式文件', modifySource)
            if (NODE_MODULES_REG.test(outputWXSSPath)) {
              outputWXSSPath = outputWXSSPath.replace(nodeModulesPath, npmOutputDir)
            } else {
              outputWXSSPath = outputWXSSPath.replace(sourceDir, outputDir)
            }
            let modifyOutput = outputWXSSPath.replace(appPath + path.sep, '')
            modifyOutput = modifyOutput.split(path.sep).join('/')
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
            printLog(processTypeEnum.GENERATE, '样式文件', modifyOutput)
          })
        } else {
          let outputWXSSPath = filePath.replace(path.extname(filePath), outputFilesTypes.STYLE)
          let modifySource = outputWXSSPath.replace(appPath + path.sep, '')
          modifySource = modifySource.split(path.sep).join('/')
          printLog(processTypeEnum.MODIFY, '样式文件', modifySource)
          if (NODE_MODULES_REG.test(outputWXSSPath)) {
            outputWXSSPath = outputWXSSPath.replace(nodeModulesPath, npmOutputDir)
          } else {
            outputWXSSPath = outputWXSSPath.replace(sourceDir, outputDir)
          }
          let modifyOutput = outputWXSSPath.replace(appPath + path.sep, '')
          modifyOutput = modifyOutput.split(path.sep).join('/')
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
          printLog(processTypeEnum.GENERATE, '样式文件', modifyOutput)
        }
      } else {
        let modifySource = filePath.replace(appPath + path.sep, '')
        modifySource = modifySource.split(path.sep).join('/')
        printLog(processTypeEnum.MODIFY, '文件', modifySource)
        copyFilesFromSrcToOutput([filePath])
      }
      initCompileStyles()
      initCompileScripts()
      initCopyFiles()
    })
}
