import nextTick from './next-tick'
import { updateComponent } from './lifecycle'

let items = []

export function enqueueRender (component) {
  // tslint:disable-next-line:no-conditional-assignment
  if (!component._dirty && (component._dirty = true) && items.push(component) === 1) {
    nextTick(rerender)
  }
}

export function rerender () {
  let p
  const list = items
  items = []
  // tslint:disable-next-line:no-conditional-assignment
  while ((p = list.pop())) {
    if (p._dirty) {
      updateComponent(p, true)
    }
  }
}
