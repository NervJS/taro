import { bindInstanceToNode, bindAnimation, Current, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo, getPageScrollerOrNode } from '@tarojs/runtime'
import { createNode } from './render'
import TaroComponentWrapper from './base'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { FlexManager } from './utils/FlexManager'
import { createTaroEvent } from './utils/events'
import { getNormalAttributes, shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroViewElement } from '@tarojs/runtime'

@Extend(TextPicker)
function attrs ({
  id,
  flexBasis,
  flexGrow,
  flexShrink,
  alignSelf,
  clip,
  width = '100%',
  height,
  margin,
  padding,
  linearGradient,
  zIndex,
  borderStyle,
  borderWidth,
  borderColor,
  borderRadius,
  opacity,
  backgroundColor = '#fff',
  backgroundImage,
  backgroundRepeat,
  backgroundImageSize,
  constraintSize,
  rotate,
  scale,
  translate,
  transform,
}) {
  .id(id)
  .key(id)
  .constraintSize(constraintSize)
  .flexGrow(flexGrow)
  .flexShrink(flexShrink)
  .flexBasis(flexBasis)
  .alignSelf(alignSelf)
  .width(width)
  .height(height)
  .margin(margin)
  .padding(padding)
  .linearGradient(linearGradient)
  .zIndex(zIndex)
  .borderStyle(borderStyle)
  .borderWidth(borderWidth)
  .borderColor(borderColor)
  .borderRadius(borderRadius)
  .opacity(opacity)
  .backgroundColor(backgroundColor)
  .backgroundImage(backgroundImage, backgroundRepeat)
  .backgroundImageSize(backgroundImageSize)
  .rotate(rotate)
  .scale(scale)
  .translate(translate)
  .transform(transform)
  .clip(clip)
}

@Extend(DatePicker)
function attrs ({
  id,
  flexBasis,
  flexGrow,
  flexShrink,
  alignSelf,
  clip,
  width = '100%',
  height,
  margin,
  padding,
  linearGradient,
  zIndex,
  borderStyle,
  borderWidth,
  borderColor,
  borderRadius,
  opacity,
  backgroundColor = '#fff',
  backgroundImage,
  backgroundRepeat,
  backgroundImageSize,
  constraintSize,
  rotate,
  scale,
  translate,
  transform,
}) {
  .id(id)
    .key(id)
    .constraintSize(constraintSize)
    .flexGrow(flexGrow)
    .flexShrink(flexShrink)
    .flexBasis(flexBasis)
    .alignSelf(alignSelf)
    .width(width )
    .height(height)
    .margin(margin)
    .padding(padding)
    .linearGradient(linearGradient)
    .zIndex(zIndex)
    .borderStyle(borderStyle)
    .borderWidth(borderWidth)
    .borderColor(borderColor)
    .borderRadius(borderRadius)
    .opacity(opacity)
    .backgroundColor(backgroundColor)
    .backgroundImage(backgroundImage, backgroundRepeat)
    .backgroundImageSize(backgroundImageSize)
    .rotate(rotate)
    .scale(scale)
    .translate(translate)
    .transform(transform)
    .clip(clip)
}

@CustomDialog
export struct PickerView {

  @ObjectLink node: TaroViewElement

  @Link select: string

  controller?: CustomDialogController

  showSelector: number[] = []

