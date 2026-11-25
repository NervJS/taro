/* eslint-disable no-console */
import { chalk } from '@tarojs/helper'
import { partial, pipe } from 'lodash/fp'
import ora from 'ora'
import formatMessages from 'webpack-format-messages'

const getServeSpinner = (() => {
  let spinner
  return () => {
    if (!spinner) {
      spinner = ora('即将开始启动编译，请稍等~')
      spinner.start()
    }
    return spinner
  }
})()

const printCompiling = () => {
  getServeSpinner().text = '正在编译...'
}

const printBuildError = (err: Error): void => {
  const message = err?.message
  const stack = err?.stack
  if (stack && message?.includes('from UglifyJs')) {
    const matched = /(.+)\[(.+):(.+),(.+)\]\[.+\]/.exec(stack)
    if (matched) {
      const [, , problemPath, line, column] = matched
      const location = column !== '0' ? `${problemPath}:${line}:${column}` : `${problemPath}:${line}`
      console.log('Failed to minify the code from this file: \n\n', chalk.yellow(`\t${location}`), '\n')
    } else {
      console.log('Failed to minify the bundle.', err)
    }
  } else {
    console.log((message || err) + '\n')
  }
  console.log()
}

const printSuccess = () => {
  getServeSpinner().stopAndPersist({
    symbol: '✅ ',
    text: chalk.green(`编译成功 ${new Date().toLocaleString()}\n`)
  })
}

export const printPrerenderSuccess = (p: string) => {
  getServeSpinner().stopAndPersist({
    symbol: '🚀 ',
    text: chalk.green(`页面 ${p} 预渲染成功 ${new Date().toLocaleString()}`)
  })
}

export const printPrerenderFail = (p: string) => {
  getServeSpinner().stopAndPersist({
    symbol: '⚠️ ',
    text: chalk.yellow(`${new Date().toLocaleString()} 页面 ${p} 预渲染失败：`)
  })
}

const printWarning = () => {
  getServeSpinner().stopAndPersist({
    symbol: '⚠️ ',
    text: chalk.yellow(`编译警告. ${new Date().toLocaleString()}\n`)
  })
}

const printFailed = () => {
  getServeSpinner().stopAndPersist({
    symbol: '🙅  ',
    text: chalk.red(`编译失败. ${new Date().toLocaleString()}\n`)
  })
}

const printWhenBeforeCompile = compiler => {
  compiler.hooks.beforeCompile.tap('taroBeforeCompile', () => {
    printCompiling()
  })
  return compiler
}

const printWhenInvalid = compiler => {
  compiler.hooks.invalid.tap('taroInvalid', () => {
    printCompiling()
  })
  return compiler
}

const printWhenFailed = compiler => {
  compiler.hooks.failed.tap('taroFailed', error => {
    printBuildError(error)
  })
  return compiler
}

let isFirst = true
const printWhenFirstDone = (devUrl: string, compiler) => {
  compiler.hooks.done.tap('taroDone', () => {
    if (isFirst) {
      isFirst = false
      getServeSpinner().clear()
      if (devUrl) {
        console.log()
        console.log(chalk.cyan(`ℹ️  Listening at ${devUrl}`))
      }
      console.log(chalk.gray('\n监听文件修改中...\n'))
    }
  })
  return compiler
}

export function extractStatsMessages (stats: any) {
  try {
    return formatMessages(stats)
  } catch {
    const json = stats?.toJson?.({ errors: true, warnings: true }) || {}
    return {
      errors: (json.errors || []).map((e: any) => e?.message || String(e)),
      warnings: (json.warnings || []).map((w: any) => w?.message || String(w))
    }
  }
}

const _printWhenDone = ({
  verbose = false
}, compiler) => {
  compiler.hooks.done.tap('taroDone', stats => {
    const { errors, warnings } = extractStatsMessages(stats)

    if (!stats.hasErrors() && !stats.hasWarnings()) {
      printSuccess()
    }

    if (stats.hasErrors()) {
      printFailed()
      errors.forEach(e => console.log(e + '\n'))
      verbose && process.exit(1)
      return
    }

    if (stats.hasWarnings()) {
      printWarning()
      warnings.forEach(w => console.log(w + '\n'))
    }

    verbose && console.log(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
      warnings: verbose
    }) + '\n')
  })
  return compiler
}

const printWhenDone = partial(_printWhenDone, [{ verbose: false }])
const printWhenDoneVerbosely = partial(_printWhenDone, [{ verbose: true }])

const bindDevLogger = (compiler, devUrl = '') => {
  console.log()
  pipe(
    printWhenBeforeCompile,
    printWhenDone,
    printWhenFailed,
    printWhenInvalid,
    partial(printWhenFirstDone, [devUrl])
  )(compiler)
  return compiler
}

const bindProdLogger = compiler => {
  console.log()
  pipe(
    printWhenBeforeCompile,
    printWhenDoneVerbosely,
    printWhenFailed
  )(compiler)
  return compiler
}

export {
  bindDevLogger,
  bindProdLogger,
  getServeSpinner,
  printBuildError,
  printCompiling
}
