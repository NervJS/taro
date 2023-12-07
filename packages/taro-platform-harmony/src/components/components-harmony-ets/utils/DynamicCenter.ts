import { bindFocus, bindInstanceToNode, bindScrollTo, initComponentNodeInfo, TaroElement, TaroNode } from '@tarojs/runtime'

export class DynamicCenter {
  static checkIsCompileModeAndInstallAfterDOMAction (node: TaroNode, parentNode: TaroNode) {
    if (!parentNode._isCompileMode) return

    parentNode._instance?.dynamicCenter?.install?.(node, parentNode)
  }

  static checkIsCompileModeAndUninstallAfterDOMAction (node: TaroNode) {
    if (!node._isCompileMode) return

    node._instance?.dynamicCenter?.uninstall?.(node)
  }

  install (node: TaroElement, parentNode: TaroElement) {
    if (!parentNode._isCompileMode) return

    const component = parentNode._instance

    this.bindComponentToNodeWithDFS(node, component)
  }

  uninstall (node: TaroElement) {
    if (!node._isCompileMode || !node._instance) return

    node._instance[node._attrs?._dynamicID] = null
    node._instance = null
  }

  bindComponentToNodeWithDFS (node: TaroElement, component) {
    if (!node) return

    const dynamicID = node._attrs?._dynamicID

    // dynamicID 只是为了更新到精准的 node
    // 而为了让半编译模板中每个 node 都能响应 api 的调用，因此 initComponentNodeInfo、bindInstanceToNode 和各种 bindAttribute 都需要执行
    initComponentNodeInfo(component, node)
    bindInstanceToNode(node, component)
    bindFocus(node)
    bindAnimatio(node)
    bindScrollTo(node, component)

    node._isCompileMode = true

    if (dynamicID) {
      node._isDynamicNode = true
      component[dynamicID] = node
    }

    if (!node.childNodes || !node.childNodes.length) return

    for (let i = 0; i < node.childNodes.length; i++) {
      // @ts-ignore
      this.bindComponentToNodeWithDFS(node.childNodes[i], component)
    }
  }
}