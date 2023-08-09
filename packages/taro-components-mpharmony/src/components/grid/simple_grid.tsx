import './style/index.scss'

import React, { FC, ReactNode, useState } from 'react'
import Measure from 'react-measure'

interface Props {
  children: ReactNode
  className?: string
  crossAxisCount: number
  maxCrossAxisExtent: number
  mainAxisGap?: number
  crossAxisGap?: number
}

export const SimpleGrid: FC<Props> = ({ className = '', children, mainAxisGap = 0, crossAxisCount, crossAxisGap = 0 }) => {

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
      <div ref={measureRef} className={'grid-container'}>
        {dimensions.width > 0 && (
          <div className={className + ' simple-grid'}>
            {React.Children.map(children, (child, index) => {
            // 在这里对每个子元素进行操作
            // 例如，可以给每个子元素添加一些属性或包装组件等
              if (React.isValidElement(child)) {
                return <div key={index} style={{ width: (dimensions.width - (crossAxisGap * (crossAxisCount - 1))) / crossAxisCount + 'px', marginBottom: mainAxisGap + 'px' }}>
                  {child}
                </div>
              }
            })}
          </div>
        )}
      </div>
    )}</Measure>
}
