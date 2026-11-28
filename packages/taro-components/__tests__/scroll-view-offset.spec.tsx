import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { ScrollView } from '../src/components/scroll-view/scroll-view'

it('scrolls the stencil container with an offset', async () => {
  const page = await newSpecPage({
    components: [ScrollView],
    template: () => <taro-scroll-view-core scrollY mpScrollIntoViewOffset={-20} mpScrollIntoViewAlignment='start'>
      <div id='anchor'>target</div>
    </taro-scroll-view-core>,
  })
  const root = page.root!
  const target = root.querySelector<HTMLElement>('#anchor')!
  root.getBoundingClientRect = () => ({ top: 10, left: 0 }) as DOMRect
  target.getBoundingClientRect = () => ({ top: 160, left: 0, width: 20, height: 20 }) as DOMRect
  Object.defineProperty(root, 'clientTop', { value: 0 })
  Object.defineProperty(root, 'clientHeight', { value: 100 })
  root.scrollTop = 0
  root.scrollTo = jest.fn()
  await page.rootInstance.mpScrollIntoViewMethod('anchor')
  expect(root.scrollTo).toHaveBeenCalledWith({ top: 130, behavior: 'auto' })
})
