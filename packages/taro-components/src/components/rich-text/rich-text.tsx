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

import { Component, h, ComponentInterface, Prop, Host } from '@stencil/core'

interface Attributes {
  [propName: string]: string | {
    [propName: string]: string
  }
}

interface NodeType {
  name: string
  attrs?: Attributes
  children?: ElementType[]
}

interface TextType {
  type: 'text'
  text: string
}

type ElementType = NodeType | TextType

type StringType = string

export type Nodes = ElementType[] | StringType

@Component({
  tag: 'taro-rich-text-core'
})
export class RichText implements ComponentInterface {
  @Prop() nodes: Nodes

  renderNode = (node: ElementType) => {
    if ('type' in node && node.type === 'text') {
      // unsupport Html Entries
      const content = (node.text || '').replace(/&nbsp;/g, '\u00A0')
      return content
    } else if ('name' in node && node.name) {
      const {
        name,
        attrs,
        children
      } = node
      const attributes: Attributes = {}
      let childList: any[] = []

      if (attrs && typeof attrs === 'object') {
        for (const key in attrs) {
          const val = attrs[key]
          if (key === 'style' && typeof val === 'string') {
            // stencil JSX style props only support object
            const styles = val
              .split(';')
              .map(item => item.trim())
              .filter(item => item)

            const styleObj: {
              [propName: string]: string
            } = {}

            styles.forEach(item => {
              if (!item) return

              const res = /(.+): *(.+)/g.exec(item)
              if (!res) return

              const [, name, value] = res
              const styleName = name.replace(/-([a-z])/g, (...args) => args[1].toUpperCase())
              styleObj[styleName] = value
            })

            if (Object.keys(styleObj).length) {
              attributes.style = styleObj
            }

            continue
          }
          attributes[key] = val
        }
      }

      if (children && children.length) {
        childList = children.map(node => this.renderNode(node))
      }

      // @ts-ignore
      return h(name, attributes, childList)
    }

    return null
  }

  render () {
    const { nodes, renderNode } = this

    if (Array.isArray(nodes)) {
      return (
        <Host>
          {nodes.map(node => renderNode(node))}
        </Host>
      )
    } else {
      return <Host innerHTML={nodes} />
    }
  }
}
