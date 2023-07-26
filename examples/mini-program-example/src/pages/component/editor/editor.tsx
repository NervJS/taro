import './editor.scss'

import Taro, { EditorContext } from '@tarojs/taro'
import React, { useState } from 'react'
import { View, Editor, Button } from '@tarojs/components'

import Header from '../../../components/head/head'
import ComponentState from '../../../components/component_state/component_state'
import { wrap } from 'module'

interface FormatApi {
  name: string;
  value: string | undefined;
  title: string | undefined;
}

interface FormatApiSection {
  sectionName: string;
  formats: FormatApi[];
}

const formatApiSections: FormatApiSection[] = [
  {
    sectionName: "FontStyle",
    formats: [
      {
        name: "bold",
        value: undefined,
        title: 'bold',
      }, {
        name: "italic",
        value: undefined,
        title: 'italic',
      }, {
        name: 'underline',
        value: undefined,
        title: 'underline',
      }, {
        name: 'strike',
        value: undefined,
        title: 'strike',
      }, {
        name: 'ins',
        value: undefined,
        title: 'ins(不支持)',
      }
    ]
  },
  {
    sectionName: "Script",
    formats: [
      {
        name: "script",
        value: "sub",
        title: 'script sub',
      },
      {
        name: "script",
        value: "super",
        title: 'script super',
      }
    ]
  },
  {
    sectionName: "Header",
    formats: [
      {
        name: "header",
        value: "1",
        title: 'H1',
      },
      {
        name: "header",
        value: "2",
        title: 'H2',
      },
      {
        name: "header",
        value: "3",
        title: 'H3',
      },
      {
        name: "header",
        value: "4",
        title: 'H4',
      },
      {
        name: "header",
        value: "5",
        title: 'H5',
      },
      {
        name: "header",
        value: "6",
        title: 'H6',
      },
    ]
  },
  {
    sectionName: "Align",
    formats: [
      {
        name: "align",
        value: "left",
        title: 'alignLeft'
      },
      {
        name: "align",
        value: "center",
        title: 'alignCenter'
      },
      {
        name: "align",
        value: "right",
        title: 'alignRight'
      },
      {
        name: "align",
        value: "justify",
        title: 'alignJustify'
      },
    ]
  },
  {
    sectionName: "Direction",
    formats: [
      {
        name: "direction",
        value: 'rtl',
        title: 'rtl'
      },
      {
        name: "direction",
        value: 'ltr',
        title: 'ltr'
      },
    ]
  },
  {
    sectionName: "Indent",
    formats: [
      {
        name: "indent",
        value: "1",
        title: '>>'
      },
      {
        name: "indent",
        value: "-1",
        title: '<<'
      },
    ]
  },
  {
    sectionName: "List",
    formats: [
      {
        name: "list",
        value: "ordered",
        title: 'list ordered'
      },
      {
        name: "list",
        value: "bullet",
        title: 'list bullet'
      },
      {
        name: "list",
        value: "check",
        title: 'list check(不支持)'
      },
    ]
  },
  {
    sectionName: "Color",
    formats: [
      {
        name: "color",
        value: "#ff0000",
        title: 'color'
      },
      {
        name: "backgroundColor",
        value: "#00ff00",
        title: 'backgroundColor'
      }
    ]
  },
  {
    sectionName: "Margin",
    formats: [
      {
        name: "margin",
        value: "20px 20px 20px 20px",
        title: 'margin'
      },
      {
        name: "marginLeft",
        value: "10px",
        title: 'marginLeft'
      },
      {
        name: "marginTop",
        value: "10px",
        title: 'marginTop'
      },
      {
        name: "marginRight",
        value: "10px",
        title: 'marginRight'
      },
      {
        name: "marginBottom",
        value: "10px",
        title: 'marginBottom'
      },
    ]
  },
  {
    sectionName: "Padding",
    formats: [
      {
        name: 'padding',
        value: '20px 20px 20px 20px',
        title: 'padding'
      },
      {
        name: 'paddingLeft',
        value: '10px',
        title: 'paddingLeft'
      },
      {
        name: 'paddingTop',
        value: '10px',
        title: 'paddingTop'
      },
      {
        name: 'paddingRight',
        value: '10px',
        title: 'paddingRight'
      },
      {
        name: 'paddingBottom',
        value: '10px',
        title: 'paddingBottom'
      },
    ]
  },
  {
    sectionName: "Font",
    formats: [
      {
        name: "font",
        value: '1.2em "Fira Sans", sans-serif',
        title: 'font',
      },
      {
        name: "fontSize",
        value: "1.5em",
        title: 'fontSize',
      },
      {
        name: "fontStyle",
        value: 'oblique 40deg',
        title: 'fontStyle',
      },
      {
        name: "fontVariant",
        value: 'common-ligatures small-caps',
        title: 'fontVariant',
      },
      {
        name: "fontWeight",
        value: "bolder",
        title: 'fontWeight',
      },
      {
        name: 'fontFamily',
        value: 'Georgia, serif',
        title: 'fontFamily',
      }
    ]
  },
  {
    sectionName: "TextLayout",
    formats: [
      {
        name: "lineHeight",
        value: "3.5em",
        title: 'lineHeight',
      },
      {
        name: "letterSpacing",
        value: '2em',
        title: 'letterSpacing',
      }, {
        name: 'textDecoration',
        value: 'underline dotted red',
        title: 'textDecoration',
      }, {
        name: 'textIndent',
        value: '2em',
        title: 'textIndent',
      }, {
        name: 'wordWrap',
        value: 'break-word',
        title: 'wordWrap',
      }, {
        name: 'wordBreak',
        value: 'keep-all',
        title: 'wordBreak',
      }, {
        name: 'whiteSpace',
        value: 'pre-line',
        title: 'whiteSpace',
      }
    ]
  },
]

