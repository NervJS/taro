import { Current, eventCenter } from '@tarojs/plugin-platform-harmony-cpp/dist/runtime/runtime-harmony'

import type { TaroAny } from '@tarojs/runtime'

const X_COMPONENT_ID_PREFIX = 'taro_x_'

interface ILocation {
  path: string
}

interface IRouterChangeEventFeedback {
  toLocation?: ILocation
  stage: string
}

const ROUTER_STAGE = new Map<string, number>([
  ['load', 0],
  ['show', 1],
  ['hide', 2],
  ['unload', 3],
])

@Component
export struct TaroXComponent {
  @Prop pageId: number = 0
  @Prop path: string = ''
  @State stage: number = 0
  data: TaroAny = null

  aboutToAppear(): void {
    if (Current.isDebug) {
      console.log("C-Component onAppear 使用 NAPI 调用 C++ 侧的方法", `taro_x_${this.pageId}`)
    }
    // FIXME Current.router 为空会导致页面切换和卸载出现问题，后续修复
    this.path = Current.router?.path?.replace(/^\//, '')
    eventCenter.on('__taroRouterChange', this.handleRouterChange)
    if (Current.page?.config?.isHome) {
      Current.taro.updatePageSync()
    }
  }

  aboutToDisappear(): void {
    if (Current.isDebug) {
      console.log("C-Component onDisAppear 使用 NAPI 调用 C++ 侧的方法", `taro_x_${this.pageId}`)
    }
    if (this.stage !== ROUTER_STAGE.get('unload')) {
      eventCenter.off('__taroRouterChange', this.handleRouterChange)
      this.handleRouterChange({ stage: 'unload' })
    }
  }

  handleRouterChange = (params: IRouterChangeEventFeedback) => {
    if (!this.pageId || !this.path) return

    if (this.path === params.toLocation?.path || (params.stage && !params.toLocation)) {
      this.stage = ROUTER_STAGE.get(params.stage) || 0
      Current.nativeModule.onXComponentStateChange(this.pageId, this.stage)
    }
  }

  build() {
    if (this.pageId > 0) {
      Stack() {
        ContentSlot(this.data)
      }
      .id(`${X_COMPONENT_ID_PREFIX}${this.pageId}`)
      .align(Alignment.TopStart)
      .height('100%')
      .width('100%')
      .onDetach(() => {
        if (Current.isDebug) {
          console.log("C-Component onDetach 使用 NAPI 调用 C++ 侧的方法", `taro_x_${this.pageId}`)
        }
        if (this.stage !== ROUTER_STAGE.get('unload')) {
          eventCenter.off('__taroRouterChange', this.handleRouterChange)
          this.handleRouterChange({ stage: 'unload' })
        }
      })
    }
  }
}
