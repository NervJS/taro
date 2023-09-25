import { parseSync, transformFromAstSync, types } from '@babel/core'
import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import { readConfig, resolveMainFilePath } from '@tarojs/helper'
import * as fs from 'fs'
import * as mimeType from 'mime-types'
import * as mkdirp from 'mkdirp'
import * as normalize from 'normalize-path'
import * as nodePath from 'path'

import { globalAny, TransformLinariaOption } from './types/index'

const RN_CSS_EXT = ['.css', '.scss', '.sass', '.less', '.styl', '.stylus']

export function getConfigFilePath (filePath: string) {
  return resolveMainFilePath(`${filePath.replace(nodePath.extname(filePath), '')}.config`)
}

export function getConfigContent (path: string) {
  if (!path) return {}
  const fileConfigPath = getConfigFilePath(path)
  const content = readConfig(fileConfigPath)
  return content
}

export function getStyleCode (code: string, basePath: string) {
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'typescript',
      'classProperties',
      'decorators-legacy'
    ]
  })

  const styleTypes = RN_CSS_EXT
  const styleSource: Record<string, string>[] = []
  t.isNode(ast) && traverse(ast, {
    ImportDeclaration (path) {
      const node = path.node
      const resource: string = node.source.value
      const ext = nodePath.extname(resource)
      // 是否是样式文件
      if (!styleTypes.includes(ext)) {
        return
      }
      let sourceName = ''
      if (node.specifiers.length) {
        sourceName = node.specifiers[0].local.name
      }
      const realPath = nodePath.resolve(basePath, resource)
      const fileName = nodePath.basename(realPath)
      styleSource.push({
        name: sourceName,
        path: realPath,
        fileName: fileName
      })
    }
  })
  return styleSource
}

export function isPageFile (file: string, sourceDir: string) {
  if ((/node_modules/.test(file)) || file.indexOf(sourceDir) === -1) return false
  const pagesList = globalAny.__taroAppPages || []
  const dirname = nodePath.dirname(file).replace(/\\/g, '/')
  const fileObj = nodePath.parse(file)
  const name = fileObj.name.split('.')[0]
  const filePath = `${dirname}/${name}`
  const filename = nodePath.basename(file).replace(nodePath.extname(file), '')
  return pagesList.includes(filePath) && !(filename.endsWith('.config'))
}

function isJSXSource (file: string, code: string) {
  let result = false
  if (/.(j|t)sx$/.test(file)) { // jsx,tsx 组件
    result = true
  } else if (file.endsWith('.ts')) { // ts 脚本
    result = false
  } else {
    // .js
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: [
        'jsx',
        'classProperties',
        'decorators-legacy'
      ]
    })
    t.isNode(ast) && traverse(ast, {
      JSXElement () {
        result = true
      }
    })
  }
  return result
}

export function isSourceComponent (file: string, code: string, sourceDir: string) {
  if ((/node_modules/.test(file)) || file.indexOf(sourceDir) === -1) return false
  return isJSXSource(file, code)
}

export function isNPMComponent (file: string, code: string, rn: any) {
  if (!rn?.resolve?.include?.find(npm => file.includes(nodePath.join('node_modules', npm)))) {
    return false
  }
  return isJSXSource(file, code)
}

export function getFileContent (fileName: string) {
  let code = ''
  if (!fs.existsSync(fileName)) return code
  try {
    code = fs.readFileSync(fileName, 'utf-8').toString()
  } catch (error) {
    code = ''
  }
  return code
}

export function getCommonStyle (appPath: string, basePath: string) {
  let styles: Record<string, string>[] = []
  // 读取入口文件的内容
  const jsExt: string[] = ['tsx', 'ts', 'jsx', 'js']
  let codeStr = ''
  // 先读带rn后缀的
  for (let i = 0; i < jsExt.length; i++) {
    const rnfilePath = `${appPath}.rn.${jsExt[i]}`
    const rnFileContent: string = getFileContent(rnfilePath)
    if (!rnFileContent) {
      codeStr = rnFileContent
      break
    }
  }
  // 不带rn后缀的
  if (!codeStr) {
    for (let i = 0; i < jsExt.length; i++) {
      const filePath = `${appPath}.${jsExt[i]}`
      const fileContent: string = getFileContent(filePath)
      if (fileContent) {
        codeStr = fileContent
        break
      }
    }
  }
  if (!codeStr) return styles
  styles = getStyleCode(codeStr, basePath)
  return styles
}

export function parseBase64Image (iconPath: string, baseRoot: string) {
  const imagePath = nodePath.join(baseRoot, iconPath)
  const fileMimeType = mimeType.lookup(imagePath)
  // 如果不是图片文件，则退出
  if (!fileMimeType.toString().includes('image')) {
    return iconPath
  }
  const data = fs.readFileSync(imagePath)
  const buff = Buffer.from(data).toString('base64')
  const base64 = 'data:' + fileMimeType + ';base64,' + buff
  return base64
}

