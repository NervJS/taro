import { bindFocus, bindInstanceToNode, bindScrollTo, initComponentNodeInfo, TaroAny, TaroElement } from '@tarojs/runtime'

import { bindAnimation } from './helper'

export class DynamicCenter {

  install (node: TaroElement, parentNode: TaroElement) {
    if (!parentNode._isCompileMode) return

    this.bindComponentToNodeWithDFS(node, parentNode._instance)
  }

  uninstall (node: TaroElement) {
    if (!node._isCompileMode || !node._instance) return

    if (node._attrs?._dynamicID) {
      node._instance[node._attrs._dynamicID] = null
    }
    node._instance = null
  }

  bindComponentToNodeWithDFS (node: TaroElement, component: TaroAny) {
    if (!node) return

    const dynamicID = node._attrs?._dynamicID

    // dynamicID 只是为了更新到精准的 node
    // 而为了让半编译模板中每个 node 都能响应 api 的调用，因此 initComponentNodeInfo、bindInstanceToNode 和各种 bindAttribute 都需要执行
    initComponentNodeInfo(component, node)
    bindInstanceToNode(node, component)
    bindFocus(node)
    bindAnimation(node)
    bindScrollTo(node, component)

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