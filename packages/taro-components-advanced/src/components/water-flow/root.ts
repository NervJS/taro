/* eslint-disable no-labels */
import { cancelAnimationFrame, requestAnimationFrame } from '@tarojs/runtime'
import { nextTick } from '@tarojs/taro'

import { getRectSizeSync } from '../../utils'
import { Node } from './node'
import { Section } from './section'
import { StatefulEventBus } from './stateful-event-bus'
import { getSysInfo, isSameRenderRange } from './utils'

import type { BaseProps, ScrollDirection, Size, WaterFlowProps } from './interface'

export type RootProps = Pick<WaterFlowProps, 'cacheCount' | 'lowerThresholdCount' | 'upperThresholdCount'> &
Required<Pick<BaseProps, 'id'>> & {
  /** scrollElement 模式下为 true，不测量自有容器；此时需布局全部 section 以展开完整高度 */
  skipContainerMeasure?: boolean
}

const { windowHeight, windowWidth } = getSysInfo()

type RootState = {
  /** 是否在滚动中 */
  isScrolling: boolean
  /** 滚动偏移量 */
  scrollOffset: number
  /**
   * 滚动方向
   *
   * - forward 向下滚动
   *
   * - backward 向上滚动
   */
  scrollDirection: ScrollDirection
  /** 滚动高度 */
  scrollHeight: number
  /** 容器的尺寸信息 */
  containerSize: Size
  /** 渲染的分组区间范围 */
  renderRange: [number, number]
}

export const RootEvents = {
  ReachUpperThreshold: Symbol.for('ReachUpperThreshold'),
  ReachLowerThreshold: Symbol.for('ReachLowerThreshold'),
  Resize: Symbol.for('Resize'),
  AllSectionsLayouted: Symbol.for('AllSectionsLayouted'),
  InitialRenderCompleted: Symbol.for('InitialRenderCompleted'),
}

type Events = keyof typeof RootEvents

/**
 * 数据模型继承自有状态的事件总线，便于在节点之间通信，以及通过 useSyncExternalStore 关联 React 视图
 */
export class Root extends StatefulEventBus<RootState, Events> {
  /**
   * 瀑布流根节点唯一标识
   */
  id: string
  /**
   * 分组映射表，便于查找分组
   */
  sectionMap: Map<string, Section> = new Map()
  /**
   * 节点映射表，便于查找节点
   */
  nodeMap: Map<string, Node> = new Map()
  /**
   * 分组列表，基于计算出的渲染的分组区间范围 sections.slice(start, end + 1) 进行渲染
   */
  sections: Section[] = []
  /**
   * 设置预加载的 Item 条数（与 props.cacheCount 一致，收敛目标）。
   */
  cacheCount = 1

  /**
   * Node 层向上（列索引减小方向）预缓存条数，可与 cacheCount 不同（快速滑动单边放大）。
   */
  nodeCacheBackward = 1

  /**
   * Node 层向下（列索引增大方向）预缓存条数。
   */
  nodeCacheForward = 1

  upperThresholdCount = 0

  lowerThresholdCount = 0

  /**
   * 触发滚动阈值对应的 scrollTop 值
   */
  upperThresholdScrollTop = -Infinity

  /**
   * 触发滚动阈值对应的 scrollTop 值
   */
  lowerThresholdScrollTop = Infinity

  /** scrollElement 模式下为 true，需布局全部 section 以展开完整高度供父容器滚动 */
  skipContainerMeasure = false

  /** 当前是否处于触顶区域；初始为 true（起始在顶部），只有从 false→true 时才触发事件 */
  private _inUpperZone = true
  /** 当前是否处于触底区域；初始为 false */
  private _inLowerZone = false
  /** scrollHeight 更新防抖（raf），减轻 pushNodes 后测量前后的高度跳变 */
  private _scrollHeightRafId: number | null = null

  constructor(props: RootProps) {
    const { id, cacheCount, lowerThresholdCount, upperThresholdCount, skipContainerMeasure } = props
    super({
      isScrolling: false,
      scrollOffset: 0,
      scrollDirection: 'forward',
      scrollHeight: windowHeight,
      renderRange: [0, 0],
      containerSize: {
        width: windowWidth,
        height: windowHeight,
      },
    })
    Object.assign(this, {
      id,
      cacheCount,
      lowerThresholdCount,
      upperThresholdCount,
      skipContainerMeasure: !!skipContainerMeasure,
    })
    this.nodeCacheBackward = cacheCount
    this.nodeCacheForward = cacheCount
    this.setupSubscriptions()
    if (!skipContainerMeasure) {
      getRectSizeSync(`#${id}`, 100).then(({ width = windowWidth, height = windowHeight }) => {
        this.setStateIn('containerSize', {
          width,
          height,
        })
      })
    }
    this.renderInitialLayout()
  }

