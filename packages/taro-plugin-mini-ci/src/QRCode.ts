/**
 * 生产二维码输出到控制台
 * @param url 链接地址
 */
export default function generateQrCode (url: string) {
  require('qrcode-terminal').generate(url, { small: true })
}
