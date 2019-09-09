import * as path from 'path'
import * as fs from 'fs'
import { isEmptyObject, getInstalledNpmPkgPath, promoteRelativePath } from '.'
import { taroJsQuickAppComponents, REG_STYLE, REG_SCRIPT } from './constants'

let quickappConfig = {}

export function getQuickappConfig (appPath) {
  if (!isEmptyObject(quickappConfig)) {
    return quickappConfig
  }
  const configPath = path.join(appPath, 'project.quickapp.json')
  if (!fs.existsSync(configPath)) {
    quickappConfig = require('../config/manifest.default.json')
  } else {
    quickappConfig = JSON.parse(fs.readFileSync(configPath).toString())
  }
  return quickappConfig
}

export function getTaroJsQuickAppComponentsPath (nodeModulesPath: string): string {
  const taroJsQuickAppComponentsPkg = getInstalledNpmPkgPath(taroJsQuickAppComponents, nodeModulesPath)
  if (!taroJsQuickAppComponentsPkg) {
    // printLog(processTypeEnum.ERROR, '包安装', `缺少包 ${taroJsQuickAppComponents}，请安装！`)
    process.exit(0)
  }
  return path.join(path.dirname(taroJsQuickAppComponentsPkg as string), 'src/components')
}

export function getImportTaroSelfComponents (filePath, nodeModulesPath, taroSelfComponents) {
  const importTaroSelfComponents = new Set<{ path: string, name: string }>()
  const taroJsQuickAppComponentsPath = getTaroJsQuickAppComponentsPath(nodeModulesPath)
  taroSelfComponents.forEach(c => {
    const cPath = path.join(taroJsQuickAppComponentsPath, c)
    const cMainPath = path.join(cPath, 'index')
    const cRelativePath = promoteRelativePath(path.relative(filePath, cMainPath.replace(nodeModulesPath, 'npm')))
    importTaroSelfComponents.add({
      path: cRelativePath,
      name: c
    })
  })
  return importTaroSelfComponents
}

export function generateQuickAppUx ({
  script,
  template,
  style,
  imports
}: {
  script?: string,
  template?: string,
  style?: string,
  imports?: Set<{
    path: string,
    name: string
  }>
}) {
  let uxTxt = ''
  if (imports && imports.size) {
    imports.forEach(item => {
      uxTxt += `<import src='${item.path}' name='${item.name}'></import>\n`
    })
  }
  if (style) {
    if (REG_STYLE.test(style)) {
      uxTxt += `<style src="${style}"></style>\n`
    } else {
      uxTxt += `<style>\n${style}\n</style>\n`
    }
  }
  if (template) {
    uxTxt += `<template>\n${template}\n</template>\n`
  }
  if (script) {
    if (REG_SCRIPT.test(script)) {
      uxTxt += `<script src="${script}"></script>\n`
    } else {
      uxTxt += `<script>\n${script}\n</script>\n`
    }
  }
  return uxTxt
}
