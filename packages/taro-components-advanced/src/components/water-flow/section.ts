import { debounce } from '../../utils'
import { Size } from './interface'
import { Node } from './node'
import { Root, RootEvents } from './root'
import { StatefulEventBus } from './stateful-event-bus'
import { createImperativePromise, getMatrixPosition, isSameRenderRange } from './utils'

export interface SectionProps {
  /** 分组的唯一标识 */
  id: string
  /** 分组的列数 */
  col: number
  /** 分组的顺序 */
  order: number
  /** 节点数量 */
  count: number
  /** 该分组的行间距 */
  rowGap: number
  /** 该分组的列间距  */
  columnGap: number
}

/**
 * 分组状态
 */
type SectionState = {
  /**
   * 分组是否已经布局计算
   */
  layouted: boolean
  /**
   * 分组顶部距离容器顶部的距离
   */
  scrollTop: number
  /**
   * 分组的高度
   */
  height: number
  /**
   * 每个列的渲染范围
   * 每个元素为一个二元组，第一个元素为起始索引，第二个元素为结束索引
   */
  renderRange: [number, number][]
}

export const SectionEvents = {
  AllNodesLayouted: Symbol.for('AllNodesLayouted'),
  Resize: Symbol.for('Resize'),
}

export class Section extends StatefulEventBus<SectionState> {
  id: string
  order: number
  col: number
  columnMap: Node[][]
  nodes: Map<string, Node> = new Map()
  defaultSize = 200
  count = 0
  rowGap = 0
  columnGap = 0
  layoutedSignal = createImperativePromise()

  constructor(public root: Root, props: SectionProps) {
    const { id, col, order, count, rowGap, columnGap } = props
    super({
      layouted: false,
      scrollTop: 0,
      height: 0,
      renderRange: Array.from({ length: col }, () => [0, 0]),
    })
    Object.assign(this, {
      id,
      col,
      count,
      order,
      rowGap,
      columnGap,
      columnMap: Array.from({ length: col }, () => []),
    })
    this.initializeColumnMap()
    root.registerSection(this)
    this.setupSubscriptions()
  }

  /**
   * 订阅事件
   */
  private setupSubscriptions() {
    // 分组的所有节点完成初次布局计算，Nodes的实际高度已经拿到，那么这时分组的高度是确定的，距离滚动容器的顶部距离也是确定的，可以开始计算
    this.sub(SectionEvents.AllNodesLayouted, () => {
      this.setStateBatch({
        scrollTop: this.calcScrollTop(),
        height: this.maxColumnHeight,
      })
      this.updateNodes()
      this.setStateIn('renderRange', this.getNodeRenderRange())
      this.setStateIn('layouted', true)
      this.layoutedSignal.resolve()
      if (this.root.sections.every((section) => section.getState().layouted)) {
        this.root.pub(RootEvents.AllSectionsLayouted)
      }
    })
    // 滚动过程中，如果分组自身可见，那么需要计算分组内应该渲染的元素节点索引区间
    this.root.sub('scrollOffset', () => {
      if (this.isInRange) {
        this.setStateIn('renderRange', this.getNodeRenderRange())
      }
    })

    /**
     *  对应分组内的节点尺寸发生变化，需要重新进行相关计算
     *  1. 重新计算尺寸发生变化的节点所在列的所有节点位置信息
     *  2. 重新计算分组的高度
     *  3. 重新计算当前分组之后的所有分组的scrollTop以及分组内的节点位置
     *  4. 更新分组内节点的渲染范围
     */
    this.sub<{ node: Node, newSize: Size, originalSize: Size }>(
      SectionEvents.Resize,
      debounce(() => {
        this.setStateIn('height', this.maxColumnHeight)
        this.updateBehindSectionsPosition()
        if (this.isInRange) {
          this.setStateIn('renderRange', this.getNodeRenderRange())
        }
        this.root.pub(RootEvents.Resize)
      })
    )
  }

  /**
   * 获取当前分组的最大高度，分组的最大高度由分组最高列决定
   * @returns 当前分组的最大高度
   */
  get maxColumnHeight() {
    return Math.max(
      ...this.columnMap.map(
        (column) => column.reduce((buf, node) => buf + node.getState().height, 0) + (column.length - 1) * this.rowGap
      )
    )
  }

  /**
   * 当前分组是否在可视区域
   *
   * 滚动偏移为 scrollOffset，容器的高度为 containerSize.height
   *
   * 当前容器滚动上边界(scrollBoundaryStart)为 scrollOffset，容器滚动的下边界(scrollBoundaryEnd)为 scrollOffset + containerSize.height
   *
   * 如果分组的 scrollTop 小于滚动下边界并且 scrollTop + 分组高度大于滚动上边界，那么分组在可视区域
   */
  get isInRange() {
    const { scrollBoundaryStart, scrollBoundaryEnd } = this.root
    const { height: sectionHeight, scrollTop: sectionScrollTop } = this.getState()
    return sectionScrollTop <= scrollBoundaryEnd && sectionScrollTop + sectionHeight >= scrollBoundaryStart
  }

