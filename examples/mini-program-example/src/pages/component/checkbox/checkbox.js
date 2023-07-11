import './checkbox.scss'
import React from 'react'

import { View, Text, Checkbox, Label, CheckboxGroup } from '@tarojs/components'

import Header from '../../../components/head/head'
import ComponentState from '../../../components/component_state/component_state'

export default class PageCheckbox extends React.Component {
  state = {
    selectValues: ['中国', '法国'],
    list: [
      {
        value: '美国',
        text: '美国',
        checked: false
      },
      {
        value: '中国',
        text: '中国',
        checked: true
      },
      {
        value: '巴西',
        text: '巴西',
        checked: false
      },
      {
        value: '日本',
        text: '日本',
        checked: false
      },
      {
        value: '英国',
        text: '英国',
        checked: false
      },
      {
        value: '法国',
        text: '法国',
        checked: true
      }
    ]
  }

  checkboxChange = e => {
    const list = this.state.list.map(item => {
      item.checked = e.detail.value.indexOf(item.value) >= 0
      return item
    })
    this.setState({
      list,
      selectValues: e.detail.value
    })
  }

  render() {
    return (
      <View className='components-page'>
        <View className='components-page__header'>
          <Header title='Checkbox'></Header>
           <ComponentState platform='H5' rate='100'> </ComponentState>
        </View>
        <View className='components-page__body'>
          <View className='components-page__body-example example'>
            <View className='example-header'>
              <Text>默认样式</Text>
            </View>
            <View className='example-body'>
              <Checkbox value='选中' checked>
                选中
              </Checkbox>
              <Checkbox style='margin-left: 20px' value='未选中'>
                未选中
              </Checkbox>
            </View>
          </View>
          <View className='components-page__body-example example'>
            <View className='example-header'>
              <Text>推荐展示样式</Text>
            </View>
            <View className='example-body'>
              <View className='select-box'>
                当前选择: {this.state.selectValues.join(',')}
              </View>
              <View>
                <View className='checkbox-list'>
                  <CheckboxGroup name='checkbox' onChange={this.checkboxChange}>
                    {this.state.list.map(item => {
                      return (
                        <Label
                          className='checkbox-list__label'
                          key={item.value}>
                          <Checkbox
                            className='checkbox-list__checkbox'
                            value={item.value}
                            checked={item.checked}>
                            {item.text}
                          </Checkbox>
                        </Label>
                      )
                    })}
                  </CheckboxGroup>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
