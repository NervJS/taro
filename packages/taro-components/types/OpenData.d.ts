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

import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
interface OpenDataProps extends StandardProps {
  /** 开放数据类型
   * @supported weapp, swan, tt, qq
   */
  type: keyof OpenDataProps.Type

  /** 当 type="groupName" 时生效, 群id
   * @supported weapp
   */
  openGid?: string

  /** 当 type="user*" 时生效，以哪种语言展示 userInfo
   * @default "en"
   * @supported weapp, qq
   */
  lang?: keyof OpenDataProps.Lang

  /** 数据为空时的默认文案
   * @supported weapp, tt
   */
  defaultText?: string

  /** 用户头像为空时的默认图片，支持相对路径和网络图片路径
   * @supported weapp, tt
   */
  defaultAvatar?: string

  /** 当数据为空且未设置默认值时，是否显示官方默认值
   * @supported tt
   */
  useEmptyValue?: string

  /** 当 type=groupCloudStorage 时有效，群分享对应的 shareTicket
   * @supported qq
   */
  shareTicket?: string

  /** 当 type=*CloudStorage 时有效，指定要拉取的 key 列表
   * @supported qq
   */
  keyList?: string

  /** 当 type=*CloudStorage 时有效，从主域透传给开放数据域的数据，会自动注入到自定义开放数据域组件的 properties 中
   * @supported qq
   */
  componentData?: string

  /** 群名称或用户信息为空时触发
   * @supported weapp, tt, qq
   */
  onError?: CommonEventFunction
}
declare namespace OpenDataProps {
  /** type 的合法值 */
  interface Type {
    /** 拉取群名称 */
    groupName

    /** 用户昵称 */
    userNickName

    /** 用户头像 */
    userAvatarUrl

    /** 用户性别 */
    userGender

    /** 用户所在城市 */
    userCity

    /** 用户所在省份 */
    userProvince

    /** 用户所在国家 */
    userCountry

    /** 用户的语言 */
    userLanguage
  }

  /** lang 的合法值 */
  interface Lang {
    /** 英文 */
    en

    /** 简体中文 */
    zh_CN

    /** 繁体中文 */
    zh_TW
  }
}

/** 用于展示平台开放的数据
 * @classification open
 * @supported weapp, swan, tt, qq
 * @example_react
 * ```tsx
 * class App extends Component {
 *   render () {
 *     return (
 *       <OpenData type='userAvatarUrl'/>
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 * <template>
 *   <open-data type="userAvatarUrl" />
 * </template>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/open-data.html
 */
declare const OpenData: ComponentType<OpenDataProps>
export { OpenData, OpenDataProps }
