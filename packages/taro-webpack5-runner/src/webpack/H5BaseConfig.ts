import { defaultMainFields } from '@tarojs/helper'
import path from 'path'
import { sync as resolveSync } from 'resolve'

import { BaseConfig } from './BaseConfig'

import type { H5BuildConfig } from '../utils/types'

export class H5BaseConfig extends BaseConfig {
  defaultTerserOptions = {
    keep_fnames: true,
    output: {
      comments: false,
      keep_quoted_props: true,
      quote_keys: true,
      beautify: false
    },
    warnings: false
  }

  constructor (appPath: string, config: Partial<H5BuildConfig>) {
    super(appPath, config)
    const mainFields = [...defaultMainFields]
    if (config.mode !== 'production') {
      mainFields.unshift('main:h5')
    }
    const resolveOptions: Parameters<typeof resolveSync>[1] = {
      basedir: appPath,
      packageFilter: (pkg, pkgFile) => {
        for (let i = 0; i < mainFields.length; i++) {
          try {
            const mainFile = pkg[mainFields[i]] as string
            if (mainFile && resolveSync(path.resolve(pkgFile, mainFile))) {
              pkg.main = mainFile
              break
            }
          } catch (e) {} // eslint-disable-line no-empty
        }
        return pkg
      },
    }
    this.chain.merge({
      resolve: {
        mainFields,
        alias: {
          // Note: link 本地依赖调试，runtime 包需要指向本地 node_modules 顶层的 runtime，保证闭包值 Current 一致，shared 也一样
          '@tarojs/runtime': resolveSync('@tarojs/runtime', resolveOptions),
          '@tarojs/shared': resolveSync('@tarojs/shared', resolveOptions),
        },
      },
    })

    this.setMinimizer(config, this.defaultTerserOptions)
  }
}
