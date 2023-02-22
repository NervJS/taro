/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
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
      // nonsupport Html Entries
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
