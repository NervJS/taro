import { Component, h, ComponentInterface, Prop, Host } from '@stencil/core'

import type { TextProps } from 'types'

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
  tag: 'taro-rich-text-core',
  styleUrl: './style/index.scss'
})
export class RichText implements ComponentInterface {
  @Prop() nodes: Nodes
  @Prop({ mutable: true }) selectable = false
  @Prop({ mutable: true }) userSelect = false
  @Prop() space?: keyof TextProps.TSpace

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
