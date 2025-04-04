// @ts-ignore
import { getPageById } from '@tarojs/plugin-framework-react/dist/runtime'
import { EMPTY_OBJ, toCamelCase } from '@tarojs/shared'

import { ATTRIBUTES_CALLBACK_TRIGGER_MAP, ID } from '../../constant'
import { Current } from '../../current'
import { eventCenter } from '../../emitter/emitter'
import { findChildNodeWithDFS } from '../../utils'
import { initComponentNodeInfo, triggerAttributesCallback } from '../../utils/info'
import { bindAnimation } from '../bind'
import { ClassList } from '../class-list'
import { createCSSStyleDeclaration } from '../cssStyleDeclaration'
import { eventSource } from '../event-source'
import { NodeType, TaroNode } from '../node'
import StyleSheet, { HarmonyStyle, TaroStyleType } from '../stylesheet'

import type { BaseTouchEvent, ITouchEvent, StandardProps } from '@tarojs/components/types'
import type { TaroAny } from '../../interface'
import type { ICSSStyleDeclaration } from '../cssStyleDeclaration'

type NamedNodeMap = { name: string, value: string }[]

export interface TaroExtraProps {
  compileMode?: string | boolean
  compileIf?: boolean
  disabled?: boolean
  __hmStyle?: TaroStyleType
}

export class TaroElement<
  T extends StandardProps<any, U> = StandardProps,
  U extends BaseTouchEvent<any> = ITouchEvent
