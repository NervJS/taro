import commonStyleModify from './style'

import type { TaroViewElement, TaroAny } from '@tarojs/runtime'

@Component
export default struct TaroListView {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroViewElement) => void = this.customBuilder
  @ObjectLink node: TaroViewElement
  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear(): void {
    if (this.node) {
      this.node._instance = this
    }
  }

  build() {
    ListItem() {
      Stack() {
        this.createLazyChildren(this.node)
      }
    }
    .attributeModifier(commonStyleModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
  }
}
