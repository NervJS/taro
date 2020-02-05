import Vue from 'vue'

describe('vue', () => {
  process.env.FRAMEWORK = 'react'
  const runtime = require('../dist/runtime.esm')
  const document = runtime.document

  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  describe('lifecycle', () => {
    const app = new Vue({
      render (h) {
        return h('block', this.$slots.default)
      }
    })

    const App = runtime.createVueApp(app)

    const home = new Vue({
      template: `
      <view class='index' id='home'>
      </view>
      `
    })

    const Home = runtime.createPageConfig(home, '/page/home')

    it('onLoad', () => {

    })
  })
})
