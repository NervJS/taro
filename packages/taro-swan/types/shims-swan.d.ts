import '@tarojs/components/types/Form'

import { StandardProps } from '@tarojs/components/types/common'

declare module '@tarojs/components/types/form' {
  interface FormProps extends StandardProps {
    /** 是否开启免授权订阅。report-type 为 subscribe，template-id 与 subscribe-id 必填时设置该属性生效。
     * @note 只有白名单内小程序可使用此功能。
     * @supported swan
     */
    skipSubscribeAuthorize?: boolean
  }
}
