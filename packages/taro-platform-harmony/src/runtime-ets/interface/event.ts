export interface EventOptions {
  bubbles: boolean
  cancelable: boolean
  [x: string]: any
}

export interface EventHandler<T = any, R = void> {
  (...args: T[]): R
  _stop?: boolean
}
