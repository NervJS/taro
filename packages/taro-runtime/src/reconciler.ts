import type { TaroElement } from './dom/element'
import type { TaroText } from './dom/text'
import type { DataTree, TaroNode } from './dom/node'
import type { TaroRootElement } from './dom/root'
import type { Instance, PageInstance, PageProps } from './dsl/instance'

type Inst = Instance<PageProps>

export interface Reconciler<Instance, DOMElement = TaroElement, TextElement = TaroText, DOMNode = TaroNode> {
  // mini apps
  appendChild?(parent: DOMNode, child: DOMNode | TextElement): void

  removeChild?(parent: DOMNode, child: DOMNode | TextElement, oldChild: DOMNode | TextElement): void

  insertBefore?(parent: DOMNode, child: DOMNode | TextElement, refChild?: DOMNode | TextElement | null): void

  removeAttribute?(element: DOMElement, qualifiedName: string): void

  setAttribute?(element: DOMElement, qualifiedName: string, value: unknown): void

  prepareUpdateData?(data: DataTree, page: TaroRootElement): DataTree

  appendInitialPage?(data: DataTree, page: TaroRootElement): DataTree

  getLifecyle(instance: Instance, lifecyle: keyof PageInstance): Function | undefined | Array<Function>

  // h5
  createPullDownComponent?(el: Instance, path: string, framework)

  findDOMNode?(instance: Instance): DOMElement | undefined

  mergePageInstance?(prev: Inst | undefined, next: Inst): void
}

export const CurrentReconciler: Reconciler<any> = {
  getLifecyle (instance, lifecyle) {
    return instance[lifecyle]
  }
}
