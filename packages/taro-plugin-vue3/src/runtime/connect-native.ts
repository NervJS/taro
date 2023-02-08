import {
  addLeadingSlash,
  Current,
  eventHandler,
  incrementId,
  injectPageInstance,
  removePageInstance,
  safeExecute
} from '@tarojs/runtime'
import { isArray } from '@tarojs/shared'
import { createApp, defineComponent, onMounted, provide, ref, shallowReactive, toRaw } from 'vue'

import { isClassComponent, setReconciler } from './connect'

import type { TaroRootElement } from '@tarojs/runtime'
import type { PageInstance } from '@tarojs/taro'
import type { ComponentOptions, h as createElement } from '@vue/runtime-core'

declare const getCurrentPages: () => PageInstance[]

interface PageItem {
  compId: string
  component: ComponentOptions
}

const getNativeCompId = incrementId()

function initNativeComponentEntry (h: typeof createElement) {
  setReconciler()

  const NativeComponentWrapper = {
    props: ['getCtx', 'compId'],
    setup (props) {
      const root = ref<TaroRootElement>()
      const ctx = props.getCtx()
      provide('id', props.compId)

      onMounted(() => {
        const rootElement = toRaw(root.value)!
        rootElement.ctx = ctx
        rootElement.performUpdate(true)
      })

      return { root }
    },
    render () {
      return h(
        'root',
        {
          ref: 'root',
          id: this.compId
        },
        this.$slots.default()
      )
    }
  }

  const App = defineComponent({
    setup () {
      const components = shallowReactive<PageItem[]>([])

      function mount (component: ComponentOptions, compId: string, getCtx: () => any) {
        // 处理类组件
        component = isClassComponent(component) ? component.__vccOpts : component
        const inject = {
          props: {
            tid: String
          },
          created () {
            injectPageInstance(this, compId)
          }
        }
        if (isArray(component.mixins)) {
          const mixins = component.mixins
          const idx = mixins.length - 1
          if (!mixins[idx].props?.tid) {
            // mixins 里还没注入过，直接推入数组
            component.mixins.push(inject)
          } else {
            // mixins 里已经注入过，代替前者
            component.mixins[idx] = inject
          }
        } else {
          component.mixins = [inject]
        }
        const PageComponent: any = Object.assign({}, component)
        const option = PageComponent.props?.option?.default?.() || {}
        const ctx = getCtx()

        const page: ComponentOptions = {
          mounted () {
            ctx.component = this
          },
          unmounted () {
            removePageInstance(compId)
          },
          render () {
            return h(
              NativeComponentWrapper,
              {
                compId,
                getCtx
              },
              {
                default () {
                  return [
                    h(PageComponent, {
                      tid: compId,
                      option,
                      ...(ctx.data ||= {}).props,
                      _scope: ctx
                    })
                  ]
                }
              }
            )
          }
        }

        components.push({
          compId,
          component: page
        })
      }

      function unmount (compId: string) {
        const index = components.findIndex(page => page.compId === compId)
        components.splice(index, 1)
      }

      onMounted(() => (Current.app = {
        mount: mount as any,
        unmount
      }))

      return {
        components
      }
    },
    render () {
      return this.components.map(page => h(page.component, { key: page.compId }))
    }
  })

  createApp(App).mount('#app')
}

export function createNativeComponentConfig (component, h: typeof createElement, componentConfig) {
  const componentObj: Record<string, any> = {
    options: componentConfig,
    properties: {
      props: {
        type: null,
        value: null,
        observer (_newVal, oldVal) {
          oldVal && this.component?.$forceUpdate()
        }
      }
    },
    created () {
      if (!Current.app) {
        initNativeComponentEntry(h)
      }
    },
    attached () {
      const compId = this.compId = getNativeCompId()
      setCurrent(compId)
      this.config = componentConfig
      Current.app!.mount!(component, compId, () => this)
    },
    ready () {
      safeExecute(this.compId, 'onReady')
    },
    detached () {
      resetCurrent()
      Current.app!.unmount!(this.compId)
      this.component = null
    },
    pageLifetimes: {
      show (options) {
        safeExecute(this.compId, 'onShow', options)
      },
      hide () {
        safeExecute(this.compId, 'onHide')
      }
    },
    methods: {
      eh: eventHandler
    }
  }

  function resetCurrent () {
    // 小程序插件页面卸载之后返回到宿主页面时，需重置Current页面和路由。否则引发插件组件二次加载异常 fix:#11991
    Current.page = null
    Current.router = null
  }

  function setCurrent (compId: string) {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    if (Current.page === currentPage) return

    Current.page = currentPage

    const route = (currentPage as any).route || (currentPage as any).__route__
    const router = {
      params: currentPage.options || {},
      path: addLeadingSlash(route),
      $taroPath: compId,
      onReady: '',
      onHide: '',
      onShow: ''
    }
    Current.router = router

    if (!currentPage.options) {
      // 例如在微信小程序中，页面 options 的设置时机比组件 attached 慢
      Object.defineProperty(currentPage, 'options', {
        enumerable: true,
        configurable: true,
        get () {
          return this._optionsValue
        },
        set (value) {
          router.params = value
          this._optionsValue = value
        }
      })
    }
  }

  return componentObj
}
