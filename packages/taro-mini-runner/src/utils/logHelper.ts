import chalk from 'chalk'
import * as ora from 'ora'
import { partial, pipe } from 'lodash/fp'
import * as formatMessages from 'webpack-format-messages'
import { BUILD_TYPES } from '@tarojs/runner-utils'

// const syntaxErrorLabel = 'Syntax error:'

const LOG_MAP = {
  [BUILD_TYPES.WEAPP]: {
    OPEN: '请打开微信小程序开发者工具进行查看'
  },
  [BUILD_TYPES.ALIPAY]: {
    OPEN: '请打开支付宝小程序开发者工具进行查看'
  },
  [BUILD_TYPES.QQ]: {
    OPEN: '请打开 QQ 小程序开发者工具进行查看'
  },
  [BUILD_TYPES.SWAN]: {
    OPEN: '请打开百度智能小程序开发者工具进行查看'
  },
  [BUILD_TYPES.TT]: {
    OPEN: '请打开字节跳动小程序开发者工具进行查看'
  },
  [BUILD_TYPES.JD]: {
    OPEN: '请打开京东小程序开发者工具进行查看'
  },
  [BUILD_TYPES.QUICKAPP]: {
    OPEN: '请按快应用端开发流程 https://taro-docs.jd.com/taro/docs/quick-app.html 进行查看'
  }
}

const getServeSpinner = (() => {
  let spinner
  return () => {
    if (!spinner) spinner = ora('Starting development server, please wait~')
    return spinner
  }
})()

const printCompiling = () => {
  getServeSpinner().text = '正在编译...'
  getServeSpinner().start()
}

const printBuildError = (err: Error): void => {
  const message = err.message
  const stack = err.stack
  if (stack && message.indexOf('from UglifyJs') !== -1) {
    try {
      const matched = /(.+)\[(.+):(.+),(.+)\]\[.+\]/.exec(stack)
      if (!matched) {
        throw new Error('Using errors for control flow is bad.')
      }
      const problemPath = matched[2]
      const line = matched[3]
      const column = matched[4]
      console.log('Failed to minify the code from this file: \n\n', chalk.yellow(`\t${problemPath}:${line}${column !== '0' ? ':' + column : ''}`), '\n')
    } catch (ignored) {
      console.log('Failed to minify the bundle.', err)
    }
  } else {
    console.log((message || err) + '\n')
  }
  console.log()
}

const printSuccess = (buildAdapter: BUILD_TYPES) => {
  getServeSpinner().stopAndPersist({
    symbol: '✅ ',
    text: isFirst ? chalk.green(`编译成功，${LOG_MAP[buildAdapter].OPEN}\n`) : chalk.green('编译成功\n')
  })
}

export const printPrerenderSuccess = (path: string) => {
  getServeSpinner().stopAndPersist({
    symbol: '🚀 ',
    text: chalk.green(`页面 ${path} 预渲染成功`)
  })
}

export const printPrerenderFail = (path: string) => {
  getServeSpinner().stopAndPersist({
    symbol: '⚠️ ',
    text: chalk.yellow(`页面 ${path} 预渲染失败：`)
  })
}

const printWarning = () => {
  getServeSpinner().stopAndPersist({
    symbol: '⚠️ ',
    text: chalk.yellow('编译警告.\n')
  })
}

const printFailed = () => {
  getServeSpinner().stopAndPersist({
    symbol: '🙅  ',
    text: chalk.red('编译失败.\n')
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
const printWhenFirstDone = (compiler) => {
  compiler.hooks.done.tap('taroDone', () => {
    if (isFirst) {
      isFirst = false
      getServeSpinner().clear()
      console.log(chalk.gray('\n监听文件修改中...\n'))
    }
  })
  return compiler
}

const _printWhenDone = ({
  verbose = false
}, buildAdapter, compiler) => {
  compiler.hooks.done.tap('taroDone', stats => {
    const { errors, warnings } = formatMessages(stats)

    if (!stats.hasErrors() && !stats.hasWarnings()) {
      printSuccess(buildAdapter)
    }

    if (stats.hasErrors()) {
      printFailed()
      errors.forEach(e => console.log(e + '\n'))
      stats.compilation.errors.forEach(error => {
        console.log(`${error.stack}\n`)
      })
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

const bindDevLogger = (compiler, buildAdapter: BUILD_TYPES) => {
  console.log()
  pipe(
    printWhenBeforeCompile,
    partial(printWhenDone, [buildAdapter]),
    printWhenFailed,
    printWhenInvalid,
    printWhenFirstDone
  )(compiler)
  return compiler
}

const bindProdLogger = (compiler, buildAdapter: BUILD_TYPES) => {
  console.log()
  pipe(
    printWhenBeforeCompile,
    partial(printWhenDoneVerbosely, [buildAdapter]),
    printWhenFailed
  )(compiler)
  return compiler
}

export {
  printBuildError,
  printCompiling,
  getServeSpinner,
  bindDevLogger,
  bindProdLogger
}
