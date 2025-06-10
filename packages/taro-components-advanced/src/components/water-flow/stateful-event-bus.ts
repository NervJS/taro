type Event = string | number | symbol;
type Handler<T = unknown> = (ev: Event, payload: T) => void;

class EventBus<T extends Event> {
  private eventsMap: Map<T, Set<Handler>> = new Map()

  pub<P = undefined>(ev: T, payload?: P) {
    const set = this.eventsMap.get(ev)
    if (set) {
      for (const cb of set) {
        cb(ev, payload)
      }
    }
  }

  sub<P = unknown>(ev: T, subscribe: Handler<P>) {
    let set = this.eventsMap.get(ev)
    if (!set) {
      set = new Set()
    }
    set.add(subscribe)
    this.eventsMap.set(ev, set)
    return () => {
      set.delete(subscribe)
    }
  }
}

/**
 * 继承自 EventBus 的有状态事件总线
 * @template S 状态类型
 * @template E 事件类型
 */
export class StatefulEventBus<
  S extends Record<string, any>,
  E extends Event = keyof S | symbol
> extends EventBus<E | keyof S | symbol> {
  /**
   * 内部状态
   */
  state: S

  /**
   * 构造函数
   * @param initialState 初始状态
   */
  constructor(initialState: S) {
    super()
    this.state = { ...initialState }
  }

  /**
   * 获取当前状态
   * @returns 当前状态的副本
   */
  getState(): S {
    return { ...this.state }
  }

  getStateIn<K extends keyof S>(p: K): S[K] {
    return this.state[p]
  }

  setStateIn(p: keyof S, v: any) {
    this.state[p] = v
    this.pub(p)
  }

  setStateBatch(s: Partial<S>) {
    for (const key in s) {
      if (Object.prototype.hasOwnProperty.call(s, key)) {
        const rawValue = this.getState()[key]
        const newValue = s[key]
        if (!Object.is(rawValue, newValue)) {
          this.setStateIn(key, newValue)
        }
      }
    }
  }

  notify(p: E) {
    this.pub(p)
  }
}
