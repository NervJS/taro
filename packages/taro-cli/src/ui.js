const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const wxTransformer = require('@tarojs/transformer-wx')
const traverse = require('babel-traverse').default
const t = require('babel-types')
const _ = require('lodash')

const CONFIG = require('./config')
const {
  resolveScriptPath,
  resolveStylePath,
  printLog,
  pocessTypeEnum,
  PROJECT_CONFIG,
  BUILD_TYPES,
  REG_STYLE,
  REG_TYPESCRIPT,
  cssImports
} = require('./util')

const appPath = process.cwd()
const configDir = path.join(appPath, PROJECT_CONFIG)
const projectConfig = require(configDir)(_.merge)
const sourceDirName = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
let outputDirName = projectConfig.outputRoot || CONFIG.OUTPUT_DIR
const sourceDir = path.join(appPath, sourceDirName)
const entryFilePath = resolveScriptPath(path.join(sourceDir, 'index'))
const entryFileName = path.basename(entryFilePath)
const tempDir = '.temp'
const tempPath = path.join(appPath, tempDir)

const weappOutputName = 'weapp'
const h5OutputName = 'h5'

async function buildH5Lib () {
  try {
    const outputDir = path.join(appPath, outputDirName, h5OutputName)
    const tempEntryFilePath = resolveScriptPath(path.join(tempPath, 'index'))
    const outputEntryFilePath = path.join(outputDir, path.basename(tempEntryFilePath))
    const code = fs.readFileSync(tempEntryFilePath).toString()
    const transformResult = wxTransformer({
      code,
      sourcePath: tempEntryFilePath,
      outputPath: outputEntryFilePath,
      isNormal: true,
      isTyped: REG_TYPESCRIPT.test(tempEntryFilePath)
    })
    const { components } = parseEntryAst(transformResult.ast, tempEntryFilePath)
    const relativePath = path.relative(appPath, tempEntryFilePath)
    printLog(pocessTypeEnum.COPY, '发现文件', relativePath)
    fs.ensureDirSync(path.dirname(outputEntryFilePath))
    fs.copyFileSync(tempEntryFilePath, path.format({
      dir: path.dirname(outputEntryFilePath),
      base: path.basename(outputEntryFilePath)
    }))
    if (components.length) {
      components.forEach(item => {
        const dirname = path.dirname(item.path)
        const distDirname = dirname.replace(tempPath, outputDir)
        const relativePath = path.relative(appPath, item.path)
        printLog(pocessTypeEnum.COPY, '发现文件', relativePath)
        fs.ensureDirSync(distDirname)
        fs.copyFileSync(item.path, path.format({
          dir: distDirname,
          base: path.basename(item.path)
        }))
      })
      analyzeFiles(components.map(item => item.path), tempPath, outputDir)
    }
  } catch (err) {
    console.log(err)
  }
}

function parseEntryAst (ast, relativeFile) {
  const styleFiles = []
  const components = []
  const importExportName = []
  let exportDefaultName = null

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
  return {
    styleFiles,
    components
  }
}

function analyzeFiles (files, sourceDir, outputDir) {
  const { parseAst } = require('./weapp')
  files.forEach(file => {
    if (fs.existsSync(file)) {
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
      } = parseAst('NORMAL', transformResult.ast, [], file, file, true)
      const resFiles = styleFiles.concat(scriptFiles, jsonFiles, mediaFiles)
      if (resFiles.length) {
        resFiles.forEach(item => {
          if (!path.isAbsolute(item)) {
            return
          }
          const dirname = path.dirname(item)
          const distDirname = dirname.replace(sourceDir, outputDir)
          const relativePath = path.relative(appPath, item)
          printLog(pocessTypeEnum.COPY, '发现文件', relativePath)
          fs.ensureDirSync(distDirname)
          fs.copyFileSync(item, path.format({
            dir: distDirname,
            base: path.basename(item)
          }))
        })
      }
      if (scriptFiles.length) {
        analyzeFiles(scriptFiles, sourceDir, outputDir)
      }
      if (styleFiles.length) {
        analyzeStyleFilesImport(styleFiles, sourceDir, outputDir)
      }
    }
  })
}

