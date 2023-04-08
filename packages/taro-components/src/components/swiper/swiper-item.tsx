import { Component, ComponentInterface, Element, Host, h, Prop } from '@stencil/core'

function isEqualTag (a: Element, b: Element) {
  return typeof a.tagName === 'undefined' ? a.nodeType === b.nodeType : a.tagName === b.tagName
}

function parseChildNodes (items: NodeListOf<ChildNode>, targets: NodeListOf<ChildNode>, needClean = false) {
  const list = Array.from(targets.values())
  for (let i = 0, j = 0; i < list.length; i++) {
    const target = list[i] as Element
    if (!target) return

    let item = items.item(j) as Element
    while (item) {
      if (!isEqualTag(item, target) || needClean) {
        item.remove()
        j++
        item = items.item(j) as Element
        continue
      }
      if (target.childNodes.length > 0) {
        const cleanAll = ['taro-image-core'].includes(target.tagName.toLocaleLowerCase())
        parseChildNodes(item.childNodes, target.childNodes, cleanAll)
      }
      break
    }
    while (i === list.length - 1 && j < items.length) {
      j++
      item = items.item(j) as Element
      item?.remove()
    }
  }
}

@Component({
  tag: 'taro-swiper-item-core'
})
export class SwiperItem implements ComponentInterface {
  @Element() el: HTMLElement

  @Prop() itemId: string

  componentDidRender () {
    const el = this.el

    if (el.classList.contains('swiper-slide-duplicate')) {
      const list = Array
        .from(el.parentElement?.childNodes?.values() || [])
        .filter((e: Element) => e.tagName === 'TARO-SWIPER-ITEM-CORE')
      if (list.length > 0) {
        parseChildNodes(
          el.childNodes,
          list[list.indexOf(el) === 0 ? list.length - 2 : 1]?.childNodes
        )
      }
    }
  }

  render () {
    return (
      <Host class='swiper-slide' item-id={this.itemId} />
    )
  }
}
