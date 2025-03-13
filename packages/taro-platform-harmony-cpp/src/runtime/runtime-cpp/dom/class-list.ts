export class ClassList {
  private el: any

  constructor (el: any) {
    this.el = el
  }

  public get value () {
    return this.toString()
  }

  public get length () {
    return nativeUIManager.executeNodeFunc(this.el, 'classList.length', [])
  }

  add (...tokens: string[]) {
    return nativeUIManager.executeNodeFunc(this.el, 'classList.add', tokens)
  }

  remove (...tokens: string[]) {
    return nativeUIManager.executeNodeFunc(this.el, 'classList.remove', tokens)
  }

  contains (token: string) {
    return nativeUIManager.executeNodeFunc(this.el, 'classList.contains', token)
  }

  toggle (token: string, force: boolean) {
    return nativeUIManager.executeNodeFunc(this.el, 'classList.toggle', [token, force])
  }

  replace (token: string, replacement_token: string) {
    return nativeUIManager.executeNodeFunc(this.el, 'classList.replace', [token, replacement_token])
  }

  toString () {
    return nativeUIManager.executeNodeFunc(this.el, 'classList.toString', [])
  }
}
