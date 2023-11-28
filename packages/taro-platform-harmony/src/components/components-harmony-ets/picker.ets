import { bindInstanceToNode, bindAnimation, AREA_CHANGE_EVENT_NAME, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo, getPageScrollerOrNode,
  TaroNode,
  TaroEvent
} from '@tarojs/runtime'
import { createNode } from './render'
import TaroComponentWrapper from './base'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { FlexManager } from './utils/FlexManager'
import { createTaroEvent } from './utils/events'
import { getNormalAttributes, shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroViewElement, TaroElement } from './utils/element'
import type { TaroStyleType } from './type'
import type { TaroAny } from './utils/type'

import { getSingleSelector, getMultiSelector } from './utils'

@Extend(TextPicker)
function textPickerAttrs (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .padding(style.padding)
  .margin(style.margin)
  .width(style.width)
  .height(style.height)
  .constraintSize(style.constraintSize)
  .flexGrow(style.flexGrow)
  .flexShrink(style.flexShrink)
  .flexBasis(style.flexBasis)
  .alignSelf(style.alignSelf)
  .backgroundColor(style.backgroundColor)
  .backgroundImage(style.backgroundImage, style.backgroundRepeat)
  .backgroundImageSize(style.backgroundImageSize)
  .rotate(style.rotate)
  .scale(style.scale)
  .translate(style.translate)
  .transform(style.transform)
  .borderStyle(style.borderStyle)
  .borderWidth(style.borderWidth)
  .borderColor(style.borderColor)
  .borderRadius(style.borderRadius)
  .linearGradient(style.linearGradient)
  .zIndex(style.zIndex)
  .opacity(style.opacity)
  .clip(style.clip)
}

@Extend(DatePicker)
function datePickerAttrs (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .padding(style.padding)
  .margin(style.margin)
  .width(style.width)
  .height(style.height || '100%')
  .constraintSize(style.constraintSize)
  .flexGrow(style.flexGrow)
  .flexShrink(style.flexShrink)
  .flexBasis(style.flexBasis)
  .alignSelf(style.alignSelf)
  .backgroundColor(style.backgroundColor || '#fff')
  .backgroundImage(style.backgroundImage, style.backgroundRepeat)
  .backgroundImageSize(style.backgroundImageSize)
  .rotate(style.rotate)
  .scale(style.scale)
  .translate(style.translate)
  .transform(style.transform)
  .borderStyle(style.borderStyle)
  .borderWidth(style.borderWidth)
  .borderColor(style.borderColor)
  .borderRadius(style.borderRadius)
  .linearGradient(style.linearGradient)
  .zIndex(style.zIndex)
  .opacity(style.opacity)
  .clip(style.clip)
}

class TimeRange {
  startHH: number
  startMM: number
  endHH: number
  endMM: number
}

@CustomDialog
export struct PickerView {

  @ObjectLink node: TaroViewElement

  @Link select: string | number

  controller?: CustomDialogController

  multiColumnIndex: number[] = []

  showSelector: number[] = []

  getDateOptions (): DatePickerOptions {
    const value: string = this.node._attrs.value
    const start: string = this.node._attrs.start
    const end: string = this.node._attrs.end
    return {
      start: new Date(start),
      end: new Date(end),
      selected: new Date(value),
    }
  }

  getTextOptions (): TextPickerOptions {
    let mode: string = this.node._attrs.mode
    const value: TaroAny = this.node._attrs.value
    const range: TaroAny = this.node._attrs.range
    if (!mode) {
      if (range && range.length && range[0] instanceof Array) {
        mode = 'multiSelector'
      }
      mode = 'selector'
    }
    switch (mode) {
      case 'selector': {
        const rangeKey: TaroAny = this.node._attrs.rangeKey
        let showRange: TaroAny = range
        if (rangeKey && typeof range[0] === 'object') {
          showRange = getSingleSelector(range, rangeKey)
        }
        return {
          range: showRange,
          selected: this.select || value
        }
      }
      case 'multiSelector': {
        const rangeKey: TaroAny = this.node._attrs.rangeKey
        let showRange: TaroAny = range
        this.showSelector = value
        showRange = getMultiSelector(range, rangeKey, value)
        return {
          range: showRange,
          selected: this.select || value
        }
      }
      case 'time': {
        const value: string = this.node._attrs.value
        const start: string = this.node._attrs.start
        const end: string = this.node._attrs.end
        let timeRange: TimeRange = {
          startHH: 0,
          startMM: 0,
          endHH: 23,
          endMM: 59
        }
        if (start) {
          const _start = start.split(':')
          timeRange.startHH = parseInt(_start[0])
          timeRange.startMM = parseInt(_start[1])
        }
        if (end) {
          const _end = end.split(':')
          timeRange.endHH = parseInt(_end[0])
          timeRange.endMM = parseInt(_end[1])
        }
        const left = generateNumberArray(timeRange.startHH, timeRange.endHH)
        const right =  generateNumberArray(timeRange.startMM, timeRange.endMM)
        const range = [left, right]
        const _selected = value.split(':')
        return {
          range: range,
          selected: [left.findIndex(i => parseInt(_selected[0]) === Number(i)), right.findIndex(i => parseInt(_selected[1]) === Number(i))],
        }
      }
    }
  }


