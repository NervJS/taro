import { getRectSizeSync, weappScope } from '../../utils'
import { Root } from './root'
import { Section, SectionEvents } from './section'
import { StatefulEventBus } from './stateful-event-bus'
import { isWeapp, isWeb } from './utils'

interface NodeProps {
  /**
   * 原始索引，即一维数组中的索引
   */
  childIndex: number
  /**
   * 在列里的顺序
   */
  order: number
  /**
   * 位于哪一列
   */
  col: number
  height: number
}

type NodeState = {
  top: number
  width: number
  height: number
  layouted: boolean
  scrollTop: number
};

export const NodeEvents = {
  Resize: Symbol.for('resize'),
}

export class Node extends StatefulEventBus<NodeState> {
  /** 小程序：测量用内层 View 的 DOM；H5：getBoundingClientRect 用 */
  private _measureEl: HTMLElement | null = null

  id: string
  /**
   * 原始索引，即一维数组中的索引
   */
  childIndex: number
  /**
   * 在列里的顺序
   */
  order: number
  /**
   * 位于哪一列
   */
  col: number
  constructor(public root: Root, public section: Section, props: NodeProps) {
    const { height, childIndex, order, col } = props
    super({
      top: 0,
      width: 0,
      height,
      scrollTop: 0,
      layouted: false,
    })
    const nodeId = `${root.id}-${section.id}-item-${childIndex}`
    Object.assign(this, { id: nodeId, childIndex, order, col })
    this.setupSubscriptions()
  }

  attachMeasureElement (el: HTMLElement | null) {
    this._measureEl = el
  }

  private setupSubscriptions() {
    this.sub('layouted', () => {
      /**
       * 如果当前分组所有的节点都完成布局计算，那么向分组推送 `AllNodesLayouted` 事件，section会在这个时机做一些计算
       */
      if (
        [...this.section.nodes.values()].every(
          (node) => node.getState().layouted
        )
      ) {
        this.section.notify(SectionEvents.AllNodesLayouted)
      }
    })

    /**
     * 如果节点的尺寸发生了变化（这通常出现在节点内容包含网络数据的情况下，比如图片，这时要求用户调用 useFlowItemPositioner 返回的 resize 方法通知数据模型去重新计算布局）
     *
     * - 更新当前节点所在列之后的所有节点的位置信息
     *
     * - 通知 section 更新布局
     */
    this.sub(NodeEvents.Resize, async () => {
      const { width, height } = this.getState()
      const newSize = await this.measure()
      if (newSize.height === height && newSize.width === width) {
        return
      }
      this.updateBehindNodesPosition()
      this.section.pub(SectionEvents.Resize, {
        node: this,
        newSize,
        originalSize: { width, height },
      })
    })
  }

  /**
   * 测量节点的尺寸信息
   */
  public async measure() {
    let width: number | undefined
    let height: number | undefined
    if (isWeb() && this._measureEl) {
      const r = this._measureEl.getBoundingClientRect()
      width = r.width
      height = r.height
    } else if (isWeapp && this._measureEl) {
      const scope = weappScope({ current: this._measureEl as any })
      const res = await getRectSizeSync(`#${this.id}`, 100, 3, scope)
      width = res.width
      height = res.height
    } else {
      const res = await getRectSizeSync(`#${this.id}`, 100, 3)
      width = res.width
      height = res.height
    }
    if (
      typeof width !== 'number' ||
      typeof height !== 'number' ||
      !Number.isFinite(width) ||
      !Number.isFinite(height) ||
      width <= 0 ||
      height <= 0
    ) {
      const s = this.getState()
      return { width: s.width, height: s.height }
    }
    this.setStateBatch({
      width,
      height,
      layouted: true,
    })
    return { width, height }
  }

  /**
   * 更新节点所在列后面的节点的位置
   */
  updateBehindNodesPosition() {
    const currentColumn = this.section.columnMap[this.col]
    let start = this.order + 1

    if (start > currentColumn.length - 1) {
      return
    }
    for (; start < currentColumn.length; start++) {
      const node = currentColumn[start]
      const previousNode = currentColumn[start - 1]
      const {
        top: previousNodeTop,
        height: previousNodeHeight,
        scrollTop: previousNodeScrollTop,
      } = previousNode.getState()
      const rowGap = this.section.rowGap
      node.setStateBatch({
        top: previousNodeTop + previousNodeHeight + rowGap,
        scrollTop: previousNodeScrollTop + previousNodeHeight + rowGap,
      })
    }
  }

  /**
   * 节点是否可见
   */
  get isInRange() {
    const { scrollBoundaryStart, scrollBoundaryEnd } = this.root
    const { height: nodeHeight, scrollTop: nodeScrollTop } = this.getState()
    return (
      nodeScrollTop < scrollBoundaryEnd &&
      nodeScrollTop + nodeHeight > scrollBoundaryStart
    )
  }
}
