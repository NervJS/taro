import './form.scss'
import React from 'react'

import {
  View,
  Text,
  Label,
  Radio,
  Checkbox,
  Slider,
  Input,
  Button,
  RadioGroup,
  Form,
  CheckboxGroup,
  Switch
} from '@tarojs/components'

import Header from '../../../components/head/head'

export default class PageForm extends React.Component {
  state = {
    radioItem: [
      {
        key: 'radio-1',
        value: '选项一',
        checked: false
      },
      {
        key: 'radio-2',
        value: '选项二',
        checked: false
      }
    ],
    checkItem: [
      {
        key: 'checkbox—1',
        value: '选项一',
        checked: false
      },
      {
        key: 'checkbox—2',
        value: '选项二',
        checked: false
      }
    ],
    sliderValue: 50
  }

  onHandleChange = e => {
    console.log(e)
  }

  onRadioChange = e => {
    console.log(e)
  }

  onCheckChange = e => {
    console.log(e)
  }

  handleSliderChange = e => {
    console.log(e)
  }

  handleSliderChanging = e => {
    console.log(e)
  }

  formSubmit = e => {
    console.log(e)
  }

  formReset = e => {
    console.log(e)
  }

  render() {
    return (
      <View className='components-page'>
        <View className='components-page__header'>
          <Header title='Form'></Header>
        </View>
        <Form onSubmit={this.formSubmit} onReset={this.formReset}>
          <View className='components-page__body'>
            <View className='components-page__body-example example'>
              <View className='example-header'>
                <Text>switch</Text>
              </View>
              <View className='example-body'>
                <Switch onChange={this.onHandleChange} name='switch' className="form-switch"></Switch>
              </View>
            </View>
            <View className='components-page__body-example example'>
              <View className='example-header'>
                <Text>radio</Text>
              </View>
              <View className='example-body'>
                <RadioGroup className='example-body__radio-group' onChange={this.onRadioChange} name='radio'>
                  {this.state.radioItem.map(item => {
                    return (
                      <Label className='example-body__radio-group-item' for={item.key} key={item.key}>
                        <Radio value={item.key} checked={item.checked} >
                          <Text>{item.value}</Text>
                        </Radio>
                      </Label>
                    )
                  })}
                </RadioGroup>
              </View>
            </View>
            <View className='components-page__body-example example'>
              <View className='example-header'>
                <Text>checkbox</Text>
              </View>
              <View className='example-body'>
                <CheckboxGroup  className='example-body__checkbox-group' onChange={this.onCheckChange} name='checkbox'>
                  {this.state.checkItem.map(item => {
                    return (
                      <Label  className='example-body__checkbox-group-item' for={item.key} key={item.key}>
                        <Checkbox value={item.key} checked={item.checked}>
                          <Text>{item.value}</Text>
                        </Checkbox>
                      </Label>
                    )
                  })}
                </CheckboxGroup>
              </View>
            </View>
            <View className='components-page__body-example example'>
              <View className='example-header'>
                <Text>slider</Text>
              </View>
              <View className='example-body'>
                <Slider
                  name='slider'
                  value={this.state.sliderValue}
                  showValue
                  onChange={this.handleSliderChange}
                  bingchanging={this.handleSliderChanging} ></Slider>
              </View>
            </View>
            <View className='components-page__body-example example example-input'>
              <View className='example-header'>
                <Text>input</Text>
              </View>
              <View className='example-body'>
                <Input
                  name='input'
                  type='text'
                  placeholder={'这是一个输入框'}
                  onChange={this.onHandleChange} ></Input>
              </View>
            </View>
            <View className='components-page__body-example example'>
              <View className='example-body'>
                <Button formType='submit' type='primary'>
                  Submit
                </Button>
                <Button formType='reset' type='default'>
                  Reset
                </Button>
              </View>
            </View>
          </View>
        </Form>
      </View>
    )
  }
}
