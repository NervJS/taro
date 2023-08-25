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
  textareaControl: Array<Boolean>
  hiddenNum: Number
}

export default class Index extends React.Component<Props, States> {
  state = {
    inputData: [],
    textareaControl: [],
    hiddenNum: 0,
  }
  componentDidMount(): void {
    const buttonList = this.props.buttonList
    const inputData: Array<Object> = []
    const textareaControl: Array<Boolean> = []
    buttonList.forEach((item) => {
      if (item['inputData']) {
        inputData.push(item.inputData)
      } else {
        inputData.push(undefined)
      }
      textareaControl.push(true)
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
  minusHidden = () => {
    const { hiddenNum } = this.state
    if (hiddenNum > 0) {
      this.setState({
        hiddenNum: hiddenNum - 1,
      })
    } else {
      Taro.showToast({
        title: '无法继续减少',
      })
    }
  }
  addHidden = () => {
    const { hiddenNum } = this.state
    const btnLength = this.props.buttonList.length
    if (hiddenNum < btnLength) {
      this.setState({
        hiddenNum: hiddenNum + 1,
      })
    } else {
      Taro.showToast({
        title: '无法继续增加',
      })
    }
  }
  hideTextarea = (apiIndex: Number) => {
    const { textareaControl } = this.state
    textareaControl[apiIndex] = !textareaControl[apiIndex]
    this.setState({
      textareaControl,
    })
  }
  render() {
    const { buttonList } = this.props
    const { inputData, textareaControl, hiddenNum } = this.state
    return (
      <View className='button-list'>
        <View className='hidden-control'>
          <Text>隐藏按钮</Text>
          <View className='stepper'>
            <View className='normal' onClick={this.minusHidden}>
              -
            </View>
            <View className='stepper-num'>{hiddenNum}</View>
            <View className='normal' onClick={this.addHidden}>
              +
            </View>
          </View>
        </View>
        {buttonList.map((item, apiIndex) => {
          return (
            <View
              className={`api-page-btn-area ${apiIndex < hiddenNum ? 'api-page-btn-area-hidden' : ''}`}
              key={item.id}
            >
              {inputData[apiIndex] != undefined ? (
                <View className='api-textarea-area'>
                  <Textarea
                    className={`api-input-area ${textareaControl[apiIndex] ? 'api-input-area-hidden' : ''}`}
                    maxlength={-1}
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
                  <View
                    className='textarea-control'
                    onClick={() => {
                      this.hideTextarea(apiIndex)
                    }}
                  >
                    {textareaControl[apiIndex] ? '+' : '-'}
                  </View>
                </View>
              ) : (
                ''
              )}
              <View
                className={`api-page-btn ${item.func == null ? 'api-page-btn-uncreate' : ''} ${
                  item.advancedAPI ? 'api-page-btn-advanced' : ''
                }`}
                id={item.id}
                onClick={() => {
                  this.submitData(inputData[apiIndex], item, apiIndex)
                }}
              >
                {item.id}
                {item.callbackRes != null ? <CallbackContents testApi={item.id} callbackRes={item.callbackRes} /> : ''}
              </View>
            </View>
          )
        })}
      </View>
    )
  }
}
