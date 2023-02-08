import { E2EPage, newE2EPage } from '@stencil/core/testing'

describe('Textarea', () => {
  let page: E2EPage

  it('props', async () => {
    page = await newE2EPage({
      html: `<taro-textarea-core />`,
    })
    const onFocus = await page.spyOnEvent('focus')
    const el = await page.find('taro-textarea-core')
    const textarea = await el.find('textarea')

    await textarea.focus()
    expect(await el.getProperty('value')).toEqual('')
    expect(await textarea.getProperty('value')).toEqual('')
    expect(textarea.getAttribute('placeholder')).toBeNull()
    expect(textarea.getAttribute('maxlength')).toEqual('140')
    expect(textarea.getAttribute('rows')).toBeNull()

    const value = 'taro'
    const placeholder = 'type sth...'
    const maxLength = 10
    const autoHeight = true

    el.setProperty('value', value)
    el.setProperty('placeholder', placeholder)
    el.setProperty('maxlength', maxLength.toString())
    el.setProperty('autoHeight', autoHeight.toString())

    await page.waitForChanges()
    expect(await el.getProperty('value')).toEqual(value)
    expect(await textarea.getProperty('value')).toEqual(value)
    expect(textarea.getAttribute('placeholder')).toEqual(placeholder)
    expect(textarea.getAttribute('maxlength')).toEqual(maxLength.toString())
    expect(onFocus).toHaveReceivedEventTimes(1)
    expect(textarea.getAttribute('rows')).toEqual('1')

    expect(page).toMatchSnapshot()
  })

  it('events', async () => {
    let value = 'taro'
    page = await newE2EPage({
      html: `<taro-textarea-core value="${value}" />`,
    })
    const el = await page.find('taro-textarea-core')
    const textarea = await el.find('textarea')
    const onInput = await el.spyOnEvent('input')
    const onFocus = await el.spyOnEvent('focus')
    const onBlur = await el.spyOnEvent('blur')
    // const onLineChange = await el.spyOnEvent('linechange')


    await textarea.focus()
    expect(onFocus).toHaveReceivedEventTimes(1)
    expect(onFocus).toHaveReceivedEventDetail({ value })

    value = 'taroa'
    el.triggerEvent('input', { detail: { value } })
    el.setProperty('value', value)
    await page.waitForChanges()
    expect(onInput).toHaveReceivedEventTimes(1)
    expect(onInput).toHaveReceivedEventDetail({ value })

    el.triggerEvent('blur')
    await page.waitForChanges()
    expect(onBlur).toHaveReceivedEventTimes(1)
    // expect(onBlur).toHaveReceivedEventDetail({ value })

    value = 'tarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotaro'
    el.setProperty('value', value)
    await page.waitForChanges()
    // expect(onLineChange).toHaveReceivedEventTimes(1)

    expect(page).toMatchSnapshot()
  })
})
