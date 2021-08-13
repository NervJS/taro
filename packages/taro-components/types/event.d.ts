export type EventHandler = (ev: Event) => void

export interface TaroEvent<T extends EventTarget, D = any> extends Event {
  srcElement: T | null
  target: T
  detail: D
}
