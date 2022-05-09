import Taro from '@tarojs/api'

import { temporarilyNotSupport } from '../../utils'

// 富文本
export class EditorContext implements Taro.EditorContext {
  blur = temporarilyNotSupport('EditorContext.blur')

  clear = temporarilyNotSupport('EditorContext.clear')

  format = temporarilyNotSupport('EditorContext.format')

  getContents = temporarilyNotSupport('EditorContext.getContents')

  getSelectionText = temporarilyNotSupport('EditorContext.getSelectionText')

  insertDivider = temporarilyNotSupport('EditorContext.insertDivider')

  insertImage = temporarilyNotSupport('EditorContext.insertImage')

  insertText = temporarilyNotSupport('EditorContext.insertText')

  redo = temporarilyNotSupport('EditorContext.redo')

  removeFormat = temporarilyNotSupport('EditorContext.removeFormat')

  scrollIntoView = temporarilyNotSupport('EditorContext.scrollIntoView')

  setContents = temporarilyNotSupport('EditorContext.setContents')

  undo = temporarilyNotSupport('EditorContext.undo')
}
