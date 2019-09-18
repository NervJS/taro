import * as path from 'path'
import VirtualStats from './virtualStats'
import webpack from 'webpack'

export default class VirtualModulePlugin {
  options: {
    moduleName: string
    contents: any
    path?: string
  }
  constructor (options) {
    this.options = options
  }

  apply (compiler: webpack.Compiler) {
    const moduleName = this.options.moduleName
    const ctime = VirtualModulePlugin.statsDate()
    let modulePath = this.options.path

    let contents
    if (typeof this.options.contents === 'string') {
      contents = this.options.contents
    }
    if (typeof this.options.contents === 'object') {
      if (typeof this.options.contents.then !== 'function') {
        contents = JSON.stringify(this.options.contents)
      }
    }
    if (typeof this.options.contents === 'function') {
      contents = this.options.contents()
    }
    if (typeof contents === 'string') {
      contents = Promise.resolve(contents)
    }

    function resolverPlugin(request, cb) {
      // populate the file system cache with the virtual module
      const fs = (this && this.fileSystem) || compiler.inputFileSystem
      const join = (this && this.join) || path.join

      if (typeof request === 'string') {
        request = cb
        cb = null
      }

      if (!modulePath) {
        modulePath = join(compiler.context, moduleName)
      }

      const resolve = (data) => {
        VirtualModulePlugin.populateFilesystem({ fs, modulePath, contents: data, ctime })
      }

      const resolved = contents.then(resolve)
      if (!cb) {
        return
      }

      resolved.then(() => cb())
    }

    compiler.hooks.normalModuleFactory.tap('VirtualModulePlugin', (nmf) => {
      nmf.hooks.beforeResolve.tap('VirtualModulePlugin', resolverPlugin)
    })
  }

  static populateFilesystem (options) {
    const fs = options.fs
    const modulePath = options.modulePath
    const contents = options.contents
    const mapIsAvailable = typeof Map !== 'undefined'
    const statStorageIsMap = mapIsAvailable && fs._statStorage.data instanceof Map
    const readFileStorageIsMap = mapIsAvailable && fs._readFileStorage.data instanceof Map

    const stats = VirtualModulePlugin.createStats(options)
    if (statStorageIsMap) { // enhanced-resolve@3.4.0 or greater
      fs._statStorage.data.set(modulePath, [null, stats])
    } else { // enhanced-resolve@3.3.0 or lower
      fs._statStorage.data[modulePath] = [null, stats]
    }
    if (readFileStorageIsMap) { // enhanced-resolve@3.4.0 or greater
      fs._readFileStorage.data.set(modulePath, [null, contents])
    } else { // enhanced-resolve@3.3.0 or lower
      fs._readFileStorage.data[modulePath] = [null, contents]
    }
  }

  static statsDate (inputDate?) {
    if (!inputDate) {
      inputDate = new Date()
    }
    return inputDate.toString()
  }

  static createStats(options) {
    if (!options) {
      options = {}
    }
    if (!options.ctime) {
      options.ctime = VirtualModulePlugin.statsDate()
    }
    if (!options.mtime) {
      options.mtime = VirtualModulePlugin.statsDate()
    }
    if (!options.size) {
      options.size = 0
    }
    if (!options.size && options.contents) {
      options.size = options.contents.length
    }
    return new VirtualStats({
      dev: 8675309,
      nlink: 1,
      uid: 501,
      gid: 20,
      rdev: 0,
      blksize: 4096,
      ino: 44700000,
      mode: 33188,
      size: options.size,
      atime: options.mtime,
      mtime: options.mtime,
      ctime: options.ctime,
      birthtime: options.ctime,
    })
  }
}
