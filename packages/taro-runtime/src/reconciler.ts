import type { TaroElement } from './dom/element'
import type { TaroText } from './dom/text'
import type { DataTree } from './dom/node'
import type { TaroRootElement } from './dom/root'
import type { PageInstance } from './dsl/instance'

export interface Reconciler<Instance, DOMElement = TaroElement, TextElement = TaroText> {
  appendChild?(parent: DOMElement, child: DOMElement | TextElement): void

  removeChild?(parent: DOMElement, child: DOMElement | TextElement): void

  insertBefore?(parent: DOMElement, child: DOMElement | TextElement, refChild: DOMElement | TextElement): void

  prepareUpdateData?(data: DataTree, page: TaroRootElement): DataTree

  appendInitialPage?(data: DataTree, page: TaroRootElement): DataTree

  getLifecyle(instance: Instance, lifecyle: keyof PageInstance): Function | undefined | Array<Function>
}

export const CurrentReconciler: Reconciler<any> = {
  getLifecyle (instance, lifecyle) {
    return instance[lifecyle]
  }
}
