import { options } from '../../options'

interface Position {
  index: number
  column: number
  line: number
}

export interface Token {
  type: string
  content?: string
  position?: {
    start?: Position
    end?: Position
  }
  close?: boolean
}

function initPosition (): Position {
  return {
    index: 0,
    column: 0,
    line: 0
  }
}

function feedPosition (position: Position, str: string, len: number) {
  const start = position.index
  const end = position.index = start + len
  for (let i = start; i < end; i++) {
    const char = str.charAt(i)
    if (char === '\n') {
      position.line++
      position.column = 0
    } else {
      position.column++
    }
  }
}

function jumpPosition (position: Position, str: string, end: number) {
  const len = end - position.index
  return feedPosition(position, str, len)
}

function copyPosition (position: Position) {
  return {
    index: position.index,
    line: position.line,
    column: position.column
  }
}

const whitespace = /\s/
function isWhitespaceChar (char: string) {
  return whitespace.test(char)
}

const equalSign = /=/
function isEqualSignChar (char: string) {
  return equalSign.test(char)
}

function shouldBeIgnore (tagName: string) {
  const name = tagName.toLowerCase()
  if (options.html!.skipElements.has(name)) {
    return true
  }
  return false
}

const alphanumeric = /[A-Za-z0-9]/

function findTextEnd (str: string, index: number) {
  while (true) {
    const textEnd = str.indexOf('<', index)
    if (textEnd === -1) {
      return textEnd
    }
    const char = str.charAt(textEnd + 1)
    if (char === '/' || char === '!' || alphanumeric.test(char)) {
      return textEnd
    }
    index = textEnd + 1
  }
}

function isWordEnd (cursor: number, wordBegin: number, html: string) {
  if (!isWhitespaceChar(html.charAt(cursor))) return false

  const len = html.length

  // backwrad
  for (let i = cursor - 1; i > wordBegin; i--) {
    const char = html.charAt(i)
    if (!isWhitespaceChar(char)) {
      if (isEqualSignChar(char)) return false
      break
    }
  }

  // forward
  for (let i = cursor + 1; i < len; i++) {
    const char = html.charAt(i)
    if (!isWhitespaceChar(char)) {
      if (isEqualSignChar(char)) return false
      return true
    }
  }
}

export class Scaner {
  private tokens: Token[] = []

  private position: Position = initPosition()

  private html: string

  constructor (html: string) {
    this.html = html
  }

  public scan (): Token[] {
    const { html, position } = this
    const len = html.length

    while (position.index < len) {
      const start = position.index
      this.scanText()
      if (position.index === start) {
        const isComment = html.startsWith('!--', start + 1)
        if (isComment) {
          this.scanComment()
        } else {
          const tagName = this.scanTag()
          if (shouldBeIgnore(tagName)) {
            this.scanSkipTag(tagName)
          }
        }
      }
    }

    return this.tokens
  }

  private scanText () {
    const type = 'text'
    const { html, position } = this
    let textEnd = findTextEnd(html, position.index)
    if (textEnd === position.index) {
      return
    }
    if (textEnd === -1) {
      textEnd = html.length
    }

    const start = copyPosition(position)
    const content = html.slice(position.index, textEnd)
    jumpPosition(position, html, textEnd)
    const end = copyPosition(position)
    this.tokens.push({ type, content, position: { start, end } })
  }

  private scanComment () {
    const type = 'comment'
    const { html, position } = this
    const start = copyPosition(position)
    feedPosition(position, html, 4) // "<!--".length
    let contentEnd = html.indexOf('-->', position.index)
    let commentEnd = contentEnd + 3 // "-->".length
    if (contentEnd === -1) {
      contentEnd = commentEnd = html.length
    }

    const content = html.slice(position.index, contentEnd)
    jumpPosition(position, html, commentEnd)
    this.tokens.push({
      type,
      content,
      position: {
        start,
        end: copyPosition(position)
      }
    })
  }

  private scanTag () {
    this.scanTagStart()
    const tagName = this.scanTagName()
    this.scanAttrs()
    this.scanTagEnd()

    return tagName
  }

