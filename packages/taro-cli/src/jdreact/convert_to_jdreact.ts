import * as fs from 'fs-extra'
import * as path from 'path'
import * as klaw from 'klaw'
import * as _ from 'lodash'
import { processTypeEnum, printLog } from '@tarojs/helper'

const JDREACT_DIR = '.jdreact'
const NATIVE_BUNDLES_DIR = 'bundle'
const appPath = process.cwd()
const jdreactTmpDirname = __dirname
const jdreactPath = path.join(appPath, JDREACT_DIR)
const pkgName = _.camelCase(require(path.join(process.cwd(), 'package.json')).name)
const moduleName = 'JDReact' + _.upperFirst(pkgName)

async function processFile ({ filePath, tempPath, entryBaseName }) {
  const indexJsStr = `
  import {AppRegistry} from 'react-native';
  import App from '../${entryBaseName}';
  // import {name as appName} from '../app.json';

  AppRegistry.registerComponent('${moduleName}', () => App);`

  if (!fs.existsSync(filePath)) {
    return
  }
  const dirname = path.dirname(filePath)
  const destDirname = dirname.replace(tempPath, jdreactPath)
  const destFilePath = path.format({dir: destDirname, base: path.basename(filePath)})
  const indexFilePath = path.join(tempPath, 'index.js')
  const tempPkgPath = path.join(tempPath, 'package.json')

  // generate jsbundles/moduleName.js
  if (filePath === indexFilePath) {
    const indexDistDirPath = path.join(jdreactPath, 'jsbundles')
    const indexDistFilePath = path.join(indexDistDirPath, `${moduleName}.js`)
    fs.ensureDirSync(indexDistDirPath)
    fs.writeFileSync(indexDistFilePath, indexJsStr)
    printLog(processTypeEnum.GENERATE, `${moduleName}.js`, indexDistFilePath)
    return
  }

  // genetate package.json
  if (filePath === tempPkgPath) {
    const destPkgPath = path.join(jdreactPath, 'package.json')
    const templatePkgPath = path.join(jdreactTmpDirname, 'pkg')
    const tempPkgObject = fs.readJsonSync(tempPkgPath)
    const templatePkgObject = fs.readJsonSync(templatePkgPath)
    templatePkgObject.name = `jdreact-jsbundle-${moduleName}`
    templatePkgObject.dependencies = Object.assign({}, tempPkgObject.dependencies, templatePkgObject.dependencies)
    fs.writeJsonSync(destPkgPath, templatePkgObject, {spaces: 2})
    printLog(processTypeEnum.GENERATE, 'package.json', destPkgPath)
    return
  }

  fs.ensureDirSync(destDirname)
  fs.copySync(filePath, destFilePath)
  printLog(processTypeEnum.COPY, _.camelCase(path.extname(filePath)).toUpperCase(), filePath)
}

export function convertToJDReact ({tempPath, entryBaseName}) {
  klaw(tempPath)
    .on('data', file => {
      const nativeBundlePath = path.join(tempPath, NATIVE_BUNDLES_DIR)
      if (file.stats.isDirectory() ||
        file.path.startsWith(path.join(tempPath, 'node_modules')) ||
        file.path.startsWith(nativeBundlePath) ||
        file.path.endsWith('yarn.lock') ||
        file.path.endsWith('package-lock.json')
      ) return

      processFile({filePath: file.path, tempPath, entryBaseName})
    })
    .on('end', () => {
      // copy templates under jsbundles/
      const templateSrcDirname = path.join(jdreactTmpDirname, 'template')
      const indexDistDirPath = path.join(jdreactPath, 'jsbundles')
      // not overwrite
      fs.copySync(path.join(templateSrcDirname, 'JDReact.version'), path.join(indexDistDirPath, `${moduleName}.version`), {overwrite: false})
      fs.copySync(path.join(templateSrcDirname, 'JDReact.web.js'), path.join(indexDistDirPath, `${moduleName}.web.js`), {overwrite: false})
      printLog(processTypeEnum.COPY, 'templates', templateSrcDirname)
    })
}
