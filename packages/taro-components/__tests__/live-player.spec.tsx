import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { LivePlayer } from '../src/components/live-player/live-player'
// import { printUnimplementedWarning } from './utils'

// @ts-ignore
// 添加全局的 self 对象
global.self = global 

jest.mock('flv.js',()=>{
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

describe('LivePlayer', () => {
  let page: SpecPage

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
    // expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
