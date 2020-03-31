import * as fs from 'fs-extra'
import * as path from 'path'

import { AppConfig, TabBar } from '@tarojs/taro'
import * as prettier from 'prettier'
import traverse, { NodePath } from 'babel-traverse'
import * as t from 'babel-types'
import * as taroize from '@tarojs/taroize'
import wxTransformer from '@tarojs/transformer-wx'
import * as postcss from 'postcss'
import * as unitTransform from 'postcss-taro-unit-transform'

import {
  printLog,
  promoteRelativePath,
  resolveScriptPath,
  processStyleImports,
  getPkgVersion,
  pascalCase,
  emptyDirectory,
  processTypeEnum,
  CSS_IMPORT_REG,
  REG_TYPESCRIPT,
  REG_URL,
  REG_IMAGE,
  chalk
} from '@tarojs/helper'

import { generateMinimalEscapeCode } from '../util/astConvert'
import Creator from '../create/creator'
import babylonConfig from '../config/babylon'
import { IPrettierConfig } from '../util/types'
import { analyzeImportUrl, incrementId } from './helper'

const template = require('babel-template')

const prettierJSConfig: IPrettierConfig = {
  semi: false,
  singleQuote: true,
  parser: 'babel'
}

const OUTPUT_STYLE_EXTNAME = '.scss'

const WX_GLOBAL_FN = new Set<string>(['getApp', 'getCurrentPages', 'requirePlugin'])

interface IComponent {
  name: string,
  path: string
}

interface IImport {
  ast: t.File,
  name: string,
  wxs?: boolean
}

interface IParseAstOptions {
  ast: t.File,
  sourceFilePath: string,
  outputFilePath: string,
  importStylePath?: string | null,
  depComponents?: Set<IComponent>,
  imports?: IImport[],
  isApp?: boolean
}

interface ITaroizeOptions {
  json?: string,
  script?: string,
  wxml?: string,
  path?: string,
  rootPath?: string
}

function processStyleImports (content: string, processFn: (a: string, b: string) => string) {
  const style: string[] = []
  const imports: string[] = []
  const styleReg = new RegExp('.wxss')
  content = content.replace(CSS_IMPORT_REG, (m, $1, $2) => {
    if (styleReg.test($2)) {
      style.push(m)
      imports.push($2)
      if (processFn) {
        return processFn(m, $2)
      }
      return ''
    }
    if (processFn) {
      return processFn(m, $2)
    }
    return m
  })
  return {
    content,
    style,
    imports
  }
}

export default class Convertor {
  root: string
  convertRoot: string
  convertDir: string
  importsDir: string
  fileTypes: any
  pages: Set<string>
  components: Set<IComponent>
  hadBeenCopyedFiles: Set<string>
  hadBeenBuiltComponents: Set<string>
  hadBeenBuiltImports: Set<string>
  entryJSPath: string
  entryJSONPath: string
  entryStylePath: string
  entryJSON: AppConfig
  entryStyle: string

  constructor (root) {
    this.root = root
    this.convertRoot = path.join(this.root, 'taroConvert')
    this.convertDir = path.join(this.convertRoot, 'src')
    this.importsDir = path.join(this.convertDir, 'imports')
    this.fileTypes = {
      TEMPL: '.wxml',
      STYLE: '.wxss',
      CONFIG: '.json',
      SCRIPT: '.js'
    }
    this.pages = new Set<string>()
    this.components = new Set<IComponent>()
    this.hadBeenCopyedFiles = new Set<string>()
    this.hadBeenBuiltComponents = new Set<string>()
    this.hadBeenBuiltImports = new Set<string>()
    this.init()
  }

  init () {
    console.log(chalk.green('开始代码转换...'))
    this.initConvert()
    this.getApp()
    this.getPages()
    this.getSitemapLocation()
    this.getSubPackages()
  }

  initConvert () {
    if (fs.existsSync(this.convertRoot)) {
      emptyDirectory(this.convertRoot, { excludes: ['node_modules'] })
    } else {
      fs.ensureDirSync(this.convertRoot)
    }
  }

  wxsIncrementId = incrementId()

