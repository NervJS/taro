export interface EventOptions {
  bubbles: boolean
  cancelable: boolean
}

export interface EventHandler extends Function {
  _stop?: boolean
}
