import './textarea.scss'

import React from 'react'
import { View, Text, Textarea, Button } from '@tarojs/components'

import Header from '../../../components/head/head'
import ComponentState from "../../../components/component_state/component_state";

export default class PageTextarea extends React.Component {
  state = {
    value: '初始值',
  }

  handleClick = () => {
    this.setState({
      value: '点击了按钮',
    })
  }

  blur = () => {
    console.log('blur');

  }

  focus = () => {
    console.log('focus')
  }

  input = (e) => {
    console.log(e);
    this.setState({
      value: e.target.value
    })
  }

  render() {
    return (
      <View className='components-page'>
        <View className='components-page__header'>
          <Header title='Textarea'></Header>
           <ComponentState platform='H5' rate='100'> </ComponentState>
        </View>
        <View className='components-page__body'>

          <View className='components-page__body-example example'>
            <View className='example-header'>
              <Text>输入区域高度自适应，不会出现滚动条</Text>
            </View>
            <View className='example-body'>
              <View className='example-body__button'>
                <Button size='mini' type='primary' onClick={this.handleClick}>点击设置值到第一个Textarea</Button>
              </View>
              <Textarea onFocus={this.focus} onBlur={this.blur} value={this.state.value} placeholder='这是一个Textarea' autoHeight onInput={this.input}></Textarea>
            </View>
          </View>

          <View className='components-page__body-example example'>
            <View className='example-header'>
              <Text>这是一个可以自动聚焦的textarea</Text>
            </View>
            <View className='example-body'>
              <Textarea autoFocus placeholder='这是一个Textarea'></Textarea>
            </View>
          </View>

        </View>
      </View>
    )
  }
}
