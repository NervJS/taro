import { MpNode } from './node'

let pending = false

let ctx: null | any = null

export function hydrate (root) {
  const data = {
    cn: root.childNodes.map(hydrate),
    nodeName: root.nodeName,
    class: root.className,
    nodeValue: root.nodeValue,
    style: root.style || ''
  }

  return data
}

export function performUpdate (node: MpNode) {
  if (ctx === null) {
    return
  }

  pending = true
  setTimeout(() => {
    let root = node
    while (true) {
      if (root.nodeName === 'root') {
        break
      }
      if (root.parentNode) {
        root = root.parentNode
        if (root.nodeName === 'root') {
          break
        }
      } else {
        break
      }
    }
    ctx.setData({
      root: hydrate(root)
    }, () => {
      pending = false
    })
  }, 1)
}

export function requestUpdate (node: MpNode) {
  if (!pending) {
    performUpdate(node)
  }
}

export function render (inst) {
  ctx = inst
  performUpdate(inst.dom)
}