  /**
   * 设置订阅事件
   */
  private setupSubscriptions() {
    /**
     * 滚动过程中计算渲染的分组区间
     * 滚动过程中分组的最大高度会发生更新，可以在这时计算滚动高度
     */
    this.sub('scrollOffset', () => {
      this.setStateIn('renderRange', this.getSectionRenderRange())
      this.handleReachThreshold()
      this.updateScrollHeight()
    })

    this.sub('scrollOffset', () => {
      const sectionSize = this.sections.length
      const lastSection = this.sections[sectionSize - 1]
      // 最后一个分组的每一列最后一行都已经完成了布局计算，那么这个时候的总高度应该是准确的
      if (lastSection?.columnMap.every((column) => column[column.length - 1]?.getState().layouted)) {
        this.setLowerThresholdScrollTop()
      }
    })

    this.sub(RootEvents.AllSectionsLayouted, () => {
      this.updateScrollHeight()
      this.setUpperThresholdScrollTop()
      this.setLowerThresholdScrollTop()
    })

    this.sub(RootEvents.Resize, () => {
      this.updateScrollHeight()
      this.setUpperThresholdScrollTop()
      this.setLowerThresholdScrollTop()
    })
  }

  /**
   * 渐进式渲染
   *
   * 因为初始没法知道每个分组的高度信息，不知道渲染边界，所以需要渐进式渲染
   *
   * 当目前的渲染批次的首个分组的scrollTop大于容器的高度，说明容器可视区域已经填满，没必要再往下渲染了
   *
   * @param [i=0] 从第几个分组开始渲染
   *
   */
  renderInitialLayout(i = 0) {
    nextTick(() => {
      const sectionSize = this.sections.length

      if (i >= sectionSize || i < 0) {
        this.pub(RootEvents.InitialRenderCompleted, null)
        return
      }
      const section = this.sections[i]
      section.layoutedSignal.promise.then(() => {
        this.setStateIn('renderRange', [0, i + 1 > sectionSize ? sectionSize - 1 : i + 1])
        // skipContainerMeasure（nestedScroll 模式）：需布局全部 section，使 scrollHeight 展开供父容器滚动
        // default 模式：容器可视区域已填满则提前终止，减少首屏渲染
        if (
          !this.skipContainerMeasure &&
          section.getState().scrollTop > this.getState().containerSize.height
        ) {
          this.pub(RootEvents.InitialRenderCompleted, section)
          return
        }

        this.renderInitialLayout(i + 1)
      })
    })
  }

  /**
   * 计算滚动阈值对应的 scrollTop 并设置 upperThresholdScrollTop
   * 当距顶部还有 upperThresholdCount 个 FlowItem 时的 scrollTop 值
   */
  private setUpperThresholdScrollTop() {
    // 如果没有设置阈值或阈值为0，则返回0
    if (!this.upperThresholdCount) {
      this.upperThresholdScrollTop = 0
      return 0
    }
    const sectionSize = this.sections.length
    const tracker = Array.from(
      { length: sectionSize },
      () => new Map<number, { accCount: number, accHeight: number }>() // Map<列, { 当前列累计个数，当前列累计高度 }>
    )

    // 从第一个分组开始扫描
    loopSeciton: for (let i = 0; i < sectionSize; i++) {
      const section = this.sections[i]
      const sectionTracker = tracker[i]
      const columnMap = section.columnMap
      // 扫描当前分组的每一列
      for (let col = 0; col < columnMap.length; col++) {
        const column = columnMap[col]
        const columnSize = column.length
        if (!sectionTracker.has(col)) {
          if (i === 0) {
            sectionTracker.set(col, { accCount: 0, accHeight: 0 })
          } else {
            const previousSectionTracker = tracker[i - 1]
            sectionTracker.set(col, {
              accCount: Math.max(...[...previousSectionTracker.values()].map((nodeTracker) => nodeTracker.accCount)),
              accHeight: section.getState().scrollTop,
            })
          }
        }
        const colTracker = sectionTracker.get(col)!
        // 扫描当前列的每一行
        loopItem: for (let j = 0; j < columnSize; j++) {
          colTracker.accCount += 1
          colTracker.accHeight += column[j].getState().height + (j === 0 ? 0 : section.rowGap)
          if (colTracker.accCount >= this.upperThresholdCount) {
            break loopItem
          }
        }
      }
      for (const [, colTracker] of sectionTracker) {
        if (colTracker.accCount >= this.upperThresholdCount) {
          this.upperThresholdScrollTop = colTracker.accHeight
          break loopSeciton
        }
      }
    }
    return this.upperThresholdScrollTop
  }

