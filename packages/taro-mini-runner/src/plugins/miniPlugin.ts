import * as path from 'path'

import * as webpack from 'webpack'
import { defaults } from 'lodash'

interface IMiniPluginOptions {
  appEntry?: string
}

export default class MiniPlugin {
  options: IMiniPluginOptions
  appEntry: string

  constructor (options = {}) {
    this.options = defaults(options || {}, {

    })
  }

  try = handler => async (arg, callback) => {
		try {
			await handler(arg)
			callback()
		} catch (err) {
			callback(err)
		}
	}

  apply (compiler: webpack.Compiler) {
    compiler.hooks.run.tapAsync(
			'MiniPlugin run',
			this.try(async (compiler: webpack.Compiler) => {
				await this.run(compiler)
			})
    )
  }

  getAppEntry (compiler) {
    if (this.options.appEntry) {
      return this.options.appEntry
    }
    const { entry } = compiler.options
    function getEntryPath (entry) {
      if (Array.isArray(entry)) {
        return entry.map(item => getEntryPath[item]).find(item => item)
      }
      if (typeof entry === 'object') {
        return entry['app']
      }
      return entry
    }
    const appEntryPath = getEntryPath(entry)
    return appEntryPath
  }

  run (compiler) {
    this.appEntry = this.getAppEntry(compiler)
    console.log(this.appEntry)
  }
}