  parseAst ({
    ast,
    sourceFilePath,
    outputFilePath,
    importStylePath,
    depComponents,
    imports = [],
    isApp = false
  }: IParseAstOptions): { ast: t.File, scriptFiles: Set<string> } {
    const scriptFiles = new Set<string>()
    const self = this
    let componentClassName: string
    let needInsertImportTaro = false
    traverse(ast, {
      Program: {
        enter (astPath) {
          astPath.traverse({
            ClassDeclaration (astPath) {
              const node = astPath.node
              let isTaroComponent = false
              if (node.superClass) {
                astPath.traverse({
                  ClassMethod (astPath) {
                    if (astPath.get('key').isIdentifier({ name: 'render' })) {
                      astPath.traverse({
                        JSXElement () {
                          isTaroComponent = true
                        }
                      })
                    }
                  }
                })
                if (isTaroComponent) {
                  componentClassName = node.id.name
                }
              }
            },

            ClassExpression (astPath) {
              const node = astPath.node
              if (node.superClass) {
                let isTaroComponent = false
                astPath.traverse({
                  ClassMethod (astPath) {
                    if (astPath.get('key').isIdentifier({ name: 'render' })) {
                      astPath.traverse({
                        JSXElement () {
                          isTaroComponent = true
                        }
                      })
                    }
                  }
                })
                if (isTaroComponent) {
                  if (node.id === null) {
                    const parentNode = astPath.parentPath.node as t.VariableDeclarator
                    if (t.isVariableDeclarator(astPath.parentPath)) {
                      componentClassName = (parentNode.id as t.Identifier).name
                    }
                  } else {
                    componentClassName = node.id.name
                  }
                }
              }
            },
            ExportDefaultDeclaration (astPath) {
              const node = astPath.node
              const declaration = node.declaration
              if (
                declaration &&
                (declaration.type === 'ClassDeclaration' || declaration.type === 'ClassExpression')
              ) {
                const superClass = declaration.superClass
                if (superClass) {
                  let isTaroComponent = false
                  astPath.traverse({
                    ClassMethod (astPath) {
                      if (astPath.get('key').isIdentifier({ name: 'render' })) {
                        astPath.traverse({
                          JSXElement () {
                            isTaroComponent = true
                          }
                        })
                      }
                    }
                  })
                  if (isTaroComponent) {
                    componentClassName = declaration.id.name
                  }
                }
              }
            },
            ImportDeclaration (astPath) {
              const node = astPath.node
              const source = node.source
              const value = source.value
              analyzeImportUrl(self.root, sourceFilePath, scriptFiles, source, value)
            },
            CallExpression (astPath) {
              const node = astPath.node
              const calleePath = astPath.get('callee')
              const callee = calleePath.node
              if (callee.type === 'Identifier') {
                if (callee.name === 'require') {
                  const args = node.arguments as Array<t.StringLiteral>
                  const value = args[0].value
                  analyzeImportUrl(self.root, sourceFilePath, scriptFiles, args[0], value)
                } else if (WX_GLOBAL_FN.has(callee.name)) {
                  calleePath.replaceWith(
                    t.memberExpression(t.identifier('Taro'), callee as t.Identifier)
                  )
                  needInsertImportTaro = true
                }
              }
            },

            MemberExpression (astPath) {
              const node = astPath.node
              const object = node.object
              if (t.isIdentifier(object) && object.name === 'wx') {
                node.object = t.identifier('Taro')
                needInsertImportTaro = true
              }
            }
          })
        },
        exit (astPath) {
          const bodyNode = astPath.get('body') as NodePath<t.Node>[]
          const lastImport = bodyNode.filter(p => p.isImportDeclaration()).pop()
          const hasTaroImport = bodyNode.some(p => p.isImportDeclaration() && p.node.source.value === '@tarojs/taro')
          if (needInsertImportTaro && !hasTaroImport) {
            (astPath.node as t.Program).body.unshift(
              t.importDeclaration(
                [t.importDefaultSpecifier(t.identifier('Taro'))],
                t.stringLiteral('@tarojs/taro')
              )
            )
          }
          astPath.traverse({
            StringLiteral (astPath) {
              const value = astPath.node.value
              const extname = path.extname(value)
              if (extname && REG_IMAGE.test(extname) && !REG_URL.test(value)) {
                let imageRelativePath: string
                let sourceImagePath: string
                let outputImagePath: string
                if (path.isAbsolute(value)) {
                  sourceImagePath = path.join(self.root, value)
                } else {
                  sourceImagePath = path.resolve(sourceFilePath, '..', value)
                }
                imageRelativePath = promoteRelativePath(path.relative(sourceFilePath, sourceImagePath))
                outputImagePath = self.getDistFilePath(sourceImagePath)
                if (fs.existsSync(sourceImagePath)) {
                  self.copyFileToTaro(sourceImagePath, outputImagePath)
                  printLog(processTypeEnum.COPY, '图片', self.generateShowPath(outputImagePath))
                } else if (!t.isBinaryExpression(astPath.parent) || astPath.parent.operator !== '+'){
                  printLog(processTypeEnum.ERROR, '图片不存在', self.generateShowPath(sourceImagePath))
                }
                if (astPath.parentPath.isVariableDeclarator()) {
                  astPath.replaceWith(t.callExpression(t.identifier('require'), [t.stringLiteral(imageRelativePath)]))
                } else if (astPath.parentPath.isJSXAttribute()) {
                  astPath.replaceWith(t.jSXExpressionContainer(t.callExpression(t.identifier('require'), [t.stringLiteral(imageRelativePath)])))
                }
              }
            }
          })
          if (lastImport) {
            if (importStylePath) {
              lastImport.insertAfter(t.importDeclaration([], t.stringLiteral(promoteRelativePath(path.relative(sourceFilePath, importStylePath)))))
            }
            if (imports && imports.length) {
              imports.forEach(({ name, ast, wxs }) => {
                const importName = wxs ? name : pascalCase(name)
                if (componentClassName === importName) {
                  return
                }
                const importPath = path.join(self.importsDir, importName + (wxs ? self.wxsIncrementId() : '') + '.js')
                if (!self.hadBeenBuiltImports.has(importPath)) {
                  self.hadBeenBuiltImports.add(importPath)
                  self.writeFileToTaro(importPath, prettier.format(generateMinimalEscapeCode(ast), prettierJSConfig))
                }
                lastImport.insertAfter(template(`import ${importName} from '${promoteRelativePath(path.relative(outputFilePath, importPath))}'`, babylonConfig)())
              })
            }
            if (depComponents && depComponents.size) {
              depComponents.forEach(componentObj => {
                const name = pascalCase(componentObj.name)
                const component = componentObj.path
                lastImport.insertAfter(template(`import ${name} from '${promoteRelativePath(path.relative(sourceFilePath, component))}'`, babylonConfig)())
              })
            }

            if (isApp) {
              (astPath.node as t.Program).body.push(template(`Taro.render(<App />, document.getElementById('app'))`, babylonConfig)())
            }
          }
        }
      }
    })

    return {
      ast,
      scriptFiles
    }
  }

