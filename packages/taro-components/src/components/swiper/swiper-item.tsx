import { Component, ComponentInterface, Element, Host, h, Prop } from '@stencil/core'

const nativeCloneNode = Node.prototype.cloneNode

@Component({
  tag: 'taro-swiper-item-core'
})
export class SwiperItem implements ComponentInterface {
  @Element() el: HTMLElement

  @Prop() itemId: string
  @Prop() deep: boolean = false

  handleCloneNode (node: Node, deep: boolean) {
    const clonedNode = nativeCloneNode.call(node, false)
    const srcChildNodes = this.handleChildNodes(node)

    if (deep) {
      for (let i = 0; i < srcChildNodes.length; i++) {
        const srcNode: Node = srcChildNodes[i]
        if (!srcNode) break
        let srcDeep: boolean = deep
        if (srcNode.nodeType !== 2 && srcNode.nodeType !== 8) {
          // Note: 没有引用节点（s-cr[reference comment]）的情况下，不复制子节点避免冗余（例如：Image 组件）
          if (this.deep !== true && !srcNode['s-cr']) {
            srcDeep = false
          }
          const childClone = this.handleCloneNode(srcNode, srcDeep)
          clonedNode.appendChild(childClone)
        }
      }
    }

    return clonedNode
  }

  handleChildNodes (node: Node) {
    const childNodes = node.childNodes

    // check if element is stencil element without shadow dom
    // and then detect elements that were slotted into the element
    if (node['s-sc']) {
      const result: any[] = []

      for (let i = 0; i < childNodes.length; i++) {
        const slot = childNodes[i]['s-nr']

        if (slot) {
          result.push(slot)
        }
      }

      return result
    }

    return Array.from(childNodes)
  }

  componentDidRender () {
    this.el.cloneNode = (deep = false) => {
      return this.handleCloneNode(this.el, deep)
    }
  }

  render () {
    return (
      <Host class='swiper-slide' item-id={this.itemId} />
    )
  }
}
