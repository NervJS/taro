import { Component, h, ComponentInterface, Prop, Host } from '@stencil/core'

interface Attributes {
  [propName: string]: string
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
          if (key === 'style' && typeof attrs[key] === 'string') {
            // stencil JSX style props only support object
            console.warn('[taro] attrs:style should be Object!')
            continue
          }
          attributes[key] = attrs[key]
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