export default function PageView () {
  let [editorContext, setEditorContext] = useState<EditorContext>()
  let [editorContent, setEditorContent] = useState<string>()

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
            flexWrap: 'wrap',
          }}>
            <button onClick={() => {
              editorContext?.getContents({
                fail: (error) => {
                  setEditorContent(`getContents fail: ${error}`)
                },
                success: (value) => {
                  let result = {
                    text: value.text,
                    html: value.html
                  }
                  setEditorContent(`getContents success:\n ${JSON.stringify(result, null, 2)}`)
                },
              })
            }}> 获取内容 </button>
            <button onClick={() => {
              editorContext?.getSelectionText({
                fail: (error) => {
                  setEditorContent(`getSelectionText fail: ${error}`)
                },
                success: (value) => {
                  let result = {
                    text: value.text
                  }
                  setEditorContent(`getSelectionText success:\n ${JSON.stringify(result, null, 2)}`)
                },
              })
            }}> 获取选中内容 </button>
            <button onClick={() => {
              editorContext?.redo({
                fail: (error) => {
                  setEditorContent(`redo fail: ${error}`)
                },
                success: (value) => {
                  setEditorContent(`redo success:\n ${JSON.stringify(value, null, 2)}`)
                },
              })
            }}> 重做 </button>
            <button onClick={() => {
              editorContext?.undo({
                fail: (error) => {
                  setEditorContent(`undo fail: ${error}`)
                },
                success: (value) => {
                  setEditorContent(`undo success:\n ${JSON.stringify(value, null, 2)}`)
                },
              })
            }}> 撤销 </button>
            <button onClick={() => {
              editorContext?.insertText({
                text: '(这是被插入的文本)',
                fail: (error) => {
                  setEditorContent(`insertText fail: ${error}`)
                },
                success: (value) => {
                  setEditorContent(`insertText success:\n ${JSON.stringify(value, null, 2)}`)
                },
              })
            }}> 插入文本 </button>
            <button onClick={() => {
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
                  setEditorContent(`insertImage fail: ${error}`)
                },
                success: (value) => {
                  setEditorContent(`insertImage success:\n ${JSON.stringify(value, null, 2)}`)
                },
              })
            }}> 插入图片 </button>
            <button onClick={() => {
              editorContext?.setContents({
                html: '(这是设置的文案)',
                fail: (error) => {
                  setEditorContent(`setContents fail: ${error}`)
                },
                success: (value) => {
                  setEditorContent(`setContents success:\n ${JSON.stringify(value, null, 2)}`)
                },
              })
            }}> 设置文本 </button>
            <button onClick={() => {
              editorContext?.removeFormat({
                fail: (error) => {
                  setEditorContent(`removeFormat fail: ${error}`)
                },
                success: (value) => {
                  setEditorContent(`removeFormat success:\n ${JSON.stringify(value, null, 2)}`)
                },
              })
            }}> 移除格式 </button>
            <button onClick={() => {
              editorContext?.scrollIntoView()
            }}> 光标滚动内容 </button>
          </View>
          <textarea style={{ width: '100%', height: 100}} disabled value={editorContent}/>
        </View>

        <View>
          <h5>EditorContext format API</h5>
          <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 5,
                  marginLeft: 5,
                  marginRight: 5,
                  marginTop: 5,
                  flex: 1,
                  flexWrap: 'wrap',
                }}>

              {
                formatApiSections.map(item => {
                  return <select
                      key={item.sectionName}
                      onChange={(e) => {
                        let idx = Number(e.target.value)
                        if (idx >= 0) {
                          let format = item.formats[idx];
                          editorContext?.format(format.name, format.value)
                        }
                      }}
                  >
                      <option value={-1}>{item.sectionName}</option>
                      {
                        item.formats.map((format, idx) => {
                          return <option key={idx} value={idx}>{format.title}</option>
                        })
                      }

                  </select>
                })
              }

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
            setEditorContent(`Editor.onReady...`)

            Taro.createSelectorQuery().select('#editor').context((res) => {
              setEditorContent(`Editor.onReady, context=${res.context}`)
              setEditorContext(res.context as EditorContext)
            }).exec()
          }}
          onInput={(event) => {
            setEditorContent(`Editor.onInput, ${event.timeStamp}  ${event.detail.text}`)
          }}
          onFocus={(event) => {
            setEditorContent(`Editor.onFocus, ${event.timeStamp} ${event.detail.text}`)
          }}
          onBlur={(event) => {
            setEditorContent(`Editor.onBlur,  ${event.timeStamp} ${event.detail.text}`)
          }}
          onStatusChange={(event) => {
            setEditorContent(`Editor.onStatusChange,  ${event.timeStamp} ${event.detail.text}`)
          }}
        />
      </View>
    </View>
  )
}