  /**
   * 注册节点
   */
  private register(node: Node) {
    const { col, order } = node
    this.columnMap[col][order] = node
    this.nodes.set(node.id, node)
  }

  /**
   * 初始化分组内的列，即将一维数组转二维数组
   */
  private initializeColumnMap() {
    const { count, col } = this
    for (let i = 0; i < count; i++) {
      this.pushNode(i, col)
    }
  }

  /**
   * 更新当前分组之后的分组的位置信息
   */
  private updateBehindSectionsPosition() {
    let start = this.order + 1
    if (start > this.root.sections.length) {
      return
    }
    for (; start < this.root.sections.length; start++) {
      const currentSection = this.root.sections[start - 1]
      const nextSection = this.root.sections[start]
      nextSection.setStateIn(
        'scrollTop',
        currentSection.getState().scrollTop + currentSection.getState().height + this.rowGap
      )
      nextSection.updateNodes()
    }
  }

  /**
   * 更新指定列的节点位置信息
   * @param col 列索引
   */
  private updateColumnNode(col: number) {
    const column = this.columnMap[col]
    const { scrollTop: sectionScrollTop } = this.getState()
    for (let i = 0; i < column.length; i++) {
      const node = column[i]
      if (i === 0) {
        node.setStateBatch({
          scrollTop: sectionScrollTop,
          top: 0,
        })
      } else {
        const prevNode = column[i - 1]
        const { scrollTop: prevNodeScrollTop, height: prevNodeHeight, top: prevNodeTop } = prevNode.getState()
        node.setStateBatch({
          scrollTop: prevNodeScrollTop + prevNodeHeight + this.rowGap,
          top: prevNodeHeight + prevNodeTop + this.rowGap,
        })
      }
    }
  }

  /**
   * 更新每列节点的位置
   */
  private updateNodes() {
    for (let col = 0; col < this.columnMap.length; col++) {
      this.updateColumnNode(col)
    }
  }

  /**
   * 计算当前分组的 scrollTop，即该分组之前的所有分组的最大列高度之和
   */
  private calcScrollTop() {
    return this.root.sections.slice(0, this.order).reduce((acc, section) => acc + section.maxColumnHeight, 0)
  }

  /**
   * 计算当前分组内每列应该渲染的节点索引区间
   */
  public getNodeRenderRange() {
    if (!this.isInRange) {
      return Array.from({ length: this.col }, () => [0, -1] as [number, number])
    }

    const result = Array.from({ length: this.col }, () => [Infinity, -Infinity] as unknown as [number, number])
    for (let i = 0; i < this.columnMap.length; i++) {
      const column = this.columnMap[i]
      for (let j = 0; j < column.length; j++) {
        const node = column[j]
        if (node.isInRange) {
          result[i][0] = Math.min(result[i][0], j)
          result[i][1] = Math.max(result[i][1], j)
        }
      }
      const start = result[i][0]
      const end = result[i][1]
      if (start === Infinity) {
        result[i][0] = 0
      }
      if (end === -Infinity) {
        result[i][1] = -1
      }

      const cacheCount = this.root.cacheCount
      const scrollDirection = this.root.getState().scrollDirection
      const backwardDistance = scrollDirection === 'backward' ? cacheCount : 0
      const forwardDistance = scrollDirection === 'forward' ? cacheCount : 0
      const overscanBackward = result[i][0] - backwardDistance
      const overscanForward = result[i][1] + forwardDistance
      result[i][0] = overscanBackward < 0 ? 0 : overscanBackward
      result[i][1] = overscanForward > column.length ? column.length - 1 : overscanForward
    }

    return isSameRenderRange(result, this.getState().renderRange) ? this.getState().renderRange : result
  }

  public pushNode(nodeIndex: number, col: number) {
    const { row: rowIndex, col: columnIndex } = getMatrixPosition(nodeIndex, col)
    const node = new Node(this.root, this, {
      childIndex: nodeIndex,
      order: rowIndex,
      col: columnIndex,
      height: this.defaultSize,
    })
    this.register(node)
    this.root.registerNode(node)
  }

  public pushNodes(count: number) {
    const { count: originalCount, col } = this
    for (let i = originalCount; i < originalCount + count; i++) {
      this.pushNode(i, col)
    }
    this.count += count
    this.root.lowerThresholdScrollTop = Infinity
    this.updateNodes()
    this.updateBehindSectionsPosition()
  }
}
