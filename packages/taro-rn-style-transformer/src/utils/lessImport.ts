/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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
