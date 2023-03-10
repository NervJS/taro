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

export interface TabItemConfig {
  showRedDot?: boolean
  tabBarBadge?: string | number
  tabBarLabel?: string
  iconPath?: string
  selectedIconPath?: string
}

// 设置全局的tabbar config 中的内容定义
export interface TaroTabBarConfig {
  needAnimate: boolean
  tabBarVisible: boolean
  tabStyle: {
    backgroundColor?: string
    borderStyle?: string
    color?: string
    selectedColor?: string
  }
  tabItems: Record<number, TabItemConfig>
}

export interface CallbackResult {
  errMsg: string
  eventChannel?: any
}

export interface BaseOption {
  success?: (res: CallbackResult) => void
  fail?: (res: CallbackResult) => void
  complete?: (res: CallbackResult) => void
}

export type OptionsFunc = (res: CallbackResult) => void
