import { createPageConfig } from '@tarojs/runtime'
import { describe, expect, test, vi } from 'vitest'
import { type App, createApp, h } from 'vue'

import { createVue3App } from '../src/runtime'

describe('vue3 lifecycle', () => {
  const appDidShow = vi.fn()
  const appDidHide = vi.fn()
  const onLoad = vi.fn()

  const App = createApp({
    onShow () {
      appDidShow.apply(this)
    },
    onHide () {
      appDidHide.apply(this)
    },
    render () {
      return h('block', this.$slots.default)
    }
  }) as unknown as App

  const app = createVue3App(App, h, {})

  const Home = {
    onLoad () {
      onLoad.apply(this)
    },
    template: `
      <view class='index' id='home' ref='current'>home</view>
    `
  }

  const home = createPageConfig(Home, '/page/home')
  app.onLaunch?.()

  test('App#onShow', () => {
    app.onShow?.()
    expect(appDidShow).toHaveBeenCalledWith()
  })

  test('App#onHide', () => {
    app.onHide?.()
    expect(appDidHide).toHaveBeenCalledWith()
  })

  test.skip('onLoad', () => {
    home.onLoad?.({})
    expect(onLoad).toHaveBeenCalledWith({})
  })
})