  getApp () {
    this.entryJSPath = path.join(this.root, `app${this.fileTypes.SCRIPT}`)
    this.entryJSONPath = path.join(this.root, `app${this.fileTypes.CONFIG}`)
    this.entryStylePath = path.join(this.root, `app${this.fileTypes.STYLE}`)
    try {
      this.entryJSON = JSON.parse(String(fs.readFileSync(this.entryJSONPath)))
      printLog(processTypeEnum.CONVERT, '入口文件', this.generateShowPath(this.entryJSPath))
      printLog(processTypeEnum.CONVERT, '入口配置', this.generateShowPath(this.entryJSONPath))
      if (fs.existsSync(this.entryStylePath)) {
        this.entryStyle = String(fs.readFileSync(this.entryStylePath))
        printLog(processTypeEnum.CONVERT, '入口样式', this.generateShowPath(this.entryStylePath))
      }
    } catch (err) {
      this.entryJSON = {}
      console.log(chalk.red(`app${this.fileTypes.CONFIG} 读取失败，请检查！`))
      process.exit(1)
    }
  }

  getPages () {
    const pages = this.entryJSON['pages']
    if (!pages || !pages.length) {
      console.log(chalk.red(`app${this.fileTypes.CONFIG} 配置有误，缺少页面相关配置`))
      return
    }
    this.pages = new Set(pages)
  }

