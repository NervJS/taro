import './style/index.scss'

import React, { FC, ReactNode, useState } from 'react'
import Measure from 'react-measure'
import { layout, measureItems, SpringGrid } from 'react-stonecutter'

const Grid = measureItems(SpringGrid)
const { pinterest } = layout

interface Props {
  children: ReactNode
  className?: string
  crossAxisCount: number
  maxCrossAxisExtent: number
  mainAxisGap?: number
  crossAxisGap?: number
}

export const WaterfallFlow:FC<Props> = ({ className = '', mainAxisGap = 0, crossAxisGap = 0, crossAxisCount = 3, children }) => {

  const [dimensions, setDimensions] = useState({
    width: -1,
    height: -1
  })

  return <Measure
    bounds
    onResize={contentRect => {
      setDimensions(contentRect.bounds)
    }}
  >{({ measureRef }) => (
      <div ref={measureRef} className={className + ' grid-container'}>
        {dimensions.width > 0 && (
          <Grid
            columns={crossAxisCount}
            columnWidth={(dimensions.width - (crossAxisGap * (crossAxisCount - 1))) / crossAxisCount}
            gutterWidth={crossAxisGap}
            gutterHeight={mainAxisGap}
            layout={pinterest}
          >
            {React.Children.map(children, (child, index) => {
            // 在这里对每个子元素进行操作
            // 例如，可以给每个子元素添加一些属性或包装组件等
              if (React.isValidElement(child)) {
                return <div key={index} style={{ width: (dimensions.width - (crossAxisGap * (crossAxisCount - 1))) / crossAxisCount + 'px' }}>
                  {child}
                </div>
              }
            })}
          </Grid>
        )}
      </div>
    )}</Measure>
}
