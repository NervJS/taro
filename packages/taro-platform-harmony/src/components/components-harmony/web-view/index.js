/**
 * 鸿蒙SDK API Version 6
 * 需在config.json中配置
 * "reqPermissions": [
 *  {
 *      "name": "ohos.permission.INTERNET"
 *    }
 *  ],
 * 文档地址 https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-components-web-0000001135254399
 */

import { createOption } from '../utils'

export default createOption({
  props: ['id', 'src'],
  onError ({ url: src, errorCode, description }) {
    this.$trigger('error', { src, errorCode, description })
  },
  onLoad ({ url: src }) {
    this.$trigger('load', { src })
  }
})
