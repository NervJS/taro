import React from 'react'
import * as assert from 'assert'
import simulant from 'simulant'
import * as sinon from 'sinon'
import {
  Form,
  Switch,
  Slider,
  Input,
  Textarea,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Picker,
  Button
} from '../h5/react'
import { mount } from './test-tools'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Form', () => {
  /**
   * @type {HTMLElement}
   */
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  afterEach(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('events', async () => {
    const onSubmit = sinon.spy()
    const onReset = sinon.spy()
    const submitRef = React.createRef()
    const resetRef = React.createRef()

    class App extends React.Component {
      constructor () {
        super(...arguments)
        this.state = {
          switchChecked: false,
          sliderValue: 0,
          inputValue: '',
          textareaValue: '',
          radios: [{
            value: 'radio1',
            checked: false
          }, {
            value: 'radio2',
            checked: false
          }],
          checkboxs: [{
            value: 'checkbox1',
            checked: false
          }, {
            value: 'checkbox2',
            checked: false
          }],
          pickerValue: 0
        }
      }

      render () {
        const {
          switchChecked,
          sliderValue,
          inputValue,
          textareaValue,
          radios,
          checkboxs,
          pickerValue
        } = this.state
        return (
          <Form
            onSubmit={e => onSubmit(e.detail.value)}
            onReset={onReset}
          >
            <Switch name='my-switch' checked={switchChecked} />

            <Slider name='my-slider' value={sliderValue} />

            <Input name='my-input' value={inputValue} />

            <Textarea name='my-textarea' value={textareaValue} />

            <RadioGroup name='my-radio-group'>
              {radios.map(({ value, checked }) => (
                <Radio key={value} value={value} checked={checked}>{value}</Radio>
              ))}
            </RadioGroup>

            <CheckboxGroup name='my-checkbox-group'>
              {checkboxs.map(({ value, checked }) => (
                <Checkbox key={value} value={value} checked={checked}>{value}</Checkbox>
              ))}
            </CheckboxGroup>

            <Picker
              name='my-picker'
              range={['葡萄', '橙子', '苹果', '木瓜']}
              value={pickerValue}
            />

            <Button formType='submit' ref={submitRef}>Submit</Button>
            <Button formType='reset' ref={resetRef}>Reset</Button>
          </Form>
        )
      }
    }
    const wrapper = await mount(<App />, scratch)
    const submitBtn = submitRef.current
    const resetBtn = resetRef.current

    simulant.fire(submitBtn, 'touchend')

    assert(onSubmit.calledOnceWith({
      'my-switch': false,
      'my-slider': '0',
      'my-input': '',
      'my-textarea': '',
      'my-radio-group': '',
      'my-checkbox-group': [],
      'my-picker': '0'
    }))

    await wrapper.setState({
      switchChecked: true,
      sliderValue: 60,
      inputValue: 'taro-input',
      textareaValue: 'taro-textarea',
      radios: [{
        value: 'radio1',
        checked: true
      }, {
        value: 'radio2',
        checked: false
      }],
      checkboxs: [{
        value: 'checkbox1',
        checked: true
      }, {
        value: 'checkbox2',
        checked: true
      }],
      pickerValue: 1
    })

    simulant.fire(submitBtn, 'touchend')

    assert(onSubmit.callCount === 2)
    assert(onSubmit.calledWith({
      'my-switch': true,
      'my-slider': '60',
      'my-input': 'taro-input',
      'my-textarea': 'taro-textarea',
      'my-radio-group': 'radio1',
      'my-checkbox-group': ['checkbox1', 'checkbox2'],
      'my-picker': '1'
    }))

    simulant.fire(resetBtn, 'touchend')
    assert(onReset.callCount === 1)

    simulant.fire(submitBtn, 'touchend')
    assert(onSubmit.calledWith({
      'my-switch': false,
      'my-input': '',
      'my-textarea': '',
      'my-radio-group': '',
      'my-checkbox-group': [],
      // Slider 和 Picker 的 input type 为 hidden，form.reset() 不能重置它们，需要再想想办法
      'my-slider': '60',
      'my-picker': '1'
    }))
  })
})
