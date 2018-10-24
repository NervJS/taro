const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const prettier = require('prettier')
const traverse = require('babel-traverse').default
const t = require('babel-types')
const generate = require('babel-generator').default
const taroize = require('@tarojs/taroize')
const wxTransformer = require('@tarojs/transformer-wx')

const {
  BUILD_TYPES,
  MINI_APP_FILES,
  printLog,
  pocessTypeEnum,
  promoteRelativePath,
  isNpmPkg,
  resolveScriptPath,
  REG_SCRIPT,
  REG_TYPESCRIPT
} = require('./util')

const prettierJSConfig = {
  semi: false,
  singleQuote: true,
  parser: 'babylon'
}

function analyzeImportUrl (sourceFilePath, scriptFiles, source, value) {
  const valueExtname = path.extname(value)
  if (path.isAbsolute(value)) {
    printLog(pocessTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 是绝对路径！`)
    return
  }
  if (value.indexOf('.') === 0) {
    if (REG_SCRIPT.test(valueExtname) || REG_TYPESCRIPT.test(valueExtname)) {
      const vpath = path.resolve(sourceFilePath, '..', value)
      let fPath = value
      if (fs.existsSync(vpath)) {
        fPath = vpath
      } else {
        printLog(pocessTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
      }
      scriptFiles.add(fPath)
    } else {
      let vpath = resolveScriptPath(path.resolve(sourceFilePath, '..', value))
      if (vpath) {
        if (!fs.existsSync(vpath)) {
          printLog(pocessTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
        } else {
          if (fs.lstatSync(vpath).isDirectory()) {
            if (fs.existsSync(path.join(vpath, 'index.js'))) {
              vpath = path.join(vpath, 'index.js')
            } else {
              printLog(Util.pocessTypeEnum.ERROR, '引用目录', `文件 ${sourceFilePath} 中引用了目录 ${value}！`)
              return
            }
          }
          let relativePath = path.relative(sourceFilePath, vpath)
          scriptFiles.add(vpath)
          relativePath = promoteRelativePath(relativePath)
          relativePath = relativePath.replace(path.extname(relativePath), '.js')
          source.value = relativePath
        }
      }
    }
  }
}

class Convertor {
  constructor () {
    this.root = process.cwd()
    this.convertDir = path.join(this.root, 'taroConvert')
    this.fileTypes = MINI_APP_FILES[BUILD_TYPES.WEAPP]
    this.pages = new Set()
    this.components = new Set()
    this.hadBeenCopyedFiles = new Set()
    this.init()
  }

  init () {
    console.log(chalk.green('开始代码转换...'))
    this.initConvert()
    this.getApp()
    this.getPages()
    this.getSubPackages()
  }

  initConvert () {
    if (fs.existsSync(this.convertDir)) {
      fs.emptyDirSync(this.convertDir)
    } else {
      fs.mkdirpSync(this.convertDir)
    }
  }



  parseAst ({ ast, sourceFilePath, outputFilePath, importStylePath }) {
    const scriptFiles = new Set()
    traverse(ast, {
      Program: {
        enter (astPath) {
          astPath.traverse({
            ImportDeclaration (astPath) {
              const node = astPath.node
              const source = node.source
              const value = source.value
              analyzeImportUrl(sourceFilePath, scriptFiles, source, value)
            },
            CallExpression (astPath) {
              const node = astPath.node
              const callee = node.callee
              if (callee.name === 'require') {
                const args = node.arguments
                const value = args[0].value
                analyzeImportUrl(sourceFilePath, scriptFiles, args[0], value)
              }
            }
          })
        },
        exit (astPath) {
          const lastImport = astPath.get('body').filter(p => p.isImportDeclaration()).pop()
          if (lastImport && importStylePath) {
            lastImport.insertAfter(t.importDeclaration([], t.stringLiteral(promoteRelativePath(path.relative(sourceFilePath, importStylePath)))))
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
      printLog(pocessTypeEnum.CONVERT, '入口文件', this.generateShowPath(this.entryJSPath))
      printLog(pocessTypeEnum.CONVERT, '入口配置', this.generateShowPath(this.entryJSONPath))
      if (fs.existsSync(this.entryStylePath)) {
        this.entryStyle = String(fs.readFileSync(this.entryStylePath))
        printLog(pocessTypeEnum.CONVERT, '入口样式', this.generateShowPath(this.entryStylePath))
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

  generateScriptFiles (files) {
    if (!files) {
      return
    }
    if (files.size) {
      files.forEach(file => {
        if (!fs.existsSync(file) && this.hadBeenCopyedFiles.has(file)) {
          return
        }
        const code = fs.readFileSync(file).toString()
        const outputFilePath = file.replace(this.root, this.convertDir)
        const transformResult = wxTransformer({
          code,
          sourcePath: file,
          outputPath: outputFilePath,
          isNormal: true,
          isTyped: REG_TYPESCRIPT.test(file)
        })
        const { ast, scriptFiles } = this.parseAst({
          ast: transformResult.ast,
          outputFilePath,
          sourceFilePath: file
        })
        const jsCode = generate(ast).code
        this.writeFileToTaro(outputFilePath, prettier.format(jsCode, prettierJSConfig))
        printLog(pocessTypeEnum.COPY, 'JS 文件', this.generateShowPath(outputFilePath))
        this.hadBeenCopyedFiles.add(file)
        this.generateScriptFiles(scriptFiles)
      })
    }
  }

  writeFileToTaro (dist, code) {
    fs.ensureDirSync(path.dirname(dist))
    fs.writeFileSync(dist, code)
  }

  getDistFilePath (src, extname) {
    if (!extname) return src.replace(this.root, this.convertDir)
    return src.replace(this.root, this.convertDir).replace(path.extname(src), extname)
  }

  generateShowPath (filePath) {
    return filePath.replace(path.join(this.root, '/'), '').split(path.sep).join('/')
  }

  generateEntry () {
    try {
      const entryJS = String(fs.readFileSync(this.entryJSPath))
      const entryJSON = JSON.stringify(this.entryJSON)
      const entryDistJSPath = this.getDistFilePath(this.entryJSPath)
      const taroizeAst = taroize({
        json: entryJSON,
        script: entryJS
      })
      const { ast, scriptFiles } = this.parseAst({
        ast: taroizeAst,
        sourceFilePath: this.entryJSPath,
        outputFilePath: entryDistJSPath,
        importStylePath: this.entryStyle ? this.entryStylePath.replace(path.extname(this.entryStylePath), '.css') : null
      })
      const jsCode = generate(ast).code
      this.writeFileToTaro(entryDistJSPath, prettier.format(jsCode, prettierJSConfig))
      printLog(pocessTypeEnum.GENERATE, '入口文件', this.generateShowPath(entryDistJSPath))
      if (this.entryStyle) {
        const entryDistStylePath = this.getDistFilePath(this.entryStylePath, '.css')
        this.writeFileToTaro(entryDistStylePath, this.entryStyle)
        printLog(pocessTypeEnum.GENERATE, '入口样式', this.generateShowPath(entryDistStylePath))
      }
      this.generateScriptFiles(scriptFiles)
    } catch (err) {
      console.log(err)
    }
  }

  traversePages () {
    this.pages.forEach(page => {
      const pagePath = path.join(this.root, page)
      const pageJSPath = pagePath + this.fileTypes.SCRIPT
      const pageDistJSPath = this.getDistFilePath(pageJSPath)
      const pageConfigPath = pagePath + this.fileTypes.CONFIG
      const pageStylePath = pagePath + this.fileTypes.STYLE
      const pageDistStylePath = this.getDistFilePath(pageStylePath, '.css')
      const pageTemplPath = pagePath + this.fileTypes.TEMPL

      try {
        const param = {}
        if (!fs.existsSync(pageJSPath)) {
          throw new Error(`页面 ${page} 没有 JS 文件！`)
        }
        printLog(pocessTypeEnum.CONVERT, '页面文件', this.generateShowPath(pageJSPath))

        if (fs.existsSync(pageConfigPath)) {
          printLog(pocessTypeEnum.CONVERT, '页面配置', this.generateShowPath(pageConfigPath))
          const pageConfigStr = String(fs.readFileSync(pageConfigPath))
          const pageConfig = JSON.parse(pageConfigStr)
          const pageUsingComponnets = pageConfig.usingComponents
          if (pageUsingComponnets) {
            // 页面依赖组件
            Object.keys(pageUsingComponnets).forEach(component => {
              this.components.add(path.resolve(pageConfigPath, '..', pageUsingComponnets[component]))
            })
          }
          param.json = pageConfigStr
        }
        param.script = String(fs.readFileSync(pageJSPath))
        if (fs.existsSync(pageTemplPath)) {
          printLog(pocessTypeEnum.CONVERT, '页面模板', this.generateShowPath(pageTemplPath))
          param.wxml = String(fs.readFileSync(pageTemplPath))
        }
        let pageStyle = null
        if (fs.existsSync(pageStylePath)) {
          printLog(pocessTypeEnum.CONVERT, '页面样式', this.generateShowPath(pageStylePath))
          pageStyle = String(fs.readFileSync(pageStylePath))
        }

        const taroizeAst = taroize(param)
        const { ast, scriptFiles } = this.parseAst({
          ast: taroizeAst,
          sourceFilePath: pageJSPath,
          outputFilePath: pageDistJSPath,
          importStylePath: pageStyle ? pageStylePath.replace(path.extname(pageStylePath), '.css') : null
        })
        const jsCode = generate(ast).code
        this.writeFileToTaro(pageDistJSPath, prettier.format(jsCode, prettierJSConfig))
        printLog(pocessTypeEnum.GENERATE, '页面文件', this.generateShowPath(pageDistJSPath))
        if (pageStyle) {
          this.writeFileToTaro(pageDistStylePath, fs.readFileSync(pageStylePath))
          printLog(pocessTypeEnum.GENERATE, '页面样式', this.generateShowPath(pageDistStylePath))
        }
        this.generateScriptFiles(scriptFiles)
      } catch (err) {
        console.log(err)
      }
    })
  }

  run () {
    this.generateEntry()
    this.traversePages()
  }
}

module.exports = Convertor
