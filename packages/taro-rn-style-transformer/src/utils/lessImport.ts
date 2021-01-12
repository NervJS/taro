import path from 'path'
import { resolveStyle } from './index'
import { LogLevelEnum } from '../types'

class Importer {
  constructor (opt) {
    this.platform = opt.platform
  }

  platform: 'android' | 'ios'

  process (src: string, { fileInfo }) {
    const basedir = fileInfo.currentDirectory
    if (!basedir) {
      return src
    }

    const resolveOpts = {
      basedir,
      platform: this.platform,
      logLevel: LogLevelEnum.WARNING
    }

    // 解析 @import "a.less" 字符串里面的内容
    src = src.replace(/@import\s+['"]([^'|"]*)['"]/gi, (_, id) => {
      const relativePath = path.relative(basedir, resolveStyle(id.trim(), resolveOpts)).replace(/\\/g, '/')
      return `@import '${relativePath}';`
    })

    return src
  }
}

function makeLessImport (options) {
  return {
    install: (_, pluginManager) => {
      pluginManager.addPreProcessor(new Importer(options))
    },
    minVersion: [2, 7, 1]
  }
}

export default makeLessImport
