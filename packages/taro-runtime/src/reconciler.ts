import type { TaroElement } from './dom/element'
import type { TaroText } from './dom/text'
import type { DataTree, TaroNode } from './dom/node'
import type { TaroRootElement } from './dom/root'
import type { PageInstance } from './dsl/instance'

export interface Reconciler<Instance, DOMElement = TaroElement, TextElement = TaroText, DOMNode = TaroNode> {
  appendChild?(parent: DOMNode, child: DOMNode | TextElement): void

  removeChild?(parent: DOMNode, child: DOMNode | TextElement, oldChild: DOMNode | TextElement): void

  insertBefore?(parent: DOMNode, child: DOMNode | TextElement, refChild?: DOMNode | TextElement | null): void

  removeAttribute?(element: DOMElement, qualifiedName: string): void

  setAttribute?(element: DOMElement, qualifiedName: string, value: unknown): void

  prepareUpdateData?(data: DataTree, page: TaroRootElement): DataTree

  appendInitialPage?(data: DataTree, page: TaroRootElement): DataTree

  getLifecyle(instance: Instance, lifecyle: keyof PageInstance): Function | undefined | Array<Function>
}

export const CurrentReconciler: Reconciler<any> = {
  getLifecyle (instance, lifecyle) {
    return instance[lifecyle]
  }
}
