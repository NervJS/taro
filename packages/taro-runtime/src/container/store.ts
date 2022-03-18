import { SID_HOOKS, SID_TARO_ELEMENT_FACTORY, SID_TARO_ELEMENT_IMPL, SID_TARO_NODE_IMPL } from '../constants/identifiers'
import { ElementNames, TaroDocumentInstance } from '../interface'

import type { Container } from 'inversify'
import type { IHooks, InstanceNamedFactory } from '../interface'
import type { TaroNodeImpl } from '../dom-external/node-impl'
import type { TaroElementImpl } from '../dom-external/element-impl'

interface IStore {
  container: Container | null
}

export const store: IStore = {
  container: null
}

export function getHooks (): IHooks {
  return store.container!.get<IHooks>(SID_HOOKS)
}

export function getElementFactory (): InstanceNamedFactory {
  return store.container!.get<InstanceNamedFactory>(SID_TARO_ELEMENT_FACTORY)
}

export function getNodeImpl (): TaroNodeImpl {
  return store.container!.get<TaroNodeImpl>(SID_TARO_NODE_IMPL)
}

export function getElementImpl (): TaroElementImpl {
  return store.container!.get<TaroElementImpl>(SID_TARO_ELEMENT_IMPL)
}

export function getDocument (): TaroDocumentInstance {
  const getElement = getElementFactory()
  return getElement(ElementNames.Document)() as TaroDocumentInstance
}
