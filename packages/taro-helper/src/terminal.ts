import ansiEscapes from 'ansi-escapes'
import chalk from 'chalk'
import supportsHyperlinks from 'supports-hyperlinks'

interface ITerminalLinkOptions {
  target?: 'stdout' | 'stderr'
  fallback?: boolean | ((text: string, url: string) => string)
  [key: string]: unknown
}

function terminalLink (text: string, url: string, { target = 'stdout', fallback }: ITerminalLinkOptions = {}) {
  if (!supportsHyperlinks[target]) {
    if (fallback === false) return text

    return typeof fallback === 'function' ? fallback(text, url) : `${text} (\u200B${url}\u200B)`
  }

  return ansiEscapes.link(text, url)
}

terminalLink.isSupported = supportsHyperlinks.stdout
terminalLink.stderr = ((text: string, url: string, options = {}) => terminalLink(text, url, { target: 'stderr', ...options })) as typeof terminalLink
terminalLink.stderr.isSupported = supportsHyperlinks.stderr

export { chalk, terminalLink }
