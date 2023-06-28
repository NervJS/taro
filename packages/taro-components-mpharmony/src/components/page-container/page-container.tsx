import '../../style/components/page-container.scss'

import classNames from 'classnames'
import React, { PureComponent, ReactNode } from 'react'

interface Props {
  className?: string
  children: ReactNode
  show: boolean
  duration: number
  zIndex: number
  overlay: boolean
  position: 'top' | 'bottom' | 'right' | 'center'
  round?: boolean
  closeOnSlideDown?: boolean
  overlayStyle?: string
  customStyle?: string
  bindbeforeenter?: (res) => void
  bindenter?: (res) => void
  bindafterenter?: (res) => void
  bindbeforeleave?: (res) => void
  bindleave?: (res) => void
  bindafterleave?: (res) => void
  bindclickoverlay?: (res) => void
}

export default class PageContainer extends PureComponent<Props> {
  context: unknown
  readonly props: Readonly<Props>
  refs: { [p: string]: React.ReactInstance }

  render (): React.ReactNode {
    const rootClass = classNames(
      'at-float-layout',
      {
        'at-float-layout--active': this.props.show
      },
      this.props.className
    )

    return (
      <div className={rootClass}>
        <div className='at-float-layout__container layout'>
          <div className='layout-body'>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }


}
