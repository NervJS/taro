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
      <taro-live-player-core>
        <div>
          <video class="taro-live-player" controls=""></video>
        </div>
      </taro-live-player-core>
    `)
    })
  })
})()