export function transformLinaria ({ sourcePath, sourceCode }: TransformLinariaOption) {
  // TODO：配置 option, 小程序和 h5 可配置 webpack loader 更改配置，RN没有loader，所以默认不可配置，后续可考虑加配置
  const cacheDirectory = '.linaria-cache'
  const preprocessor = undefined
  const extension = '.linaria.css'
  const root = process.cwd()

  // 处理 option 参数
  const baseOutputFileName = sourcePath.replace(/\.[^.]+$/, extension)
  const outputFilename = normalize(
    nodePath.join(
      nodePath.isAbsolute(cacheDirectory)
        ? cacheDirectory
        : nodePath.join(process.cwd(), cacheDirectory),
      sourcePath.includes(root)
        ? nodePath.relative(root, baseOutputFileName)
        : baseOutputFileName
    )
  )
  const filename = nodePath.relative(process.cwd(), sourcePath)

  // linaria代码转换
  const result = require('linaria/lib/node').transform(sourceCode, {
    filename,
    // inputSourceMap: inputSourceMap ?? undefined,
    outputFilename,
    preprocessor
  })

  // 生成样式文件
  if (result.cssText) {
    const { cssText } = result
    // Read the file first to compare the content
    // Write the new content only if it's changed
    // This will prevent unnecessary WDS reloads
    let currentCssText

    try {
      currentCssText = fs.readFileSync(outputFilename, 'utf-8')
    } catch (e) {
      // Ignore error
    }

    if (currentCssText !== cssText) {
      mkdirp.sync(nodePath.dirname(outputFilename))
      fs.writeFileSync(outputFilename, cssText)
    }
  } else {
    // 没有生成 linaria 样式文件不走下面处理语法的逻辑
    return
  }

  const ast = parseSync(result.code, {
    filename,
    caller: { name: 'taro' }
  })

  // 遍历 ast 处理引入的样式文件和更改属性名
  let linariaStyle: types.Identifier
  /**
   * 维护对应组件和样式的关系
   * 比如 const Background = styled(View)`width: 100px;`
   * Map => [['Background', className]]
   */
  const componentClassMap = new Map()

  if (t.isNode(ast)) {
    traverse(ast, {
      Program: {
        enter (astPath) {
          linariaStyle = astPath.scope.generateUidIdentifier('linariaStyle')
          let lastImportAstPath
          for (const stmt of astPath.get('body')) {
            if (types.isImportDeclaration(stmt.node)) {
              lastImportAstPath = stmt
            }
          }
          if (lastImportAstPath) {
            const cssImportCSS = types.importDeclaration([types.importDefaultSpecifier(linariaStyle)], types.stringLiteral(outputFilename))
            lastImportAstPath.insertAfter(cssImportCSS)
          }
        }
      },
      ObjectExpression (astPath) {
        for (const node of astPath.node.properties) {
          if (types.isObjectProperty(node) && types.isIdentifier(node.key) && node.key.name === 'class') {
            if (types.isStringLiteral(node.value) && Object.keys(result.rules).includes(`.${node.value.value}`)) {
              const componentProperty = astPath.node.properties.find((property) => {
                if (types.isObjectProperty(property) && types.isIdentifier(property.key)) {
                  return property.key.name === 'name'
                }
              })
              if (types.isObjectProperty(componentProperty) && types.isStringLiteral(componentProperty.value)) {
                componentClassMap.set(componentProperty.value.value, node.value.value)
              }
              break
            }
          }
        }
      },
      JSXOpeningElement (astPath) {
        const { attributes, name: component } = astPath.node
        const className = types.isJSXIdentifier(component) && componentClassMap.get(component.name)
        if (className) {
          const index = attributes.findIndex(attribute =>
            types.isJSXAttribute(attribute) && attribute.name.name === 'style')

          let attribute = attributes[index]
          const linariaExpression = types.memberExpression(
            linariaStyle,
            types.identifier(className)
          )

          // 不处理行内字符串样式，删除 style 属性
          if (attribute && types.isJSXAttribute(attribute) && types.isStringLiteral(attribute.value)) {
            attributes.splice(index, 1)
            attribute = null as any
          }

          if (attribute) {
            if (types.isJSXAttribute(attribute) && types.isJSXExpressionContainer(attribute.value)) {
              const expression = attribute.value.expression
              let elements
              if (types.isArrayExpression(expression)) {
                elements = expression.elements
              } else {
                elements = expression
              }
              // 合并 style 对象
              // style = Object.assign({}, linariaStyle, { color: 'red' })
              const mergeStyleExpression = types.callExpression(
                types.identifier('Object.assign'),
                // @ts-ignore
                [types.objectExpression([])].concat(linariaExpression, elements)
              )
              attribute.value = types.jSXExpressionContainer(mergeStyleExpression)
            }
          } else {
            attributes.push(
              types.jsxAttribute(
                types.jsxIdentifier('style'),
                types.jsxExpressionContainer(linariaExpression)
              )
            )
          }
        }
      }
    })

    // 根据 ast 生成新的结果
    const transformResult = transformFromAstSync(ast, result.code, {
      filename,
      babelrc: false,
      configFile: false,
      sourceMaps: true,
      sourceFileName: filename,
      inputSourceMap: result.sourceMap
    })

    return transformResult
  }
}
