import Taro from '@tarojs/api'

/**
 * EditorContext 实例
 * 
 * @canUse EditorContext
 * @__class 
 * [blur, clear, format, getContents, getSelectionText, insertDivider, insertImage, insertText, redo, removeFormat,\ 
 * scrollIntoView, setContents, undo]
 */
export class EditorContext implements Taro.EditorContext {
  blur (option?: Taro.EditorContext.BlurOption | undefined): void {
    try {
      // 将焦点设置到页面上一个非输入元素（例如按钮）上
      const buttonName = document.getElementById('myButtonTest')
      buttonName?.focus()
      option?.success?.({ errMsg: `ok` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `ok` })
    }
  }

  getContext (): Taro.EditorContext {
    return this as Taro.EditorContext
  }

  activeEditor (): any {
    // @ts-ignore
    return tinymce.activeEditor
  }

  scrollIntoView (): void {
    this.activeEditor()?.selection.scrollIntoView()
  }

  getSelectionText (option?: Taro.EditorContext.getSelectionText.Option | undefined): void {
    try {
      const selection = this.activeEditor()?.selection
      if (selection) {
        const selectionText = selection.getContent({ format: 'text' })
        option?.success?.({ errMsg: 'ok', text: selectionText })
      }
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `ok` })
    }
  }

  clear (option?: Taro.EditorContext.ClearOption | undefined): void {
    try {
      this.activeEditor()?.setContent('')
      option?.success?.({ errMsg: `ok` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `ok` })
    }
  }

  format (name: string, value?: string | undefined): void {
    // 微信: https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.format.html
    // tinymce: https://www.tiny.cloud/docs/tinymce/6/content-formatting/#formats
    // NOT SUPPORT
    // 1. ins
    // 2. list check

    const editor = this.activeEditor()
    if (!editor) {
      console.error(`Editor fail get activeEditor in format.`)
      return
    }

    if (name === 'bold' || name === 'italic' || name === 'underline') {
      editor.formatter.toggle(name)
      return
    } else if (name === 'strike') {
      editor.formatter.toggle('strikethrough')
      return
    } else if (name === 'ins') {
      console.error(`Editor not support format ins`)
      return
    }

    value = value || ''
    if (value.length < 1) {
      console.error(`Editor format ${name} value must be not empty.`)
      return
    }

    if (name === 'script') {
      // value = sub / super
      if (value === 'sub') {
        editor.formatter.toggle('subscript')
      } else if (value === 'super') {
        editor.formatter.toggle('superscript')
      }
    } else if (name === 'header') {
      // value = H1 / H2 / h3 / H4 / h5 / H6
      const levelMap: Map<string, string> = new Map<string, string>(
        Object.entries({
          // H1 / H2 / h3 / H4 / h5 / H6
          h1: 'h1',
          1: 'h1',
          h2: 'h2',
          2: 'h2',
          h3: 'h3',
          3: 'h3',
          h4: 'h4',
          4: 'h4',
          h5: 'h5',
          5: 'h5',
          h6: 'h6',
          6: 'h6',
        })
      )

      const formatName = levelMap.get(value)
      if (formatName) {
        editor.formatter.toggle(formatName)
      }
    } else if (name === 'align') {
      // value = left / center / right / justify
      editor.formatter.toggle(name + value.toLocaleLowerCase())
    } else if (name === 'direction') {
      // value = rtl / ltf
      if (value === 'ltr' || value === 'rtl') {
        editor.getBody().dir = value
      }
    } else if (name === 'indent') {
      // value = -1 / +1
      const num = Number(value)
      if (num === 1) {
        editor.execCommand('Indent')
      } else if (num === -1) {
        editor.execCommand('Outdent')
      }
    } else if (name === 'list') {
      // value = ordered / bullet / check
      // ordered = num list
      // bullet = dot list
      // check = checkbox list
      // https://www.tiny.cloud/docs/plugins/opensource/lists/

      const type = value.toLocaleLowerCase()
      if (type === 'ordered') {
        editor.execCommand('InsertOrderedList', false, {
          'list-style-type': 'decimal',
        })
      } else if (type === 'bullet') {
        editor.execCommand('InsertUnorderedList', false, {
          'list-style-type': 'disc',
        })
      } else if (type === 'check') {
        // https://www.tiny.cloud/docs/plugins/premium/checklist/
        console.error(`Editor not support format list with check`)
      } else {
        // 删除list
        // editor.execCommand('RemoveList');
      }
    } else if (name === 'color') {
      editor.formatter.apply('forecolor', { value: value })
    } else if (name === 'backgroundColor') {
      editor.formatter.apply('hilitecolor', { value: value })
    } else {
      editor.formatter.apply(name, { value: value })
    }
  }

  getContents (option?: Taro.EditorContext.GetContents.Option | undefined): void {
    try {
      const editor = this.activeEditor()
      if (editor) {
        option?.success?.({
          errMsg: 'ok',
          html: editor.getContent({ format: 'html' }),
          text: editor.getContent({ format: 'text' }),
          delta: editor.getContent({ format: 'tree' }),
        })
      }
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `ok` })
    }
  }

  insertDivider (option?: Taro.EditorContext.InsertDividerOption | undefined): void {
    try {
      this.activeEditor()?.insertContent('<hr>')
      option?.success?.({ errMsg: `ok` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `ok` })
    }
  }

  insertImage (option: Taro.EditorContext.InsertImageOption): void {
    try {
      const data = (option.data || {}) as Record<string, any>
      let dataCustom = ''
      for (const key in data) {
        dataCustom = dataCustom + `${key}=${data[key]};`
      }

      this.activeEditor()?.insertContent(
        `<img class="${option.extClass}" data-custom="${dataCustom}" alt="${option.alt}" height="${option.height}" width="${option.width}" src="${option.src}" />`
      )
      const nowrap = option.nowrap || false
      if (nowrap === false) {
        this.activeEditor()?.insertContent(`<br/><br/>`)
      }
      option?.success?.({ errMsg: `ok` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `ok` })
    }
  }

  insertText (option: Taro.EditorContext.InsertTextOption): void {
    try {
      const text = option.text || ''
      if (text.length > 0) {
        this.activeEditor()?.insertContent(text)
      }
      option?.success?.({ errMsg: `ok` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `ok` })
    }
  }

  removeFormat (option?: Taro.EditorContext.RemoveFormatOption | undefined): void {
    try {
      // https://www.tiny.cloud/docs/tinymce/6/editor-command-identifiers/#supported-browser-native-commands

      this.activeEditor()?.formatter.remove('alignleft')
      this.activeEditor()?.formatter.remove('aligncenter')
      this.activeEditor()?.formatter.remove('alignright')
      this.activeEditor()?.formatter.remove('alignjustify')
      this.activeEditor()?.execCommand('RemoveFormat')

      option?.success?.({ errMsg: `ok` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `ok` })
    }
  }

  setContents (option: Taro.EditorContext.SetContentsOption): void {
    try {
      const delta = option && option.delta
      const html = option && option.html
      const editor = this.activeEditor()
      if (delta) {
        try {
          editor?.setContent(delta, { format: 'tree' })
        } catch (e) {
          if (html) {
            editor?.setContent(html, { format: 'html' })
          }
        }
      } else {
        if (html) {
          editor?.setContent(html, { format: 'html' })
        }
      }

      option?.success?.({ errMsg: `ok` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `ok` })
    }
  }

  redo (option?: Taro.EditorContext.RedoOption | undefined): void {
    try {
      this.activeEditor()?.undoManager.redo()
      option?.success?.({ errMsg: `ok` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `ok` })
    }
  }

  undo (option?: Taro.EditorContext.UndoOption | undefined): void {
    try {
      this.activeEditor()?.undoManager.undo()
      option?.success?.({ errMsg: `ok` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `ok` })
    }
  }
}
