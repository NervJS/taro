/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

// import merge from 'lodash/merge'
// import _cell from './Cell/variable'
// import _dialog from './Dialog/variable'

const _global = {
  // color
  weuiColorPrimary: '#1AAD19',
  weuiColorWarn: '#E64340',

  // link
  weuiLinkColorDefault: '#586C94',

  // background
  weuiBgColorDefault: '#EFEFF4',
  weuiBgColorActive: '#ECECEC',

  // line
  weuiLineColorLight: '#E5E5E5',
  weuiLineColorDark: '#BCBAB6',

  // text
  weuiTextColorTitle: '#000000',
  weuiTextColorTips: '#B2B2B2',
  weuiTextColorWarn: '#E64340',
  weuiTextColorGray: '#999999',

  weuiActionSheetAndroidBorderRadius: 2,

  // ------------------------- old
  baseFontSize: 16,
  baseLineHeight: 1.6,
  // ------cell
  weuiCellBg: '#FFFFFF',
  weuiCellBorderColor: '#D9D9D9',
  weuiCellGapV: 10,
  weuiCellGapH: 15,
  weuiCellInnerGapH: 17 * 0.35, // '.35em'
  weuiCellHeight: 44,
  weuiCellFontSize: 17,
  weuiCellTipsFontSize: 14,
  weuiCellLabelWidth: 105,

  // unit((weuiCellHeight - 2 * weuiCellGapV) / weuiCellFontSize)
  // 高度为44，减去上下padding的行高
  weuiCellLineHeight: 44 - 20,
  // unit(20 / @weuiCellFontSize, em),
  weuiCellsMarginTop: 20,

  // weui switch
  weuiSwitchHeight: 32,

  // weui uploader
  weuiUploaderBorderColor: '#D9D9D9',
  weuiUploaderActiveBorderColor: '#999999',
  weuiUploaderFileSpacing: '9px',
  weuiUploaderSize: '79px',
  weuiUploaderBorderWidth: '1px',

  // Dialog
  weuiDialogBackgroundColor: '#FFFFFF',
  weuiDialogLineColor: '#D5D5D6',
  weuiDialogLinkColor: '#3CC51F',
  weuiDialogLinkActiveBc: '#EEEEEE',
  weuiDialogGapWidth: 1.6 * 16
}

export default _global
