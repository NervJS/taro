import { E2EPage, newE2EPage } from '@stencil/core/testing'

describe('Label e2e', () => {
  let page: E2EPage

  it('label contain subject', async () => {
    page = await newE2EPage({
      html: `<taro-checkbox-group-core>
        <taro-label-core>
          <taro-checkbox-core value="dog"></taro-checkbox-core>
          <div id="dog">dog</div>
        </taro-label-core>
        <taro-label-core>
          <taro-checkbox-core value="cat" checked></taro-checkbox-core>
          <div id="cat">cat</div>
        </taro-label-core>
      </taro-checkbox-group-core>`,
    })
    const el = await page.find('taro-checkbox-group-core')
    const target = await page.find('#dog')
    const onChange = await el.spyOnEvent('change')

    let value = await el.getProperty('value')
    expect(value).toHaveLength(1)
    expect(value).toContain('cat')

    await target.click()
    await page.waitForChanges()

    value = await el.getProperty('value')
    expect(value).toHaveLength(2)
    expect(value).toContain('cat')
    expect(value).toContain('dog')
    expect(onChange).toHaveReceivedEventTimes(1)
  })

  it('label for', async () => {
    page = await newE2EPage({
      html: `<div>
        <taro-radio-group-core ref={radioGroup}>
          <taro-radio-core id="gz" value="GuangZhou">GuangZhou</taro-radio-core>
          <taro-radio-core id="sz" value="ShenZhen" checked={true}>ShenZhen</taro-radio-core>
        </taro-radio-group-core>

        <taro-label-core for="gz">广州</taro-label-core>
        <taro-label-core for="sz">深圳</taro-label-core>
      </div>`,
    })
    const group = await page.find('taro-radio-group-core')
    const gzLabel = await page.find('label')
    const onChange = await group.spyOnEvent('change')

    let value = await group.getProperty('value')
    expect(value).toContain('ShenZhen')

    await gzLabel.click()
    await page.waitForChanges()

    value = await group.getProperty('value')
    expect(value).toContain('GuangZhou')
    expect(onChange).toHaveReceivedEventTimes(1)
  })
})