function analyzeStyleFilesImport (styleFiles, sourceDir, outputDir) {
  styleFiles.forEach(item => {
    if (!fs.existsSync(item)) {
      return
    }
    let content = fs.readFileSync(item).toString()
    content = content.replace(/(?:@import\s+)?\burl\s*\(\s*("(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*'|[^)}\s]+)\s*\)(\s*;?)/g, (m, $1) => {
      if ($1) {
        let filePath = $1.replace(/'?"?/g, '')
        if (filePath.indexOf('.') === 0) {
          filePath = path.resolve(path.dirname(item), filePath)
          if (fs.existsSync(filePath)) {
            const dirname = path.dirname(filePath)
            const distDirname = dirname.replace(sourceDir, outputDir)
            const relativePath = path.relative(appPath, filePath)
            printLog(pocessTypeEnum.COPY, '发现文件', relativePath)
            fs.ensureDirSync(distDirname)
            fs.copyFileSync(filePath, path.format({
              dir: distDirname,
              base: path.basename(filePath)
            }))
          }
        }
      }
      return m
    })
    let imports = cssImports(content)
    if (imports.length > 0) {
      imports = imports.map(importItem => {
        const filePath = resolveStylePath(path.resolve(path.dirname(item), importItem))
        if (!fs.existsSync(filePath)) {
          return filePath
        }
        const dirname = path.dirname(filePath)
        const distDirname = dirname.replace(sourceDir, outputDir)
        const relativePath = path.relative(appPath, filePath)
        printLog(pocessTypeEnum.COPY, '发现文件', relativePath)
        fs.ensureDirSync(distDirname)
        fs.copyFileSync(filePath, path.format({
          dir: distDirname,
          base: path.basename(filePath)
        }))
        return filePath
      })
      analyzeStyleFilesImport(imports, sourceDir, outputDir)
    }
  })
}

async function buildForWeapp () {
  console.log()
  console.log(chalk.green('开始编译小程序端组件库！'))
  if (!fs.existsSync(entryFilePath)) {
    console.log(chalk.red('入口文件不存在，请检查！'))
    return
  }
  try {
    const { compileDepStyles } = require('./weapp')
    const outputDir = path.join(appPath, outputDirName, weappOutputName)
    const outputEntryFilePath = path.join(outputDir, entryFileName)
    const code = fs.readFileSync(entryFilePath).toString()
    const transformResult = wxTransformer({
      code,
      sourcePath: entryFilePath,
      outputPath: outputEntryFilePath,
      isNormal: true,
      isTyped: REG_TYPESCRIPT.test(entryFilePath)
    })
    const { styleFiles, components } = parseEntryAst(transformResult.ast, entryFilePath)
    if (styleFiles.length) {
      const outputStylePath = path.join(outputDir, 'css', 'index.css')
      await compileDepStyles(outputStylePath, styleFiles, false)
    }
    const relativePath = path.relative(appPath, entryFilePath)
    printLog(pocessTypeEnum.COPY, '发现文件', relativePath)
    fs.ensureDirSync(path.dirname(outputEntryFilePath))
    fs.copyFileSync(entryFilePath, path.format({
      dir: path.dirname(outputEntryFilePath),
      base: path.basename(outputEntryFilePath)
    }))
    if (components.length) {
      components.forEach(item => {
        const dirname = path.dirname(item.path)
        const distDirname = dirname.replace(sourceDir, outputDir)
        const relativePath = path.relative(appPath, item.path)
        printLog(pocessTypeEnum.COPY, '发现文件', relativePath)
        fs.ensureDirSync(distDirname)
        fs.copyFileSync(item.path, path.format({
          dir: distDirname,
          base: path.basename(item.path)
        }))
      })
      analyzeFiles(components.map(item => item.path), sourceDir, outputDir)
    }
  } catch (err) {
    console.log(err)
  }
}

async function buildForH5 (buildConfig) {
  const { buildTemp } = require('./h5')
  console.log()
  console.log(chalk.green('开始编译 H5 端组件库！'))
  await buildTemp(buildConfig)
  await buildH5Lib()
}

function buildEntry () {
  const content = `if (process.env.TARO_ENV === '${BUILD_TYPES.H5}') {
    module.exports = require('./${h5OutputName}/index')
    module.exports.default = module.exports
  } else {
    module.exports = require('./${weappOutputName}/index')
    module.exports.default = module.exports
  }`
  const outputDir = path.join(appPath, outputDirName)
  fs.writeFileSync(path.join(outputDir, 'index.js'), content)
}

async function build () {
  buildEntry()
  await buildForWeapp()
  await buildForH5()
}

module.exports = {
  build
}
