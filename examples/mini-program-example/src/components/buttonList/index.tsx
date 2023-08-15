import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Textarea } from '@tarojs/components'
import CallbackContents from '@/components/callbackContents'
import './index.scss'

/**
 * 按钮列表
 * @returns
 */

interface Props {
  buttonList: any
}

interface States {
  inputData: Array<Object | String | undefined>
}

export default class Index extends React.Component<Props, States> {
  state = {
    inputData: [],
  }
  componentDidMount(): void {
    const buttonList = this.props.buttonList
    const inputData: Array<Object> = []
    buttonList.forEach((item) => {
      if (item['inputData']) {
        inputData.push(item.inputData)
      } else {
        inputData.push(undefined)
      }
    })
    this.setState({
      inputData,
    })
  }
  changeData = (e, apiIndex) => {
    const { inputData } = this.state
    try {
      inputData[apiIndex] = JSON.parse(e.detail.value)
    } catch (err) {
      inputData[apiIndex] = e.detail.value
    }
    this.setState({
      inputData,
    })
  }
  submitData = (data, apiItem, apiIndex) => {
    if (apiItem.func != null) {
      if (typeof data == 'string') {
        Taro.showToast({
          icon: 'error',
          title: '请检查参数格式',
        })
      } else if (data == undefined) {
        apiItem.func(apiIndex)
      } else {
        apiItem.func(apiIndex, data)
      }
    }
  }
  render() {
    const { buttonList } = this.props
    const { inputData } = this.state
    return (
      <View className='button-list'>
        {buttonList.map((item, apiIndex) => {
          return (
            <View className='api-page-btn-area' key={item.id}>
              {inputData[apiIndex] != undefined ? (
                <Textarea
                  className='api-input-area'
                  id={`${item.id}-input`}
                  value={
                    typeof inputData[apiIndex] == 'string'
                      ? inputData[apiIndex]
                      : JSON.stringify(inputData[apiIndex], null, 2)
                  }
                  onInput={(e) => {
                    this.changeData(e, apiIndex)
                  }}
                />
              ) : (
                ''
              )}
              <View
                className='api-page-btn'
                id={item.id}
                onClick={() => {
                  this.submitData(inputData[apiIndex], item, apiIndex)
                }}
              >
                {item.id}
                {item.func == null && <Text className='navigator-state tag'>未创建Demo</Text>}
                {item.callbackRes != null ? <CallbackContents testApi={item.id} callbackRes={item.callbackRes} /> : ''}
              </View>
            </View>
          )
        })}
      </View>
    )
  }
}
