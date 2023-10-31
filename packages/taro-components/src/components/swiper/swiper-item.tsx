import { Component, ComponentInterface, Element, Host, h, Prop } from '@stencil/core'

const nativeCloneNode = Node.prototype.cloneNode

function cloneNode (node: Node, deep: boolean) {
  const clonedNode = nativeCloneNode.call(node, false)
  const srcChildNodes = childNodes(node)

  if (deep) {
    for (let i = 0; i < srcChildNodes.length; i++) {
      const srcNode: Node = srcChildNodes[i]
      let srcDeep: boolean = deep
      if (srcNode.nodeType !== 2 && srcNode.nodeType !== 8) {
        // Note: 没有引用节点（s-cr[reference comment]）的情况下，不复制子节点避免冗余（例如：Image 组件）
        if (!srcNode['s-cr']) {
          srcDeep = false
        }
        const childClone = cloneNode(srcNode, srcDeep)
        clonedNode.appendChild(childClone)
      }
    }
  }

  return clonedNode
}

function childNodes (node: Node) {
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

@Component({
  tag: 'taro-swiper-item-core'
})
export class SwiperItem implements ComponentInterface {
  @Element() el: HTMLElement

  @Prop() itemId: string

  componentDidRender () {
    this.el.cloneNode = (deep = false) => {
      return cloneNode.call(null, this.el, deep)
    }
  }

  render () {
    return (
      <Host class='swiper-slide' item-id={this.itemId} />
    )
  }
}
