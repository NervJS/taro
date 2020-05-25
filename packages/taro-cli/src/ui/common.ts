import * as path from 'path'
import * as fs from 'fs-extra'

import * as t from 'babel-types'
import * as glob from 'glob'
import traverse from 'babel-traverse'
import generate from 'babel-generator'
import * as wxTransformer from '@tarojs/transformer-wx'
import {
  cssImports,
  printLog,
  resolveScriptPath,
  resolveStylePath,
  isNpmPkg,
  processTypeEnum,
  REG_STYLE,
  REG_TYPESCRIPT,
  REG_SCRIPT,
  REG_JSON,
  REG_FONT,
  REG_IMAGE,
  REG_MEDIA,
  CSS_EXT
} from '@tarojs/helper'

import { IBuildData } from './ui.types'

let processedScriptFiles: Set<string> = new Set()

export const WEAPP_OUTPUT_NAME = 'weapp'
export const QUICKAPP_OUTPUT_NAME = 'quickappp'
export const H5_OUTPUT_NAME = 'h5'
export const RN_OUTPUT_NAME = 'rn'
export const TEMP_DIR = '.temp'
export const RN_TEMP_DIR = 'rn_temp'

interface IComponentObj {
  name?: string,
  path: string | null,
  type?: string
}

interface IParseAstReturn {
  styleFiles: string[],
  scriptFiles: string[],
  jsonFiles: string[],
  mediaFiles: string[]
}

function parseAst (
  ast: t.File,
  sourceFilePath: string
): IParseAstReturn {
  const styleFiles: string[] = []
  const scriptFiles: string[] = []
  const jsonFiles: string[] = []
  const mediaFiles: string[] = []

  traverse(ast, {
    Program: {
      exit (astPath) {
        astPath.traverse({
          ImportDeclaration (astPath) {
            const node = astPath.node
            const source = node.source
            const value = source.value
            const valueExtname = path.extname(value)
            if (value.indexOf('.') === 0) {
              let importPath = path.resolve(path.dirname(sourceFilePath), value)
              importPath = resolveScriptPath(importPath)
              if (REG_SCRIPT.test(valueExtname) || REG_TYPESCRIPT.test(valueExtname)) {
                const vpath = path.resolve(sourceFilePath, '..', value)
                let fPath = value
                if (fs.existsSync(vpath) && vpath !== sourceFilePath) {
                  fPath = vpath
                }
                if (scriptFiles.indexOf(fPath) < 0) {
                  scriptFiles.push(fPath)
                }
              } else if (REG_JSON.test(valueExtname)) {
                const vpath = path.resolve(sourceFilePath, '..', value)
                if (fs.existsSync(vpath) && jsonFiles.indexOf(vpath) < 0) {
                  jsonFiles.push(vpath)
                }
              } else if (REG_FONT.test(valueExtname) || REG_IMAGE.test(valueExtname) || REG_MEDIA.test(valueExtname)) {
                const vpath = path.resolve(sourceFilePath, '..', value)
                if (fs.existsSync(vpath) && mediaFiles.indexOf(vpath) < 0) {
                  mediaFiles.push(vpath)
                }
              } else if (REG_STYLE.test(valueExtname)) {
                const vpath = path.resolve(path.dirname(sourceFilePath), value)
                if (fs.existsSync(vpath) && styleFiles.indexOf(vpath) < 0) {
                  styleFiles.push(vpath)
                }
              } else {
                const vpath = resolveScriptPath(path.resolve(sourceFilePath, '..', value))
                if (fs.existsSync(vpath) && scriptFiles.indexOf(vpath) < 0) {
                  scriptFiles.push(vpath)
                }
              }
            }
          }
        })
      }
    }
  })

  return {
    styleFiles,
    scriptFiles,
    jsonFiles,
    mediaFiles
  }
}

export function parseEntryAst (ast: t.File, relativeFile: string) {
  const styleFiles: string[] = []
  const components: IComponentObj[] = []
  const importExportName: string[] = []
  let exportDefaultName: string | null = null

  traverse(ast, {
    ExportNamedDeclaration (astPath) {
      const node = astPath.node
      const specifiers = node.specifiers
      const source = node.source
      if (source && source.type === 'StringLiteral') {
        specifiers.forEach(specifier => {
          const exported = specifier.exported
          components.push({
            name: exported.name,
            path: resolveScriptPath(path.resolve(path.dirname(relativeFile), source.value))
          })
        })
      } else {
        specifiers.forEach(specifier => {
          const exported = specifier.exported
          importExportName.push(exported.name)
        })
      }
    },

    ExportDefaultDeclaration (astPath) {
      const node = astPath.node
      const declaration = node.declaration
      if (t.isIdentifier(declaration)) {
        exportDefaultName = declaration.name
      }
    },

    Program: {
      exit (astPath) {
        astPath.traverse({
          ImportDeclaration (astPath) {
            const node = astPath.node
            const specifiers = node.specifiers
            const source = node.source
            const value = source.value
            const valueExtname = path.extname(value)
            if (REG_STYLE.test(valueExtname)) {
              const stylePath = path.resolve(path.dirname(relativeFile), value)
              if (styleFiles.indexOf(stylePath) < 0) {
                styleFiles.push(stylePath)
              }
              astPath.remove()
            } else {
              if (importExportName.length) {
                importExportName.forEach(nameItem => {
                  specifiers.forEach(specifier => {
                    const local = specifier.local
                    if (local.name === nameItem) {
                      components.push({
                        name: local.name,
                        path: resolveScriptPath(path.resolve(path.dirname(relativeFile), source.value))
                      })
                    }
                  })
                })
              }
              if (exportDefaultName != null) {
                specifiers.forEach(specifier => {
                  const local = specifier.local
                  if (local.name === exportDefaultName) {
                    components.push({
                      name: local.name,
                      path: resolveScriptPath(path.resolve(path.dirname(relativeFile), source.value))
                    })
                  }
                })
              }
            }
          }
        })
      }
    }
  })
  const code = generate(ast).code
  return {
    code,
    styleFiles,
    components
  }
}

