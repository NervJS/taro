import { Container, interfaces } from 'inversify'
import SERVICE_IDENTIFIER from '../constants/identifiers'
import { TaroNodeImpl } from '../dom-external/node-impl'
import { TaroElementImpl } from '../dom-external/element-impl'
import { TaroElement } from '../dom/element'
import { TaroText } from '../dom/text'
import { TaroDocument } from '../dom/document'
import { TaroRootElement } from '../dom/root'
import { FormElement } from '../dom/form'
import { ElementNames, InstanceFactory, InstanceNamedFactory } from '../interface'
import domExternal from '../dom-external'
import { Hooks } from '../hooks'
import { DefaultHooksContainer } from './default-hooks'
import processPluginHooks from './plugin-hooks'

const container = new Container()

container.bind<TaroElement>(SERVICE_IDENTIFIER.TaroElement).to(TaroElement).whenTargetNamed(ElementNames.Element)
container.bind<TaroDocument>(SERVICE_IDENTIFIER.TaroElement).to(TaroDocument).inSingletonScope().whenTargetNamed(ElementNames.Document)
container.bind<TaroRootElement>(SERVICE_IDENTIFIER.TaroElement).to(TaroRootElement).whenTargetNamed(ElementNames.RootElement)
container.bind<FormElement>(SERVICE_IDENTIFIER.TaroElement).to(FormElement).whenTargetNamed(ElementNames.FormElement)
container.bind<InstanceNamedFactory>(SERVICE_IDENTIFIER.TaroElementFactory).toFactory<TaroElement>((context: interfaces.Context) => {
  return (named: ElementNames) => (nodeName?: string) => {
    const el = context.container.getNamed<TaroElement>(SERVICE_IDENTIFIER.TaroElement, named)
    if (nodeName) {
      el.nodeName = nodeName
    }
    el.tagName = el.nodeName.toUpperCase()
    return el
  }
})

container.bind<TaroText>(SERVICE_IDENTIFIER.TaroText).to(TaroText)
container.bind<InstanceFactory<TaroText>>(SERVICE_IDENTIFIER.TaroTextFactory).toFactory<TaroText>((context: interfaces.Context) => {
  return (text: string) => {
    const textNode = context.container.get<TaroText>(SERVICE_IDENTIFIER.TaroText)
    textNode._value = text
    return textNode
  }
})

container.bind<TaroNodeImpl>(SERVICE_IDENTIFIER.TaroNodeImpl).to(TaroNodeImpl).inSingletonScope()
container.bind<TaroElementImpl>(SERVICE_IDENTIFIER.TaroElementImpl).to(TaroElementImpl).inSingletonScope()
container.bind<Hooks>(SERVICE_IDENTIFIER.Hooks).to(Hooks).inSingletonScope()

container.load(domExternal, DefaultHooksContainer)

processPluginHooks(container)

export default container