  getSubPackages () {
    const subPackages = this.entryJSON['subpackages'] || this.entryJSON['subPackages']
    if (!subPackages || !subPackages.length) {
      return
    }
    subPackages.forEach(item => {
      if (item.pages && item.pages.length) {
        const root = item.root
        item.pages.forEach(page => {
          let pagePath = `${root}/${page}`
          pagePath = pagePath.replace(/\/{2,}/g, '/')
          this.pages.add(pagePath)
        })
      }
    })
  }

  getSitemapLocation () {
    const sitemapLocation = this.entryJSON['sitemapLocation']
    if (sitemapLocation) {
      const sitemapFilePath = path.join(this.root, sitemapLocation)
      if (fs.existsSync(sitemapFilePath)) {
        const outputFilePath = path.join(this.convertRoot, sitemapLocation)
        this.copyFileToTaro(sitemapFilePath, outputFilePath)
      }
    }
  }

  generateScriptFiles (files: Set<string>) {
    if (!files) {
      return
    }
    if (files.size) {
      files.forEach(file => {
        if (!fs.existsSync(file) || this.hadBeenCopyedFiles.has(file)) {
          return
        }
        const code = fs.readFileSync(file).toString()
        let outputFilePath = file.replace(this.root, this.convertDir)
        const extname = path.extname(outputFilePath)
        if (/\.wxs/.test(extname)) {
          outputFilePath += '.js'
        }
        const transformResult = wxTransformer({
          code,
          sourcePath: file,
          isNormal: true,
          isTyped: REG_TYPESCRIPT.test(file)
        })
        const { ast, scriptFiles } = this.parseAst({
          ast: transformResult.ast,
          outputFilePath,
          sourceFilePath: file
        })
        const jsCode = generateMinimalEscapeCode(ast)
        this.writeFileToTaro(outputFilePath, prettier.format(jsCode, prettierJSConfig))
        printLog(processTypeEnum.COPY, 'JS 文件', this.generateShowPath(outputFilePath))
        this.hadBeenCopyedFiles.add(file)
        this.generateScriptFiles(scriptFiles)
      })
    }
  }

  writeFileToTaro (dist: string, code: string) {
    fs.ensureDirSync(path.dirname(dist))
    fs.writeFileSync(dist, code)
  }

  copyFileToTaro (from: string, to: string, options?: fs.CopyOptionsSync) {
    const filename = path.basename(from)
    if (fs.statSync(from).isFile() && !path.extname(to)) {
      fs.ensureDir(to)
      return fs.copySync(from, path.join(to, filename), options)
    }
    fs.ensureDir(path.dirname(to))
    return fs.copySync(from, to, options)
  }

  getDistFilePath (src: string, extname?: string): string {
    if (!extname) return src.replace(this.root, this.convertDir)
    return src.replace(this.root, this.convertDir).replace(path.extname(src), extname)
  }

  generateShowPath (filePath: string): string {
    return filePath.replace(path.join(this.root, '/'), '').split(path.sep).join('/')
  }

  generateEntry () {
    try {
      const entryJS = String(fs.readFileSync(this.entryJSPath))
      const entryJSON = JSON.stringify(this.entryJSON)
      const entryDistJSPath = this.getDistFilePath(this.entryJSPath)
      const taroizeResult = taroize({
        json: entryJSON,
        script: entryJS,
        path: this.root,
        rootPath: this.root
      })
      const { ast, scriptFiles } = this.parseAst({
        ast: taroizeResult.ast,
        sourceFilePath: this.entryJSPath,
        outputFilePath: entryDistJSPath,
        importStylePath: this.entryStyle ? this.entryStylePath.replace(path.extname(this.entryStylePath), OUTPUT_STYLE_EXTNAME) : null,
        isApp: true
      })
      const jsCode = generateMinimalEscapeCode(ast)
      this.writeFileToTaro(entryDistJSPath, prettier.format(jsCode, prettierJSConfig))
      printLog(processTypeEnum.GENERATE, '入口文件', this.generateShowPath(entryDistJSPath))
      if (this.entryStyle) {
        this.traverseStyle(this.entryStylePath, this.entryStyle)
      }
      this.generateScriptFiles(scriptFiles)
      if (this.entryJSON.tabBar) {
        this.generateTabBarIcon(this.entryJSON.tabBar)
      }
    } catch (err) {
      console.log(err)
    }
  }

