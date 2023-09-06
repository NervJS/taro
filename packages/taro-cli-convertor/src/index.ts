// import { ProjectType } from './../../taro-plugin-mini-ci/src/BaseCi';
import template from '@babel/template'
import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import { Creator } from '@tarojs/cli'
import {
  chalk,
  CSS_IMPORT_REG,
  emptyDirectory,
  fs,
  pascalCase,
  printLog,
  processTypeEnum,
  promoteRelativePath,
  REG_IMAGE,
  REG_TYPESCRIPT,
  REG_URL,
  resolveScriptPath,
} from '@tarojs/helper'
import * as taroize from '@tarojs/taroize'
import wxTransformer from '@tarojs/transformer-wx'
import * as path from 'path'
import Processors from 'postcss'
import * as unitTransform from 'postcss-taro-unit-transform'
import * as prettier from 'prettier'

import {
  analyzeImportUrl,
  copyFileToTaro,
  getMatchUnconvertDir,
  getPkgVersion,
  getWxssImports,
  handleThirdPartyLib,
  handleUnconvertDir,
  incrementId,
  transRelToAbsPath,
} from './util'
import { generateMinimalEscapeCode } from './util/astConvert'

import type { ParserOptions } from '@babel/parser'
import type { AppConfig, TabBar } from '@tarojs/taro'

const prettierJSConfig: prettier.Options = {
  semi: false,
  singleQuote: true,
  parser: 'babel',
}

const babylonConfig: ParserOptions = {
  sourceType: 'module',
  plugins: [
    'typescript',
    'classProperties',
    'jsx',
    'asyncGenerators',
    'objectRestSpread',
    'decorators',
    'dynamicImport',
  ],
}

const OUTPUT_STYLE_EXTNAME = '.scss'

const WX_GLOBAL_FN = new Set<string>(['getApp', 'getCurrentPages', 'requirePlugin', 'Behavior'])

interface IComponent {
  name: string
  path: string
}

interface IImport {
  ast: t.File
  name: string
  wxs?: boolean
}

interface IParseAstOptions {
  ast: t.File
  sourceFilePath: string
  outputFilePath: string
  importStylePath?: string | null
  depComponents?: Set<IComponent>
  imports?: IImport[]
  isApp?: boolean
}

interface ITaroizeOptions {
  json?: string
  script?: string
  wxml?: string
  path?: string
  rootPath?: string
  scriptPath?: string
}

// convert.config,json配置参数
interface IConvertConfig {
  external: string[] // 不做转换的目录
  nodePath: string[] // 搜索三方库的目录
}

