import { Component } from '@tarojs/taro-h5'
import Nerv from 'nervjs'
import classNames from 'classnames'

const noop = () => {}

export default class Tabbar extends Component {
  static defaultProps = {
    index: null,
    isSelected: false,
    onSelect: noop,
    textColor: {},
    iconPath: ''
  }

  onClick = () => {
    this.props.onSelect(this.props.index)
  }

  render () {
    const { isSelected, index, textColor, iconPath, text } = this.props
    const className = classNames('weui-tabbar__item', {
      'weui-bar__item_on': isSelected
    })

    return (
      <a key={index} href='javascript:;' className={className} onClick={this.onClick}>
        <span style='display: inline-block;position: relative;'>
          <img src={iconPath} alt='' className='weui-tabbar__icon' />
        </span>
        <p className='weui-tabbar__label' style={{ color: textColor }}>
          {text}
        </p>
      </a>
    )
  }
}
