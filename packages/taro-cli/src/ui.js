const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const wxTransformer = require('@tarojs/transformer-wx')
const traverse = require('babel-traverse').default
const t = require('babel-types')
const generate = require('babel-generator').default
const template = require('babel-template')

const CONFIG = require('./config')
const {
  resolveScriptPath,
  REG_TYPESCRIPT
} = require('./util')

const appPath = process.cwd()
const sourceDirName = CONFIG.SOURCE_DIR
const sourceDir = path.join(appPath, sourceDirName)
const entryFilePath = resolveScriptPath(path.join(sourceDir, 'index'))
const entryFileName = path.basename(entryFilePath)

const weappOutputName = 'weapp'

function parseEntryAst (ast) {
  const components = []
  const importExportName = []
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
            path: resolveScriptPath(path.resolve(path.dirname(entryFilePath), source.value))
          })
        })
      } else {
        specifiers.forEach(specifier => {
          const exported = specifier.exported
          importExportName.push(exported.name)
        })
      }
    },

    Program: {
      exit (astPath) {
        astPath.traverse({
          ImportDeclaration (astPath) {
            const node = astPath.node
            const specifiers = node.specifiers
            const source = node.source
            if (importExportName.length) {
              importExportName.forEach(nameItem => {
                specifiers.forEach(specifier => {
                  const local = specifier.local
                  if (local.name === nameItem) {
                    components.push({
                      name: local.name,
                      path: resolveScriptPath(path.resolve(path.dirname(entryFilePath), source.value))
                    })
                  }
                })
              })
            }
          }
        })
      }
    }
  })

  return components
}

async function buildForWeapp () {
  const { buildDepComponents } = require('./weapp')
  console.log()
  console.log(chalk.green('开始编译微信小程序端组件库！'))
  if (!fs.existsSync(entryFilePath)) {
    console.log(chalk.red('入口文件不存在，请检查！'))
    return
  }
  try {
    const code = fs.readFileSync(entryFilePath)
    let outputDirName = `${CONFIG.OUTPUT_DIR}/${weappOutputName}`
    let outputDir = path.join(appPath, outputDirName)
    const outputEntryFilePath = path.join(outputDir, entryFileName)
    fs.ensureDirSync(path.dirname(outputEntryFilePath))
    fs.writeFileSync(outputEntryFilePath, code)
    const transformResult = wxTransformer({
      code,
      sourcePath: entryFilePath,
      outputPath: outputEntryFilePath,
      isNormal: true,
      isTyped: REG_TYPESCRIPT.test(entryFilePath)
    })
    const parseResult = parseEntryAst(transformResult.ast)
    await buildDepComponents(parseResult, {
      npmSkip: true,
      outputDir,
      outputDirName
    })
  } catch (err) {
    console.log(err)
  }
}

async function buildForH5 (buildConfig) {
  const { buildTemp } = require('./h5')
  console.log()
  console.log(chalk.green('开始编译 H5 端组件库！'))
  await buildTemp(buildConfig)
}

async function build () {
  await buildForWeapp()
  await buildForH5()
}

module.exports = {
  build
}
