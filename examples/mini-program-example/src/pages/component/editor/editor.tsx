import './editor.scss'

import Taro, { EditorContext } from '@tarojs/taro'
import React, { useState } from 'react'
import { View, Editor, Button } from '@tarojs/components'

import Header from '../../../components/head/head'
import ComponentState from '../../../components/component_state/component_state'

export default function PageView () {
  let [editorContext, setEditorContext] = useState<EditorContext>()

  return (
    <View className='components-page'>
      <View className='components-page__header'>
        <Header title='Editor'></Header>
        <ComponentState platform='H5' rate='100'> </ComponentState>
      </View>
      <View className='index'>

        <View>
          <h5>EditorContext API</h5>
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            alignContent: 'center',
            gap: 5,
            margin: 5,
          }}>
            <Button onClick={() => {
              editorContext?.getContents({
                fail: (error) => {
                  alert(`fail: ${error}`)
                },
                success: (value) => {
                  let result = {
                    text: value.text,
                    html: value.html
                  }
                  alert(`success:\n ${JSON.stringify(result, null, 2)}`)
                },
              })
            }}> 获取内容 </Button>
            <Button onClick={() => {
              editorContext?.getSelectionText({
                fail: (error) => {
                  alert(`fail: ${error}`)
                },
                success: (value) => {
                  let result = {
                    text: value.text
                  }
                  alert(`success:\n ${JSON.stringify(result, null, 2)}`)
                },
              })
            }}> 获取选中内容 </Button>
            <Button onClick={() => {
              editorContext?.redo({
                fail: (error) => {
                  alert(`fail: ${error}`)
                },
                success: (value) => {
                  alert(`success:\n ${JSON.stringify(value, null, 2)}`)
                },
              })
            }}> 重做(Redo) </Button>
            <Button onClick={() => {
              editorContext?.undo({
                fail: (error) => {
                  alert(`fail: ${error}`)
                },
                success: (value) => {
                  alert(`success:\n ${JSON.stringify(value, null, 2)}`)
                },
              })
            }}> 撤销(Undo) </Button>
            <Button onClick={() => {
              editorContext?.insertText({
                text: '(这是被插入的文本)',
                fail: (error) => {
                  alert(`fail: ${error}`)
                },
                success: (value) => {
                  alert(`success:\n ${JSON.stringify(value, null, 2)}`)
                },
              })
            }}> 插入文本 </Button>
            <Button onClick={() => {
              editorContext?.insertImage({
                src: 'https://img.58cdn.com.cn/logo/58/252_84/logo-o.png',
                alt: '58同城logo',
                width: '252',
                height: '84',
                nowrap: false,
                data: {
                  version: '2',
                  time: new Date().getTime()
                },
                fail: (error) => {
                  alert(`fail: ${error}`)
                },
                success: (value) => {
                  alert(`success:\n ${JSON.stringify(value, null, 2)}`)
                },
              })
            }}> 插入图片 </Button>
            <Button onClick={() => {
              editorContext?.setContents({
                html: '(这是设置的文案)',
                fail: (error) => {
                  alert(`fail: ${error}`)
                },
                success: (value) => {
                  alert(`success:\n ${JSON.stringify(value, null, 2)}`)
                },
              })
            }}> 设置文本 </Button>
            <Button onClick={() => {
              editorContext?.removeFormat({
                fail: (error) => {
                  alert(`fail: ${error}`)
                },
                success: (value) => {
                  alert(`success:\n ${JSON.stringify(value, null, 2)}`)
                },
              })
            }}> 移除格式 </Button>
            <Button onClick={() => {
              editorContext?.scrollIntoView()
            }}> 光标滚动内容 </Button>
          </View>

        </View>

        <h5 style={{ marginTop: 20 }}>Editor</h5>
        <Editor
          id='editor'
          placeholder='请输入文本'
          style={{
            height: 300
          }}
          onReady={() => {
            console.log(`Editor.onReady...`)

            Taro.createSelectorQuery().select('#editor').context((res) => {
              console.log(`Editor.onReady, context=${res.context}`)
              setEditorContext(res.context as EditorContext)

            }).exec()
          }}
          onInput={(event) => {
            console.log(`Editor.onInput, ${event.detail.text}`)
          }}
          onFocus={(event) => {
            console.log(`Editor.onFocus, ${event.detail.text}`)
          }}
          onBlur={(event) => {
            console.log(`Editor.onBlur, ${event.detail.text}`)
          }}
          onStatusChange={(event) => {
            console.log(`Editor.onStatusChange, ${event.detail.text}`)
          }}
        />
      </View>
    </View>
  )
}
