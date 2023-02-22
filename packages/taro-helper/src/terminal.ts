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
