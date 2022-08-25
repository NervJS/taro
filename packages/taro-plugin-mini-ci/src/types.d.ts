
interface QrcodeInfo {
  /**
    // imageSVG 用于产出二维码 SVG
    // imageFile 用于将二维码存储到某个路径
    // terminal 用于将二维码在控制台输出
    // null 则不产出二维码
     */
  format: 'imageFile' | 'terminal' | 'imageSVG' | 'plain' | null
  /** 只在 imageFile 生效，填写图片输出绝对路径 */
  output?: string
  options?: {
    /** 使用小二维码，主要用于 terminal */
    small?: boolean
  }
}
interface PreviewOption {
  project: {
    path: string
  }
  page: {
    /** 小程序打开页面 */
    path: string
    /** 小程序打开 query */
    query?: string
  }
  qrcode: QrcodeInfo
  /** 是否使用缓存 */
  cache: boolean
  /** 是否将产出的二维码链接复制到剪切板 */
  copyToClipboard: boolean
}

interface ProjectQRCode {
  /** 二维码过期时间 */
  expireTime: number
  /** 二维码短链 */
  shortUrl: string
  /** 二维码 schema */
  originSchema: string
  /** 二维码 SVG */
  qrcodeSVG?: string
  /** 二维码存储路径 */
  qrcodeFilePath?: string
  /** 是否命中并使用缓存 */
  useCache: boolean
}

type UploadOption = Omit<PreviewOption, 'page'> | {
  version: string
  changeLog: string
  needUploadSourcemap: boolean
}
export interface TTInstance {
  /** 打开开发者工具 */
  open(options: {
    project: {
      path: string
    }
  }): Promise<void>

  loginByEmail(options: { email: string; password: string; dontSaveCookie?: boolean }): Promise<any>

  checkSession(): Promise<{
    isValid: boolean
    errMsg: string
  }>

  preview(options: PreviewOption): Promise<ProjectQRCode>

  upload(options: UploadOption): Promise<ProjectQRCode>
}