  private scanTagStart () {
    const type = 'tag-start'
    const { html, position } = this

    const secondChar = html.charAt(position.index + 1)
    const close = secondChar === '/'
    const start = copyPosition(position)
    feedPosition(position, html, close ? 2 : 1)
    this.tokens.push({ type, close, position: { start } })
  }

  private scanTagEnd () {
    const type = 'tag-end'
    const { html, position } = this

    const firstChar = html.charAt(position.index)
    const close = firstChar === '/'
    feedPosition(position, html, close ? 2 : 1)
    const end = copyPosition(position)
    this.tokens.push({ type, close, position: { end } })
  }

  private scanTagName (): string {
    const type = 'tag'
    const { html, position } = this
    const len = html.length
    let start = position.index
    while (start < len) {
      const char = html.charAt(start)
      const isTagChar = !(isWhitespaceChar(char) || char === '/' || char === '>')
      if (isTagChar) break
      start++
    }

    let end = start + 1
    while (end < len) {
      const char = html.charAt(end)
      const isTagChar = !(isWhitespaceChar(char) || char === '/' || char === '>')
      if (!isTagChar) break
      end++
    }

    jumpPosition(position, html, end)
    const tagName = html.slice(start, end)
    this.tokens.push({
      type,
      content: tagName
    })

    return tagName
  }

  private scanAttrs () {
    const { html, position, tokens } = this
    let cursor = position.index
    let quote: string | null = null // null, single-, or double-quote
    let wordBegin = cursor // index of word start
    const words: string[] = [] // "key", "key=value", "key='value'", etc
    const len = html.length
    while (cursor < len) {
      const char = html.charAt(cursor)
      if (quote) {
        const isQuoteEnd = char === quote
        if (isQuoteEnd) {
          quote = null
        }
        cursor++
        continue
      }

      const isTagEnd = char === '/' || char === '>'
      if (isTagEnd) {
        if (cursor !== wordBegin) {
          words.push(html.slice(wordBegin, cursor))
        }
        break
      }

      if (isWordEnd(cursor, wordBegin, html)) {
        if (cursor !== wordBegin) {
          words.push(html.slice(wordBegin, cursor))
        }
        wordBegin = cursor + 1
        cursor++
        continue
      }

      const isQuoteStart = char === '\'' || char === '"'
      if (isQuoteStart) {
        quote = char
        cursor++
        continue
      }

      cursor++
    }

    jumpPosition(position, html, cursor)

    const wLen = words.length
    const type = 'attribute'
    for (let i = 0; i < wLen; i++) {
      const word = words[i]
      const isNotPair = word.includes('=')
      if (isNotPair) {
        const secondWord = words[i + 1]
        if (secondWord && secondWord.startsWith('=')) {
          if (secondWord.length > 1) {
            const newWord = word + secondWord
            tokens.push({ type, content: newWord })
            i += 1
            continue
          }
          const thirdWord = words[i + 2]
          i += 1
          if (thirdWord) {
            const newWord = word + '=' + thirdWord
            tokens.push({ type, content: newWord })
            i += 1
            continue
          }
        }
      }
      if (word.endsWith('=')) {
        const secondWord = words[i + 1]
        if (secondWord && !secondWord.includes('=')) {
          const newWord = word + secondWord
          tokens.push({ type, content: newWord })
          i += 1
          continue
        }

        const newWord = word.slice(0, -1)
        tokens.push({ type, content: newWord })
        continue
      }

      tokens.push({ type, content: word })
    }
  }

  private scanSkipTag (tagName: string) {
    const { html, position } = this
    const safeTagName = tagName.toLowerCase()
    const len = html.length
    while (position.index < len) {
      const nextTag = html.indexOf('</', position.index)
      if (nextTag === -1) {
        this.scanText()
        break
      }

      jumpPosition(position, html, nextTag)
      const name = this.scanTag()
      if (safeTagName === name.toLowerCase()) {
        break
      }
    }
  }
}
