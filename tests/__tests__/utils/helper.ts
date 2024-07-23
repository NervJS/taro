import * as path from 'node:path'

import ReactLikePlugin from '@tarojs/plugin-framework-react'
import Vue3Plugin from '@tarojs/plugin-framework-vue3'
import * as runnerUtils from '@tarojs/runner-utils'
import { componentConfig } from '@tarojs/webpack5-runner/dist/utils/component'

import type { IFs } from 'memfs'
import type { CommonBuildConfig, IH5BuildConfig, IMiniBuildConfig } from '../../../packages/taro-webpack5-runner/src/utils/types'

export function readDir(fs: IFs, dir: string) {
  let files: string[] = []
  const list = fs.readdirSync(dir)
  list.forEach((item) => {
    const filePath = path.join(dir, item)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      files = files.concat(readDir(fs, filePath))
    } else {
      files.push(filePath)
    }
  })
  return files
}

export function getOutput<T extends IMiniBuildConfig | IH5BuildConfig = CommonBuildConfig>(stats, config: Partial<T>) {
  // @ts-ignore
  const fs: IFs = config.fs ?? stats.compilation.compiler.outputFileSystem

  const files = readDir(fs, config.outputRoot || '')
  // Note: 在小程序端构建过程中，仅 Windows 端编译会输出 runtime.js 文件
  const output = files.filter(e => !/runtime\.js$/.test(e)).reduce((content, file) => {
    return `${content}
/** filePath: ${file} **/
${file === 'dist/runtime.js' ? '' : fs.readFileSync(file)}
`
  }, '')
  fs.rmdirSync(config.outputRoot || '', { recursive: true })
  return output
}

/**
 * 处理不同框架的自定义逻辑
 * @param chain webpack-chain
 */
export function frameworkPatch(chain, webpack, config) {
  const mockCtx = {
    initialConfig: {
      framework: config.framework || 'react',
    },
    modifyWebpackChain: (cb) => cb({ chain, webpack, data: { componentConfig } }),
    modifyViteConfig: (cb) => {
      const cbList: any = []
      cbList.push(cb)
    },
    modifyRunnerOpts: (cb) => cb(config),
    onParseCreateElement: (cb) => cb({ nodeName: '', componentConfig }),
    applyPlugins: () => null,
    runnerUtils,
  }

  let frameworkPlugin: any = ReactLikePlugin
  if (config.framework === 'vue3') {
    config.opts = {}
    frameworkPlugin = Vue3Plugin
  }

  frameworkPlugin(mockCtx)
}
