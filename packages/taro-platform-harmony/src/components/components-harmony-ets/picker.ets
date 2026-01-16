import { AREA_CHANGE_EVENT_NAME, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME, TaroPickerElement, createTaroEvent } from '@tarojs/runtime'
import commonStyleModify from './style'
import { getSingleSelector, getMultiSelector } from './utils'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { FlexManager } from './utils/flexManager'
import { shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroAny, TaroEvent } from '@tarojs/runtime'

import { PickerDateProps, PickerMultiSelectorProps, PickerSelectorProps, PickerTimeProps } from '@tarojs/components/types'

interface TimeRange {
  startHH: number
  startMM: number
  endHH: number
  endMM: number
}

@CustomDialog
export struct PickerView {
  node: TaroPickerElement | null = null

  controller?: CustomDialogController

  multiColumnIndex: number[] = []

  showSelector: number[] = []

  getDateOptions (): DatePickerOptions {
    const _attrs = this.node?._attrs as PickerDateProps
    return {
      start: new Date(_attrs.start || ''),
      end: new Date(_attrs.end || ''),
      selected: new Date(_attrs.value || ''),
    }
  }

  getTextOptions (): TextPickerOptions {
    let mode: string = this.node?._attrs.mode || 'selector'
    if (!mode) {
      const _attrs = this.node?._attrs as PickerSelectorProps
      const range = _attrs.range
      if (range && range.length && range[0] instanceof Array) {
        mode = 'multiSelector'
      }
      mode = 'selector'
    }
    switch (mode) {
      case 'time': {
        const _attrs = this.node?._attrs as PickerTimeProps
        let timeRange: TimeRange = {
          startHH: 0,
          startMM: 0,
          endHH: 23,
          endMM: 59
        }
        if (_attrs.start) {
          const _start = _attrs.start.split(':')
          timeRange.startHH = parseInt(_start[0])
          timeRange.startMM = parseInt(_start[1])
        }
        if (_attrs.end) {
          const _end = _attrs.end.split(':')
          timeRange.endHH = parseInt(_end[0])
          timeRange.endMM = parseInt(_end[1])
        }
        const left = generateNumberArray(timeRange.startHH, timeRange.endHH)
        const right =  generateNumberArray(timeRange.startMM, timeRange.endMM)
        const range = [left, right]
        const _selected = _attrs.value?.split(':') as string[]
        return {
          range: range,
          selected: [left.findIndex(i => parseInt(_selected[0]) === Number(i)), right.findIndex(i => parseInt(_selected[1]) === Number(i))],
        }
      }
      case 'multiSelector': {
        const _attrs = this.node?._attrs as PickerMultiSelectorProps
        let showRange = _attrs.range as string[][]
        const selected: number[] = this.node?.value
        this.showSelector = selected
        showRange = getMultiSelector(this, _attrs.range, _attrs.rangeKey, selected)

        return {
          selected,
          range: showRange,
        }
      }
      default: {
        const _attrs = this.node?._attrs as PickerSelectorProps
        const range = _attrs.range
        let showRange = _attrs.range as string[]
        if (_attrs.rangeKey && typeof range[0] === 'object') {
          showRange = getSingleSelector(range, _attrs.rangeKey)
        }
        return {
          range: showRange,
          selected: this.node?.value
        }
      }
    }
  }

  emitEvent = (type: string, detail: TaroAny = {}) => {
    const event: TaroEvent = createTaroEvent(type, { detail }, this.node)
    event.stopPropagation()
    eventHandler(event, type, this.node)
  }

  getText = () => {
    if (this.node?._attrs.mode === 'selector') {
      const _attrs = this.node._attrs as PickerSelectorProps
      return [_attrs.textProps?.okText || '确认', _attrs.textProps?.cancelText || '取消']
    } else {
      return ['确认', '取消']
    }
  }

