import TaroComponentWrapper from './base'

import type { TaroViewElement } from '@tarojs/runtime'


@Component
struct TaroInnerHtml {

  @ObjectLink node: TaroViewElement

  build() {
    TaroComponentWrapper({ node: this.node }) {
      RichText(this.node._innerHTML)
      .size({
        width: '100%',
        height: '100%'
      })
      .clip(true)
    }
  }
}

export default TaroInnerHtml
