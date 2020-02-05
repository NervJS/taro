
describe('vue', () => {
  process.env.FRAMEWORK = 'vue'
  const runtime = require('../dist/runtime.esm')
  global.document = runtime.document
  global.window = runtime.window
  global.navigator = runtime.navigator
  const Vue = require('./vue').default

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
