import React from 'react'

// RadioGroup
import {
  View,
  Text,
  CheckboxGroup,
  Checkbox,
  Label,
  Radio,
  RadioGroup
} from '@tarojs/components'

import Header from '../../../components/head/head'

import './label.scss'

export default class PageLabel extends React.Component {
  state = {
    checked: false
  }

  handleChange = e => {
    const { checked } = this.state
    this.setState({
      checked: !checked
    })
  }

  render() {
    return (
      <View className='components-page'>
        <View className='components-page__header'>
          <Header title='Label'></Header>
        </View>
        <View className='components-page__body'>
          <View className='components-page__body-example example'>
            <View className='example-header'>
              <Text>表单组件在label内</Text>
            </View>
            <View className='example-body'>
              <CheckboxGroup>
                <Label className='example-body__label'>
                  <Checkbox value='美国'>美国</Checkbox>
                </Label>
                <Label className='example-body__label'>
                  <Checkbox value='中国' checked>
                    中国
                </Checkbox>
                </Label>
              </CheckboxGroup>
            </View>
          </View>
          <View className='components-page__body-example example'>
            <View className='example-header'>
              <Text>表单组件在Label外</Text>
            </View>
            <View className='example-body'>
              <RadioGroup>
                <Radio value='GuangZhou' id='gz'>GuangZhou</Radio>
                <Radio value='ShenZhen' id='sz'>ShenZhen</Radio>
              </RadioGroup>
            </View>

            <Label className='example-body__label' for='gz'>
              广州
            </Label>
            <Label className='example-body__label' for='sz'>
              深圳
            </Label>
          </View>
        </View>
      </View>
    )
  }
}
