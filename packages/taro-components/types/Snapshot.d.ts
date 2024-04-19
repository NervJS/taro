import { ComponentType } from 'react'
import { StandardProps } from './common'

interface SnapshotProps extends StandardProps {
  /**
   * 渲染模式
   * @supported weapp
   * @default 'view'
   *
   * 可选值:
   * - view: 以真实节点渲染
   * - picture: 对子节点生成的内容截图渲染
   */
  mode: 'view' | 'picture'
}

/**
 * 截图组件
 * 支持将其子节点的渲染结果导出成图片，该组件需配合 snapshot 接口使用。 目前仅在 Skyline 渲染引擎 下支持。
 * @classification skyline
 * @supported weapp
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/snapshot.html
 */
declare const Snapshot: ComponentType<SnapshotProps>
export { Snapshot, SnapshotProps }
