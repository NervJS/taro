import * as t from '@babel/types'

import { errors, globals, resetGlobals, THIRD_PARTY_COMPONENTS } from './global'
import { parseScript } from './script'
import { getLineBreak, printToLogFile, setting, updateLogFileContent } from './utils'
import { parseVue } from './vue'
import { parseWXML } from './wxml'

interface IPluginInfo {
  pluginRoot: string // projectRoot + pluginRoot(project.config.json)
  pluginName: string
  pages: Set<string>
  pagesMap: Map<string, string> // 插件名和路径的映射
  publicComponents: Set<IComponent>
  entryFilePath: string
}

interface IComponent {
  name: string
  path: string
}

interface Option {
  json?: string
  script?: string
  scriptPath?: string
  wxml?: string
  path: string
  rootPath: string
  framework: 'react' | 'vue'
  isApp?: boolean
  logFilePath: string
  pluginInfo: IPluginInfo
  templatePath?: string
}

export function parse (option: Option) {
  resetGlobals(option.rootPath, option.logFilePath)
  updateLogFileContent(
    `INFO [taroize] parse - 入参 ${getLineBreak()}option: ${JSON.stringify(option)} ${getLineBreak()}`
  )

  try {
    setting.rootPath = option.rootPath
    if (option.json) {
      const config = JSON.parse(option.json)
      const usingComponents = config.usingComponents
      if (usingComponents) {
        for (const key in usingComponents) {
          if (usingComponents.hasOwnProperty(key)) {
            THIRD_PARTY_COMPONENTS.add(key)
          }
        }
      }
    }

    if (option.framework === 'vue') {
      const result = parseVue(option.path, option.wxml || '', option.script)
      return {
        ...result,
        errors,
      }
    }

    globals.currentParseFile = option.templatePath || ''
    const { wxml, wxses, imports, refIds } = parseWXML(option.path, option.wxml)
    setting.sourceCode = option.script!
    globals.currentParseFile = option.scriptPath || ''
    const ast = parseScript(
      option.script,
      option.scriptPath,
      wxml as t.Expression,
      wxses,
      refIds,
      option.isApp,
      option.pluginInfo
    )
    const errCodeMsgs = globals.errCodeMsgs
    return {
      ast,
      imports,
      errors,
      errCodeMsgs,
    }
  } finally {
    printToLogFile()
  }
}
