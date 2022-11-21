import { ComponentType } from 'react'
import { StandardProps } from './common'
interface CommentDetailProps extends StandardProps {
  /** 评论核心参数
   * @supported swan
   */
  commentParam: CommentDetailProps.ICommentParam

  /** 评论 ID
   * @supported swan
   */
  srid: string

  /** 滚动方式为页面滚动，若组件作为浮层使用，该参数需设为 false
   * @supported swan
   * @default true
   */
  isPageScroll?: boolean

  /** 是否需要底部 toolbar，若使用开发者自定义的底部 toolbar，该参数需设为 false
   * @supported swan
   * @default true
   */
  needToolbar?: boolean

  /** 是否需要详情顶部父级评论的点赞按钮，默认显示
   * @supported swan
   * @default true
   */
  needLikeBtn?: boolean

  /** 删除详情后是否返回列表项，默认一站式逻辑。若使用浮层，请设置改属性为 false
   * @supported swan
   * @default true
   */
  backListAfterDelete?: boolean

  /** 用于调起评论发布器发布评论
   * @supported swan
   * @default false
   */
  addComment?: boolean

  /** 删除整体详情内容时触发，返回数据为{status, data:{srid}}
   * @supported swan
   */
  onDelete?: CommonEventFunction
}
namespace CommentDetailProps {
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
  }
}

/** 评论详情
 * @classification open
 * @supported swan
 * @see https://smartprogram.baidu.com/docs/develop/extended/component-content/comment-detail/
 */
declare const CommentDetail: ComponentType<CommentDetailProps>
export { CommentDetail, CommentDetailProps }
