/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

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
