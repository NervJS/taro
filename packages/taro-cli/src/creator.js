const path = require('path')
const fs = require('fs-extra')
const memFs = require('mem-fs')
const editor = require('mem-fs-editor')

const {
  getRootPath
} = require('./util')

class Creator {
  constructor () {
    const store = memFs.create()
    this.fs = editor.create(store)
    this.sourceRoot(path.join(getRootPath()))
    this.init()
  }

  init () {}

  sourceRoot (rootPath) {
    if (typeof rootPath === 'string') {
      this._rootPath = path.resolve(rootPath)
    }
    if (!fs.existsSync(this._rootPath)) {
      fs.ensureDirSync(this._rootPath)
    }
    return this._rootPath
  }

  templatePath () {
    let filepath = path.join.apply(path, arguments)
    if (!path.isAbsolute(filepath)) {
      filepath = path.join(this._rootPath, 'templates', filepath)
    }
    return filepath
  }

  destinationRoot (rootPath) {
    if (typeof rootPath === 'string') {
      this._destinationRoot = path.resolve(rootPath)
      if (!fs.existsSync(rootPath)) {
        fs.ensureDirSync(rootPath)
      }
      process.chdir(rootPath)
    }
    return this._destinationRoot || process.cwd()
  }

  destinationPath () {
    let filepath = path.join.apply(path, arguments)
    if (!path.isAbsolute(filepath)) {
      filepath = path.join(this.destinationRoot(), filepath)
    }
    return filepath
  }

  template (template, source, dest, data, options) {
    if (typeof dest !== 'string') {
      options = data
      data = dest
      dest = source
    }
    this.fs.copyTpl(
      this.templatePath(template, source),
      this.destinationPath(dest),
      Object.assign({}, this, data),
      options
    )
    return this
  }

  copy (template, type, source, dest) {
    dest = dest || source
    this.template(template, type, source, dest)
    return this
  }

  writeGitKeepFile (dirname) {
    dirname = path.resolve(dirname)
    fs.writeFileSync(path.join(dirname, '.gitkeep'), 'Place hold file', 'utf8')
  }

  write () {}
}

module.exports = Creator
