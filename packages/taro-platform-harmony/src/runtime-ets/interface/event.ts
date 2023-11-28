export interface EventOptions {
  bubbles: boolean
  cancelable: boolean
  [x: string]: any
}

export interface EventHandler extends Function {
  _stop?: boolean
}
