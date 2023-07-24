import './style/index.scss'

import React, { createRef,PureComponent, ReactElement, ReactNode } from 'react'
import { layout,measureItems, SpringGrid } from 'react-stonecutter'

interface Props {
  children: ReactNode
  className?: string
  type: 'aligned' | 'masonry'
  crossAxisCount: number
  maxCrossAxisExtent: number
  mainAxisGap?: number
  crossAxisGap?: number
}

interface State {
  itemWidth?: number
}

export class GridView extends PureComponent<Props, State> {
  context: unknown
  readonly props: Readonly<Props>
  refs: { [p: string]: React.ReactInstance }

  childRefs: React.RefObject<HTMLDivElement>[] = []
  childWidths: number[] = []
  maxChildWidth = 0
  isHadMeasureWidth = false

  componentDidMount () {
    // 在组件挂载后，可以通过 this.childRefs 来获取子元素的宽度
    this.calculateChildWidths()
  }

  calculateChildWidths () {

    let tempMaxWith = 0
    this.childRefs.forEach((ref) => {
      if (ref.current) {
        const width = ref.current.clientWidth
        if (width > tempMaxWith) {
          tempMaxWith = width
        }
        this.childWidths.push(width)

      }
    })
    this.maxChildWidth = tempMaxWith
    // console.log('子元素宽度:', this.childWidths)
    if (!this.isHadMeasureWidth) {
      this.isHadMeasureWidth = true
      this.setState({
        itemWidth: this.maxChildWidth
      })
    }

  }


  render (): React.ReactNode {
    let mainAxisGap = 0
    if (this.props.mainAxisGap !== undefined) {
      mainAxisGap = this.props.mainAxisGap
    }

    let crossAxisGap = 0
    if (this.props.crossAxisGap !== undefined) {
      crossAxisGap = this.props.crossAxisGap
    }
    const childs: ReactElement[] = []

    let column = 3
    if (this.props.crossAxisCount !== undefined) {
      column = this.props.crossAxisCount
    }

    let layout_type = layout.pinterest

    if (this.props.type === 'masonry') {
      layout_type = layout.pinterest
    } else {
      layout_type = layout.simple
    }


    this.childRefs = [] // 创建一个 Ref 数组用来存放子元素的 Ref

    React.Children.map(this.props.children, (child) => {
      // 在这里对每个子元素进行操作
      // 例如，可以给每个子元素添加一些属性或包装组件等
      if (React.isValidElement(child)) {

        const i = child.key
        const childRef = createRef<HTMLDivElement>() // 创建子元素的 Ref
        this.childRefs.push(childRef) // 将子元素的 Ref 添加到数组中

        childs.push(
          <div key={i} ref={childRef} style={{ display:'flex' }}>
            {child}
          </div>
        )
        // console.log('count ' + count + ' column ' + column + ' x: ' + x + ' y: ' + y + ' w: ' +  w + ' h: ' +  h + ' child ' + typeof child + ' i: ' + child.key)
      }
    })
    // console.log(' layout ' + layout)
    const Grid = measureItems(SpringGrid)
    if (this.maxChildWidth === 0) {
      // 没有被测量出宽度
      const preView = (<div style={{ display:'flex' }}>
        {childs}
      </div>)
      return preView
    }

    // console.log('render:', this.state.itemWidth)

    return (
      <Grid
        columns={column}
        columnWidth={this.state.itemWidth}
        gutterWidth={mainAxisGap}
        gutterHeight={crossAxisGap}
        layout={layout_type}
      >
        {childs}
      </Grid>

    )
  }
}
