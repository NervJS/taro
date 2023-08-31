import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Editor } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'
import { TestConsole } from '@/util/util'

/**
 * 设备-电池
 * @returns
 */
let inputText = {
  placeholder: '请输入文本...',
}
let editorContext
export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'EditorContext',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext')
          Taro.createSelectorQuery()
            .select('#editor')
            .context((res) => {
              editorContext = res.context
              TestConsole.consoleNormal('success-----', editorContext)
            })
            .exec()
        },
      },
      {
        id: 'clear',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_clear')
          editorContext.clear({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'format_left',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_format_left')
          editorContext.format('align', 'left')
          TestConsole.consoleNormal('editorContext.format success ')
        },
      },
      {
        id: 'format_right',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_format_right')
          editorContext.format('align', 'right')
          TestConsole.consoleNormal('editorContext.format success ')
        },
      },
      {
        id: 'getContents',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_getContents')
          editorContext.getContents({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'insertDivider',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_insertDivider')
          editorContext.insertDivider({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'insertImage',
        inputData: {
          src: 'https://user-images.githubusercontent.com/3369400/133268513-5bfe2f93-4402-42c9-a403-81c9e86934b6.jpeg',
          nowrap: false,
          alt: 'hello,beautiful world',
          data: '',
          extClass: 'test_image',
          height: '100',
          width: '100',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('EditorContext_insertImage')
          editorContext.insertImage({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'insertText',
        inputData: {
          text: 'developer conference',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('EditorContext_insertText')
          editorContext.insertText({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'redo',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_redo')
          editorContext.redo({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'removeFormat',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_removeFormat')
          editorContext.removeFormat({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'scrollIntoView',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_scrollIntoView')
          editorContext.scrollIntoView()
          TestConsole.consoleNormal('editorContext.scrollIntoView success ')
        },
      },
      {
        id: 'setContents',
        inputData: {
          delta: '',
          html: 'test_html',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('EditorContext_setContents')
          editorContext.setContents({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'undo',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_undo')
          editorContext.undo({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'getSelectionText',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_getSelectionText')
          editorContext.getSelectionText({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'blur',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_blur')
          editorContext.blur({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
    ],
  }
  render() {
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
        <Editor id='editor' className='editor' placeholder={inputText.placeholder}></Editor>
      </View>
    )
  }
}
