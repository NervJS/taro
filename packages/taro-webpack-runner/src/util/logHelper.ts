import chalk from 'chalk';
import * as ora from 'ora';
import { partial, pipe } from 'lodash/fp';

const syntaxErrorLabel = 'Syntax error:';

const getServeSpinner = (() => {
  let spinner
  return () => {
    if (!spinner) spinner = ora(`Starting development server, please wait~`)
    return spinner
  }
})()

const isLikelyASyntaxError = (message: string): boolean => {
  return message.indexOf(syntaxErrorLabel) >= 0;
}

const formatMessage = (message: string): string => {
  let lines = message.split('\n');
  if (lines.length > 2 && lines[1] === '') {
    lines.splice(1, 1);
  }
  if (lines[0].lastIndexOf('!') >= 0) {
    lines[0] = lines[0].substr(lines[0].lastIndexOf('!') + 1);
  }
  lines = lines.filter(line => line.indexOf(' @ ') !== 0);
  if (!lines[0] || !lines[1]) {
    return lines.join('\n');
  }
  if (lines[1].indexOf('Module not found: ') === 0) {
    lines = [
      lines[0],
      lines[1]
        .replace("Cannot resolve 'file' or 'directory' ", '')
        .replace('Cannot resolve module ', '')
        .replace('Error: ', '')
        .replace('[CaseSensitivePathsPlugin] ', '')
    ];
  } else if (lines[1].indexOf('Module build failed: ') === 0) {
    lines[1] = lines[1].replace(
      'Module build failed: SyntaxError:',
      syntaxErrorLabel
    );
  }

  const exportError = /\s*(.+?)\s*(")?export '(.+?)' was not found in '(.+?)'/;
  if (lines[1].match(exportError)) {
    lines[1] = lines[1].replace(
      exportError,
      "$1 '$4' does not contain an export named '$3'."
    );
  }
  lines[0] = chalk.inverse(lines[0]);
  message = lines.join('\n');

  message = message.replace(
    /^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm,
    ''
  );
  return message.trim();
}

const formatWebpackMessage = (message): { errors, warnings } => {
  const errors = message.errors.map(item => formatMessage(item));
  const warnings = message.warnings.map(item => formatMessage(item));

  const result = {
    errors,
    warnings
  };
  if (result.errors.some(isLikelyASyntaxError)) {
    result.errors = result.errors.filter(isLikelyASyntaxError);
  }
  return result;
}

const printCompiling = () => {
  getServeSpinner().text = 'Compiling...'
  getServeSpinner().start()
}

const printBuildError = (err: Error): void => {
  const message = err.message
  const stack = err.stack
  if (stack && typeof message === 'string' && message.indexOf('from UglifyJs') !== -1) {
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

const printSuccess = () => {
  getServeSpinner().stopAndPersist({
    symbol: '✅ ',
    text: chalk.green('Compile successful!\n')
  })
}

const printWarning = () => {
  getServeSpinner().stopAndPersist({
    symbol: '⚠️  ',
    text: chalk.yellow('Compile completes with warnings.\n')
  })
}

const printFailed = () => {
  getServeSpinner().stopAndPersist({
    symbol: '🙅  ',
    text: chalk.red('Compile failed!\n')
  })
}

const printWhenBeforeCompile = compiler => {
  compiler.hooks.beforeCompile.tap('taroBeforeCompile', filepath => {
    printCompiling()
  })
  return compiler
}

const printWhenInvalid = compiler => {
  compiler.hooks.invalid.tap('taroInvalid', filepath => {
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

let isFirst = false
const printWhenFirstDone = (devUrl, compiler) => {
  compiler.hooks.done.tap('taroDone', stats => {
    if (isFirst) {
      isFirst = false
      getServeSpinner().clear()
      console.log()
      console.log(chalk.cyan(`ℹ️  Listening at ${devUrl}`))
      console.log(chalk.gray('\n监听文件修改中...\n'))
    }
  })
  return compiler
}

const _printWhenDone = ({
  verbose = false
}, compiler) => {
  compiler.hooks.done.tap('taroDone', stats => {
    const { errors, warnings } = formatWebpackMessage(stats.toJson(true))

    if (stats.hasErrors()) {
      printFailed()
      printBuildError(new Error(errors.join('\n\n')))
      return
    }

    if (stats.hasWarnings()) {
      printWarning()
      console.log(warnings.join('\n\n'))
    }
    
    printSuccess()

    const enableWarnings = verbose

    console.log(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
        warnings: enableWarnings
      }) + '\n'
    )
  })
  return compiler
}

const printWhenDone = partial(_printWhenDone, [{ verbose: false }])

const printWhenDoneVerbosely = partial(_printWhenDone, [{ verbose: true }])

const bindDevLogger = (devUrl, compiler) => {
  pipe(
    printWhenBeforeCompile,
    partial(printWhenFirstDone, [devUrl]),
    printWhenDone,
    printWhenFailed,
    printWhenInvalid
  )(compiler)
  return compiler
}

const bindProdLogger = (compiler) => {
  pipe(
    printWhenBeforeCompile,
    printWhenDoneVerbosely,
    printWhenFailed
  )(compiler)
  return compiler
}

const bindDllLogger = (compiler) => {
  pipe(
    printWhenBeforeCompile,
    printWhenDone,
    printWhenFailed
  )(compiler)
  return compiler
}

export {
  printBuildError,
  printCompiling,
  getServeSpinner,
  bindDevLogger,
  bindProdLogger,
  bindDllLogger
}
