import { View, Text, Input } from '@tarojs/components'
import React from 'react'

import Header from '../../../components/head/head'

import './input.scss'
import ComponentState from "../../../components/component_state/component_state";

export default class PageInput extends React.Component {
  state = {
    value: ''
  }

  onInput = e => {
    this.setState({
      value: e.detail.value
    })
  }

  render() {
    return (
      <View className='components-page'>
        <View className='components-page__header'>
          <Header title='Input'></Header>
           <ComponentState platform='H5' rate='100'> </ComponentState>
        </View>
        <View className='components-page__body'>
          <View className='components-page__body-example example'>
            <View className='example-header'>
              <Text>可以自动聚焦的input</Text>
            </View>
            <View className='example-body'>
              <Input type='text' placeholder={'将会获取焦点'} focus ></Input>
            </View>
          </View>
          <View className='components-page__body-example example'>
            <View className='example-header'>
              <Text>控制最大输入长度的input</Text>
            </View>
            <View className='example-body'>
              <Input
                type='text'
                placeholder={'最大输入长度为10'}
                maxlength='10' ></Input>
            </View>
          </View>
          <View className='components-page__body-example example'>
            <View className='example-header'>
              <Text>实时获取输入值:{this.state.value}</Text>
            </View>
            <View className='example-body'>
              <Input
                type='text'
                placeholder={'输入同步到view中'}
                value={this.state.value}
                onInput={this.onInput} ></Input>
            </View>
          </View>
          <View className='components-page__body-example example'>
            <View className='example-header'>
              <Text>数字输入的input</Text>
            </View>
            <View className='example-body'>
              <Input type='number' placeholder={'这是一个数字输入框'} ></Input>
            </View>
          </View>
          <View className='components-page__body-example example'>
            <View className='example-header'>
              <Text>密码输入的input</Text>
            </View>
            <View className='example-body'>
              <Input
                type='password'
                password
                placeholder={'这是一个密码输入框'} ></Input>
            </View>
          </View>
          <View className='components-page__body-example example'>
            <View className='example-header'>
              <Text>身份证输入的input</Text>
            </View>
            <View className='example-body'>
              <Input type='idcard' placeholder={'身份证输入键盘'} ></Input>
            </View>
          </View>
          <View className='components-page__body-example example'>
            <View className='example-header'>
              <Text>控制占位符颜色的input</Text>
            </View>
            <View className='example-body'>
              <Input
                type='text'
                placeholder={'占位符字体是红色的'}
                placeholderStyle='color:red' ></Input>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
