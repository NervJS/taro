import { LegacyException } from 'sass'

import * as d from './declarations'

const STOP_CHARS = [
  '',
  '\n',
  '\r',
  '\t',
  ' ',
  ':',
  ';',
  ',',
  '{',
  '}',
  '.',
  '#',
  '@',
  '!',
  '[',
  ']',
  '(',
  ')',
  '&',
  '+',
  '~',
  '^',
  '*',
  '$',
]

/**
 * Generates a diagnostic as a result of an error originating from Sass.
 *
 * This function mutates the provided context by pushing the generated diagnostic to the context's collection of
 * diagnostics.
 *
 * @param context the compilation context that the plugin has access to
 * @param sassError the Sass error to create a diagnostic from
 * @param filePath the path of the file that led to an error being raised
 * @returns the created diagnostic, or `null` if one could not be generated
 */
export function loadDiagnostic (
  context: d.PluginCtx,
  sassError: LegacyException,
  filePath: string,
): d.Diagnostic | null {
  if (sassError == null || context == null) {
    return null
  }

  type TErrorLine = d.PrintLine & { text: string, errorLength: number }
  const diagnostic: d.Diagnostic & { lines: TErrorLine[] } = {
    level: 'error',
    type: 'css',
    language: 'scss',
    header: 'sass error',
    code: formatCode(sassError.status),
    messageText: formatMessage(sassError.message),
    lines: [],
  }

  if (typeof sassError.file === 'string' && sassError.file !== 'stdin') {
    filePath = sassError.file
  }

  if (typeof filePath === 'string') {
    diagnostic.language = /(\.scss)$/i.test(filePath) ? 'scss' : 'sass'
    diagnostic.absFilePath = filePath
    diagnostic.relFilePath = formatFileName(context.config.rootDir!, diagnostic.absFilePath)

    const errorLineNumber = sassError.line || 0
    const errorLineIndex = errorLineNumber - 1

    diagnostic.lineNumber = errorLineNumber
    diagnostic.columnNumber = sassError.column

    if (errorLineIndex > -1) {
      try {
        const sourceText = context.fs.readFileSync(diagnostic.absFilePath)
        const srcLines = sourceText.split(/\r?\n/)

        const errorLine: TErrorLine = {
          lineIndex: errorLineIndex,
          lineNumber: errorLineNumber,
          text: typeof srcLines[errorLineIndex] === 'string' ? srcLines[errorLineIndex] : '',
          errorCharStart: sassError.column!,
          errorLength: 0,
        }

        for (let i = errorLine.errorCharStart; i >= 0; i--) {
          if (STOP_CHARS.indexOf(errorLine.text.charAt(i)) > -1) {
            break
          }
          errorLine.errorCharStart = i
        }

        for (let j = errorLine.errorCharStart; j <= errorLine.text.length; j++) {
          if (STOP_CHARS.indexOf(errorLine.text.charAt(j)) > -1) {
            break
          }
          errorLine.errorLength++
        }

        if (errorLine.errorLength === 0 && errorLine.errorCharStart > 0) {
          errorLine.errorLength = 1
          errorLine.errorCharStart--
        }

        diagnostic.lines.push(errorLine)

        if (errorLine.lineIndex > 0) {
          const previousLine: d.PrintLine = {
            lineIndex: errorLine.lineIndex - 1,
            lineNumber: errorLine.lineNumber - 1,
            text: srcLines[errorLine.lineIndex - 1],
            errorCharStart: -1,
            errorLength: -1,
          }

          diagnostic.lines.unshift(previousLine)
        }

        if (errorLine.lineIndex + 1 < srcLines.length) {
          const nextLine: d.PrintLine = {
            lineIndex: errorLine.lineIndex + 1,
            lineNumber: errorLine.lineNumber + 1,
            text: srcLines[errorLine.lineIndex + 1],
            errorCharStart: -1,
            errorLength: -1,
          }

          diagnostic.lines.push(nextLine)
        }
      } catch (e) {
        console.error(`StyleSassPlugin loadDiagnostic, ${e}`)
      }
    }
  }

  context.diagnostics.push(diagnostic)

  return diagnostic
}

/**
 * Helper function for converting a number error code to a string
 * @param input the numeric error code to convert
 * @returns the stringified error code
 */
function formatCode (input: number): string {
  let output = ''
  if (input != null) {
    output = String(input)
  }
  return output
}

/**
 * Splits up a message from Sass, returning all input prior to the first '╷' character.
 * If no such character exists, the entire original message will be returned.
 * @param input the Sass message to split
 * @returns the split message
 */
function formatMessage (input: string): string {
  let output = ''
  if (typeof input === 'string') {
    output = input.split('╷')[0]
  }
  return output
}

/**
 * Formats the provided filename, by stripping the provided root directory out of the filename, and limiting the
 * display string to 80 characters
 * @param rootDir the root directory to strip out of the provided filename
 * @param fileName the filename to format for pretty printing
 * @returns the formatted filename
 */
function formatFileName (rootDir: string, fileName: string): string {
  if (!rootDir || !fileName) return ''

  fileName = fileName.replace(rootDir, '')
  if (/\/|\\/.test(fileName.charAt(0))) {
    fileName = fileName.substring(1)
  }
  if (fileName.length > 80) {
    fileName = '...' + fileName.substring(fileName.length - 80)
  }
  return fileName
}
