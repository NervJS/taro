import '@tarojs/components/types/Input'
import '@tarojs/components/types/Textarea'
import '@tarojs/components/types/Video'

declare module '@tarojs/components/types/input' {
  interface InputProps {
    /** 使用原生键盘
     * @default true
     * @supported alipay
     */
    enableNative?: boolean
  }
}

declare module '@tarojs/components/types/textarea' {
  interface TextareaProps {
    /** 使用原生键盘
     * @default false
     * @supported alipay
     */
    enableNative?: boolean
  }
}

declare module '@tarojs/components/types/video' {
  interface VideoProps {
    /** 使用原生
     * @default true
     * @supported alipay
     */
    enableNative?: boolean
  }
}
