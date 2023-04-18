import type { TaroElement } from './element'

export class ClassList {
  private el: TaroElement

  private _value: string[] = []

  constructor (className: string, el: TaroElement) {
    this.el = el
    className.trim().split(/\s+/).forEach(token => this._value.push(token))
  }

  public get value () {
    return this.toString()
  }

  public get length () {
    return this._value.length
  }

  add () {
    let i = 0
    let updated = false

    const tokens = arguments
    const l = tokens.length
    const value = this._value

    do {
      const token: string = tokens[i]

      if (this.checkTokenIsValid(token) && !~value.indexOf(token)) {
        value.push(token)

        updated = true
      }
    } while (++i < l)

    if (updated) {
      this._update()
    }
  }

  remove () {
    let i = 0
    let updated = false

    const tokens = arguments
    const l = tokens.length
    const value = this._value

    do {
      const token = tokens[i] + ''

      if (!this.checkTokenIsValid(token)) continue
    
      const index = value.indexOf(token)

      if (~index) {
        value.splice(index, 1)

        updated = true
      }
    } while (++i < l)

    if (updated) {
      this._update()
    }
  }

  contains (token: string) {
    if (!this.checkTokenIsValid(token)) return false

    return !!~this._value.indexOf(token)
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
  
    const index = this._value.indexOf(token)

    if (~index) {
      this._value.splice(index, 1, replacement_token)
		  this._update()
    }
  }

  toString () {
	  return this._value.filter(v => v !== '').join(' ')
  }

  private checkTokenIsValid (token: string) {
    if (token === '' || /\s/.test(token)) return false
  
    return true
  }

  private _update () {
    this.el.className = this.value
  }
}
