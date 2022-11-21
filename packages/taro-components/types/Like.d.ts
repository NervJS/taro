import { ComponentType } from 'react'
import { StandardProps } from './common'
interface LikeProps extends StandardProps {
  /** 是否已被点赞
   * @supported swan
   * @default false
   */
  isLiked?: boolean

  /** 按钮模式。icon：表示仅有图标；mixture：表示图标文字结合
   * @supported swan
   * @default "icon"
   */
  mode?: string

  /** 图标类型。hand：表示手形；heart：表示心形
   * @supported swan
   * @default "hand"
   */
  iconType?: string

  /** 点赞按钮上的文案。默认为赞，仅在 mode 属性值为'mixture'时有效
   * @supported swan
   * @default "赞"
   */
  likeText?: string

  /** 点赞数量
   * @supported swan
   * @default 0
   */
  likeNum?: number

  /** 被点赞的对象类型。0：表示对文章内容进行点赞；1：表示对评论内容进行点赞
   * @supported swan
   * @default 0
   */
  likeType?: number

  /** 点赞动效形式。0：无动效；1：轻动效；2：强动效
   * @supported swan
   * @default 1
   */
  animationType?: number

  /** 点赞后是否弹出 toast 提示
   * @supported swan
   * @default false
   */
  isShowToast?: boolean

  /** toast 文案，默认为已点赞、已取消
   * @supported swan
   * @default ['已点赞', '已取消']
   */
  toastText?: string[]

  /** 点赞服务需要的必要参数
   * @supported swan
   */
  likeParam: LikeProps.ILikeParam

  /** 使用 npm 方式引入点赞组件时，点击按钮时在用户未登录状态下会触发此事件；使用动态库方式引入点赞组件时，点击按钮时在用户未登录状态下不会触发此事件
   * @supported swan
   */
  onError?: CommonEventFunction

  /** 点击点赞按钮，在点赞服务成功后将状态返回给使用组件者
   * @supported swan
   */
  onSuccess?: CommonEventFunction

  /** 点击点赞按钮，在点赞服务失败后将状态返回给使用组件者
   * @supported swan
   */
  onFail?: CommonEventFunction
}
declare namespace LikeProps {
  interface ILikeParam {
    /** 用户身份唯一标识 */
    openid: string

    /** 被点赞的文章的 id，与 path 参数一一对应
     * @example "20200101"
     */
    snid: string

    /** 被点赞的评论 id */
    spid?: string

    /** 文章标题 */
    title: string

    /** 智能小程序内页链接，最长不能超过 194 字符
     * @example "/pages/index/index"
     */
    path: string
  }
}

/** 点赞
 * @classification open
 * @supported swan
 * @see https://smartprogram.baidu.com/docs/develop/extended/component-content/like/
 */
declare const Like: ComponentType<LikeProps>
export { Like, LikeProps }