  generateTabBarIcon (tabBar: TabBar) {
    const { list = [] } = tabBar
    const icons = new Set<string>()
    if (Array.isArray(list) && list.length) {
      list.forEach(item => {
        if (typeof item.iconPath === 'string') icons.add(item.iconPath)
        if (typeof item.selectedIconPath === 'string') icons.add(item.selectedIconPath)
      })
      if (icons.size > 0) {
        Array.from(icons)
          .map(icon => path.join(this.root, icon))
          .forEach(iconPath => {
            const iconDistPath = this.getDistFilePath(iconPath)
            this.copyFileToTaro(iconPath, iconDistPath)
            printLog(processTypeEnum.COPY, 'TabBar 图标', this.generateShowPath(iconDistPath))
          })
      }
    }
  }

  traversePages () {
    this.pages.forEach(page => {
      const pagePath = path.join(this.root, page)
      const pageJSPath = pagePath + this.fileTypes.SCRIPT
      const pageDistJSPath = this.getDistFilePath(pageJSPath)
      const pageConfigPath = pagePath + this.fileTypes.CONFIG
      const pageStylePath = pagePath + this.fileTypes.STYLE
      const pageTemplPath = pagePath + this.fileTypes.TEMPL

      try {
        const depComponents = new Set<IComponent>()
        if (!fs.existsSync(pageJSPath)) {
          throw new Error(`页面 ${page} 没有 JS 文件！`)
        }
        const param: ITaroizeOptions = {}
        printLog(processTypeEnum.CONVERT, '页面文件', this.generateShowPath(pageJSPath))

        if (fs.existsSync(pageConfigPath)) {
          printLog(processTypeEnum.CONVERT, '页面配置', this.generateShowPath(pageConfigPath))
          const pageConfigStr = String(fs.readFileSync(pageConfigPath))
          const pageConfig = JSON.parse(pageConfigStr)
          const pageUsingComponnets = pageConfig.usingComponents
          if (pageUsingComponnets) {
            // 页面依赖组件
            const usingComponents = {}
            Object.keys(pageUsingComponnets).forEach(component => {
              let componentPath = path.resolve(pageConfigPath, '..', pageUsingComponnets[component])
              if (!fs.existsSync(resolveScriptPath(componentPath))) {
                componentPath = path.join(this.root, pageUsingComponnets[component])
              }

              if (pageUsingComponnets[component].startsWith('plugin://')) {
                console.log(component)
                usingComponents[component] = pageUsingComponnets[component]
              } else {
                depComponents.add({
                  name: component,
                  path: componentPath
                })
              }
            })
            if (Object.keys(usingComponents).length === 0) {
              delete pageConfig.usingComponents
            } else {
              pageConfig.usingComponents = usingComponents
            }

          }
          param.json = JSON.stringify(pageConfig)
        }
        param.script = String(fs.readFileSync(pageJSPath))
        if (fs.existsSync(pageTemplPath)) {
          printLog(processTypeEnum.CONVERT, '页面模板', this.generateShowPath(pageTemplPath))
          param.wxml = String(fs.readFileSync(pageTemplPath))
        }
        let pageStyle: string | null = null
        if (fs.existsSync(pageStylePath)) {
          printLog(processTypeEnum.CONVERT, '页面样式', this.generateShowPath(pageStylePath))
          pageStyle = String(fs.readFileSync(pageStylePath))
        }
        param.path = path.dirname(pageJSPath)
        param.rootPath = this.root
        const taroizeResult = taroize(param)
        const { ast, scriptFiles } = this.parseAst({
          ast: taroizeResult.ast,
          sourceFilePath: pageJSPath,
          outputFilePath: pageDistJSPath,
          importStylePath: pageStyle ? pageStylePath.replace(path.extname(pageStylePath), OUTPUT_STYLE_EXTNAME) : null,
          depComponents,
          imports: taroizeResult.imports
        })
        const jsCode = generateMinimalEscapeCode(ast)
        this.writeFileToTaro(pageDistJSPath, prettier.format(jsCode, prettierJSConfig))
        printLog(processTypeEnum.GENERATE, '页面文件', this.generateShowPath(pageDistJSPath))
        if (pageStyle) {
          this.traverseStyle(pageStylePath, pageStyle)
        }
        this.generateScriptFiles(scriptFiles)
        this.traverseComponents(depComponents)
      } catch (err) {
        printLog(processTypeEnum.ERROR, '页面转换', this.generateShowPath(pageJSPath))
        console.log(err)
      }
    })
  }