  @Builder
  showDialog() {
    Column() {
      if (this.node) {
        Flex({
          direction: FlexDirection.Row,
          justifyContent: FlexAlign.SpaceBetween,
          alignItems: ItemAlign.Center
        }) {
          Text(this.getText()[1]).fontSize(15).padding({top: 20, bottom: 40}).fontColor('#888').onClick(() => {
            this.emitEvent('cancel')
            this.controller?.close()
          })
          Text(this.getText()[0]).fontSize(15).padding({top: 20, bottom: 40}).fontColor('#1aad19').onClick(() => {
            this.emitEvent('change', { value: this.node?.value })
            this.controller?.close()
          })
        }
        .width('100%')
        .backgroundColor('#fff')
        .padding({
          left: 20,
          right: 20
        })
        if (this.node._attrs.mode === 'selector') {
          TextPicker(this.getTextOptions())
            .selectedTextStyle({
              color: '#000'
            })
            .canLoop(false)
            .attributeModifier(commonStyleModify.setNode(this.node, {
              width: '100%',
              backgroundColor: '#fff'
            }))
            .onChange((_, index) => {
              this.node?.updateFormWidgetValue(index)
            })
        } else if (this.node?._attrs.mode === 'multiSelector') {
          TextPicker(this.getTextOptions())
            .selectedTextStyle({
              color: '#000'
            })
            .canLoop(false)
            .attributeModifier(commonStyleModify.setNode(this.node, {
              width: '100%',
              backgroundColor: '#fff'
            }))
            .onChange((_, index) => {
              if (index instanceof Array) {
                this.node?.updateFormWidgetValue(index)
                // 计算几列发生了变化
                const originIndexs: number[] = this.multiColumnIndex || this.showSelector
                this.multiColumnIndex = index
                let changeValue: number | undefined
                const changeIndex = index.findIndex((item, i) => {
                  const originIndex = originIndexs[i]
                  if (originIndex != item) {
                    changeValue = item
                    return true
                  }
                  return false
                })
                if (changeIndex < 0) {
                  return
                }
                this.emitEvent('columnChange', { column: changeIndex, value: changeValue })
              }
            })
        } else if (this.node._attrs.mode === 'date') {
          DatePicker(this.getDateOptions())
            .selectedTextStyle({
              color: '#000'
            })
            .attributeModifier(commonStyleModify.setNode(this.node, {
              width: '100%',
              backgroundColor: '#fff'
            }))
            .onDateChange(value => {
              const data = value.toLocaleDateString().split('/')
              const day = data[1]
              const month = data[0]
              const year = data[2]
              this.node?.updateFormWidgetValue(`${year}-${month}-${day}`)
            })
        } else if (this.node._attrs.mode === 'time') {
          TextPicker(this.getTextOptions())
            .selectedTextStyle({
              color: '#000'
            })
            .canLoop(false)
            .attributeModifier(commonStyleModify.setNode(this.node, {
              width: '100%',
              backgroundColor: '#fff'
            }))
            .onChange((value) => {
              this.node?.updateFormWidgetValue(`${('00'+value[0]).slice(-2)}:${('00'+value[1]).slice(-2)}`)
            })
        }
      }
    }
  }

  build() {
    this.showDialog()
  }
}


@Component
export default struct TaroPicker {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroPickerElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroPickerElement

  aboutToAppear () {
    this.node?.addEventListener('click', this.handleClick)

    if (this.node && !this.node._isInit) {
      let defaultResetValue: TaroAny = ''
      switch (this.node._attrs.mode) {
        case 'selector':
          defaultResetValue = 0
          break
        case 'multiSelector':
          defaultResetValue = this.node._attrs.range.map((_: TaroAny) => 0)
          break
        case 'time': {
          const hour = new Date().getHours()
          const minute = new Date().getMinutes()

          defaultResetValue = `${('00'+hour).slice(-2)}:${('00'+minute).slice(-2)}`
          break
        }
        case 'date': {
          const data = new Date().toLocaleDateString().split('/')
          const day = data[1]
          const month = data[0]
          const year = data[2]

          defaultResetValue = `${year}-${month}-${day}`
          break
        }
        default:
          defaultResetValue = ''
          break
      }

      this.node._isInit = true
      this.node._reset = this.node.value || defaultResetValue
    }
  }

  dialogController: CustomDialogController | null = null

  aboutToDisappear() {
    this.dialogController = null // 将dialogController置空
    this.node?.removeEventListener('click', this.handleClick)
  }

  handleClick = () => {
    if (!this.dialogController && this.node) {
      this.dialogController = new CustomDialogController({
        builder: PickerView({ node: this.node }),
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
    }
    this.dialogController?.open()
  }

  @Styles defaultEvent () {
    .onClick((e: ClickEvent) => {
      eventHandler(e, 'click', this.node)
    })
    .onTouch(shouldBindEvent((e: TouchEvent) => { eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node) }, this.node, TOUCH_EVENT_MAP.values()))
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      if (this.node) {
        this.node._nodeInfo.areaInfo = res[1]
      }
    }))
  }

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  build() {
    if (FlexManager.isFlexNode(this.node) && FlexManager.direction(this.node) !== FlexDirection.Column) {
      Row() {
        this.createLazyChildren(this.node, 0)
      }
      .defaultEvent()
      .visibleChangeEvent()
      .alignItems(FlexManager.alignItems<VerticalAlign>(this.node))
      .justifyContent(FlexManager.justifyContent(this.node))
    } else {
      Column() {
        this.createLazyChildren(this.node, 0)
      }
      .defaultEvent()
      .visibleChangeEvent()
      .alignItems(FlexManager.alignItems<HorizontalAlign>(this.node))
      .justifyContent(FlexManager.justifyContent(this.node))
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