  getPickerConstruct () {
    let { mode } = this.node._attrs
    const { value, range } = this.node._attrs
    if (!mode) {
      if (range && range.length && range[0] instanceof Array) {
        mode = 'multiSelector'
      }
      mode = 'selector'
    }
    switch (mode) {
      case 'selector': {
        const { range, rangeKey } = this.node._attrs
        let showRange = range
        if (rangeKey && typeof range[0] === 'object') {
          showRange = range.map((data, i) => data[rangeKey])
        }
        return {
          range: showRange,
          selected: this.select || value
        }
      }
      case 'multiSelector': {
        const { range, rangeKey } = this.node._attrs
        let showRange = range
        this.showSelector = value
        showRange = range.map((arr, arrIndex) => arr.map((data, i) => {
          let columnValue = value[arrIndex]
          if (columnValue === data) {
            this.showSelector[arrIndex] = i
          }
          if (rangeKey && typeof range[0][0] === 'object') {
            return data[rangeKey]
          }
          return data
        }))
        return {
          range: showRange,
          selected: this.select || value
        }
      }
      case 'date': {
        const { value, start, end } = this.node._attrs
        return {
          start: new Date(start),
          end: new Date(end),
          selected: new Date(value),
        }
      }
      case 'time': {
        const { value ,start, end } = this.node._attrs
        let timeRange = {
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
          selected: [left.findIndex(i => parseInt(_selected[0]) === +i), right.findIndex(i => parseInt(_selected[1]) === +i)],
        }
      }
    }
  }
  
  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  @Styles defaultEvent () {
    .onClick((e: ClickEvent) => {
      if (this.dialogController != null) {
        this.dialogController.open()
      }
      eventHandler(e, 'click', this.node)
    })
    .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP[e.type], this.node), this.node, Object.values(TOUCH_EVENT_MAP)))
    .onAreaChange(getComponentEventCallback('areaChange', ({ eventResult }) => {
      const [_, areaResult] = eventResult
      this.nodeInfoMap[this.node._nid].areaInfo = areaResult
    }, this))
  }

  emitEvent = (type, detail) => {
    const event = createTaroEvent(type, { detail }, this.node)
    event.stopPropagation()
    eventHandler(event, type, this.node)
  }

  @Builder
  showDialog(mode) {
    Column() {
      Flex({
        direction: FlexDirection.Row,
        justifyContent: FlexAlign.SpaceBetween,
        alignItems: ItemAlign.Center
      }) {
        Text(this.node._attrs.textProps?.cancelText || '取消').fontSize(15).padding({top: 20, bottom: 40}).fontColor('#888').onClick(() => {
          this.emitEvent('cancel')
          this.controller.close()
        })
        Text(this.node._attrs.textProps?.okText || '确认').fontSize(15).padding({top: 20, bottom: 40}).fontColor('#1aad19').onClick(() => {
          this.emitEvent('change', { value: this.select})
          this.controller.close()
        })
      }
        .width('100%')
        .backgroundColor('#fff')
        .padding({
          left: 20,
          right: 20
        })
      if (mode === 'selector') {
        TextPicker(this.getPickerConstruct())
          .selectedTextStyle({
            color: '#000'
          })
          .canLoop(false)
          .attrs(getNormalAttributes(this.node))
          .defaultEvent()
          .visibleChangeEvent()
          .onChange((value, index) => {
            this.select = index
          })
      } else if (mode === 'multiSelector') {
        TextPicker(this.getPickerConstruct())
          .selectedTextStyle({
            color: '#000'
          })
          .canLoop(false)
          .attrs(getNormalAttributes(this.node))
          .defaultEvent()
          .visibleChangeEvent()
          .onChange((value, index) => {
            this.select = index
            // 计算几列发生了变化
            const originIndexs = this.multiColumnIndex || this.showSelector
            this.multiColumnIndex = index
            let changeValue
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
            this.select = index
            this.emitEvent('columnChange', { column: changeIndex, value: changeValue })
          })
      } else if (mode === 'date') {
        DatePicker(this.getPickerConstruct())
          .selectedTextStyle({
            color: '#000'
          })
          .attrs(getNormalAttributes(this.node))
          .defaultEvent()
          .visibleChangeEvent()
          .onChange(value => {
            this.select = `${value.year}-${value.month}-${value.day}`
          })
      } else if (mode === 'time') {
        TextPicker(this.getPickerConstruct())
          .selectedTextStyle({
            color: '#000'
          })
          .canLoop(false)
          .attrs(getNormalAttributes(this.node))
          .defaultEvent()
          .visibleChangeEvent()
          .onChange((value) => {
            this.select = `${('00'+value[0]).slice(-2)}:${('00'+value[1]).slice(-2)}}`
          })
      }
    }
  }

  build() {
    this.showDialog(this.node._attrs.mode)
  }
}

@Component
export default struct TaroPicker {
  nodeInfoMap: any = {}

  eventMap: any = {}

  multiColumnIndex: number[] = []

  @State select: string = ''

  @ObjectLink node: TaroViewElement

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
      const event = createTaroEvent('cancel', { detail: {} }, this.node)
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
    .onAreaChange(getComponentEventCallback('areaChange', ({ eventResult }) => {
      const [_, areaResult] = eventResult

      this.nodeInfoMap[this.node._nid].areaInfo = areaResult
    }, this))
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      Flex(FlexManager.flexOptions(this.node)) {
        ForEach(this.node.childNodes, item => {
          createNode(item)
        }, item => item._nid)
      }
        .defaultEvent()
    }
  }
}

function generateNumberArray(x, y) {
  // 创建一个空数组来存储结果
  let result = []

  // 使用循环将 x 到 y 之间的数字添加到数组中
  for (let i = x; i <= y; i++) {
    result.push(`${i}`)
  }

  // 返回结果数组
  return result
}