  /**
   * 计算滚动阈值对应的 scrollTop 并设置 lowerThresholdScrollTop
   * 当距底部还有 lowerThresholdCount 个 FlowItem 时的 scrollTop 值
   */
  private setLowerThresholdScrollTop() {
    // 与 setUpperThresholdScrollTop 一致：0 或 undefined 时用「内容底 - 容器高」作为触底阈值
    if (!this.lowerThresholdCount) {
      // 必须用 sectionRange 实时计算，避免依赖可能未更新的 scrollHeight 状态
      const range = this.sectionRange
      const totalHeight = range.length > 0 ? range[range.length - 1][1] : 0
      this.lowerThresholdScrollTop = totalHeight - this.getState().containerSize.height
      return 0
    }
    const sectionSize = this.sections.length
    const tracker = Array.from(
      { length: sectionSize },
      () => new Map<number, { accCount: number, scrollTop: number }>()
    )
    // 从最后一个分组开始计算
    loopSeciton: for (let i = sectionSize - 1; i >= 0; i--) {
      const section = this.sections[i]
      const sectionTracker = tracker[i]
      const columnMap = section.columnMap
      // 扫描当前分组的每一列
      for (let col = 0; col < columnMap.length; col++) {
        const column = columnMap[col]
        const columnSize = column.length
        if (!sectionTracker.has(col)) {
          if (i === sectionSize - 1) {
            sectionTracker.set(col, { accCount: 0, scrollTop: 0 })
          } else {
            const belowSectionTracker = tracker[i + 1]
            sectionTracker.set(col, {
              accCount: Math.max(...[...belowSectionTracker.values()].map((nodeTracker) => nodeTracker.accCount)),
              scrollTop: 0,
            })
          }
        }
        const colTracker = sectionTracker.get(col)!
        // 从当前列的最后一行开始往前扫描
        loopItem: for (let j = columnSize - 1; j >= 0; j--) {
          colTracker.accCount += 1
          colTracker.scrollTop = column[j].getState().scrollTop
          if (colTracker.accCount >= this.lowerThresholdCount) {
            break loopItem
          }
        }
      }

      for (const [, colTracker] of sectionTracker) {
        if (colTracker.accCount >= this.lowerThresholdCount) {
          this.lowerThresholdScrollTop = colTracker.scrollTop
          break loopSeciton
        }
      }
    }

    return this.lowerThresholdScrollTop
  }

  /**
   * 处理滚动到阈值的情况
   * 检测当前滚动位置是否达到了上下阈值，并触发相应的事件
   * scrollElement 模式：scrollOffset 为内容内偏移（scrollTop - startOffset），upper/lowerThresholdScrollTop 基于本组件内容计算，触顶/触底以本 WaterFlow 内容为基准
   */
  private handleReachThreshold() {
    const { scrollOffset, containerSize } = this.getState()
    const inUpper = this.upperThresholdScrollTop !== -Infinity && scrollOffset <= this.upperThresholdScrollTop
    const inLower = this.lowerThresholdScrollTop !== Infinity && scrollOffset + containerSize.height >= this.lowerThresholdScrollTop
    if (inUpper && !this._inUpperZone) this.pub(RootEvents.ReachUpperThreshold)
    if (inLower && !this._inLowerZone) this.pub(RootEvents.ReachLowerThreshold)
    this._inUpperZone = inUpper
    this._inLowerZone = inLower
  }

  /**
   * 容器的滚动上边界
   */
  get scrollBoundaryStart() {
    return this.getState().scrollOffset
  }

  /**
   * 容器的滚动下边界
   */
  get scrollBoundaryEnd() {
    return this.scrollBoundaryStart + this.getStateIn('containerSize').height
  }

