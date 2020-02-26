import { ComponentType } from 'react'
import { StandardProps } from './common'

interface OpenDataProps extends StandardProps {
  /** 开放数据类型
   */
  type: 'groupName' | 'userNickName' | 'userAvatarUrl' | 'userGender' |
    'userCity' | 'userProvince' | 'userCountry' | 'userLanguage'
  openGid?: string
  lang?: 'zh_CN' | 'zh_TW' | 'en'
}

/** 用于展示微信开放的数据
 * @classification open
 */
declare const OpenData: ComponentType<OpenDataProps>

export { OpenData, OpenDataProps }
