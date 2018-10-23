const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const taroize = require('@tarojs/taroize')

const {
  BUILD_TYPES,
  MINI_APP_FILES
} = require('./util')

class Convertor {
  constructor () {
    this.root = process.cwd()
    this.convertDir = 'taroConvert'
    this.fileTypes = MINI_APP_FILES[BUILD_TYPES.WEAPP]
    this.pages = new Set()
    this.components = new Set()
    this.init()
  }

  init () {
    this.getApp()
    this.getPages()
    this.getSubPackages()
  }

  getApp () {
    this.entryJSPath = path.join(this.root, 'app.js')
    this.entryJSONPath = path.join(this.root, 'app.json')
    try {
      this.entryJSON = JSON.parse(String(fs.readFileSync(this.entryJSONPath)))
    } catch (err) {
      this.entryJSON = {}
      console.log(chalk.red(`app.json 读取失败，请检查！`))
      process.exit(1)
    }
  }

  getPages () {
    const pages = this.entryJSON['pages']
    if (!pages || !pages.length) {
      console.log(chalk.red(`app.json 配置有误，缺少页面相关配置`))
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

  traversePages () {
    this.pages.forEach(page => {
      const pagePath = path.join(this.root, page)
      const pageJSPath = pagePath + this.fileTypes.SCRIPT
      const pageConfigPath = pagePath + this.fileTypes.CONFIG
      const pageStylePath = pagePath + this.fileTypes.STYLE
      const pageTemplPath = pagePath + this.fileTypes.TEMPL
      try {
        const param = {}
        if (fs.existsSync(pageConfigPath)) {
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
        if (fs.existsSync(pageJSPath)) {
          param.script = String(fs.readFileSync(pageJSPath))
        }
        if (fs.existsSync(pageTemplPath)) {
          param.wxml = String(fs.readFileSync(pageTemplPath))
        }
        const taroizeResult = taroize(param)
        console.log(taroizeResult)
      } catch (err) {
        console.log(err)
      }
    })
  }

  run () {
    this.traversePages()
  }
}

module.exports = Convertor
