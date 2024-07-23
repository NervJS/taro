import type { TaroProgressElement, TaroAny } from '@tarojs/runtime'
import commonStyleModify from './style'
import { shouldBindEvent, getNodeThresholds } from './utils/helper'
import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'

const PROGRESS_ACTIVECOLOR = '#09BB07'
const PROGRESS_BACKGROUNDCOLOR = '#EBEBEB'
const PROGRESS_DEFAULTINFOFONTSIZE = 16

@Component
export default struct TaroProgress {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroProgressElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroProgressElement
  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear(): void {
    if (this.node) {
      this.node._instance = this
    }
  }

  build() {
    Row({ space: 5 }) {
      Progress({
        value: parseFloat(this.node.getAttribute('percent')),
        type: ProgressType.Linear
      })
        .attributeModifier(commonStyleModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
        .color(this.node.getAttribute('activeColor') ?? PROGRESS_ACTIVECOLOR)
        .backgroundColor(this.node.getAttribute('backgroundColor') ?? PROGRESS_BACKGROUNDCOLOR)
        .style({
          strokeWidth: this.node.getAttribute('strokeWidth'),
          strokeRadius: parseFloat(this.node.getAttribute('borderRadius')),
          enableSmoothEffect: Boolean(this.node.getAttribute('active')),
        })

        .onClick(shouldBindEvent((e: ClickEvent) => { eventHandler(e, 'click', this.node) }, this.node, ['click']))
        .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          if (this.node) {
            this.node._nodeInfo.areaInfo = res[1]
          }
        }))

      if (this.node.getAttribute('showInfo')) {
        Text(`${this.node.getAttribute('percent')}%`)
          .fontSize(this.node.getAttribute('fontSize') ?? PROGRESS_DEFAULTINFOFONTSIZE)
      }
    }
  }
}
