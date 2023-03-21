import { ComponentType } from 'react'
import { StandardProps } from './common'
interface CommentListProps extends StandardProps {
  /** 评论核心参数
   * @supported swan
   */
  commentParam: CommentListProps.ICommentParam

  /** 底部 toolbar 的相关配置
   * @supported swan
   */
  toolbarConfig?: CommentListProps.IToolbarConfig

  /** 滚动方式为页面滚动，若组件作为浮层使用，该参数需设为 false
   * @supported swan
   * @default true
   */
  isPageScroll?: boolean

  /** 是否需要底部 toolbar ，若使用开发者自定义的底部 toolbar ，该参数需设为 false
   * @supported swan
   * @default true
   */
  needToolbar?: boolean

  /** 用于调起评论发布器发布评论，发布成功插入列表第一条，且滚动到列表顶部
   * @supported swan
   * @default false
   */
  addComment?: boolean

  /** 点击单条评论跳转的详情页页面 path ，若没有配置则不会发生跳转；配置的前提是列表与详情均是页面级
   * @supported swan
   */
  detailPath?: string

  /** 是否折叠列表，默认全展示
   * @supported swan
   * @default false
   */
  isFolded?: boolean

  /** 折叠后列表展示最大条数，默认 3 条，最多 10 条
   * @supported swan
   * @default 3
   */
  foldNum?: number

  /** 传入放置评论组件的页面路径，如'/pages/list/index'，组件内部会触发跳转逻辑
   * @supported swan
   */
  viewMorePath?: string

  /** 『全部 xx 条』的样式，目前只支持开发者自定义字体颜色
   * @supported swan
   */
  viewMoreStyle?: CommentListProps.IViewMoreStyle

  /** 绑定点击单条评论的事件，点击单条评论时触发，返回数据为{status, data:{srid}}
   * @supported swan
   */
  onClickComment?: CommonEventFunction

  /** 绑定点击更多事件，若除了页面跳转还需要其他操作，可通过该回调执行；若为浮层，也可使用该回调自定义交互逻辑
   * @supported swan
   */
  onViewMore?: CommonEventFunction
}
namespace CommentListProps {
  interface ICommentParam {
    /** 被点赞的文章的 id，与 path 参数一一对应
     * @example "20200101"
     */
    snid: string

    /** 文章标题 */
    title: string

    /** 智能小程序内页链接，最长不能超过 194 字符
     * @example "/pages/index/index"
     */
    path: string

    /** 数组第一项用于收藏功能的展示图片
     * @default ['https://b.bdstatic.com/miniapp/images/demo-dog.png']
     */
    images?: string[]
  }
  interface IToolbarConfig {
    /** 输入框提示文字 */
    placeholder?: string

    /** 显示的互动模块，对应默认值分别是：评论数、点赞、收藏、分享
     * @default ['comment', 'like', 'favor', 'share']
     */
    moduleList?: string

    /** 若 moduleList 里配置了 share 模块，该参数为必填 */
    share?: IShare
  }
  interface IShare {
    /** 分享标题 */
    title: string

    /** 分享内容 */
    content?: string

    /** 分享图标 */
    imageUrl?: string

    /** 页面 path ，必须是以 / 开头的完整路径，如果 path 中参数包含中文字符，需对中文字符进行编码 */
    path?: string
  }
  interface IViewMoreStyle {
    /** 『全部 xx 条』的字体颜色，默认为视觉提供色号，开发者可传入自定义色号
     * @default "#3388ff"
     */
    color?: string
  }
}

/** 评论列表
 * @classification open
 * @supported swan
 * @see https://smartprogram.baidu.com/docs/develop/extended/component-content/comment-list/
 */
declare const CommentList: ComponentType<CommentListProps>
export { CommentList, CommentListProps }
