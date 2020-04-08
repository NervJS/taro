import { transformSync, TransformOptions } from '@babel/core'
import traverse, { NodePath } from 'babel-traverse'
import { parserOpts } from '../loaders/utils/config'
import * as t from '@babel/types'
import { REG_TYPESCRIPT } from './constants'
import { kebabCase } from 'lodash'
import * as path from 'path'
import * as fs from 'fs'

const Status = {
  isSFC: false
}

export interface Options {
  sourcePath: string,
  code: string,
  sourceDir?: string,
  isRoot?: boolean,
}

interface Result {
  template?: string,
  componentProperies?: string[]
}

interface ComponentResult {
  name: string,
  path: string,
  type: string
}

export interface TransformResult extends Result {
  ast: t.File,
  code?: string,
  imageSrcs?: string,
  compressedTemplate?: string,
  sourcemap?: object,
  components: ComponentResult[]
}

export function getTransformResult (options: Options): TransformResult {
  const {code: source, sourcePath} = options
  // @ts-ignore
  const {ast, code} = transformSync(source, buildBabelTransformOptions(sourcePath))
  if (REG_TYPESCRIPT.test(sourcePath)) {
    // @ts-ignore
    const mainClassNode = ast!.program.body.find(v => {
      return t.isClassDeclaration(v)
    }) as t.ClassDeclaration | undefined
    if (mainClassNode) {
      resetTSClassProperty(mainClassNode.body.body)
    }
  }
  // TODO 暂时废弃
  const components = getComponents(ast, sourcePath)
  return {
    ast,
    code,
    components
  }
}

function getComponents (ast, sourcePath): ComponentResult[] {
  const components: ComponentResult[] = []
  const customComponents: Map<string, { sourcePath: string, type: string, imported?: string }> = new Map()
  let mainClass: NodePath<t.ClassDeclaration>
  traverse(ast, {
    ClassDeclaration (path) {
      mainClass = path as any
    },
    ClassExpression (path) {
      mainClass = path as any
    },
    // @ts-ignore
    JSXElement: {
      // @ts-ignore
      exit (path: NodePath<t.JSXElement>) {
        if (!mainClass) return
        const moduleNames = Object.keys(mainClass.scope.getAllBindings('module'))
        const id = path.node.openingElement.name
        if (
          t.isJSXIdentifier(id) &&
          !DEFAULT_Component_SET.has(id.name)
        ) {
          if (moduleNames.indexOf(id.name) !== -1) {
            const name = id.name
            const binding = mainClass.scope.getBinding(name)
            if (binding && t.isImportDeclaration(binding.path.parent)) {
              const sourcePath = binding.path.parent.source.value
              const specs = binding.path.parent.specifiers.filter(s => t.isImportSpecifier(s)) as Array<t.ImportSpecifier>
              if (binding.path.isImportDefaultSpecifier()) {
                customComponents.set(name, {
                  sourcePath,
                  type: 'default'
                })
              } else {
                const spec = specs.find(s => s.local.name === name && s.imported.name !== name)
                if (spec) {
                  customComponents.set(name, {
                    sourcePath,
                    type: 'pattern',
                    imported: spec.imported.name
                  })
                } else {
                  customComponents.set(name, {
                    sourcePath,
                    type: 'pattern'
                  })
                }
              }
            }
          }
        }
      }
    }
  })

  customComponents.forEach((component, name) => {
    if (name.startsWith('Taro') && component.sourcePath === '@tarojs/components') {
      return
    }
    if (component.sourcePath === 'react-native') return
    components.push({
      path: pathResolver(component.sourcePath, sourcePath),
      name: component.imported ? kebabCase(name) + '|' + kebabCase(component.imported) : kebabCase(name),
      type: component.type
    })
  })
  return components
}

export const buildBabelTransformOptions: (filePath) => TransformOptions = (filePath) => {
  Status.isSFC = false
  return {
    ast: true,
    filename: filePath,
    babelrc: false,
    presets: [
      [
        require('@babel/preset-typescript'),
        {
          isTSX: true,
          allExtensions: true
        }
      ]
    ],
    parserOpts
  }
}

/**
 * TS 编译器会把 class property 移到构造器，
 * 而小程序要求 `config` 和所有函数在初始化(after new Class)之后就收集到所有的函数和 config 信息，
 * 所以当如构造器里有 this.func = () => {...} 的形式，就给他转换成普通的 classProperty function
 * 如果有 config 就给他还原
 */
function resetTSClassProperty (body: (t.ClassMethod | t.ClassProperty)[]) {
  for (const method of body) {
    if (t.isClassMethod(method) && method.kind === 'constructor') {
      if (t.isBlockStatement(method.body)) {
        method.body.body = method.body.body.filter(statement => {
          if (t.isExpressionStatement(statement) && t.isAssignmentExpression(statement.expression)) {
            const expr = statement.expression
            const {left, right} = expr
            if (
              t.isMemberExpression(left) &&
              t.isThisExpression(left.object) &&
              t.isIdentifier(left.property)
            ) {
              if (
                (t.isArrowFunctionExpression(right) || t.isFunctionExpression(right))
                ||
                (left.property.name === 'config' && t.isObjectExpression(right))
              ) {
                const classProp = t.classProperty(left.property, right)
                body.push(classProp)
                return false
              }
            }
          }
          return true
        })
      }
    }
  }
}

export function pathResolver (source: string, location: string) {
  const extName = path.extname(source)
  const promotedPath = source
  if (!['js', 'tsx'].includes(extName)) {
    try {
      const pathExist = fs.existsSync(path.resolve(path.dirname(location), source, 'index.js'))
      const tsxPathExist = fs.existsSync(path.resolve(path.dirname(location), source, 'index.tsx'))
      if (pathExist || tsxPathExist) {
        let p = path.join(promotedPath, 'index')
        if (!p.startsWith('.')) {
          p = './' + p
        }
        return slash(p)
      }
      return slash(promotedPath)
    } catch (error) {
      return slash(promotedPath)
    }
  }
  return slash(promotedPath.split('.').slice(0, -1).join('.'))
}

function slash (input: string) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(input)
  const hasNonAscii = /[^\u0000-\u0080]+/.test(input)
  const hasChinese = /[^\u4e00-\u9fa5]+/.test(input)  // has Chinese characters

  if (isExtendedLengthPath || (hasNonAscii && !hasChinese)) {
    return input
  }

  return input.replace(/\\/g, '/')
}

export const DEFAULT_Component_SET = new Set<string>([
  'View',
  'ScrollView',
  'Swiper',
  'CoverView',
  'CoverImage',
  'Icon',
  'Text',
  'RichText',
  'Progress',
  'Button',
  'Checkbox',
  'Form',
  'Input',
  'Label',
  'Picker',
  'PickerView',
  'PickerViewColumn',
  'Radio',
  'RadioGroup',
  'CheckboxGroup',
  'Slider',
  'Switch',
  'Textarea',
  'Navigator',
  'Audio',
  'Image',
  'Video',
  'Camera',
  'LivePlayer',
  'LivePusher',
  'Map',
  'Canvas',
  'OpenData',
  'WebView',
  'SwiperItem',
  'MovableArea',
  'MovableView',
  'FunctionalPageNavigator',
  'Ad',
  'Block',
  'Import',
  'OfficialAccount',
  'Template',
  'Editor'
])
