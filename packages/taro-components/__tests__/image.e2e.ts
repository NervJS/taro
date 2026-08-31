import { E2EPage, newE2EPage } from '@stencil/core/testing'

const IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIzMiI+PC9zdmc+'

describe('Image e2e', () => {
  let page: E2EPage

  it('centers aspectFit images on both axes', async () => {
    page = await newE2EPage({
      html: `<taro-image-core
        mode="aspectFit"
        src="${IMAGE}"
        style="width: 48px; height: 48px;"
      ></taro-image-core>`,
    })

    await page.waitForFunction(() => {
      const image = document.querySelector<HTMLImageElement>('taro-image-core img')
      return Boolean(image?.complete && image.naturalWidth > 0)
    })

    const centers = await page.evaluate(() => {
      const host = document.querySelector('taro-image-core')!
      const image = host.querySelector('img')!
      const hostRect = host.getBoundingClientRect()
      const imageRect = image.getBoundingClientRect()

      return {
        hostWidth: hostRect.width,
        imageWidth: imageRect.width,
        hostX: hostRect.left + hostRect.width / 2,
        hostY: hostRect.top + hostRect.height / 2,
        imageX: imageRect.left + imageRect.width / 2,
        imageY: imageRect.top + imageRect.height / 2,
      }
    })

    expect(centers.imageWidth).toBeLessThan(centers.hostWidth)
    expect(centers.imageX).toBeCloseTo(centers.hostX, 5)
    expect(centers.imageY).toBeCloseTo(centers.hostY, 5)
  })
})
