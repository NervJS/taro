import { ATTRIBUTES_CALLBACK_TRIGGER_MAP } from '../../constant'
import { Current } from '../../current'
import { eventCenter } from '../../emitter/emitter'
import { TaroNativeModule } from '../../harmony-library'
import { initComponentNodeInfo, printInfo, runInDebug, triggerAttributesCallback } from '../../utils/info'
import { ClassList } from '../class-list'
import { TaroDataSourceElement } from '../dataSource'
import { NodeType } from '../node'
import { Style } from '../style'
import StyleSheet from '../stylesheet'

import type { BaseTouchEvent, ITouchEvent, StandardProps } from '@tarojs/components/types'
import type { TaroAny } from '../../interface'

type NamedNodeMap = { name: string, value: string }[]

export interface TaroExtraProps {
  compileMode?: string | boolean
  compileIf?: boolean
  disabled?: boolean
}

export class TaroElement<
  T extends StandardProps<any, U> = StandardProps,
  U extends BaseTouchEvent<any> = ITouchEvent
> extends TaroDataSourceElement {
  public _innerHTML = ''
  public _nodeInfo: TaroAny = {
    layer: 0 // 渲染层级
  }

  isETS = false

  public hm_instance: TaroAny

  public get _instance () {
    return this.hm_instance
  }

  public set _instance (value) {
    this.hm_instance = value
    if (this._nodeInfo.aboutToAppear) {
      let task
      // eslint-disable-next-line no-cond-assign
      while (task = this._nodeInfo.aboutToAppear.shift()) {
        task()
      }
    }
  }

  public readonly tagName: string
  public _attrs: T & TaroExtraProps = {} as T

  constructor(tagName: string) {
    super(tagName.replace(new RegExp('(?<=.)([A-Z])', 'g'), '-$1').toUpperCase(), NodeType.ELEMENT_NODE)
    this.tagName = this.nodeName
    this.style = new Style(this)
    initComponentNodeInfo(this)

    TaroNativeModule.createTaroNode(this)
  }

  public set id(value: string) {
    this.setAttribute('id', value)
  }

  public get id(): string {
    return this.getAttribute('id')
  }

  public get uid(): string {
    return this.getAttribute('uid')
  }

  public set className(value: string) {
    this.setAttribute('class', value)
  }

  public get className(): string {
    return this.getAttribute('class') || ''
  }

  public get classList(): ClassList {
    return new ClassList(this)
  }

  public get attributes(): NamedNodeMap {
    const list: NamedNodeMap = []

    // FIXME
    Object.keys(this._attrs).forEach((name) => {
      const value: TaroAny = this._attrs[name]

      list.push({ name, value })
    })

    return list
  }

  public get children(): TaroElement[] {
    return TaroNativeModule.getTaroNodeProperty(this, 'children')
  }

  public get dataset(): Record<string, unknown> {
    return TaroNativeModule.getTaroNodeProperty(this, 'dataset') || {}
  }

  public setAttribute(name: string, value: TaroAny): void {
    this._attrs[name] = value

    // 混合开发的组件没办法自动更新，需要把父级的结点删掉新建
    // Current.nativeComponentNames会在render.ets中赋值
    if (Current.nativeComponentNames?.includes(this.tagName)) {
      const idxOfRef = (this.parentNode as TaroDataSourceElement)?.findIndex(this)

      if (idxOfRef !== undefined) {
        this._nativeUpdateTrigger++
        if (this.isETS) {
          (this.parentNode as TaroDataSourceElement)?.notifyDataChange?.(idxOfRef)
        }
      }
    }

    if (['PAGE-META', 'NAVIGATION-BAR'].includes(this.tagName)) {
      // FIXME 等 Harmony 支持更细粒度的 @Watch 方法后移出
      eventCenter.trigger('__taroComponentAttributeUpdate', {
        id: this._nid,
        tagName: this.tagName,
        attribute: name,
        value
      })
    } else {
      const attributeTriggerValue: TaroAny = ATTRIBUTES_CALLBACK_TRIGGER_MAP[name]
      if (attributeTriggerValue) {
        const triggerName: TaroAny = attributeTriggerValue.triggerName
        const valueInspect: TaroAny = attributeTriggerValue.valueInspect

        if (valueInspect && !valueInspect(value)) return

        runInDebug(() => {
          printInfo('setAttribute', this._nid, this.parentNode?.nodeName, this.nodeName, triggerName, this._attrs[triggerName])
        })
        TaroNativeModule.setTaroNodeAttribute(this, triggerName, this._attrs[triggerName])
        triggerAttributesCallback(this, triggerName)
      } else {
        runInDebug(() => {
          printInfo('setAttribute', this._nid, this.parentNode?.nodeName, this.nodeName, name, value ?? null)
        })
        TaroNativeModule.setTaroNodeAttribute(this, name, value ?? null)
      }
    }
  }

  public getAttribute(name: string): any {
    return TaroNativeModule.getTaroNodeAttribute(this, name)
  }

  public removeAttribute(name: string): void {
    this._attrs[name] = null
    TaroNativeModule.removeTaroNodeAttribute(this, name)
  }

  public hasAttribute(name: string): boolean {
    return TaroNativeModule.hasTaroNodeAttribute(this, name)
  }

  public hasAttributes(): boolean {
    return TaroNativeModule.hasTaroNodeAttributes(this)
  }

  public set innerHTML(value: string) {
    if (this.nodeType === NodeType.ELEMENT_NODE && this.ownerDocument) {
      const ele = this.ownerDocument.createElement('inner-html')
      ele._innerHTML = value
      this.appendChild(ele as TaroAny)
    }
  }

  public get innerHTML(): string {
    return this._innerHTML
  }

  // 存放的样式，获取其实跟获取style是一样的，只不过这里取的更快捷，不需要走style的get方法进到cssStyleDeclaration
  public _st: TaroAny = new StyleSheet()

  // 经转换后的鸿蒙样式
  public get hmStyle(): TaroAny {
    return this._st.hmStyle
  }

  public style: Style | null = null

  // 设置动画
  public setAnimation (playing) {
    if (!this._instance) {
      if (!this._nodeInfo.aboutToAppear) {
        this._nodeInfo.aboutToAppear = []
      }
      this._nodeInfo.aboutToAppear.push(() => {
        this.setAnimation(playing)
      })
      return
    }

    const keyframes = this._st.hmStyle.animationName

    // 防止动画闪烁，需要把第一帧的内容先设置上去设置初始样式
    if (playing && keyframes && keyframes[0] && keyframes[0].percentage === 0) {
      this._instance.overwriteStyle = keyframes[0].event
    }

    // 首次设置，不用实例替换
    if (!this._nodeInfo.hasAnimation && playing) {
      this._nodeInfo.hasAnimation = true
      // 下一帧播放，等节点样式首次设置上去在进行覆盖
      setTimeout(() => {
        if (playing) {
          this.playAnimation()
        }
      }, 0)
    } else if (this.parentNode) {
      const idx = (this.parentNode as TaroDataSourceElement).findIndex(this)
      ;(this.parentNode as TaroDataSourceElement).notifyDataDelete(idx)

      // 下一帧播放，等实例被移除掉，再重新插入
      setTimeout(() => {
        // insert
        (this.parentNode as TaroDataSourceElement)?.notifyDataAdd(idx)

        // 执行动画
        if (playing) {
          this.playAnimation()
        }
      }, playing ? 0 : 100)
    }
  }

  private playAnimation () {
    const {
      animationDuration = 0, animationDelay = 0, animationIterationCount = 1, animationName: keyframes,
      animationTimingFunction
    } = this._st.hmStyle

    if (keyframes) {
      let cur_percentage = 0
      this._instance.getUIContext()?.keyframeAnimateTo({
        delay: animationDelay,
        iterations: animationIterationCount,
      }, keyframes.map(item => {
        const duration = (item.percentage - cur_percentage) * animationDuration
        cur_percentage = item.percentage
        return {
          duration: duration,
          curve: item.event.animationTimingFunction || animationTimingFunction,
          event: () => {
            this._instance.overwriteStyle = item.event
          }
        }
      }))
    }
  }
}
