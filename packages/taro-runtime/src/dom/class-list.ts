import type { TaroElement } from './element'

export class ClassList {
  private el: TaroElement

  private tokenList: string[] = []

  constructor (className: string, el: TaroElement) {
    this.el = el
    className.trim().split(/\s+/).forEach(token => this.tokenList.push(token))
  }

  public get value () {
    return this.toString()
  }

  public get length () {
    return this.tokenList.length
  }

  add () {
    let index = 0
    let updated = false

    const tokens = arguments
    const length = tokens.length
    const tokenList = this.tokenList

    do {
      const token: string = tokens[index]

      if (this.checkTokenIsValid(token) && !~tokenList.indexOf(token)) {
        tokenList.push(token)

        updated = true
      }
    } while (++index < length)

    if (updated) {
      this._update()
    }
  }

  remove () {
    let i = 0
    let updated = false

    const tokens = arguments
    const length = tokens.length
    const tokenList = this.tokenList

    do {
      const token = tokens[i] + ''

      if (!this.checkTokenIsValid(token)) continue

      const index = tokenList.indexOf(token)

      if (~tokenList.indexOf(token)) {
        tokenList.splice(index, 1)

        updated = true
      }
    } while (++i < length)

    if (updated) {
      this._update()
    }
  }

  contains (token: string) {
    if (!this.checkTokenIsValid(token)) return false

    return !!~this.tokenList.indexOf(token)
  }

  toggle (token: string, force: boolean) {
    const result = this.contains(token)
    const method = result ? force !== true && 'remove' : force !== false && 'add'

    if (method) {
      // @ts-ignore
      this[method](token)
    }

    if (force === true || force === false) {
      return force
    } else {
      return !result
    }
  }

  replace (token: string, replacement_token: string) {
    if (!this.checkTokenIsValid(token) || !this.checkTokenIsValid(replacement_token)) return

    const index = this.tokenList.indexOf(token)

    if (~index) {
      this.tokenList.splice(index, 1, replacement_token)
      this._update()
    }
  }

  toString () {
    return this.tokenList.filter(v => v !== '').join(' ')
  }

  private checkTokenIsValid (token: string) {
    if (token === '' || /\s/.test(token)) return false

    return true
  }

  private _update () {
    this.el.className = this.value
  }
}
