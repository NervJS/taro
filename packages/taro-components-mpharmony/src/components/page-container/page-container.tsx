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
        'at-float-layout--active': this.props.show,

      },
      this.props.className
    )

    let position_css = 'no_active_bottom'
    if (this.props.show) {
      if (this.props.position === 'bottom') {
        position_css = 'active_bottom'
      } else if (this.props.position === 'top') {
        position_css = 'active_top'
      } else if (this.props.position === 'right') {
        position_css = 'active_right'
      }
    } else {
      if (this.props.position === 'bottom') {
        position_css = 'no_active_bottom'
      } else if (this.props.position === 'top') {
        position_css = 'no_active_top'
      } else if (this.props.position === 'right') {
        position_css = 'no_active_right'
      }
    }

    const container = classNames(
      'at-float-layout__container',
      'layout',
      {
        'container_has_corner': this.props.round,
        [position_css]: false,
      },
    )

    let overlay_color = 'overlay_none'

    if (this.props.overlay) {
      overlay_color = 'overlay_none'
    } else {
      if (this.props.overlayStyle !== undefined) {
        overlay_color = this.props.overlayStyle
      } else {
        overlay_color = 'overlay_black'
      }
    }

    const overlay = classNames(
      'at-float-layout__overlay',
      {
        [overlay_color]: true,
      },
    )


    return (
      <div className={rootClass}>
        <div onClick={this.props.bindclickoverlay} className={overlay}/>
        <div className={container}>
          <div className='layout-body'>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }


}
