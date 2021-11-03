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

export default {
  props: ['id', 'src'],
  onError ({ url: src, errorCode, description }) {
    this.$trigger('error', { detail: { src, errorCode, description } })
  },
  onLoad ({ url: src }) {
    this.$trigger('load', { detail: { src } })
  }
}
