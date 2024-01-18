export interface EventListenerOptions {
  capture?: boolean
}

export interface AddEventListenerOptions extends EventListenerOptions {
  once?: boolean
  passive?: boolean
}

// eslint-disable-next-line 
export interface EventHandler extends Function {
  _stop?: boolean
}
