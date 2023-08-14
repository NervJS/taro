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
        id: 'EditorContext_blur_暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_blur')
          editorContext
            .blur({
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
            .then((res) => {
              TestConsole.consoleReturn.call(this, res, apiIndex)
            })
        },
      },
      {
        id: 'EditorContext_clear',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_clear')
          editorContext
            .clear({
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
            .then((res) => {
              TestConsole.consoleReturn.call(this, res, apiIndex)
            })
        },
      },
      {
        id: 'EditorContext_format_left',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_format_left')
          editorContext.format('align', 'left')
          TestConsole.consoleNormal('editorContext.format success ')
        },
      },
      {
        id: 'EditorContext_format_right',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_format_right')
          editorContext.format('align', 'right')
          TestConsole.consoleNormal('editorContext.format success ')
        },
      },
      {
        id: 'EditorContext_getContents',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_getContents')
          editorContext
            .getContents({
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
            .then((res) => {
              TestConsole.consoleReturn.call(this, res, apiIndex)
            })
        },
      },
      {
        id: 'EditorContext_insertDivider_暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_insertDivider')
          editorContext
            .insertDivider({
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
            .then((res) => {
              TestConsole.consoleReturn.call(this, res, apiIndex)
            })
        },
      },
      {
        id: 'EditorContext_insertImage',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_insertImage')
          editorContext
            .insertImage({
              src: '',
              nowrap: true,
              alt: 'hello,beautiful world',
              data: '',
              extClass: 'test_image',
              height: '100',
              width: '100',
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
            .then((res) => {
              TestConsole.consoleReturn.call(this, res, apiIndex)
            })
        },
      },
      {
        id: 'EditorContext_insertText',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_insertText')
          editorContext
            .insertText({
              text: 'developer conference',
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
            .then((res) => {
              TestConsole.consoleReturn.call(this, res, apiIndex)
            })
        },
      },
      {
        id: 'EditorContext_redo',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_redo')
          editorContext
            .redo({
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
            .then((res) => {
              TestConsole.consoleReturn.call(this, res, apiIndex)
            })
        },
      },
      {
        id: 'EditorContext_removeFormat',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_removeFormat')
          editorContext
            .removeFormat({
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
            .then((res) => {
              TestConsole.consoleReturn.call(this, res, apiIndex)
            })
        },
      },
      {
        id: 'EditorContext_scrollIntoView',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_scrollIntoView')
          editorContext.scrollIntoView()
          TestConsole.consoleNormal('editorContext.scrollIntoView success ')
        },
      },
      {
        id: 'EditorContext_setContents',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_setContents')
          editorContext
            .setContents({
              delta: 'test_contents',
              html: 'test_html',
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
            .then((res) => {
              TestConsole.consoleReturn.call(this, res, apiIndex)
            })
        },
      },
      {
        id: 'EditorContext_undo',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_undo')
          editorContext
            .undo({
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
            .then((res) => {
              TestConsole.consoleReturn.call(this, res, apiIndex)
            })
        },
      },
      {
        id: 'EditorContext_getSelectionText',
        func: (apiIndex) => {
          TestConsole.consoleTest('EditorContext_getSelectionText')
          editorContext
            .getSelectionText({
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
            .then((res) => {
              TestConsole.consoleReturn.call(this, res, apiIndex)
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
