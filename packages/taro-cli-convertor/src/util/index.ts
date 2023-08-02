import {
  fs,
  printLog,
  processTypeEnum,
  promoteRelativePath,
  REG_SCRIPT,
  REG_TYPESCRIPT,
  resolveScriptPath
} from '@tarojs/helper'
import * as path from 'path'

import type * as t from '@babel/types'

export function getRootPath (): string {
  return path.resolve(__dirname, '../../')
}

export function getPkgVersion (): string {
  return require(path.join(getRootPath(), 'package.json')).version
}

//Fix: 在小程序三方件中找到入口 index
function getModulePath(rootPath, modulePath) {
  let parts = modulePath.split('/');
  let moduleIndex = path.join(rootPath, 'node_modules') // node_modules文件夹
  if (parts.at(-1) === 'index') {
      parts.pop();
  } 
  parts.push('index.js');
  let npmIndex = path.join(rootPath, `miniprogram_npm/${modulePath}.js`); // 判断本身是否是一个完整的入口
  if (fs.existsSync(npmIndex)) {
      parts.pop();
      let tempPart = parts.at(-1) + '.js';
      parts.pop();
      parts.push(tempPart);
  }
  parts.forEach(part => {
      const moduleFile = moduleIndex;
      moduleIndex = searchFile(moduleFile, part);
  })
  return moduleIndex;
}

function getRelativePath (
  rootPath: string,
  sourceFilePath: string,
  oriPath: string
) {
  // 处理以/开头的绝对路径，比如 /a/b
  if (path.isAbsolute(oriPath)) {
    if (oriPath.indexOf('/') !== 0) {
      return ''
    }
    const vpath = path.resolve(rootPath, oriPath.substr(1))
    if (!fs.existsSync(vpath)) {
      return ''
    }
    let relativePath = path.relative(path.dirname(sourceFilePath), vpath)
    relativePath = promoteRelativePath(relativePath)
    if (relativePath.indexOf('.') !== 0) {
      return './' + relativePath
    }
    return relativePath
  }
  // 处理非正常路径，比如 a/b
  if (oriPath.indexOf('.') !== 0) {
    const vpath = path.resolve(sourceFilePath, '..', oriPath)
    if (fs.existsSync(vpath)) {
      return './' + oriPath
    }
    const testParts = oriPath.split('/');
    let testindex = path.join(rootPath, `node_modules/${testParts[0]}`); // 判断三方件是否在node_modules中
    if (!fs.existsSync(testindex)) {
      if (oriPath.indexOf('/') !== -1 && oriPath.indexOf('@') === -1 && oriPath.lastIndexOf('.js') !== oriPath.length-3){
        oriPath = oriPath + '.js'  // 不在这里返回    utils/auth -> utils/auth.js
      }
      if (fs.existsSync(oriPath)) {
        oriPath =  './' + oriPath
      }
      return oriPath;
    }
    const realPath = getModulePath(rootPath, oriPath);
    // 转成相对路径
    let relativePath = path.relative(path.dirname(sourceFilePath), realPath);
    if (relativePath.indexOf('.') !== 0) {
        return './' + relativePath;
    }
    return relativePath;
  }
  return oriPath
}

export function analyzeImportUrl (
  rootPath: string,
  sourceFilePath: string,
  scriptFiles: Set<string>,
  source: t.StringLiteral,
  value: string,
  isTsProject?: boolean
) {
  const valueExtname = path.extname(value)
  const rpath = getRelativePath(rootPath, sourceFilePath, value)
  if (!rpath) {
    printLog(processTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
    return
  }
  if (rpath !== value) {
    value = rpath
    source.value = rpath
  }
  if (value.indexOf('.') === 0) {
    if (REG_SCRIPT.test(valueExtname) || REG_TYPESCRIPT.test(valueExtname)) {
      const vpath = path.resolve(sourceFilePath, '..', value)
      let fPath = value
      if (fs.existsSync(vpath)) {
        fPath = vpath
      } else {
        printLog(processTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
      }
      scriptFiles.add(fPath)
    } else {
      let vpath = resolveScriptPath(path.resolve(sourceFilePath, '..', value))
      if (vpath) {
        if (!fs.existsSync(vpath)) {
          printLog(processTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
        } else {
          if (fs.lstatSync(vpath).isDirectory()) {
            if (fs.existsSync(path.join(vpath, 'index.js'))) {
              vpath = path.join(vpath, 'index.js')
            } else {
              printLog(processTypeEnum.ERROR, '引用目录', `文件 ${sourceFilePath} 中引用了目录 ${value}！`)
              return
            }
          }
          let relativePath = path.relative(sourceFilePath, vpath)
          const relativePathExtname = path.extname(relativePath)
          scriptFiles.add(vpath)
          relativePath = promoteRelativePath(relativePath)
          if (/\.wxs/.test(relativePathExtname)) {
            relativePath += '.js'
          } else if (!isTsProject) {
            relativePath = relativePath.replace(relativePathExtname, '.js')
          }
          source.value = relativePath
        }
      }
    }
  }
}

export const incrementId = () => {
  let n = 0
  return () => (n++).toString()
}

export function searchFile(moduleFile, indexPart) { //Fix: 递归遍历查找
  const filePath = path.join(moduleFile, indexPart);
  if(fs.existsSync(filePath)) {
      return filePath;
  }
  const folders = fs.readdirSync(moduleFile); //获取子目录
  let resultFile;
  for (let i = 0; i < folders.length; i++) {
      if (folders[i].indexOf('ali') !== -1) {
        continue;
      }
      if (folders[i].indexOf('baidu') !== -1) {
        continue;
      }
      if (folders[i].indexOf('qq') !== -1) {
        continue;
      }
      if (folders[i].indexOf('toutiao') !== -1) {
        continue;
      }
      const nextModule = path.join(moduleFile, folders[i]);
      if (fs.lstatSync(nextModule).isDirectory()) {
          resultFile = searchFile(nextModule, indexPart);
      }
      if (resultFile && fs.existsSync(resultFile)) {
          return resultFile;
      }
  }
}