function processStyleImports (content: string, processFn: (a: string, b: string) => string) {
  // 获取css中的引用样式文件路径集合
  const imports: string[] = getWxssImports(content)

  // 将引用的样式文件路径转换为相对路径，后缀名转换为.scss
  const styleReg = new RegExp('.wxss')
  content = content.replace(CSS_IMPORT_REG, (m, _$1, $2) => {
    if (styleReg.test($2)) {
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
    imports,
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
  entryJSON: AppConfig & { usingComponents?: Record<string, string> }
  entryStyle: string
  entryUsingComponents: Record<string, string>
  framework: 'react' | 'vue'
  isTsProject: boolean
  miniprogramRoot: string
  convertConfig: IConvertConfig
  external: string[]

  constructor (root, isTsProject) {
    this.root = root
    this.convertRoot = path.join(this.root, 'taroConvert')
    this.convertDir = path.join(this.convertRoot, 'src')
    this.importsDir = path.join(this.convertDir, 'imports')
    this.isTsProject = isTsProject
    if (isTsProject) {
      this.miniprogramRoot = path.join(this.root, 'miniprogram')
    }
    this.fileTypes = {
      TEMPL: '.wxml',
      STYLE: '.wxss',
      CONFIG: '.json',
      SCRIPT: isTsProject ? '.ts' : '.js',
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
    this.getConvertConfig()
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
    this.convertSelfDefinedConfig()
  }

  wxsIncrementId = incrementId()

  parseAst ({ ast, sourceFilePath, outputFilePath, importStylePath, depComponents, imports = [] }: IParseAstOptions): {
    ast: t.File
    scriptFiles: Set<string>
  } {
    const scriptFiles = new Set<string>()
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    let componentClassName: string
    let needInsertImportTaro = false
    const setDataInfo = new Map()
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
                        },
                      })
                    }
                  },
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
                        },
                      })
                    }
                  },
                })
                if (isTaroComponent) {
                  if (node.id === null) {
                    const parentNode = astPath.parentPath.node as t.VariableDeclarator
                    if (t.isVariableDeclarator(astPath.parentPath)) {
                      componentClassName = (parentNode.id as t.Identifier).name
                    }
                  } else {
                    componentClassName = node.id!.name
                  }
                }
              }
            },
            ExportDefaultDeclaration (astPath) {
              const node = astPath.node
              const declaration = node.declaration
              if (declaration && (declaration.type === 'ClassDeclaration' || declaration.type === 'ClassExpression')) {
                const superClass = declaration.superClass
                if (superClass) {
                  let isTaroComponent = false
                  astPath.traverse({
                    ClassMethod (astPath) {
                      if (astPath.get('key').isIdentifier({ name: 'render' })) {
                        astPath.traverse({
                          JSXElement () {
                            isTaroComponent = true
                          },
                        })
                      }
                    },
                  })
                  if (isTaroComponent) {
                    componentClassName = declaration.id!.name
                  }
                }
              }
            },
            ImportDeclaration (astPath) {
              const node = astPath.node
              const source = node.source
              const value = source.value
              analyzeImportUrl(self.root, sourceFilePath, scriptFiles, source, value, self.isTsProject)
            },
            CallExpression (astPath) {
              const node = astPath.node
              const calleePath = astPath.get('callee')
              const callee = calleePath.node
              if (callee.type === 'Identifier') {
                if (callee.name === 'require') {
                  const args = node.arguments as Array<t.StringLiteral>
                  const value = args[0].value
                  analyzeImportUrl(self.root, sourceFilePath, scriptFiles, args[0], value, self.isTsProject)
                } else if (WX_GLOBAL_FN.has(callee.name)) {
                  calleePath.replaceWith(t.memberExpression(t.identifier('Taro'), callee as t.Identifier))
                  needInsertImportTaro = true
                }
              } else if (callee.type === 'MemberExpression') {
                // find this.setData({}) ,includes this & _this
                if (
                  t.isThisExpression(callee.object) ||
                  (t.isIdentifier(callee.object) && callee.object.name === '_this')
                ) {
                  if (t.isIdentifier(callee.property)) {
                    if (callee.property.name === 'setData') {
                      // 把scope存为key,后续判断是否跟this.data.xx在同一个作用域
                      setDataInfo.set(astPath.scope, astPath)
                    }
                  }
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
            },
          })
        },
        exit (astPath) {
          const bodyNode = astPath.get('body') as NodePath<t.Node>[]
          const lastImport = bodyNode.filter((p) => p.isImportDeclaration()).pop()
          const hasTaroImport = bodyNode.some((p) => p.isImportDeclaration() && p.node.source.value === '@tarojs/taro')
          if (needInsertImportTaro && !hasTaroImport) {
            (astPath.node as t.Program).body.unshift(
              t.importDeclaration([t.importDefaultSpecifier(t.identifier('Taro'))], t.stringLiteral('@tarojs/taro'))
            )
          }
          astPath.traverse({
            StringLiteral (astPath) {
              const value = astPath.node.value
              const extname = path.extname(value)
              if (extname && REG_IMAGE.test(extname) && !REG_URL.test(value)) {
                let sourceImagePath: string
                if (path.isAbsolute(value)) {
                  sourceImagePath = path.join(self.root, value)
                } else {
                  sourceImagePath = path.resolve(sourceFilePath, '..', value)
                }
                const imageRelativePath = promoteRelativePath(path.relative(sourceFilePath, sourceImagePath))
                const outputImagePath = self.getDistFilePath(sourceImagePath)
                if (fs.existsSync(sourceImagePath)) {
                  copyFileToTaro(sourceImagePath, outputImagePath)
                  printLog(processTypeEnum.COPY, '图片', self.generateShowPath(outputImagePath))
                } else if (!t.isBinaryExpression(astPath.parent) || astPath.parent.operator !== '+') {
                  printLog(processTypeEnum.ERROR, '图片不存在', self.generateShowPath(sourceImagePath))
                }
                if (astPath.parentPath.isVariableDeclarator()) {
                  astPath.replaceWith(t.callExpression(t.identifier('require'), [t.stringLiteral(imageRelativePath)]))
                } else if (astPath.parentPath.isJSXAttribute()) {
                  astPath.replaceWith(
                    t.jSXExpressionContainer(
                      t.callExpression(t.identifier('require'), [t.stringLiteral(imageRelativePath)])
                    )
                  )
                }
              }
            },
            AssignmentExpression (astPath) {
              const node = astPath.node
              // 处理this.data.xx = XXX 的情况，因为此表达式在taro暂不支持
              if (t.isMemberExpression(node.left)) {
                if (t.isMemberExpression(node.left.object)) {
                  if (t.isThisExpression(node.left.object.object)) {
                    if (t.isIdentifier(node.left.object.property)) {
                      if (node.left.object.property.name === 'data') {
                        // 已确认左边是this.data
                        if (t.isIdentifier(node.left.property)) {
                          // 判断在this.data.xx=XX的同一作用域内是否有setData
                          let hasSetDataInSameScope = 0
                          let setDataAstPath: any
                          if (setDataInfo) {
                            for (const [key, value] of setDataInfo) {
                              if (key === astPath.scope) {
                                hasSetDataInSameScope = 1
                                setDataAstPath = value
                                break
                              }
                            }
                          }
                          const lastName = node.left.property.name
                          // 右边不能确定数据类型，所以直接存整个对象
                          const rightValue = node.right
                          if (hasSetDataInSameScope === 1) {
                            // this.data.xx = XX 和 setData 在同一作用域，要合并
                            let hasobjexp = 0
                            let singleArg: any
                            for (singleArg of setDataAstPath.node.arguments) {
                              if (t.isObjectExpression(singleArg)) {
                                hasobjexp = 1
                                break
                              }
                            }
                            if (hasobjexp === 1) {
                              // 有ObjectExpression，往更里层插入objectProperty新值
                              singleArg.properties.push(t.objectProperty(t.identifier(lastName), rightValue))
                            } else {
                              // 插入一个ObjectExpression
                              setDataAstPath.node.arguments.push(
                                t.objectExpression([t.objectProperty(t.identifier(lastName), rightValue)])
                              )
                            }
                            astPath.remove()
                          } else {
                            // 此作用域只有this.data.xx = XX ,直接转换为setData的形式
                            const memberExp = t.memberExpression(t.thisExpression(), t.identifier('setData'))
                            const objExp = t.objectExpression([t.objectProperty(t.identifier(lastName), rightValue)])
                            astPath.replaceWith(t.expressionStatement(t.callExpression(memberExp, [objExp])))
                          }
                          console.log(`语法  this.data.xx=XX暂不支持,会被替换为setData()`)
                        }
                      }
                    }
                  }
                }
              }
            },
          })
          if (lastImport) {
            if (importStylePath) {
              lastImport.insertAfter(
                t.importDeclaration(
                  [],
                  t.stringLiteral(promoteRelativePath(path.relative(sourceFilePath, importStylePath)))
                )
              )
            }
            if (imports && imports.length) {
              imports.forEach(({ name, ast, wxs }) => {
                const importName = wxs ? name : pascalCase(name)
                if (componentClassName === importName) {
                  return
                }
                const importPath = path.join(
                  self.importsDir,
                  importName + (wxs ? self.wxsIncrementId() : '') + (self.isTsProject ? '.ts' : '.js')
                )
                if (!self.hadBeenBuiltImports.has(importPath)) {
                  self.hadBeenBuiltImports.add(importPath)
                  self.writeFileToTaro(importPath, prettier.format(generateMinimalEscapeCode(ast), prettierJSConfig))
                }
                lastImport.insertAfter(
                  template(
                    `import ${importName} from '${promoteRelativePath(path.relative(outputFilePath, importPath))}'`,
                    babylonConfig
                  )() as t.Statement
                )
              })
            }
            if (depComponents && depComponents.size) {
              depComponents.forEach((componentObj) => {
                const name = pascalCase(componentObj.name)
                let componentPath = componentObj.path
                if (componentPath.indexOf(self.root) !== -1) {
                  componentPath = path.relative(sourceFilePath, componentPath)
                }
                lastImport.insertAfter(
                  template(
                    `import ${name} from '${promoteRelativePath(componentPath)}'`,
                    babylonConfig
                  )() as t.Statement
                )
              })
            }
          }
        },
      },
    })

    return {
      ast,
      scriptFiles,
    }
  }

  convertSelfDefinedConfig () {
    // 搬运自定义的配置文件
    const selfDefinedConfig: any = []
    // 目前只有tsconfig.json，还有的话继续加到array里
    selfDefinedConfig[0] = `tsconfig${this.fileTypes.CONFIG}`
    for (const tempConfig of selfDefinedConfig) {
      const tempConfigPath = path.join(this.root, tempConfig)
      if (fs.existsSync(tempConfig)) {
        try {
          const outputFilePath = path.join(this.convertRoot, tempConfig)
          copyFileToTaro(tempConfigPath, outputFilePath)
        } catch (err) {
          // 失败不退出，仅提示
          console.log(chalk.red(`tsconfig${this.fileTypes.CONFIG} 拷贝失败，请检查！`))
        }
      }
    }
  }

  getConvertConfig () {
    // 处理convert.config.json，并存储到convertConfig中
    const convertJsonPath: string = path.join(this.root, `convert.config${this.fileTypes.CONFIG}`)
    if (fs.existsSync(convertJsonPath)) {
      try {
        const convertJson = JSON.parse(String(fs.readFileSync(convertJsonPath)))
        this.convertConfig = { ...convertJson }
        this.convertConfig.external = transRelToAbsPath(convertJsonPath, this.convertConfig.external)
      } catch (err) {
        console.log(chalk.red(`convert.config${this.fileTypes.CONFIG} 读取失败，请检查！`))
        process.exit(1)
      }
    }
  }

  getApp () {
    if (this.isTsProject) {
      this.entryJSPath = path.join(this.miniprogramRoot, `app${this.fileTypes.SCRIPT}`)
      this.entryJSONPath = path.join(this.miniprogramRoot, `app${this.fileTypes.CONFIG}`)
      this.entryStylePath = path.join(this.miniprogramRoot, `app${this.fileTypes.STYLE}`)
    } else {
      this.entryJSPath = path.join(this.root, `app${this.fileTypes.SCRIPT}`)
      this.entryJSONPath = path.join(this.root, `app${this.fileTypes.CONFIG}`)
      this.entryStylePath = path.join(this.root, `app${this.fileTypes.STYLE}`)
    }

    try {
      this.entryJSON = JSON.parse(String(fs.readFileSync(this.entryJSONPath)))

      const using = this.entryJSON.usingComponents
      if (using && Object.keys(using).length) {
        for (const key in using) {
          if (using[key].startsWith('plugin://')) continue
          const componentPath = using[key]
          // 非三方库的路径需要处理
          if (!this.isThirdPartyLib(componentPath, this.root)) {
            using[key] = path.join(this.root, componentPath)
          }
        }
        this.entryUsingComponents = using
        delete this.entryJSON.usingComponents
      }

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
    const pages = this.entryJSON.pages
    if (!pages || !pages.length) {
      console.log(chalk.red(`app${this.fileTypes.CONFIG} 配置有误，缺少页面相关配置`))
      return
    }
    this.pages = new Set(pages)
  }

  getSubPackages () {
    const subPackages = this.entryJSON.subpackages || this.entryJSON.subPackages
    if (!subPackages || !subPackages.length) {
      return
    }
    subPackages.forEach((item) => {
      if (item.pages && item.pages.length) {
        const root = item.root
        item.pages.forEach((page) => {
          let pagePath = `${root}/${page}`
          pagePath = pagePath.replace(/\/{2,}/g, '/')
          this.pages.add(pagePath)
        })
      }
    })
  }

  getSitemapLocation () {
    // eslint-disable-next-line dot-notation
    const sitemapLocation = this.entryJSON['sitemapLocation']
    if (sitemapLocation) {
      const sitemapFilePath = path.join(this.root, sitemapLocation)
      if (fs.existsSync(sitemapFilePath)) {
        const outputFilePath = path.join(this.convertRoot, sitemapLocation)
        copyFileToTaro(sitemapFilePath, outputFilePath)
      }
    }
  }

  generateScriptFiles (files: Set<string>) {
    if (!files) {
      return
    }
    if (files.size) {
      files.forEach((file) => {
        if (!fs.existsSync(file) || this.hadBeenCopyedFiles.has(file)) {
          return
        }

        // 处理三方库引用，可在convert.config.json中nodePath字段自定义配置配置，默认node_modules
        if (!path.isAbsolute(file)) {
          handleThirdPartyLib(file, this.convertConfig?.nodePath, this.root, this.convertRoot)
          return
        }

        // 处理不转换的目录，可在convert.config.json中external字段配置
        const matchUnconvertDir: string | null = getMatchUnconvertDir(file, this.convertConfig?.external)
        if (matchUnconvertDir !== null) {
          handleUnconvertDir(matchUnconvertDir, this.root, this.convertRoot)
          return
        }

        const code = fs.readFileSync(file).toString()
        let outputFilePath = file.replace(this.isTsProject ? this.miniprogramRoot : this.root, this.convertDir)
        const extname = path.extname(outputFilePath)
        if (/\.wxs/.test(extname)) {
          outputFilePath += '.js'
        }
        const transformResult = wxTransformer({
          code,
          sourcePath: file,
          isNormal: true,
          isTyped: REG_TYPESCRIPT.test(file),
        })
        const { ast, scriptFiles } = this.parseAst({
          ast: transformResult.ast,
          outputFilePath,
          sourceFilePath: file,
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

  // 自定义组件，如果组件文件命名为index，引入时可省略index这一层，解析时需加上
  getComponentPath (component: string, extname: string) {
    if (fs.existsSync(component + extname)) return component + extname
    else return component + '/index' + extname
  }

  getDistFilePath (src: string, extname?: string): string {
    if (!extname) return src.replace(this.isTsProject ? this.miniprogramRoot : this.root, this.convertDir)
    return src
      .replace(this.isTsProject ? this.miniprogramRoot : this.root, this.convertDir)
      .replace(path.extname(src), extname)
  }

  getConfigFilePath (src: string) {
    const { dir, name } = path.parse(src)
    return path.join(dir, name + '.config.js')
  }

  writeFileToConfig (src: string, json = '{}') {
    const configSrc = this.getConfigFilePath(src)
    const code = `export default ${json}`
    this.writeFileToTaro(configSrc, prettier.format(code, prettierJSConfig))
  }

  generateShowPath (filePath: string): string {
    return filePath.replace(path.join(this.root, '/'), '').split(path.sep).join('/')
  }

  private formatFile (jsCode: string, template = '') {
    let code = jsCode
    const config = { ...prettierJSConfig }
    if (this.framework === 'vue') {
      code = `
${template}
<script>
${code}
</script>
      `
      config.parser = 'vue'
      config.semi = false
      config.htmlWhitespaceSensitivity = 'ignore'
    }
    return prettier.format(code, config)
  }

  generateEntry () {
    try {
      const entryJS = String(fs.readFileSync(this.entryJSPath))
      const entryJSON = JSON.stringify(this.entryJSON)
      const entryDistJSPath = this.getDistFilePath(this.entryJSPath)
      const taroizeResult = taroize({
        json: entryJSON,
        script: entryJS,
        scriptPath: this.entryJSPath,
        path: this.root,
        rootPath: this.root,
        framework: this.framework,
        isApp: true,
      })
      const { ast, scriptFiles } = this.parseAst({
        ast: taroizeResult.ast,
        sourceFilePath: this.entryJSPath,
        outputFilePath: entryDistJSPath,
        importStylePath: this.entryStyle
          ? this.entryStylePath.replace(path.extname(this.entryStylePath), OUTPUT_STYLE_EXTNAME)
          : null,
        isApp: true,
      })
      const jsCode = generateMinimalEscapeCode(ast)
      this.writeFileToTaro(entryDistJSPath, jsCode)
      this.writeFileToConfig(entryDistJSPath, entryJSON)
      printLog(processTypeEnum.GENERATE, '入口文件', this.generateShowPath(entryDistJSPath))
      if (this.entryStyle) {
        this.traverseStyle(this.entryStylePath, this.entryStyle)
      }
      this.generateScriptFiles(scriptFiles)
      if (this.entryJSON.tabBar) {
        this.generateTabBarIcon(this.entryJSON.tabBar)
        this.generateCustomTabbar(this.entryJSON.tabBar)
      }
    } catch (err) {
      console.log(err)
    }
  }

  generateTabBarIcon (tabBar: TabBar) {
    const { list = [] } = tabBar
    const icons = new Set<string>()
    if (Array.isArray(list) && list.length) {
      list.forEach((item) => {
        if (typeof item.iconPath === 'string') icons.add(item.iconPath)
        if (typeof item.selectedIconPath === 'string') icons.add(item.selectedIconPath)
      })
      if (icons.size > 0) {
        Array.from(icons)
          .map((icon) => path.join(this.root, icon))
          .forEach((iconPath) => {
            const iconDistPath = this.getDistFilePath(iconPath)
            copyFileToTaro(iconPath, iconDistPath)
            printLog(processTypeEnum.COPY, 'TabBar 图标', this.generateShowPath(iconDistPath))
          })
      }
    }
  }

  generateCustomTabbar (tabBar: TabBar) {
    if (!tabBar.custom) return

    const customTabbarPath = path.join(this.root, 'custom-tab-bar')
    if (fs.existsSync(customTabbarPath)) {
      const customTabbarDistPath = this.getDistFilePath(customTabbarPath)
      copyFileToTaro(customTabbarPath, customTabbarDistPath)
      printLog(processTypeEnum.COPY, '自定义 TabBar', this.generateShowPath(customTabbarDistPath))
    }
  }

  private getComponentDest (file: string) {
    if (this.framework === 'react') {
      return file
    }

    return path.join(path.dirname(file), path.basename(file, path.extname(file)) + '.vue')
  }

  // 判断是否是三方库
  isThirdPartyLib (modulePath: string, curPageDir: string) {
    // 相对路径和带根目录的路径都不是三方库
    if (modulePath.indexOf('.') === 0 || modulePath.indexOf('/') === 0 || modulePath.indexOf(this.root) !== -1) {
      return false
    }

    // 通过格式如component/component引用组件
    // app.json中引用组件
    if (curPageDir === this.root) {
      if (fs.existsSync(resolveScriptPath(path.join(curPageDir, modulePath)))) {
        return false
      }
    } else {
      // 页面中引用组件
      if (
        fs.existsSync(resolveScriptPath(path.join(curPageDir, modulePath))) ||
        fs.existsSync(resolveScriptPath(path.join(this.root, modulePath)))
      ) {
        return false
      }
    }

    return true
  }

  // 判断三方库是否安装
  isInNodeModule (modulePath: string) {
    const nodeModules = path.resolve(this.root, 'node_modules')
    if (!fs.existsSync(nodeModules)) {
      return false
    }
    const modules = fs.readdirSync(nodeModules)
    const parts = modulePath.split('/')
    if (modules.indexOf(parts[0]) === -1) {
      return false
    }
    return true
  }

  traversePages () {
    this.pages.forEach((page) => {
      const pagePath = this.isTsProject ? path.join(this.miniprogramRoot, page) : path.join(this.root, page)

      // 处理不转换的页面，可在convert.config.json中external字段配置
      const matchUnconvertDir: string | null = getMatchUnconvertDir(pagePath, this.convertConfig?.external)
      if (matchUnconvertDir !== null) {
        handleUnconvertDir(matchUnconvertDir, this.root, this.convertRoot)
        return
      }

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

        let pageConfig
        if (fs.existsSync(pageConfigPath)) {
          printLog(processTypeEnum.CONVERT, '页面配置', this.generateShowPath(pageConfigPath))
          const pageConfigStr = String(fs.readFileSync(pageConfigPath))
          pageConfig = JSON.parse(pageConfigStr)
        } else if (this.entryUsingComponents) {
          pageConfig = {}
        }
        if (pageConfig) {
          if (this.entryUsingComponents) {
            pageConfig.usingComponents = {
              ...pageConfig.usingComponents,
              ...this.entryUsingComponents,
            }
          }
          const pageUsingComponents = pageConfig.usingComponents
          if (pageUsingComponents) {
            // 页面依赖组件
            const usingComponents = {}
            Object.keys(pageUsingComponents).forEach((component) => {
              const unResolveComponentPath: string = pageUsingComponents[component]
              if (unResolveComponentPath.startsWith('plugin://')) {
                usingComponents[component] = unResolveComponentPath
              } else if (this.isThirdPartyLib(unResolveComponentPath, path.resolve(pagePath, '..'))) {
                handleThirdPartyLib(unResolveComponentPath, this.convertConfig?.nodePath, this.root, this.convertRoot)
              } else {
                let componentPath
                if (unResolveComponentPath.startsWith(this.root)) {
                  componentPath = unResolveComponentPath
                } else {
                  componentPath = path.resolve(pageConfigPath, '..', pageUsingComponents[component])
                  // 支持将组件库放在工程根目录下
                  if (!fs.existsSync(resolveScriptPath(componentPath))) {
                    componentPath = path.join(this.root, pageUsingComponents[component])
                  }
                }

                depComponents.add({
                  name: component,
                  path: componentPath,
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
        param.scriptPath = pageJSPath
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
        const taroizeResult = taroize({
          ...param,
          framework: this.framework,
        })
        const { ast, scriptFiles } = this.parseAst({
          ast: taroizeResult.ast,
          sourceFilePath: pageJSPath,
          outputFilePath: pageDistJSPath,
          importStylePath: pageStyle ? pageStylePath.replace(path.extname(pageStylePath), OUTPUT_STYLE_EXTNAME) : null,
          depComponents,
          imports: taroizeResult.imports,
        })
        const jsCode = generateMinimalEscapeCode(ast)
        this.writeFileToTaro(this.getComponentDest(pageDistJSPath), this.formatFile(jsCode, taroizeResult.template))
        printLog(processTypeEnum.GENERATE, 'writeFileToTaro', this.generateShowPath(pageDistJSPath))
        this.writeFileToConfig(pageDistJSPath, param.json)
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
    components.forEach((componentObj) => {
      const component = componentObj.path
      if (this.hadBeenBuiltComponents.has(component)) return
      this.hadBeenBuiltComponents.add(component)

      const componentJSPath = this.getComponentPath(component, this.fileTypes.SCRIPT)
      const componentDistJSPath = this.getDistFilePath(componentJSPath)
      const componentConfigPath = this.getComponentPath(component, this.fileTypes.CONFIG)
      const componentStylePath = this.getComponentPath(component, this.fileTypes.STYLE)
      const componentTemplPath = this.getComponentPath(component, this.fileTypes.TEMPL)

      try {
        const param: ITaroizeOptions = {}
        const depComponents = new Set<IComponent>()
        if (!fs.existsSync(componentJSPath)) {
          throw new Error(`自定义组件 ${component} 没有 JS 文件！`)
        }
        printLog(processTypeEnum.CONVERT, '组件文件', this.generateShowPath(componentJSPath))
        if (fs.existsSync(componentConfigPath)) {
          printLog(processTypeEnum.CONVERT, '组件配置', this.generateShowPath(componentConfigPath))
          const componentConfigStr = String(fs.readFileSync(componentConfigPath))
          const componentConfig = JSON.parse(componentConfigStr)
          const componentUsingComponnets = componentConfig.usingComponents
          if (componentUsingComponnets) {
            // 页面依赖组件
            Object.keys(componentUsingComponnets).forEach((component) => {
              let componentPath = path.resolve(componentConfigPath, '..', componentUsingComponnets[component])
              if (!fs.existsSync(resolveScriptPath(componentPath))) {
                componentPath = path.join(this.root, componentUsingComponnets[component])
              }
              if (!fs.existsSync(componentPath + this.fileTypes.SCRIPT)) {
                componentPath = path.join(componentPath, `/index`)
              }
              depComponents.add({
                name: component,
                path: componentPath,
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
        const taroizeResult = taroize({
          ...param,
          framework: this.framework,
        })
        const { ast, scriptFiles } = this.parseAst({
          ast: taroizeResult.ast,
          sourceFilePath: componentJSPath,
          outputFilePath: componentDistJSPath,
          importStylePath: componentStyle
            ? componentStylePath.replace(path.extname(componentStylePath), OUTPUT_STYLE_EXTNAME)
            : null,
          depComponents,
          imports: taroizeResult.imports,
        })
        const jsCode = generateMinimalEscapeCode(ast)
        this.writeFileToTaro(
          this.getComponentDest(componentDistJSPath),
          this.formatFile(jsCode, taroizeResult.template)
        )
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
    const postcssResult = await Processors([unitTransform()]).process(content, {
      from: filePath,
    })
    return postcssResult
  }

  processStyleAssets (content: string, stylePath: string, styleDist: string) {
    const reg = /url\(["'](.+?)["']\)/g
    let token = reg.exec(content)
    stylePath = path.dirname(stylePath)
    styleDist = path.dirname(styleDist)

    while (token?.length) {
      let url = token[1]

      if (url && url.indexOf('data:') !== 0 && url.indexOf('#') !== 0 && !/^[a-z]+:\/\//.test(url)) {
        url = url.trim()
        url.replace(/[/\\]/g, path.sep)
        url = url.split('?')[0]
        url = url.split('#')[0]

        const originPath = path.resolve(stylePath, url)
        const destPath = path.resolve(styleDist, url)
        const destDir = path.dirname(destPath)

        if (!fs.existsSync(originPath)) {
          printLog(processTypeEnum.WARNING, '静态资源', `找不到资源：${originPath}`)
        } else if (!fs.existsSync(destPath)) {
          fs.ensureDirSync(destDir)
          fs.copyFile(originPath, destPath)
          printLog(processTypeEnum.COPY, '样式资源', this.generateShowPath(destPath))
        }
      }

      token = reg.exec(content)
    }
  }

  async traverseStyle (filePath: string, style: string) {
    const { imports, content } = processStyleImports(style, (str, stylePath) => {
      let relativePath = stylePath
      if (path.isAbsolute(relativePath)) {
        relativePath = promoteRelativePath(path.relative(filePath, path.join(this.root, stylePath)))
      }
      return str.replace(stylePath, relativePath).replace('.wxss', OUTPUT_STYLE_EXTNAME)
    })
    const styleDist = this.getDistFilePath(filePath, OUTPUT_STYLE_EXTNAME)
    this.processStyleAssets(content, filePath, styleDist)
    const { css } = await this.styleUnitTransform(filePath, content)
    this.writeFileToTaro(styleDist, css)
    printLog(processTypeEnum.GENERATE, '样式文件', this.generateShowPath(styleDist))
    if (imports && imports.length) {
      imports.forEach((importItem) => {
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
    const date = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`
    creator.template(templateName, 'package.json.tmpl', pkgPath, {
      description,
      projectName,
      version,
      css: 'sass',
      typescript: false,
      template: templateName,
      framework: this.framework,
      compiler: 'webpack5',
    })
    creator.template(templateName, path.join('config', 'index.js'), path.join(configDir, 'index.js'), {
      date,
      projectName,
      framework: this.framework,
      compiler: 'webpack5',
      typescript: false,
    })
    creator.template(templateName, path.join('config', 'dev.js'), path.join(configDir, 'dev.js'), {
      framework: this.framework,
      compiler: 'webpack5',
      typescript: false,
    })
    creator.template(templateName, path.join('config', 'prod.js'), path.join(configDir, 'prod.js'), {
      framework: this.framework,
      typescript: false,
    })
    creator.template(templateName, 'project.config.json', path.join(this.convertRoot, 'project.config.json'), {
      description,
      projectName,
      framework: this.framework,
    })
    creator.template(templateName, '.gitignore', path.join(this.convertRoot, '.gitignore'))
    creator.template(templateName, '.editorconfig', path.join(this.convertRoot, '.editorconfig'))
    creator.template(templateName, '.eslintrc.js', path.join(this.convertRoot, '.eslintrc.js'), {
      typescript: false,
      framework: this.framework,
    })
    creator.template(templateName, 'babel.config.js', path.join(this.convertRoot, 'babel.config.js'), {
      typescript: false,
      framework: this.framework,
    })
    creator.template(templateName, path.join('src', 'index.html'), path.join(this.convertDir, 'index.html'), {
      projectName,
    })
    creator.fs.commit(() => {
      const pkgObj = JSON.parse(fs.readFileSync(pkgPath).toString())
      pkgObj.dependencies['@tarojs/with-weapp'] = `^${version}`
      fs.writeJSONSync(pkgPath, pkgObj, {
        spaces: 2,
        EOL: '\n',
      })
      printLog(processTypeEnum.GENERATE, '文件', this.generateShowPath(path.join(configDir, 'index.js')))
      printLog(processTypeEnum.GENERATE, '文件', this.generateShowPath(path.join(configDir, 'dev.js')))
      printLog(processTypeEnum.GENERATE, '文件', this.generateShowPath(path.join(configDir, 'prod.js')))
      printLog(processTypeEnum.GENERATE, '文件', this.generateShowPath(pkgPath))
      printLog(
        processTypeEnum.GENERATE,
        '文件',
        this.generateShowPath(path.join(this.convertRoot, 'project.config.json'))
      )
      printLog(processTypeEnum.GENERATE, '文件', this.generateShowPath(path.join(this.convertRoot, '.gitignore')))
      printLog(processTypeEnum.GENERATE, '文件', this.generateShowPath(path.join(this.convertRoot, '.editorconfig')))
      printLog(processTypeEnum.GENERATE, '文件', this.generateShowPath(path.join(this.convertRoot, '.eslintrc')))
      printLog(processTypeEnum.GENERATE, '文件', this.generateShowPath(path.join(this.convertDir, 'index.html')))
      this.showLog()
    })
  }

  showLog () {
    console.log()
    console.log(
      `${chalk.green('✔ ')} 转换成功，请进入 ${chalk.bold(
        'taroConvert'
      )} 目录下使用 npm 或者 yarn 安装项目依赖后再运行！`
    )
  }

  run () {
    this.framework = 'react'
    this.generateEntry()
    this.traversePages()
    this.generateConfigFiles()
  }
}