  traverseComponents (components: Set<IComponent>) {
    if (!components || !components.size) {
      return
    }
    components.forEach(componentObj => {
      const component = componentObj.path
      if (this.hadBeenBuiltComponents.has(component)) return
      this.hadBeenBuiltComponents.add(component)

      const componentJSPath = component + this.fileTypes.SCRIPT
      const componentDistJSPath = this.getDistFilePath(componentJSPath)
      const componentConfigPath = component + this.fileTypes.CONFIG
      const componentStylePath = component + this.fileTypes.STYLE
      const componentTemplPath = component + this.fileTypes.TEMPL

      try {
        const param: ITaroizeOptions = {}
        const depComponents = new Set<IComponent>()
        if (!fs.existsSync(componentJSPath)) {
          throw new Error(`组件 ${component} 没有 JS 文件！`)
        }
        printLog(processTypeEnum.CONVERT, '组件文件', this.generateShowPath(componentJSPath))
        if (fs.existsSync(componentConfigPath)) {
          printLog(processTypeEnum.CONVERT, '组件配置', this.generateShowPath(componentConfigPath))
          const componentConfigStr = String(fs.readFileSync(componentConfigPath))
          const componentConfig = JSON.parse(componentConfigStr)
          const componentUsingComponnets = componentConfig.usingComponents
          if (componentUsingComponnets) {
            // 页面依赖组件
            Object.keys(componentUsingComponnets).forEach(component => {
              let componentPath = path.resolve(componentConfigPath, '..', componentUsingComponnets[component])
              if (!fs.existsSync(resolveScriptPath(componentPath))) {
                componentPath = path.join(this.root, componentUsingComponnets[component])
              }
              depComponents.add({
                name: component,
                path: componentPath
              })
            })
            delete componentConfig.usingComponents
          }
          param.json = JSON.stringify(componentConfig)
        }
        param.script = String(fs.readFileSync(componentJSPath))
        if (fs.existsSync(componentTemplPath)) {
          printLog(processTypeEnum.CONVERT, '组件模板', this.generateShowPath(componentTemplPath))
          param.wxml = String(fs.readFileSync(componentTemplPath))
        }
        let componentStyle: string | null = null
        if (fs.existsSync(componentStylePath)) {
          printLog(processTypeEnum.CONVERT, '组件样式', this.generateShowPath(componentStylePath))
          componentStyle = String(fs.readFileSync(componentStylePath))
        }
        param.path = path.dirname(componentJSPath)
        param.rootPath = this.root
        const taroizeResult = taroize(param)
        const { ast, scriptFiles } = this.parseAst({
          ast: taroizeResult.ast,
          sourceFilePath: componentJSPath,
          outputFilePath: componentDistJSPath,
          importStylePath: componentStyle ? componentStylePath.replace(path.extname(componentStylePath), OUTPUT_STYLE_EXTNAME) : null,
          depComponents,
          imports: taroizeResult.imports
        })
        const jsCode = generateMinimalEscapeCode(ast)
        this.writeFileToTaro(componentDistJSPath, prettier.format(jsCode, prettierJSConfig))
        printLog(processTypeEnum.GENERATE, '组件文件', this.generateShowPath(componentDistJSPath))
        if (componentStyle) {
          this.traverseStyle(componentStylePath, componentStyle)
        }
        this.generateScriptFiles(scriptFiles)
        this.traverseComponents(depComponents)
      } catch (err) {
        printLog(processTypeEnum.ERROR, '组件转换', this.generateShowPath(componentJSPath))
        console.log(err)
      }
    })
  }

  async styleUnitTransform (filePath: string, content: string) {
    const postcssResult = await postcss([
      unitTransform()
    ]).process(content, {
      from: filePath
    })
    return postcssResult
  }

