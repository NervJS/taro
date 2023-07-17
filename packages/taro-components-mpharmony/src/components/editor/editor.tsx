/* eslint-disable */

import { BaseEventOrig } from '@tarojs/components/dist/types/common'
import { EditorProps } from '@tarojs/components/dist/types/Editor'
import React from "react";

// @ts-ignore
import { Editor as TinyMceEditor, EditorEvent as TinyMceEditorEvent } from "tinymce"

import { Editor as TinyMceReactEditor } from '@tinymce/tinymce-react';

/* Import TinyMCE */
// 6.5.1
// @ts-ignore
import 'tinymce/tinymce';

/* Default icons are required. After that, import custom icons if applicable */
import 'tinymce/icons/default';

/* Required TinyMCE components */
import 'tinymce/themes/silver';
import 'tinymce/models/dom';

// Theme
import 'tinymce/themes/silver/theme'

// Skins
// import 'tinymce/skins/ui/oxide/skin.css'
/* content UI CSS is required */
// import contentUiSkinCss from 'tinymce/skins/ui/oxide/content.css';
/* The default content CSS can be changed or replaced with appropriate CSS for the editor content. */
// import contentCss from 'tinymce/skins/content/default/content.css';

import { contentCss, contentUiSkinCss, skinCss } from './tinymce-css'

import './langs/zh_CN'

// Plugins
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/link'
import 'tinymce/plugins/image'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/code'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/wordcount'

/* eslint-enable */

// dynamic inject tinymce skin.css
(function () {
  const head = document.head
  const style = document.createElement('style')
  style.setAttribute('type', 'text/css')
  style.innerText = skinCss.toString()
  head.appendChild(style)
})()

export const Editor: React.FC<EditorProps> = (props) => {

  const generateEditorEventOrig = (
    name: string,
    editor: TinyMceEditor,
    event?: TinyMceEditorEvent<any>
  ): BaseEventOrig<EditorProps.editorEventDetail> => {

    return {
      type: name,
      timeStamp: event?.timeStamp || new Date().getTime(),
      target: editor.targetElm,
      currentTarget: editor.targetElm,
      preventDefault: () => event?.preventDefault(),
      stopPropagation: () => event?.stopPropagation(),
      detail: {
        html: editor.getContent({ format: 'html' }),
        text: editor.getContent({ format: 'text' }),
        delta: editor.getContent({ format: 'tree' })
      }
    }
  }

  const handleEditorChange = (_content: string, editor: TinyMceEditor) => {
    props.onInput?.(generateEditorEventOrig('oninput', editor))
  }

  return <>
    {/* @ts-ignore */}
    <TinyMceReactEditor
      id={props.id}
      tagName='taro-editor-core'
      textareaName='taro-editor-core'
      init={{
        readonly: props.readOnly,
        placeholder: props.placeholder,
        width: '100%',
        min_height: 300,
        branding: false,
        menubar: false,
        statusbar: false,
        language: 'zh_CN',
        // skin_url: '../../style/components/editor/skin.css',
        // content_css: [
        //   '../../style/components/editor/ui-content.css',
        //   '../../style/components/editor/content.css'
        // ],
        // content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
        skin: false,
        content_css: false,
        content_style: contentUiSkinCss.toString() + '\n' + contentCss.toString(),
        // formats: {
        //   alignleft: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'left' },
        //   aligncenter: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'center' },
        //   alignright: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'right' },
        //   alignjustify: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'full' },
        //   bold: { inline: 'span', 'classes': 'bold', styles: { 'font-weight': 'bold' } },
        //   italic: { inline: 'span', 'classes': 'italic', styles: { 'font-weight': 'italic' } },
        //   underline: { inline: 'span', styles: { 'text-decoration': 'underline' }, exact: true },
        //   strikethrough: { inline: 'span', styles: { 'text-decoration': 'line-through' }, exact: true },
        //   forecolor: { inline: 'span', classes: 'forecolor', styles: { color: '%value' } },
        //   hilitecolor: { inline: 'span', classes: 'hilitecolor', styles: { backgroundColor: '%value' } },
        // },
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'autoresize', 'autosave', 'wordcount',
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic underline forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | image | table',
      }}
      onEditorChange={handleEditorChange}
      onInit={(_evt, editor) => {
        props.onReady?.(generateEditorEventOrig('onready', editor, _evt))
      }}
      onFocus={(_evt, editor) => {
        props.onFocus?.(generateEditorEventOrig('onfocus', editor, _evt))
      }}
      onBlur={(_evt, editor) => {
        props.onBlur?.(generateEditorEventOrig('onblur', editor, _evt))
      }}
      // onChange={(_evt, editor) => {
      // props.onInput?.(generateEditorEventOrig('oninput', _evt, editor))
      // }}
      onSelectionChange={(_evt, editor) => {
        props.onStatusChange?.(generateEditorEventOrig('onstatuschange', editor, _evt))
      }}
    />
  </>


}
