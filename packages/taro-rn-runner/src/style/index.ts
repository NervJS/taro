import * as path from 'path'
import * as _ from 'lodash'
import chalk from 'chalk'
import transformCSS from 'taro-css-to-react-native'
import { StyleSheetValidation } from './StyleSheet'
import { printLog } from '../utils'
import { processTypeEnum } from '../utils/constants'

let globalStyleObject = {}

function getWrapedCSS (css) {
  return (`
import { StyleSheet, Dimensions } from 'react-native'

// 一般app 只有竖屏模式，所以可以只获取一次 width
const deviceWidthDp = Dimensions.get('window').width
const uiWidthPx = 375

function scalePx2dp (uiElementPx) {
  return uiElementPx * deviceWidthDp / uiWidthPx
}

export default StyleSheet.create(${css})
`)
}

function getStyleObject ({css, filePath}) {
  let styleObject = {}
  try {
    styleObject = transformCSS(css)
  } catch (err) {
    printLog(processTypeEnum.WARNING, 'css-to-react-native 报错', filePath)
    console.log(chalk.red(err.stack))
  }
  return styleObject
}

function validateStyle ({styleObject, filePath}) {
  for (const name in styleObject) {
    try {
      StyleSheetValidation.validateStyle(name, styleObject)
    } catch (err) {
      // 先忽略掉 scalePx2dp 的报错
      if (/Invalid prop `.*` of type `string` supplied to `.*`, expected `number`[^]*/g.test(err.message)) return
      printLog(processTypeEnum.WARNING, '样式不支持', filePath)
      console.log(chalk.red(err.message))
    }
  }
}

export function compileStyle (css, filePath) {
  const fileExt = path.extname(filePath)
  printLog(processTypeEnum.COMPILE, _.camelCase(fileExt).toUpperCase(), filePath)
  // transformCSS
  let styleObject = getStyleObject({css, filePath})
  // validate styleObject
  validateStyle({styleObject, filePath})

  if (filePath === 'app.css') {
    globalStyleObject = styleObject
  } else {
    styleObject = Object.assign(styleObject, globalStyleObject)
  }

  const styleSource = JSON.stringify(styleObject, null, 2)
  const styleSourcePx = styleSource.replace(/"(scalePx2dp\(.*?\))"/g, '$1')
  return getWrapedCSS(styleSourcePx)
}
