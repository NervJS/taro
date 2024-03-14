import React from 'react'
import Vue from 'vue'

import Taro from './index'

declare module './index' {
  // ref: packages/taro-runtime/src/current.ts
  interface RouterInfo<TParams extends Partial<Record<string, string>> = Partial<Record<string, string>>> {
    /** 路由参数 */
    params: TParams

    /** 页面路径 */
    path: string

    onReady: string
    onHide: string
    onShow: string

    shareTicket: string | undefined
    scene: number | undefined
    exitState?: any
  }

  interface Show {
    componentDidShow?(): void
    componentDidHide?(): void
    onShow?(): void
    onHide?(): void
  }
  interface AppInstance extends Show {
    mount(component: React.Component | Vue.ComponentOptions<typeof Vue>, id: string, cb: (...args: any[]) => void): void
    componentDidShow?(options?: Record<string, unknown>): void
    onShow?(options?: Record<string, unknown>): void
    unmount(id: string, cb?: () => void): void
  }
  type Target = Record<string, unknown> & { dataset: Record<string, unknown>; id: string }
  interface MpEvent {
    type: string
    detail: Record<string, unknown>
    target: Target
    currentTarget: Target
  }
  interface PageLifeCycle extends Show {
    eh?(event: MpEvent): void
    onLoad(options: Record<string, unknown>): void
    onOptionMenuClick?(): void
    onPageScroll?(opt: PageScrollObject): void
    onPopMenuClick?(): void
    onPullDownRefresh?(): void
    onPullIntercept?(): void
    onReachBottom?(): void
    onResize?(opt: PageResizeObject): void
    onShareAppMessage?(opt: ShareAppMessageObject): ShareAppMessageReturn
    onShareTimeline?(): ShareTimelineReturnObject
    onTabItemTap?(opt: TabItemTapObject): void
    onTitleClick?(): void
    onUnload(): void
  }
  interface ComponentInstance<
    TData extends Record<string, unknown> = Record<string, unknown>,
    TParams extends Record<string, string> = Record<string, string>
  > {
    /** 组件的文件路径 */
    is?: string
    /** 节点id */
    id?: string
    /** 节点dataset */
    dataset?: string
    /** 组件数据，包括内部数据和属性值 */
    data?: TData
    /** 组件数据，包括内部数据和属性值（与 data 一致） */
    properties?: TData
    /** 相对于当前自定义组件的 Router 对象 */
    router?: RouterInfo<TParams>
    /** 相对于当前自定义组件所在页面的 Router 对象 */
    pageRouter?: RouterInfo<TParams>
    /** 设置data并执行视图层渲染 */
    setData?(newData: Partial<TData>): void
    /** 检查组件是否具有 behavior （检查时会递归检查被直接或间接引入的所有behavior） */
    hasBehavior?(behavior: unknown): boolean
    /** 触发事件，参见[组件间通信与事件](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/events.html) */
    triggerEvent?(name: string, detail: Record<string, unknown>, options: {
      /** 事件是否冒泡 */
      bubbles?: boolean
      /** 事件是否可以穿越组件边界，为 false 时，事件将只能在引用组件的节点树上触发，不进入其他任何组件内部 */
      composed?: boolean
      /** 事件是否拥有捕获阶段 */
      capturePhase?: boolean
    }): void
    /** 创建一个 SelectorQuery 对象，选择器选取范围为这个组件实例内 */
    createSelectorQuery?(): SelectorQuery
    /** 创建一个 IntersectionObserver 对象，选择器选取范围为这个组件实例内 */
    createIntersectionObserver?(options?: createIntersectionObserver.Option): IntersectionObserver
    /** 创建一个 MediaQueryObserver 对象 */
    createMediaQueryObserver?(): MediaQueryObserver
    /** 使用选择器选择组件实例节点，返回匹配到的第一个组件实例对象（会被 wx://component-export 影响） */
    selectComponent?<
      TD extends Record<string, unknown> = Record<string, unknown>,
      TP extends Record<string, string> = Record<string, string>
    >(selector: string): ComponentInstance<TD, TP>
    /** 使用选择器选择组件实例节点，返回匹配到的全部组件实例对象组成的数组（会被 wx://component-export 影响） */
    selectAllComponents?<
      TD extends Record<string, unknown> = Record<string, unknown>,
      TP extends Record<string, string> = Record<string, string>
    >(selector: string): ComponentInstance<TD, TP>
    /** 选取当前组件节点所在的组件实例（即组件的引用者），返回它的组件实例对象（会被 wx://component-export 影响） */
    selectOwnerComponent?<
      TD extends Record<string, unknown> = Record<string, unknown>,
      TP extends Record<string, string> = Record<string, string>
    >(): ComponentInstance<TD, TP>
    /** 获取这个关系所对应的所有关联节点，参见[组件间关系](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/relations.html) */
    getRelationNodes?(relationKey: string): NodesRef[]
    /** 立刻执行 callback ，其中的多个 setData 之间不会触发界面绘制（只有某些特殊场景中需要，如用于在不同组件同时 setData 时进行界面绘制同步） */
    groupSetData?(callback: () => void): void
    /** 返回当前页面的 custom-tab-bar 的组件实例，详见[自定义 tabBar](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html) */
    getTabBar?(): ComponentInstance
    /** 返回页面标识符（一个字符串），可以用来判断几个自定义组件实例是不是在同一个页面内 */
    getPageId?(): string
    /** 执行关键帧动画，详见[动画](https://developers.weixin.qq.com/miniprogram/dev/framework/view/animation.html) */
    animate?(selector: string, keyFrames: KeyFrame[], duration: number, callback: () => void): void
    /** 滚动驱动的动画，详见[动画](https://developers.weixin.qq.com/miniprogram/dev/framework/view/animation.html) */
    animate?(selector: string, keyFrames: KeyFrame[], duration: number, scrollTimeline: ScrollTimelineOption): void
    /** 清除关键帧动画，详见[动画](https://developers.weixin.qq.com/miniprogram/dev/framework/view/animation.html) */
    clearAnimation?(selector: string, callback: () => void): void
    /** 清除关键帧动画，详见[动画](https://developers.weixin.qq.com/miniprogram/dev/framework/view/animation.html) */
    clearAnimation?(selector: string, options: ClearAnimationOptions, callback: () => void): void
    /** 清除关键帧动画，详见[动画](https://developers.weixin.qq.com/miniprogram/dev/framework/view/animation.html) */
    setUpdatePerformanceListener?(options: {
      /** 是否返回变更的 data 字段信息 */
      withDataPaths?: boolean
    }, listener: () => void): void
  }
  interface PageInstance extends PageLifeCycle, ComponentInstance {
    /** 页面配置 */
    config?: PageConfig
    /** 页面的初始数据 */
    data?: Record<string, unknown>
    /** 页面路径 */
    path?: string
    /** 页面的组件选项 */
    options?: Record<string, unknown>
    /** 获得一个 EventChannel 对象，用于页面间通讯 */
    getOpenerEventChannel?(): Record<string, any>
  }
}
