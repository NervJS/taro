import type { TaroProgressElement, TaroAny } from '@tarojs/runtime'
import {   shouldBindEvent, getNodeThresholds } from './utils/helper'
import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'


@Component
export default struct TaroProgress {
  node: TaroProgressElement | null = null

  build() {
    if(this.node) {
      Row({ space: 5 }) {
        Progress({
          value: parseFloat(this.node.getAttribute('percent')),
          type: ProgressType.Linear
        })
          .color(this.node.getAttribute('activeColor') ?? '#09BB07')
          .backgroundColor(this.node.getAttribute('backgroundColor') ?? '#EBEBEB')
          .style({
            strokeWidth: this.node.getAttribute('strokeWidth'),
            strokeRadius: parseFloat( this.node.getAttribute('borderRadius') ),
            enableSmoothEffect: Boolean(this.node.getAttribute('active')),
          }).onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
          .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
            if(this.node) {
              this.node._nodeInfo.areaInfo = res[1]
            }

          }))

        if(this.node.getAttribute('showInfo')) {
          Text(`${this.node.getAttribute('percent')}%`).fontSize(this.node.getAttribute('fontSize') ?? 16)
        }

      }


    }

  }
}