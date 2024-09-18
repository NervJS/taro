import { E2EPage, newE2EPage } from '@stencil/core/testing'

describe('Form e2e', () => {
  let page: E2EPage
  const switchChecked = false
  const sliderValue = 0
  const inputValue = ''
  const textareaValue = ''
  const radioList = [{
    value: 'radio1',
    checked: false
  }, {
    value: 'radio2',
    checked: false
  }]
  const checkboxList = [{
    value: 'checkbox1',
    checked: false
  }, {
    value: 'checkbox2',
    checked: false
  }]
  const pickerValue = 0

  it('events', async () => {
    page = await newE2EPage({
      html: `<taro-form-core>
        <taro-switch-core name='my-switch' checked="${switchChecked}"></taro-switch-core>
        <taro-slider-core name='my-slider' value="${sliderValue}"></taro-slider-core>
        <taro-input-core name='my-input' value="${inputValue}"></taro-input-core>
        <taro-textarea-core name='my-textarea' value="${textareaValue}"></taro-textarea-core>
        <taro-radio-group-core name='my-radio-group'>
          ${radioList.map(({ value, checked }) => `<taro-radio-core key="${value}" value="${value}" checked="${checked}">${value}</taro-radio-core>`).join('')}
        </taro-radio-group-core>
        <taro-checkbox-group-core name='my-checkbox-group'>
          ${checkboxList.map(({ value, checked }) => `<taro-checkbox-core key="${value}" value="${value}" checked="${checked}">${value}</taro-checkbox-core>`).join('')}
        </taro-checkbox-group-core>
        <taro-picker-core name='my-picker' range={['葡萄', '橙子', '苹果', '木瓜']} value="${pickerValue}"></taro-picker-core>
        <taro-button-core form-type='submit'>Submit</taro-button-core>
        <taro-button-core form-type='reset'>Reset</taro-button-core>
      </taro-form-core>`,
    })
    const el = await page.find('taro-form-core')
    const submit = await el.find('taro-button-core[form-type="submit"]')
    const reset = await el.find('taro-button-core[form-type="reset"]')
    const formSwitch = await el.find('taro-switch-core')
    const formSlider = await el.find('taro-slider-core')
    const formInput = await el.find('taro-input-core')
    const formTextarea = await el.find('taro-textarea-core')
    const formRadio = await el.find('taro-radio-group-core')
    const formCheckbox = await el.find('taro-checkbox-group-core')
    const formPicker = await el.find('taro-picker-core')
    const onSubmit = await el.spyOnEvent('submit')
    const onReset = await el.spyOnEvent('reset')

    submit.triggerEvent('touchend')
    await page.waitForChanges()
    expect(onSubmit).toHaveReceivedEventTimes(1)
    expect(onSubmit).toHaveReceivedEventDetail({
      value: {
        'my-switch': false,
        'my-slider': '0',
        'my-input': '',
        'my-textarea': '',
        'my-radio-group': '',
        'my-checkbox-group': [],
        'my-picker': '0'
      }
    })

    formSwitch.setProperty('checked', true)
    formSlider.setProperty('value', '60')
    formInput.setProperty('value', 'taro-input')
    formTextarea.setProperty('value', 'taro-textarea')
    formPicker.setProperty('value', '1')
    await page.waitForChanges()
    ;(await formCheckbox.find('taro-checkbox-core[key="checkbox1"]')).click()
    await page.waitForChanges()
    ;(await formCheckbox.find('taro-checkbox-core[key="checkbox2"]')).click()
    await page.waitForChanges()
    ;(await formRadio.find('taro-radio-core[key="radio1"]')).click()
    await page.waitForChanges()

    submit.triggerEvent('touchend')
    await page.waitForChanges()
    expect(onSubmit).toHaveReceivedEventTimes(2)
    expect(onSubmit).toHaveReceivedEventDetail({
      value: {
        'my-switch': true,
        'my-slider': '60',
        'my-input': 'taro-input',
        'my-textarea': 'taro-textarea',
        'my-radio-group': 'radio1',
        'my-checkbox-group': ['checkbox1', 'checkbox2'],
        'my-picker': '1'
      }
    })

    reset.triggerEvent('touchend')
    await page.waitForChanges()
    expect(onReset).toHaveReceivedEventTimes(1)

    submit.triggerEvent('touchend')
    await page.waitForChanges()
    expect(onSubmit).toHaveReceivedEventDetail({
      value: {
        'my-switch': false,
        'my-input': '',
        'my-textarea': '',
        'my-radio-group': '',
        'my-checkbox-group': [],
        // Slider 和 Picker 的 input type 为 hidden，form.reset() 不能重置它们，需要再想想办法
        'my-slider': '60',
        'my-picker': '1'
      }
    })

    expect(page).toMatchSnapshot()
  })
})
