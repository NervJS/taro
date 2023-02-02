import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { PickerView } from '../src/components/picker-view/picker-view'
import { PickerViewColumn } from '../src/components/picker-view/picker-view-column'

describe('PickerView', () => {
  let page: SpecPage

  it('props valid', async () => {
    const date = new Date()
    const years: number[] = []
    for (let i = 1990; i <= date.getFullYear(); i++) {
      years.push(i)
    }
    page = await newSpecPage({
      components: [PickerView, PickerViewColumn],
      template: () => (<taro-view-core>
        <taro-picker-view-core
          indicatorStyle='height: 60px;'
          indicatorClass='test_indicatorClass'
          style='width: 100%; height: 300px; position: absolute; bottom: 0px;'
          maskClass='test_maskClass'
          maskStyle="background-color: rgba(33, 33, 33, 0.5);"
        >
          <taro-picker-view-column-core>
            {years.map(item => (
              <taro-view-core key={item} style='height: 60px; line-height: 60px; text-align: center;'>
                {item}年
              </taro-view-core>
            ))}
          </taro-picker-view-column-core>
        </taro-picker-view-core>
      </taro-view-core>),
    })

    const indicatorEle = page.root?.querySelector('.taro-picker-view-mask-indicator')
    expect(indicatorEle?.classList.contains('test_indicatorClass')).toBe(true)

    const maskTopEle = page.root?.querySelector('.taro-picker-view-mask-top')
    expect(maskTopEle?.classList.contains('test_maskClass')).toBe(true)

    const maskBottomEle = page.root?.querySelector('.taro-picker-view-mask-bottom')
    expect(maskBottomEle?.classList.contains('test_maskClass')).toBe(true)

    const pickerViewColumnEle = page.root?.querySelector('.taro-picker-view-column-container')

    // 模拟滑动
    const startY = 0
    const endY = 200

    pickerViewColumnEle?.dispatchEvent(new Event('mousedown', {
      // @ts-ignore
      clientY: startY
    }))

    pickerViewColumnEle?.dispatchEvent(new Event('mousemove', {
      // @ts-ignore
      clientY: endY
    }))

    expect(page.root).toMatchSnapshot()
  })
})
