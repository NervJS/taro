import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { RtcRoom } from '../src/components/rtc-room/rtc-room'
import { RtcRoomItem } from '../src/components/rtc-room/rtc-room-item'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('RtcRoom', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [RtcRoom, RtcRoomItem],
      template: () => (<taro-rtc-room-core>
        <taro-rtc-room-item-core />
        <taro-rtc-room-item-core />
        <taro-rtc-room-item-core />
        <taro-rtc-room-item-core />
      </taro-rtc-room-core>),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-rtc-room-core>
        <taro-rtc-room-item-core></taro-rtc-room-item-core>
        <taro-rtc-room-item-core></taro-rtc-room-item-core>
        <taro-rtc-room-item-core></taro-rtc-room-item-core>
        <taro-rtc-room-item-core></taro-rtc-room-item-core>
      </taro-rtc-room-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
