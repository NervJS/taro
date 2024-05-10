import commonStyleModify from './style'

import type { TaroViewElement, TaroElement, TaroAny } from '@tarojs/runtime'

@Component
export default struct TaroStickySection {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroViewElement) => void = this.customBuilder
  @ObjectLink node: TaroViewElement
  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear(): void {
    if (this.node) {
      this.node._instance = this
    }
  }

  @Builder
  itemHead(header: TaroViewElement) {
    Stack() {
      LazyForEach(header, (item: TaroElement) => {
        if (item.tagName === 'STICKY-HEADER') {
          this.createLazyChildren(item as TaroViewElement)
        }
      }, (item: TaroElement) => `${item._nid}-${item._nodeInfo?.layer || 0}`)
    }
  }

  build() {
    ListItemGroup({
      header: this.itemHead(this.node)
    }) {
      ForEach(this.node.children, (item: TaroElement) => {
        if (item.tagName === 'LIST-VIEW') {
          this.createLazyChildren(item as TaroViewElement)
        }
      }, (item: TaroElement) => `${item._nid}-${item._nodeInfo?.layer || 0}`)

    }
    .attributeModifier(commonStyleModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
  }
}
