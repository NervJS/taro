import './style/index.css'

import React, { PureComponent } from 'react'

interface Props {
  columnItem: (childItem: any, i: number, index: number) => React.ReactNode
  className?: string
  data: []
  columnNum: number
}

function _chunk (data: [], columnNum: number): any[][] {

  const result: any[][] = []
  const length = data.length
  let i = 0

  while (i < length) {
    let chunk = []
    if (i + columnNum < length) {
      chunk = data.slice(i, i + columnNum)
    } else {
      chunk = data.slice(i, length)
    }
    result.push(chunk)
    i += columnNum
  }

  return result
}

export class GridView extends PureComponent<Props> {
  context: unknown
  readonly props: Readonly<Props>
  refs: { [p: string]: React.ReactInstance }

  render (): React.ReactNode {
    const gridGroup = _chunk(this.props.data, this.props.columnNum)

    return (
      <div className={this.props.className}>
        {gridGroup.map((item, i) => (
          <div style={{ display: 'flex' }} key={`grid-group-${i}`}>
            {item.map((childItem, index) => (
              this.props.columnItem(childItem, i, index)
            ))}
          </div>
        ))}
      </div>
    )
  }
}
