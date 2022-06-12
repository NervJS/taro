import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

interface OpenDataProps extends StandardProps {
  /** 开放数据类型
   * @supported weapp, tt
   */
  type: keyof OpenDataProps.Type
  /** 当 type="groupName" 时生效, 群id
   * @supported weapp
   */
  openGid?: string
  /** 当 type="user*" 时生效，以哪种语言展示 userInfo
   * @default "en"
   * @supported weapp
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

  /** 群名称或用户信息为空时触发
   * @supported weapp, tt
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
 * @supported weapp, tt
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
