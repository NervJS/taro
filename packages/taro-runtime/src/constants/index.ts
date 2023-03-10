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

export const PROPERTY_THRESHOLD = 2046
export const TARO_RUNTIME = 'Taro runtime'
export const HOOKS_APP_ID = 'taro-app'
export const SET_DATA = '小程序 setData'
export const PAGE_INIT = '页面初始化'
export const ROOT_STR = 'root'
export const HTML = 'html'
export const HEAD = 'head'
export const BODY = 'body'
export const APP = 'app'
export const CONTAINER = 'container'
export const DOCUMENT_ELEMENT_NAME = '#document'
export const DOCUMENT_FRAGMENT = 'document-fragment'
export const ID = 'id'
export const UID = 'uid'
export const CLASS = 'class'
export const STYLE = 'style'
export const FOCUS = 'focus'
export const VIEW = 'view'
export const STATIC_VIEW = 'static-view'
export const PURE_VIEW = 'pure-view'
export const PROPS = 'props'
export const DATASET = 'dataset'
export const OBJECT = 'object'
export const VALUE = 'value'
export const INPUT = 'input'
export const CHANGE = 'change'
export const CUSTOM_WRAPPER = 'custom-wrapper'
export const TARGET = 'target'
export const CURRENT_TARGET = 'currentTarget'
export const TYPE = 'type'
export const CONFIRM = 'confirm'
export const TIME_STAMP = 'timeStamp'
export const KEY_CODE = 'keyCode'
export const TOUCHMOVE = 'touchmove'
export const DATE = 'Date'
export const SET_TIMEOUT = 'setTimeout'
export const CATCHMOVE = 'catchMove'
export const CATCH_VIEW = 'catch-view'
export const COMMENT = 'comment'
export const ON_LOAD = 'onLoad'
export const ON_READY = 'onReady'
export const ON_SHOW = 'onShow'
export const ON_HIDE = 'onHide'
export const OPTIONS = 'options'
export const EXTERNAL_CLASSES = 'externalClasses'
export const EVENT_CALLBACK_RESULT = 'e_result'
export const BEHAVIORS = 'behaviors'
export const A = 'a'

/**
 * 页面上下文切换时的行为
 */
export enum CONTEXT_ACTIONS {
  INIT = '0',
  RESTORE = '1',
  RECOVER = '2',
  DESTORY = '3'
}