  emitEvent = (type: string, detail: TaroAny = {}) => {
    const event: TaroEvent = createTaroEvent(type, { detail }, this.node)
    event.stopPropagation()
    eventHandler(event, type, this.node)
  }

  build() {
    showDialog(this, this.node._attrs.mode)
  }
}


@Builder
function showDialog($$: PickerView, mode: string) {
  Column() {
    Flex({
      direction: FlexDirection.Row,
      justifyContent: FlexAlign.SpaceBetween,
      alignItems: ItemAlign.Center
    }) {
      Text($$.node._attrs.textProps?.cancelText || '取消').fontSize(15).padding({top: 20, bottom: 40}).fontColor('#888').onClick(() => {
        $$.emitEvent('cancel')
        $$.controller.close()
      })
      Text($$.node._attrs.textProps?.okText || '确认').fontSize(15).padding({top: 20, bottom: 40}).fontColor('#1aad19').onClick(() => {
        $$.emitEvent('change', { value: $$.select})
        $$.controller.close()
      })
    }
    .width('100%')
    .backgroundColor('#fff')
    .padding({
      left: 20,
      right: 20
    })
    if (mode === 'selector') {
      TextPicker($$.getTextOptions())
        .selectedTextStyle({
          color: '#000'
        })
        .canLoop(false)
        .textPickerAttrs(getNormalAttributes($$.node))
        .onChange((value, index: number) => {
          $$.select = index
        })
    } else if (mode === 'multiSelector') {
      TextPicker($$.getTextOptions())
        .selectedTextStyle({
          color: '#000'
        })
        .canLoop(false)
        .textPickerAttrs(getNormalAttributes($$.node))
        .onChange((value, index: number[]) => {
          $$.select = index.join(',')
          // 计算几列发生了变化
          const originIndexs: number[] = $$.multiColumnIndex || $$.showSelector
          $$.multiColumnIndex = index
          let changeValue: number
          const changeIndex = index.findIndex((item, i) => {
            const originIndex = originIndexs[i]
            if (originIndex != item) {
              changeValue = item
              return true
            }
          })
          if (changeIndex < 0) {
            return
          }
          $$.emitEvent('columnChange', { column: changeIndex, value: changeValue })
        })
    } else if (mode === 'date') {
      DatePicker($$.getDateOptions())
        .selectedTextStyle({
          color: '#000'
        })
        .datePickerAttrs(getNormalAttributes($$.node))
        .onChange(value => {
          $$.select = `${value.year}-${value.month}-${value.day}`
        })
    } else if (mode === 'time') {
      TextPicker($$.getTextOptions())
        .selectedTextStyle({
          color: '#000'
        })
        .canLoop(false)
        .textPickerAttrs(getNormalAttributes($$.node))
        .onChange((value) => {
          $$.select = `${('00'+value[0]).slice(-2)}:${('00'+value[1]).slice(-2)}}`
        })
    }
  }
}


@Component
export default struct TaroPicker {
  nodeInfoMap: TaroAny = {}

  @State select: string = ''

  // TODO 原本为Objectlink
  @Prop node: TaroViewElement

  aboutToAppear () {
    initComponentNodeInfo(this, this.node)
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node)

    this.select = this.node._attrs.value

    this.node.addEventListener('click', () => {
      if (this.dialogController != null) {
        this.dialogController.open()
      }
    })
  }

  dialogController: CustomDialogController | null = new CustomDialogController({
    builder: PickerView({
      node: this.node,
      select: this.select
    }),
    customStyle: true,
    cornerRadius: '0vp',
    autoCancel: true,
    alignment: DialogAlignment.Bottom,
    offset: { dx: 0, dy: 0 },
    gridCount: 4,
    cancel: () => {
      const event: TaroEvent = createTaroEvent('cancel', { detail: {} }, this.node)
      event.stopPropagation()
      eventHandler(event, 'cancel', this.node)
    }
  })

  aboutToDisappear() {
    this.dialogController = null // 将dialogController置空
  }

  @Styles defaultEvent () {
    .onClick((e: ClickEvent) => {
      eventHandler(e, 'click', this.node)
    })
    .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP[e.type], this.node), this.node, Object.values(TOUCH_EVENT_MAP)))
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, res => {
      const eventResult: TaroAny = res.eventResult
      this.nodeInfoMap[this.node._nid].areaInfo = eventResult[1]
    }))
  }

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      Flex(FlexManager.flexOptions(this.node)) {
        ForEach(this.node.childNodes, (item: TaroElement) => {
          createNode(item)
        }, (item: TaroElement) => item._nid)
      }
        .defaultEvent()
        .visibleChangeEvent()
    }
  }
}



function generateNumberArray(x: number, y: number) {
  // 创建一个空数组来存储结果
  let result: string[] = []

  // 使用循环将 x 到 y 之间的数字添加到数组中
  for (let i = x; i <= y; i++) {
    result.push(`${i}`)
  }
  // 返回结果数组
  return result
}
