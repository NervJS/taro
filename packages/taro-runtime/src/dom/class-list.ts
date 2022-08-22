import type { TaroElement } from './element'

export class ClassList extends Set<string> {
  private el: TaroElement

  constructor (className: string, el: TaroElement) {
    super()
    className.trim().split(/\s+/).forEach(super.add.bind(this))
    this.el = el
  }

  public get value () {
    return [...this].filter(v => v !== '').join(' ')
  }

  public add (s: string) {
    super.add(s)
    this._update()

    return this
  }

  public get length (): number {
    return this.size
  }

  public remove (s: string) {
    super.delete(s)
    this._update()
  }

  public toggle (s: string) {
    if (super.has(s)) {
      super.delete(s)
    } else {
      super.add(s)
    }

    this._update()
  }

  public replace (s1: string, s2: string) {
    super.delete(s1)
    super.add(s2)

    this._update()
  }

  public contains (s: string) {
    return super.has(s)
  }

  public toString () {
    return this.value
  }

  private _update () {
    this.el.className = this.value
  }
}