  /**
   * 计算每个section的底部位置
   *
   * sectionBottomRange = [ [section1.top, section1.bottom], [section2.top, section2.bottom], ..., [sectionN.top, sectionN.bottom] ]
   *
   * @returns [number,number][]
   */
  get sectionRange() {
    const length = this.sections.length
    if (length === 0) return []
    const range = Array.from({ length }, () => [0, this.sections[0].maxColumnHeight])
    for (let i = 1; i < length; i++) {
      const previous = range[i - 1]
      const prevSection = this.sections[i - 1]
      const gap = prevSection.rowGap ?? 0
      range[i] = [previous[1] + gap, previous[1] + gap + this.sections[i].maxColumnHeight]
    }

    return range
  }

  /**
   * 更新总滚动高度（各 Section 累计）。
   * @param immediate true 时跳过 raf 防抖（如 finalizePushNodesStateIfNeeded），避免高度滞后引起跳动
   */
  public updateScrollHeight(immediate = false) {
    const flush = () => {
      const next = this.sectionRange[this.sectionRange.length - 1]?.[1] ?? 0
      this.setStateIn('scrollHeight', next)
    }
    if (immediate) {
      if (this._scrollHeightRafId != null) {
        cancelAnimationFrame(this._scrollHeightRafId)
        this._scrollHeightRafId = null
      }
      flush()
      return
    }
    if (this._scrollHeightRafId != null) {
      cancelAnimationFrame(this._scrollHeightRafId)
    }
    this._scrollHeightRafId = requestAnimationFrame(() => {
      this._scrollHeightRafId = null
      flush()
    })
  }

  /**
   * 注册分组
   */
  public registerSection(section: Section) {
    const { id, order } = section
    this.sectionMap.set(id, section)
    this.sections[order] = section
  }

  /**
   * 注册节点
   */
  public registerNode(node: Node) {
    this.nodeMap.set(node.id, node)
  }

  /**
   * 查找分组
   */
  public findSection(id: string) {
    return this.sectionMap.get(id)
  }

  /**
   * 查找节点
   */
  public findNode(id: string) {
    return this.nodeMap.get(id)
  }

  /**
   * 设置 Node 层上下方向预缓存条数，并刷新可见分组内的列渲染区间。
   */
  public setNodeCacheRange (backward: number, forward: number) {
    const b = Math.max(0, Math.floor(backward))
    const f = Math.max(0, Math.floor(forward))
    if (this.nodeCacheBackward === b && this.nodeCacheForward === f) {
      return
    }
    this.nodeCacheBackward = b
    this.nodeCacheForward = f
    for (const section of this.sections) {
      if (section.isInRange) {
        section.setStateIn('renderRange', section.getNodeRenderRange())
      }
    }
  }

  /**
   * 获取分组渲染区间
   */
  public getSectionRenderRange() {
    const result: [number, number] = [Infinity, -Infinity]

    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i]
      if (section.isInRange) {
        result[0] = Math.min(result[0], i)
        result[1] = Math.max(result[1], i)
      }
    }

    if (result[0] === Infinity) {
      result[0] = 0
    }

    if (result[1] === -Infinity) {
      result[1] = this.sections.length - 1
    }

    const [backwardCache, forwardCache] = this.calcCacheSection(result)
    // 双向预缓存，避免反向滚动时出现空白（原逻辑仅在滚动方向缓存，反向时未预渲染）
    const backwardDistance = backwardCache
    const forwardDistance = forwardCache

    const overscanBackward = result[0] - backwardDistance
    const overscanForward = result[1] + forwardDistance

    result[0] = overscanBackward < 0 ? 0 : overscanBackward

    result[1] = overscanForward > this.sections.length ? this.sections.length - 1 : overscanForward

    const prevRange = this.getState().renderRange
    return isSameRenderRange(result, prevRange) ? prevRange : result
  }

  /**
   * 计算预渲染的分组个数
   */
  private calcCacheSection(renderRange: [number, number]) {
    const clientHeight = this.getState().containerSize.height
    const sectionCount = this.sectionMap.size
    let [start, end] = renderRange
    let cacheBackward = 1
    let cacheForward = 1

    if (start > 0) {
      let acc = this.sections[--start]?.getState().height ?? 0
      while (--start > 0) {
        const prevSection = this.sections[start]
        acc += prevSection.getState().height
        cacheBackward += 1
        if (acc >= clientHeight >>> 1) {
          break
        }
      }
    }

    if (end < sectionCount - 1) {
      let acc = this.sections[++end]?.getState().height ?? 0
      while (++end < sectionCount - 1) {
        const nextSection = this.sections[end]
        acc += nextSection.getState().height
        cacheForward += 1
        if (acc >= clientHeight >>> 1) {
          break
        }
      }
    }

    return [cacheBackward, cacheForward]
  }
}
