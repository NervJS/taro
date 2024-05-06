import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

interface DraggableSheetProps extends StandardProps {
  /**
   * 初始时占父容器的比例
   * @supported weapp
   * @default 0.5
   */
  initialChildSize?: number
  /**
   * 最小时占父容器的比例
   * @supported weapp
   * @default 0.25
   */
  minChildSize?: number
  /**
   * 最大时占父容器的比例
   * @supported weapp
   * @default 1.0
   */
  maxChildSize?: number
  /**
   * 拖拽后是否自动对齐关键点
   * @supported weapp
   * @default false
   */
  snap?: boolean
  /**
   * 拖拽后对齐的关键点，无需包含最小和最大值
   * @supported weapp
   * @default []
   */
  snapSizes?: any[]
}

/**
 * 半屏可拖拽组件
 * 该组件需配合 DraggableSheetContext 接口使用。 目前仅在 Skyline 渲染引擎下支持。
 * 页面内拖拽是一种常见的交互效果，开发者可通过手势系统灵活实现。draggable-sheet 组件封装了常见的交互逻辑，实现起来更加简单。
 * 该组件需结合 scroll-view 使用。scroll-view 组件声明 associative-container 属性后，可与 draggable-sheet 关联起来。
 * @classification skyline
 * @supported weapp
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/draggable-sheet.html
 */
declare const DraggableSheet: ComponentType<DraggableSheetProps>
export { DraggableSheet, DraggableSheetProps }