  async traverseStyle (filePath: string, style: string) {
    const { imports, content } = processStyleImports(style, (str, stylePath) => {
      let relativePath = stylePath
      if (path.isAbsolute(relativePath)) {
        relativePath = promoteRelativePath(path.relative(filePath, path.join(this.root, stylePath)))
      }
      return str.replace(stylePath, relativePath)
        .replace('.wxss', OUTPUT_STYLE_EXTNAME)
    })
    const styleDist = this.getDistFilePath(filePath, OUTPUT_STYLE_EXTNAME)
    const { css } = await this.styleUnitTransform(filePath, content)
    this.writeFileToTaro(styleDist, css)
    printLog(processTypeEnum.GENERATE, '样式文件', this.generateShowPath(styleDist))
    if (imports && imports.length) {
      imports.forEach(importItem => {
        const importPath = path.isAbsolute(importItem)
          ? path.join(this.root, importItem)
          : path.resolve(path.dirname(filePath), importItem)
        if (fs.existsSync(importPath)) {
          const styleText = fs.readFileSync(importPath).toString()
          this.traverseStyle(importPath, styleText)
        }
      })
    }
  }

  generateConfigFiles () {
    const creator = new Creator()
    const templateName = 'default'
    const configDir = path.join(this.convertRoot, 'config')
    const pkgPath = path.join(this.convertRoot, 'package.json')
    const projectName = 'taroConvert'
    const description = ''
    const version = getPkgVersion()
    const dateObj = new Date()
    const date = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1)}-${dateObj.getDate()}`
    creator.template(templateName, 'pkg', pkgPath, {
      description,
      projectName,
      version,
      css: 'sass',
      typescript: false,
      template: templateName
    })
    creator.template(templateName, path.join('config', 'index.js'), path.join(configDir, 'index.js'), {
      date,
      projectName
    })
    creator.template(templateName, path.join('config', 'dev.js'), path.join(configDir, 'dev.js'))
    creator.template(templateName, path.join('config', 'prod.js'), path.join(configDir, 'prod.js'))
    creator.template(templateName, 'project.config.json', path.join(this.convertRoot, 'project.config.json'), {
      description,
      projectName
    })
    creator.template(templateName, '.gitignore', path.join(this.convertRoot, '.gitignore'))
    creator.template(templateName, '.editorconfig', path.join(this.convertRoot, '.editorconfig'))
    creator.template(templateName, '.eslintrc', path.join(this.convertRoot, '.eslintrc'), {
      typescript: false
    })
    creator.template(templateName, path.join('src', 'index.html'), path.join(this.convertDir, 'index.html'))
    creator.fs.commit(() => {
      const pkgObj = JSON.parse(fs.readFileSync(pkgPath).toString())
      pkgObj.dependencies['@tarojs/with-weapp'] = `^${version}`
      fs.writeJSONSync(pkgPath, pkgObj, {
        spaces: 2,
        EOL: '\n'
      })
      printLog(processTypeEnum.GENERATE, '文件', this.generateShowPath(path.join(configDir, 'index.js')))
      printLog(processTypeEnum.GENERATE, '文件', this.generateShowPath(path.join(configDir, 'dev.js')))
      printLog(processTypeEnum.GENERATE, '文件', this.generateShowPath(path.join(configDir, 'prod.js')))
      printLog(processTypeEnum.GENERATE, '文件', this.generateShowPath(pkgPath))
      printLog(processTypeEnum.GENERATE, '文件', this.generateShowPath(path.join(this.convertRoot, 'project.config.json')))
      printLog(processTypeEnum.GENERATE, '文件', this.generateShowPath(path.join(this.convertRoot, '.gitignore')))
      printLog(processTypeEnum.GENERATE, '文件', this.generateShowPath(path.join(this.convertRoot, '.editorconfig')))
      printLog(processTypeEnum.GENERATE, '文件', this.generateShowPath(path.join(this.convertRoot, '.eslintrc')))
      printLog(processTypeEnum.GENERATE, '文件', this.generateShowPath(path.join(this.convertDir, 'index.html')))
      this.showLog()
    })
  }

  showLog () {
    console.log()
    console.log(`${chalk.green('✔ ')} 转换成功，请进入 ${chalk.bold('taroConvert')} 目录下使用 npm 或者 yarn 安装项目依赖后再运行！`)
  }

  run () {
    this.generateEntry()
    this.traversePages()
    this.generateConfigFiles()
  }
}
