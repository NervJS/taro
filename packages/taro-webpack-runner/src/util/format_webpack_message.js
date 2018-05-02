const chalk = require('chalk')

const syntaxErrorLabel = 'Syntax error:'

function isLikelyASyntaxError (message) {
  return message.indexOf(syntaxErrorLabel) >= 0
}

function formatMessage (message) {
  let lines = message.split('\n')
  if (lines.length > 2 && lines[1] === '') {
    lines.splice(1, 1)
  }
  if (lines[0].lastIndexOf('!') >= 0) {
    lines[0] = lines[0].substr(lines[0].lastIndexOf('!') + 1)
  }
  lines = lines.filter(line => line.indexOf(' @ ') !== 0)
  if (!lines[0] || !lines[1]) {
    return lines.join('\n')
  }
  if (lines[1].indexOf('Module not found: ') === 0) {
    lines = [
      lines[0],
      lines[1]
        .replace("Cannot resolve 'file' or 'directory' ", '')
        .replace('Cannot resolve module ', '')
        .replace('Error: ', '')
        .replace('[CaseSensitivePathsPlugin] ', '')
    ]
  } else if (lines[1].indexOf('Module build failed: ') === 0) {
    lines[1] = lines[1].replace(
      'Module build failed: SyntaxError:',
      syntaxErrorLabel
    )
  }

  const exportError = /\s*(.+?)\s*(")?export '(.+?)' was not found in '(.+?)'/
  if (lines[1].match(exportError)) {
    lines[1] = lines[1].replace(
      exportError,
      "$1 '$4' does not contain an export named '$3'."
    )
  }
  lines[0] = chalk.inverse(lines[0])
  message = lines.join('\n')

  message = message.replace(/^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm, '')
  return message.trim()
}

module.exports = function formatWebpackMessage (message) {
  const errors = message.errors.map(item => formatMessage(item))
  const warnings = message.warnings.map(item => formatMessage(item))

  const result = {
    errors,
    warnings
  }
  if (result.errors.some(isLikelyASyntaxError)) {
    result.errors = result.errors.filter(isLikelyASyntaxError)
  }
  return result
}
