(function () {
  // 添加全局的 self 对象
  // @ts-ignore
  global.self = global
  const { h } = require('@stencil/core')
  const { newSpecPage } = require('@stencil/core/testing')

  const { LivePlayer } = require('../src/components/live-player/live-player')

  jest.mock('flv.js', () => {
    const createPlayer = jest.fn().mockReturnValue({
      attachMediaElement: jest.fn(),
      load: jest.fn(),
      play: jest.fn()
    })

    return {
      createPlayer
    }
  })

  const logError = jest.fn()
  console.error = logError
  let page

  describe('LivePlayer', () => {

    it('unimplemented', async () => {
      page = await newSpecPage({
        components: [LivePlayer],
        template: () => (<taro-live-player-core />),
      })
      await page.waitForChanges()

      expect(page.root).toEqualHtml(`
      <taro-live-player-core class="taro-live-player-container">
        <video class="taro-live-player" playsinline="" webkit-playsinline="" style="object-fit: contain;"></video>
        <div class="taro-video-cover">
          <div class="taro-video-loader"></div>
        </div>
        <taro-video-control controls="" showplaybtn="">
          <div class="taro-video-mute"></div>
          <div class="taro-video-fullscreen"></div>
        </taro-video-control>
      </taro-live-player-core>
    `)
    })
  })
})()
