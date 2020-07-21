import * as path from 'path'
import * as fs from 'fs-extra'
import * as postcss from 'postcss'
import * as pxtransform from 'postcss-pxtransform'
import transformCSS from 'taro-css-to-react-native'
import {
  printLog,
  npm as npmProcess,
  FILE_PROCESSOR_MAP,
  processTypeEnum,
  chalk
} from '@tarojs/helper'

import { StyleSheetValidation } from './StyleSheet/index'

import * as stylelintConfig from '../config/rn-stylelint.json'

const DEVICE_RATIO = 'deviceRatio'

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

/**
 * @description 读取 css/scss/less 文件，预处理后，返回 css string
 * @param {string} filePath
 * @param {object} pluginsConfig
 * @param {string} appPath
 * @returns {*}
 */
function loadStyle ({filePath, pluginsConfig}, appPath) {
  const fileExt = path.extname(filePath)
  const pluginName = FILE_PROCESSOR_MAP[fileExt]
  if (pluginName) {
    return npmProcess.callPlugin(pluginName, null, filePath, pluginsConfig[pluginName] || {}, appPath)
      .then((item) => {
        return {
          css: item.css.toString(),
          filePath
        }
      }).catch((e) => {
        printLog(processTypeEnum.ERROR, '样式预处理', filePath)
        console.log(e.stack)
      })
  }
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, content) => {
      if (err) {
        return reject(err)
      }
      resolve({
        css: content,
        filePath
      })
    })
  })
}

/**
 * @description 传入 css string ，返回 postCSS 处理后的 css string
 * @param {string} css
 * @param {string} filePath
 * @param {object} projectConfig
 * @returns {Function | any}
 */
function postCSS ({css, filePath, projectConfig}) {
  const pxTransformConfig = {
    designWidth: projectConfig.designWidth || 750
  }
  if (projectConfig.hasOwnProperty(DEVICE_RATIO)) {
    pxTransformConfig[DEVICE_RATIO] = projectConfig.deviceRatio
  }
  return postcss([
    require('stylelint')(stylelintConfig),
    require('postcss-reporter')({clearReportedMessages: true}),
    pxtransform(
      {
        platform: 'rn',
        ...pxTransformConfig
      }
    )
  ])
    .process(css, {from: filePath})
    .then((result) => {
      return {
        css: result.css,
        filePath
      }
    }).catch((e) => {
      printLog(processTypeEnum.ERROR, '样式转换', filePath)
      console.log(e.stack)
    })
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

function writeStyleFile ({css, tempFilePath}) {
  const fileContent = getWrapedCSS(css.replace(/"(scalePx2dp\(.*?\))"/g, '$1'))
  fs.ensureDirSync(path.dirname(tempFilePath))
  fs.writeFileSync(tempFilePath, fileContent)
  printLog(processTypeEnum.GENERATE, '生成样式文件', tempFilePath)
}

export {
  loadStyle,
  postCSS,
  getStyleObject,
  validateStyle,
  writeStyleFile
}
