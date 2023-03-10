/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
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
