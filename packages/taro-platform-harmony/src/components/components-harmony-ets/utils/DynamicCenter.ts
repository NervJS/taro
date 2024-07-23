import { TaroAny, TaroElement } from '@tarojs/runtime'

export class DynamicCenter {
  install (node: TaroElement, parentNode: TaroElement) {
    if (!parentNode._isCompileMode) return

    this.bindComponentToNodeWithDFS(node, parentNode._instance)
  }

  uninstall (node: TaroElement) {
    if (!node._isCompileMode || !node._instance) return

    if (node._attrs?._dynamicID) {
      node._instance[node._attrs._dynamicID] = new TaroElement('Ignore')
    }
    node._instance = null
  }

  bindComponentToNodeWithDFS (node: TaroElement, component: TaroAny) {
    if (!node) return

    const dynamicID = node._attrs?._dynamicID

    // dynamicID 只是为了更新到精准的 node
    node._instance = component
    node._isCompileMode = true

    if (dynamicID) {
      node._isDynamicNode = true
      component[dynamicID] = node
    }

    if (!node.childNodes || !node.childNodes.length) return

    for (let i = 0; i < node.childNodes.length; i++) {
      this.bindComponentToNodeWithDFS(node.childNodes[i] as TaroElement, component)
    }
  }
}
