
import React, { PureComponent } from 'react'

interface Props {
  columnItem: (childItem: any, i: number) => React.ReactNode
  className?: string
  orientation: 'horizontal'|'vertical'
  data: []
  columnNum: number
}

export class ListView extends PureComponent<Props> {
  context: unknown
  readonly props: Readonly<Props>
  refs: { [p: string]: React.ReactInstance }

  render (): React.ReactNode {
    const displayStyle = this.props.orientation === 'horizontal' ? 'flex' : 'block'
    return (
      <div className={this.props.className} style={{ display: displayStyle }}>
        {this.props.data.map((item, i) => (
          this.props.columnItem(item, i)
        ))}
      </div>
    )
  }
}
