import { ComponentType } from 'react'
import { StandardProps } from './common'

export interface OpenDataProps extends StandardProps {

  /**
   * 开放数据类型
   */
  type: 'groupName' | 'userNickName' | 'userAvatarUrl' | 'userGender' |
    'userCity' | 'userProvince' | 'userCountry' | 'userLanguage',
  openGid?: string,
  lang?: 'zh_CN' | 'zh_TW' | 'en'
}

declare const OpenData: ComponentType<OpenDataProps>

export { OpenData }
