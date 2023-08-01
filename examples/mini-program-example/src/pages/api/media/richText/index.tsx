import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Editor } from '@tarojs/components'
import './index.scss'

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
        func: () => {
          Taro.createSelectorQuery()
            .select('#editor')
            .context((res) => {
              editorContext = res.context
              console.log('success-----', editorContext)
            })
            .exec()
        },
      },
      {
        id: 'EditorContext_blur_暂不支持',
        func: () => {
          editorContext.blur({
            success: (res) => {
              console.log('editorContext.blur success ', res)
            },
            fail: (res) => {
              console.log('editorContext.blur fail ', res)
            },
            complete: (res) => {
              console.log('editorContext.blur complete ', res)
            },
          })
        },
      },
      {
        id: 'EditorContext_clear',
        func: () => {
          editorContext.clear({
            success: (res) => {
              console.log('editorContext.clear success ', res)
            },
            fail: (res) => {
              console.log('editorContext.clear fail ', res)
            },
            complete: (res) => {
              console.log('editorContext.clear complete ', res)
            },
          })
        },
      },
      {
        id: 'EditorContext_format_left',
        func: () => {
          editorContext.format('align', 'left')
          console.log('editorContext.format success ')
        },
      },
      {
        id: 'EditorContext_format_right',
        func: () => {
          editorContext.format('align', 'right')
          console.log('editorContext.format success ')
        },
      },
      {
        id: 'EditorContext_getContents',
        func: () => {
          editorContext.getContents({
            success: (res) => {
              console.log('editorContext.getContents success ', res)
            },
            fail: (res) => {
              console.log('editorContext.getContents fail ', res)
            },
            complete: (res) => {
              console.log('editorContext.getContents complete ', res)
            },
          })
        },
      },
      {
        id: 'EditorContext_insertDivider_暂不支持',
        func: () => {
          editorContext.insertDivider({
            success: (res) => {
              console.log('editorContext.insertDivider success ', res)
            },
            fail: (res) => {
              console.log('editorContext.insertDivider fail ', res)
            },
            complete: (res) => {
              console.log('editorContext.insertDivider complete ', res)
            },
          })
        },
      },
      {
        id: 'EditorContext_insertImage',
        func: () => {
          editorContext.insertImage({
            src: '',
            nowrap: true,
            alt: 'hello,beautiful world',
            data: '',
            extClass: 'test_image',
            height: '100',
            width: '100',
            success: (res) => {
              console.log('editorContext.insertImage success ', res)
            },
            fail: (res) => {
              console.log('editorContext.insertImage fail ', res)
            },
            complete: (res) => {
              console.log('editorContext.insertImage complete ', res)
            },
          })
        },
      },
      {
        id: 'EditorContext_insertText',
        func: () => {
          editorContext.insertText({
            text: 'developer conference',
            success: (res) => {
              console.log('editorContext.insertText success ', res)
            },
            fail: (res) => {
              console.log('editorContext.insertText fail ', res)
            },
            complete: (res) => {
              console.log('editorContext.insertText complete ', res)
            },
          })
        },
      },
      {
        id: 'EditorContext_redo',
        func: () => {
          editorContext.redo({
            success: (res) => {
              console.log('editorContext.redo success ', res)
            },
            fail: (res) => {
              console.log('editorContext.redo fail ', res)
            },
            complete: (res) => {
              console.log('editorContext.redo complete ', res)
            },
          })
        },
      },
      {
        id: 'EditorContext_removeFormat',
        func: () => {
          editorContext.removeFormat({
            success: (res) => {
              console.log('editorContext.removeFormat success ', res)
            },
            fail: (res) => {
              console.log('editorContext.removeFormat fail ', res)
            },
            complete: (res) => {
              console.log('editorContext.removeFormat complete ', res)
            },
          })
        },
      },
      {
        id: 'EditorContext_scrollIntoView',
        func: () => {
          editorContext.scrollIntoView()
          console.log('editorContext.scrollIntoView success ')
        },
      },
      {
        id: 'EditorContext_setContents',
        func: () => {
          editorContext.setContents({
            delta: 'test_contents',
            html: 'test_html',
            success: (res) => {
              console.log('editorContext.setContents success ', res)
            },
            fail: (res) => {
              console.log('editorContext.setContents fail ', res)
            },
            complete: (res) => {
              console.log('editorContext.setContents complete ', res)
            },
          })
        },
      },
      {
        id: 'EditorContext_undo',
        func: () => {
          editorContext.undo({
            success: (res) => {
              console.log('editorContext.undo success ', res)
            },
            fail: (res) => {
              console.log('editorContext.undo fail ', res)
            },
            complete: (res) => {
              console.log('editorContext.undo complete ', res)
            },
          })
        },
      },
      {
        id: 'EditorContext_getSelectionText',
        func: () => {
          editorContext.getSelectionText({
            success: (res) => {
              console.log('editorContext.getSelectionText success ', res)
            },
            fail: (res) => {
              console.log('editorContext.getSelectionText fail ', res)
            },
            complete: (res) => {
              console.log('editorContext.getSelectionText complete ', res)
            },
          })
        },
      },
    ],
  }
  render() {
    return (
      <View className='api-page'>
        {this.state.list.map((item) => {
          return (
            <View key={item.id} className='api-page-btn' onClick={item.func == null ? () => {} : item.func}>
              {item.id}
              {item.func == null && <Text className='navigator-state tag'>未创建Demo</Text>}
            </View>
          )
        })}
        <Editor id='editor' className='editor' placeholder={inputText.placeholder}></Editor>
      </View>
    )
  }
}
