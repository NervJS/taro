import Taro from '@tarojs/api'

// import { temporarilyNotSupport } from '../../utils'

// 富文本
export class EditorContext implements Taro.EditorContext {
  // blur = temporarilyNotSupport('EditorContext.blur')

  blur (option?: Taro.EditorContext.BlurOption | undefined): void {
    option?.fail?.({ errMsg: `not support blur.` })
  }

  getContext (): Taro.EditorContext {
    return this as Taro.EditorContext
  }

  activeEditor () : any {
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
        option?.success?.({ errMsg: '', text: selectionText })
      }
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

  clear (option?: Taro.EditorContext.ClearOption | undefined): void {
    try {
      this.activeEditor()?.setContent('')
      option?.success?.({ errMsg: `` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

  format (name: string, value?: string | undefined): void {
    if (value) {
      this.activeEditor()?.formatter.apply(name, { style: value })
    }
  }

  getContents (option?: Taro.EditorContext.GetContents.Option | undefined): void {
    try {
      const editor = this.activeEditor()
      if (editor) {
        option?.success?.({
          errMsg: '',
          html: editor.getContent({ format: 'html' }),
          text: editor.getContent({ format: 'text' }),
          delta: editor.getContent({ format: 'tree' }),
        })
      }
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }

    option?.complete?.({ errMsg: `` })
  }

  insertDivider (option?: Taro.EditorContext.InsertDividerOption | undefined): void {
    try {
      option?.fail?.({ errMsg: 'not support EditorContext.insertDivider api.' })
    } finally {
      option?.complete?.({ errMsg: '' })
    }
  }

  insertImage (option: Taro.EditorContext.InsertImageOption): void {
    try {
      const data = (option.data || {}) as Record<string, any>
      let dataCustom = ''
      for (const key in data) {
        dataCustom = dataCustom + `${key}=${data[key]};`
      }

      this.activeEditor()?.insertContent(`<img class="${option.extClass}" data-custom="${dataCustom}" alt="${option.alt}" height="${option.height}" width="${option.width}" src="${option.src}" />`)
      const nowrap = option.nowrap || false
      if (nowrap === false) {
        this.activeEditor()?.insertContent(`<br/>`)
      }
      option?.success?.({ errMsg: `` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

  insertText (option: Taro.EditorContext.InsertTextOption): void {
    try {
      const text = option.text || ''
      if (text.length > 0) {
        this.activeEditor()?.insertContent(text)
      }
      option?.success?.({ errMsg: `` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

  removeFormat (option?: Taro.EditorContext.RemoveFormatOption | undefined): void {
    try {
      // https://www.tiny.cloud/docs/tinymce/6/editor-command-identifiers/#supported-browser-native-commands
      this.activeEditor()?.execCommand('RemoveFormat')
      option?.success?.({ errMsg: `` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
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

      option?.success?.({ errMsg: `` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

  redo (option?: Taro.EditorContext.RedoOption | undefined): void {
    try {
      this.activeEditor()?.undoManager.redo()
      option?.success?.({ errMsg: `` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

  undo (option?: Taro.EditorContext.UndoOption | undefined): void {
    try {
      this.activeEditor()?.undoManager.undo()
      option?.success?.({ errMsg: `` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

}
