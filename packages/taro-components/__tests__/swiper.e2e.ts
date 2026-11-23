import { newE2EPage } from '@stencil/core/testing'
import { build } from 'esbuild'

import type Swiper from 'swiper'

it('emits both changes when reversing direction before the transition ends', async () => {
  // Bundle the custom element's Swiper dependency as the H5 build does.
  const { outputFiles } = await build({
    stdin: {
      contents: `
        import { defineCustomElement } from '../dist/components/taro-swiper-core.js'
        defineCustomElement()
      `,
      resolveDir: __dirname,
    },
    bundle: true,
    write: false,
    logLevel: 'error',
  })
  const page = await newE2EPage()
  await page.evaluate(() => {
    document.body.innerHTML = `
      <taro-swiper-core>
        <taro-swiper-item-core class="swiper-slide">First</taro-swiper-item-core>
        <taro-swiper-item-core class="swiper-slide">Second</taro-swiper-item-core>
      </taro-swiper-core>
    `
  })
  await page.addScriptTag({ content: outputFiles[0].text })
  await page.waitForFunction(() => {
    const container = document.querySelector('.swiper-container') as (HTMLElement & { swiper?: Swiper }) | null
    return container?.swiper?.initialized
  })

  const changes = await page.$eval('taro-swiper-core', element => {
    const container = element.querySelector('.swiper-container') as HTMLElement & { swiper: Swiper }
    const swiper = container.swiper
    const indices: number[] = []
    element.addEventListener('change', (event: CustomEvent<{ current: number }>) => {
      indices.push(event.detail.current)
    })
    swiper.slideTo(1, 500)
    swiper.slideTo(0, 500)
    return indices
  })

  expect(changes).toEqual([1, 0])
})
