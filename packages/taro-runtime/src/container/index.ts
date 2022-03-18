import { Container, interfaces } from 'inversify'
import { TaroNodeImpl } from '../dom-external/node-impl'
import { TaroElementImpl } from '../dom-external/element-impl'
import { TaroElement } from '../dom/element'
import { TaroText } from '../dom/text'
import { TaroDocument } from '../dom/document'
import { TaroRootElement } from '../dom/root'
import { FormElement } from '../dom/form'
import { ElementNames, InstanceFactory, InstanceNamedFactory } from '../interface'
import { store } from './store'
import { Hooks } from '../hooks'
import { DefaultHooksContainer } from './default-hooks'
import processPluginHooks from './plugin-hooks'
import {
  SID_TARO_ELEMENT,
  SID_TARO_ELEMENT_FACTORY,
  SID_TARO_TEXT,
  SID_TARO_TEXT_FACTORY,
  SID_TARO_NODE_IMPL,
  SID_TARO_ELEMENT_IMPL,
  SID_HOOKS
} from '../constants/identifiers'

interface IbindOptions {
  name?: string
  single?: boolean
}

const container = new Container()

function bind<T> (sid: string, target, options: IbindOptions = {}) {
  type Res = interfaces.BindingInWhenOnSyntax<T> | interfaces.BindingWhenOnSyntax<T> | interfaces.BindingOnSyntax<T>
  let res: Res = container.bind<T>(sid).to(target)
  if (options.single) {
    res = (res as interfaces.BindingInWhenOnSyntax<T>).inSingletonScope()
  }
  if (options.name) {
    res = (res as interfaces.BindingInWhenOnSyntax<T> | interfaces.BindingWhenOnSyntax<T>).whenTargetNamed(options.name)
  }
  return res
}

if (process.env.TARO_ENV !== 'h5') {
  bind<TaroText>(SID_TARO_TEXT, TaroText)
  bind<TaroElement>(SID_TARO_ELEMENT, TaroElement, { name: ElementNames.Element })
  bind<TaroRootElement>(SID_TARO_ELEMENT, TaroRootElement, { name: ElementNames.RootElement })
  bind<FormElement>(SID_TARO_ELEMENT, FormElement, { name: ElementNames.FormElement })
  bind<TaroDocument>(SID_TARO_ELEMENT, TaroDocument, { name: ElementNames.Document, single: true })
  bind<TaroNodeImpl>(SID_TARO_NODE_IMPL, TaroNodeImpl, { single: true })
  bind<TaroElementImpl>(SID_TARO_ELEMENT_IMPL, TaroElementImpl, { single: true })

  container.bind<InstanceNamedFactory>(SID_TARO_ELEMENT_FACTORY).toFactory<TaroElement>((context: interfaces.Context) => {
    return (named: ElementNames) => (nodeName?: string) => {
      const el = context.container.getNamed<TaroElement>(SID_TARO_ELEMENT, named)
      if (nodeName) {
        el.nodeName = nodeName
      }
      el.tagName = el.nodeName.toUpperCase()
      return el
    }
  })
  container.bind<InstanceFactory<TaroText>>(SID_TARO_TEXT_FACTORY).toFactory<TaroText>((context: interfaces.Context) => {
    return (text: string) => {
      const textNode = context.container.get<TaroText>(SID_TARO_TEXT)
      textNode._value = text
      return textNode
    }
  })
}

bind<Hooks>(SID_HOOKS, Hooks, { single: true })
container.load(DefaultHooksContainer)
processPluginHooks(container)

store.container = container

export default container
