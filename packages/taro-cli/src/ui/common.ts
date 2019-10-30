import * as t from 'babel-types'
import { IComponentObj } from '../mini/interface'
import traverse from 'babel-traverse'
import { cssImports, printLog, resolveScriptPath, resolveStylePath } from '../util'
import * as path from 'path'
import * as wxTransformer from '@tarojs/transformer-wx'
import { PARSE_AST_TYPE, processTypeEnum, REG_STYLE, REG_TYPESCRIPT } from '../util/constants'
import generate from 'babel-generator'
import * as fs from 'fs-extra'
import { parseAst } from '../mini/astProcess'
import { IBuildData } from './ui.types'

const processedScriptFiles: Set<string> = new Set()

export const WEAPP_OUTPUT_NAME = 'weapp'
export const H5_OUTPUT_NAME = 'h5'
export const RN_OUTPUT_NAME = 'rn'
export const TEMP_DIR = '.temp'
export const RN_TEMP_DIR = 'rn_temp'

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

export function copyFileToDist (filePath: string, sourceDir: string, outputDir: string, buildData: IBuildData) {
  if (!filePath && !path.isAbsolute(filePath)) {
    return
  }
  const {appPath} = buildData
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

export function analyzeFiles (files: string[], sourceDir: string, outputDir: string, buildData: IBuildData) {
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
      } = parseAst(PARSE_AST_TYPE.NORMAL, transformResult.ast, [], file, file, true)

      const resFiles = styleFiles.concat(scriptFiles,jsonFiles, mediaFiles)

      if (resFiles.length) {
        resFiles.forEach(item => {
          copyFileToDist(item, sourceDir, outputDir, buildData)
        })
      }
      if (scriptFiles.length) {
        analyzeFiles(scriptFiles, sourceDir, outputDir, buildData)
      }
      if (styleFiles.length) {
        analyzeStyleFilesImport(styleFiles, sourceDir, outputDir, buildData)
      }
    }
  })
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
        const filePath = resolveStylePath(path.resolve(path.dirname(item), importItem))
        copyFileToDist(filePath, sourceDir, outputDir, buildData)
        return filePath
      })
      analyzeStyleFilesImport(imports, sourceDir, outputDir, buildData)
    }
  })
}
