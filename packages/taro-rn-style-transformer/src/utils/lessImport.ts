import Less from 'less'

import { resolveStyle } from './index'

class LessImporter extends Less.FileManager {
  platform: 'android' | 'ios'
  alias: Record<string, string> = {}

  constructor (opt) {
    super()
    this.platform = opt.platform
    this.alias = opt.alias
  }

  supports () {
    return true
  }

  supportsSync () {
    return false
  }

  async loadFile (
    filename: string,
    currentDirectory: string,
    options: any,
    environment: any
  ) {
    const resolveOpts = {
      basedir: currentDirectory,
      alias: this.alias,
      platform: this.platform,
      defaultExt: '.less'
    }
    const rewriteFilename = resolveStyle(filename, resolveOpts)

    return super.loadFile(rewriteFilename, currentDirectory, options, environment)
  }
}

function makeLessImport (options) {
  return {
    install: (_, pluginManager) => {
      pluginManager.addFileManager(new LessImporter(options))
    },
    minVersion: [2, 7, 1]
  }
}

export default makeLessImport
