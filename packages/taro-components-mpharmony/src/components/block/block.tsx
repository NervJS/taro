import React, { PureComponent, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export class TestBlock extends PureComponent<Props> {
  context: unknown
  readonly props: Readonly<Props>
  refs: { [p: string]: React.ReactInstance }

  render (): React.ReactNode {
    return this.props.children
  }

}
