import * as path from 'path'
import * as fs from 'fs-extra'
import * as memFs from 'mem-fs'
import * as editor from 'mem-fs-editor'
import * as _ from 'lodash'

import {
  getRootPath
} from '../util'

interface IFile {
  contents: Buffer | NodeJS.ReadableStream | null,
  cwd: string,
  base: string | null | undefined,
  history: string[],
  relative: string,
  dirname: string,
  basename: string,
  stem: string,
  extname: string,
  symlink: string,
  stat: fs.Stats | null
}

interface IReadOptions {
  raw?: boolean
}

interface IAppendOptions {
  trimEnd?: boolean,
  separator?: string
}

interface IMemFsEditor {
  store: {
    [key: string]: IFile
  },
  read(filePath: string, options?: IReadOptions): string | Buffer,
  readJSON(filePath: string, defaults?: JSON): JSON,
  write(filePath: string, contents: string | Buffer): string,
  writeJSON(filepath: string, contents: JSON, replacer?: ((key: string, value: any) => any) | undefined, space?: string | number | undefined): string,
  append(filePath: string, contents: string | Buffer, options?: IAppendOptions): string | Buffer,
  copyTpl(from: string, to: string, context: object, templateOptions: object),
  commit(cb: () => void)
}

export default class Creator {
  fs: IMemFsEditor
  protected _rootPath: string
  private _destinationRoot: string

  constructor (sourceRoot?: string) {
    const store = memFs.create()
    this.fs = editor.create(store)
    this.sourceRoot(sourceRoot || path.join(getRootPath()))
    this.init()
  }

  init () {}

  sourceRoot (rootPath?: string) {
    if (typeof rootPath === 'string') {
      this._rootPath = path.resolve(rootPath)
    }
    if (!fs.existsSync(this._rootPath)) {
      fs.ensureDirSync(this._rootPath)
    }
    console.log('this._rootPath: ', this._rootPath)
    return this._rootPath
  }

  templatePath (...args: string[]): string {
    let filepath = path.join.apply(path, args)
    if (!path.isAbsolute(filepath)) {
      filepath = path.join(this._rootPath, 'templates', filepath)
    }
    return filepath
  }

  destinationRoot (rootPath?: string): string {
    if (typeof rootPath === 'string') {
      this._destinationRoot = path.resolve(rootPath)
      if (!fs.existsSync(rootPath)) {
        fs.ensureDirSync(rootPath)
      }
      process.chdir(rootPath)
    }
    return this._destinationRoot || process.cwd()
  }

  destinationPath (...args: string[]): string {
    let filepath = path.join.apply(path, args)
    if (!path.isAbsolute(filepath)) {
      filepath = path.join(this.destinationRoot(), filepath)
    }
    return filepath
  }

  template (template: string, source: string, dest: string, data?: object, options?) {
    if (typeof dest !== 'string') {
      options = data
      data = dest
      dest = source
    }
    this.fs.copyTpl(
      this.templatePath(template, source),
      this.destinationPath(dest),
      Object.assign({ _ }, this, data),
      options
    )
    return this
  }

  writeGitKeepFile (dirname: string) {
    dirname = path.resolve(dirname)
    fs.writeFileSync(path.join(dirname, '.gitkeep'), 'Place hold file', 'utf8')
  }

  write () {}
}