export function isFileToBeCSSModulesMap (filePath) {
  let isMap = false
  CSS_EXT.forEach(item => {
    const reg = new RegExp(`${item}.map.js$`, 'g')
    if (reg.test(filePath)) {
      isMap = true
    }
  })
  return isMap
}

export function copyFileToDist (filePath: string, sourceDir: string, outputDir: string, buildData: IBuildData) {
  if ((!filePath && !path.isAbsolute(filePath)) || isFileToBeCSSModulesMap(filePath)) {
    return
  }

  const { appPath } = buildData
  const dirname = path.dirname(filePath)
  const distDirname = dirname.replace(sourceDir, outputDir)
  const relativePath = path.relative(appPath, filePath)
  printLog(processTypeEnum.COPY, '发现文件', relativePath)
  fs.ensureDirSync(distDirname)
  fs.copyFileSync(filePath, path.format({
    dir: distDirname,
    base: path.basename(filePath)
  }))
}

function _analyzeFiles(files: string[], sourceDir: string, outputDir: string, buildData: IBuildData){
  files.forEach(file => {
    if (fs.existsSync(file)) {
      if (processedScriptFiles.has(file)) {
        return
      }
      processedScriptFiles.add(file)
      const code = fs.readFileSync(file).toString()
      const transformResult = wxTransformer({
        code,
        sourcePath: file,
        outputPath: file,
        isNormal: true,
        isTyped: REG_TYPESCRIPT.test(file)
      })
      const {
        styleFiles,
        scriptFiles,
        jsonFiles,
        mediaFiles
      } = parseAst(transformResult.ast, file)

      const resFiles = styleFiles.concat(scriptFiles, jsonFiles, mediaFiles)

      if (resFiles.length) {
        resFiles.forEach(item => {
          copyFileToDist(item, sourceDir, outputDir, buildData)
        })
      }
      if (scriptFiles.length) {
        _analyzeFiles(scriptFiles, sourceDir, outputDir, buildData)
      }
      if (styleFiles.length) {
        analyzeStyleFilesImport(styleFiles, sourceDir, outputDir, buildData)
      }
    }
  })
}

export function analyzeFiles (files: string[], sourceDir: string, outputDir: string, buildData: IBuildData) {
  _analyzeFiles(files, sourceDir, outputDir, buildData)
  processedScriptFiles = new Set()
}

export function analyzeStyleFilesImport (styleFiles, sourceDir, outputDir, buildData: IBuildData) {
  styleFiles.forEach(item => {
    if (!fs.existsSync(item)) {
      return
    }
    let content = fs.readFileSync(item).toString()
    content = content.replace(/(?:@import\s+)?\burl\s*\(\s*("(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*'|[^)}\s]+)\s*\)(\s*;?)/g,
      (m, $1) => {
        if ($1) {
          let filePath = $1.replace(/'?"?/g, '')
          if (filePath.indexOf('.') === 0) {
            filePath = path.resolve(path.dirname(item), filePath)
            copyFileToDist(filePath, sourceDir, outputDir, buildData)
          }
        }
        return m
      })
    let imports = cssImports(content)
    if (imports.length > 0) {
      imports = imports.map(importItem => {
        if (isNpmPkg(importItem)) {
          return ''
        }
        const filePath = resolveStylePath(path.resolve(path.dirname(item), importItem))
        copyFileToDist(filePath, sourceDir, outputDir, buildData)
        return filePath
      }).filter(item => item)
      analyzeStyleFilesImport(imports, sourceDir, outputDir, buildData)
    }
  })
}

export function copyAllInterfaceFiles (sourceDir, outputDir, buildData) {
  const interfaceFiles = glob.sync(path.join(sourceDir, '**/*.d.ts'))
  if (interfaceFiles && interfaceFiles.length) {
    interfaceFiles.forEach(item => {
      copyFileToDist(item, sourceDir, outputDir, buildData)
    })
  }
}