> extends TaroNode {
  public _innerHTML = ''
  public _nodeInfo: TaroAny = {
    layer: 0, // 渲染层级
  }

  public _hm_instance: TaroAny
  public weak_hm_instance: WeakRef<TaroAny>
  public use_weak_hm_instance: boolean = true

  public get hm_instance(): TaroAny {
    if (this.use_weak_hm_instance && this.weak_hm_instance) {
      return this.weak_hm_instance?.deref()
    }
    return this._hm_instance
  }

  public set hm_instance(instance) {
    if (this.use_weak_hm_instance && instance) {
      this.weak_hm_instance = new WeakRef(instance)
      return
    }
    this._hm_instance = instance
  }

  public get _instance() {
    return this.hm_instance
  }

  public set _instance(value) {
    this.hm_instance = value
    if (this._nodeInfo.aboutToAppear) {
      let task
      // eslint-disable-next-line no-cond-assign
      while ((task = this._nodeInfo.aboutToAppear.shift())) {
        task()
      }
    }
  }

  public readonly tagName: string
  public dataset: Record<string, unknown> = EMPTY_OBJ
  public _attrs: T & TaroExtraProps = {} as T & TaroExtraProps

  private _page: any

  constructor(tagName: string) {
    super(tagName.replace(new RegExp('(?<=.)([A-Z])', 'g'), '-$1').toUpperCase(), NodeType.ELEMENT_NODE)
    this.tagName = this.nodeName
    this._style = createCSSStyleDeclaration(this)
    initComponentNodeInfo(this)
    bindAnimation(this)

    this._page = Current.page
  }

  public set id(value: string) {
    this.setAttribute('id', value)
  }

  public get id(): string {
    return this.getAttribute('id') || `${this._nid}`
  }

  public set className(value: string) {
    this.setAttribute('class', value)
  }

  public get className(): string {
    return this.getAttribute('class') || ''
  }

  public get classList(): ClassList {
    return new ClassList(this.className, this)
  }

  public get attributes(): NamedNodeMap {
    const list: NamedNodeMap = []

    Object.keys(this._attrs).forEach((name) => {
      const value: TaroAny = this._attrs[name]

      list.push({ name, value })
    })

    return list
  }

  public get children(): TaroElement[] {
    return this.childNodes.filter((node) => node.nodeType === NodeType.ELEMENT_NODE) as TaroElement[]
  }

  public setAttribute(name: string, value: TaroAny): void {
    switch (name) {
      case ID:
        eventSource.delete(this._attrs.id)
        eventSource.set(value, this as TaroAny)
        break
      default:
        if (name.startsWith('data-')) {
          if (this.dataset === EMPTY_OBJ) {
            this.dataset = Object.create(null)
          }
          this.dataset[toCamelCase(name.replace(/^data-/, ''))] = value
        }
        break
    }

    this._attrs[name] = value

    // 混合开发的组件没办法自动更新，需要把父级的结点删掉新建
    // Current.nativeComponentNames会在render.ets中赋值
    if (Current.nativeComponentNames?.includes(this.tagName)) {
      const idxOfRef = this.parentNode?.findIndex(this)

      if (idxOfRef !== undefined) {
        this._nativeUpdateTrigger++
        this.parentNode?.notifyDataChange(idxOfRef)
      }
    }

    if (['PAGE-META', 'NAVIGATION-BAR'].includes(this.tagName)) {
      // FIXME 等 Harmony 支持更细粒度的 @Watch 方法后移出
      eventCenter.trigger('__taroComponentAttributeUpdate', {
        id: this._nid,
        tagName: this.tagName,
        attribute: name,
        value,
      })
    } else {
      const attributeTriggerValue: TaroAny = ATTRIBUTES_CALLBACK_TRIGGER_MAP[name]
      if (attributeTriggerValue) {
        const triggerName: TaroAny = attributeTriggerValue.triggerName
        const valueInspect: TaroAny = attributeTriggerValue.valueInspect

        if (valueInspect && !valueInspect(value)) return

        triggerAttributesCallback(this, triggerName)
      }
    }
  }

  public getAttribute(name: string): string {
    return this._attrs[name]
  }

  public removeAttribute(name: string): void {
    this._attrs[name] = null
  }

  public hasAttribute(name: string): boolean {
    return !!this._attrs[name]
  }

  public hasAttributes(): boolean {
    return Object.keys(this._attrs).length > 0
  }

  public getElementById<T extends TaroElement = TaroElement>(id: string | undefined | null) {
    return findChildNodeWithDFS<T>(
      this as TaroAny,
      (el) => {
        return el.id === id
      },
      false
    )
  }

  public getElementsByTagName<T extends TaroElement = TaroElement>(tagName: string) {
    return (
      findChildNodeWithDFS<T>(
        this as TaroAny,
        (el) => {
          return el.nodeName === tagName || (tagName === '*' && (this as TaroAny) !== el)
        },
        true
      ) || []
    )
  }

  public getElementsByClassName<T extends TaroElement = TaroElement>(className: string) {
    const classNames = className.trim().split(new RegExp('\\s+'))

    return (
      findChildNodeWithDFS<T>(
        this as TaroAny,
        (el) => {
          const classList = el.classList
          return classNames.every((c) => {
            const bool = classList.contains(c)

            return bool
          })
        },
        true
      ) || []
    )
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
  public _st = new StyleSheet()

  // 经转换后的鸿蒙样式
  public get hmStyle() {
    return this._st.hmStyle
  }

  public _style: ICSSStyleDeclaration | null = null

  public get style(): ICSSStyleDeclaration | null {
    return this._style
  }

  // 伪元素，不存在style动态设置，均已被转换为鸿蒙样式
  // 可根据实际情况，迁移到具体的组件中，如View、ScrollView中，Text\Image其实是不需要的
  public _pseudo_before: StyleSheet | null = null

  public set_pseudo_before(value: HarmonyStyle | null) {
    if (value) {
      if (!this._pseudo_before) {
        this._pseudo_before = new StyleSheet()
      }
      Object.keys(value).forEach((key) => {
        this._pseudo_before!.hmStyle[key] = value[key]
      })
    } else {
      this._pseudo_before = null
    }
  }

  public _pseudo_after: StyleSheet | null = null

  public set_pseudo_after(value: HarmonyStyle | null) {
    if (value) {
      if (!this._pseudo_after) {
        this._pseudo_after = new StyleSheet()
      }
      Object.keys(value).forEach((key) => {
        this._pseudo_after!.hmStyle[key] = value[key]
      })
    } else {
      this._pseudo_after = null
    }
  }

  // 伪类，在获取的时候根据dom和parent的关系，动态设置
  public _pseudo_class: Record<string, StyleSheet | null> = {
    // ["::first-child"]: new StyleSheet(),
  }

  public set_pseudo_class(name: string, value: HarmonyStyle | null) {
    if (value) {
      if (!this._pseudo_class[name]) {
        this._pseudo_class[name] = new StyleSheet()
      }
      Object.keys(value).forEach((key) => {
        this._pseudo_class[name]!.hmStyle[key] = value[key]
      })
    } else {
      this._pseudo_class[name] = null
    }
  }

  get currentLayerNode() {
    if (!this._page) return null
    if (typeof this._page.tabBarCurrentIndex !== 'undefined') {
      this._page.layerNode ||= []
      this._page.layerNode[this._page.tabBarCurrentIndex] ||= Current.createHarmonyElement('VIEW')
      // Tabbar
      return this._page.layerNode[this._page.tabBarCurrentIndex]
    } else {
      this._page.layerNode ||= Current.createHarmonyElement('VIEW')
      return this._page.layerNode
    }
  }

  get currentLayerParents() {
    if (!this._page) return null
    if (typeof this._page.tabBarCurrentIndex !== 'undefined') {
      this._page.layerParents ||= {}
      this._page.layerParents[this._page.tabBarCurrentIndex] ||= {}
      // Tabbar
      return this._page.layerParents[this._page.tabBarCurrentIndex]
    } else {
      this._page.layerParents ||= {}
      return this._page.layerParents
    }
  }

  // 设置渲染层级，0为正常层级，大于0为固定层级
  // 1、appendChild的时候会判断是否需要设置层级
  // 2、taro-react的setProperty，在处理属性变化的时候，会判断是否需要设置层级
  // 3、removeChild的时候，会判断是否需要移除层级
  public setLayer(value: number) {
    if (!this.parentNode) return // 没有父节点，不需要设置层级关系

    const currentPage = getPageById(this.getAttribute('__fixed'))
    if (currentPage) {
      this._page = currentPage
    }

    this._nodeInfo.layer = value

    const currentLayerNode = this.currentLayerNode
    const currentLayerParents = this.currentLayerParents
    if (!currentLayerNode || !currentLayerParents) return
    if (value > 0) {
      // 插入到固定浮层
      currentLayerNode.childNodes.push(this)
      currentLayerNode.notifyDataAdd(currentLayerNode.childNodes.length - 1)
      // 绑定祖先的节点id，建立关系，方便在祖先卸载（removeChild）的时候，能够找到该节点使其卸载
      const _parentRecord = {}
      generateLayerParentIds(_parentRecord, this)
      currentLayerParents[this.getStrNid()] = _parentRecord
    } else {
      const idx = currentLayerNode.childNodes.findIndex((n) => n.getStrNid() === this.getStrNid())
      currentLayerNode.childNodes.splice(idx, 1)
      currentLayerNode.notifyDataDelete(idx)

      delete currentLayerParents[this.getStrNid()]
    }

    if (this.parentNode) {
      this.parentNode.notifyDataChange(this.parentNode.findIndex(this))
      this.updateComponent()
    }
  }

  protected toggleLayer(add: boolean) {
    if (add) {
      if (this._st?.hmStyle.position === 'fixed') {
        this.setLayer(1)
      }
    } else {
      const currentLayerParents = this.currentLayerParents
      if (!currentLayerParents) return
      // 识别Current.page.layerParents里面是否有需要移除的固定元素
      if (this._nodeInfo?.layer > 0) {
        delete currentLayerParents[this.getStrNid()]
        this.setLayer(0)
      } else {
        Object.keys(currentLayerParents).forEach((fixedId) => {
          const parentIds = currentLayerParents[fixedId]
          if (parentIds[this.getStrNid()]) {
            // 需要移除fixedId
            delete currentLayerParents[fixedId]
            const fixedNode = eventSource.get(this.getNumNid(fixedId)) as unknown as TaroElement
            if (fixedNode) {
              fixedNode.setLayer(0)
            }
          }
        })
      }
    }
  }

  // 设置动画
  public setAnimation(playing) {
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
      const idx = this.parentNode.findIndex(this)
      // Note: 因为keyframeAnimateTo无法暂停，华为没有支持，只能临时先换掉实例，重新创建ark节点，使得原本的keyframeAnimateTo失效
      // remove
      this.parentNode.childNodes.splice(idx, 1)
      this.parentNode.notifyDataDelete(idx)

      // 下一帧播放，等实例被移除掉，再重新插入
      setTimeout(
        () => {
          // insert
          this.parentNode?.childNodes.splice(idx, 0, this)
          this.parentNode?.notifyDataAdd(idx)

          // 执行动画
          if (playing) {
            this.playAnimation()
          }
        },
        playing ? 0 : 100
      )
    }
  }

  private playAnimation() {
    const {
      animationDuration = 0,
      animationDelay = 0,
      animationIterationCount = 1,
      animationName: keyframes,
      animationTimingFunction,
    } = this._st.hmStyle

    if (keyframes) {
      let cur_percentage = 0
      this._instance.getUIContext()?.keyframeAnimateTo(
        {
          delay: animationDelay,
          iterations: animationIterationCount,
        },
        keyframes.map((item) => {
          const duration = (item.percentage - cur_percentage) * animationDuration
          cur_percentage = item.percentage
          return {
            duration: duration,
            curve: item.event.animationTimingFunction || animationTimingFunction,
            event: () => {
              this._instance.overwriteStyle = item.event
            },
          }
        })
      )
    }
  }
}

function generateLayerParentIds(ids: Record<string, true>, node?: TaroElement) {
  if (node?.parentElement) {
    ids[node.parentElement.getStrNid()] = true
    generateLayerParentIds(ids, node.parentElement)
  }
}
