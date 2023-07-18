import './style/index.scss'

import React, { PureComponent, ReactElement, ReactNode } from 'react'
import GridLayout from 'react-grid-layout'

interface Props {
  children: ReactNode
  width: number
  className?: string
  type: 'aligned' | 'masonry'
  crossAxisCount: number
  maxCrossAxisExtent: number
  mainAxisGap?: number
  crossAxisGap?: number
}

export class GridView extends PureComponent<Props> {
  context: unknown
  readonly props: Readonly<Props>
  refs: { [p: string]: React.ReactInstance }

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

    const layout: { i: string | number | null, x: number, y: number, w: number, h: number, static: boolean }[] = []
    let column = 3
    if (this.props.crossAxisCount !== undefined) {
      column = this.props.crossAxisCount
    }

    let count = 0
    React.Children.map(this.props.children, (child) => {
      // 在这里对每个子元素进行操作
      // 例如，可以给每个子元素添加一些属性或包装组件等
      if (React.isValidElement(child)) {
        const i = child.key
        const y = Math.floor(count / column)
        const x = count % column
        const w = child.props.w
        const h = child.props.h

        layout.push({ i: i, x: x, y: y, w, h, static: true })
        childs.push(
          <div key={i}>
            {child}
          </div>
        )

        count++
        // console.log('count ' + count + ' column ' + column + ' x: ' + x + ' y: ' + y + ' w: ' +  w + ' h: ' +  h + ' child ' + typeof child + ' i: ' + child.key)
      }
    })
    // console.log(' layout ' + layout)

    return (
      <GridLayout
        className={'layout ' + this.props.className}
        cols={this.props.crossAxisCount}
        layout={layout}
        isDroppable={false}
        margin={[mainAxisGap, crossAxisGap]}
        width={this.props.width}
      >
        {childs}

      </GridLayout>
    )
  }
}
