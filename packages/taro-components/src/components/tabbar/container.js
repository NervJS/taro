import Nerv from 'nervjs'
import classNames from 'classnames'
import View from '../view'
export default class TabbarContainer extends Nerv.Component {
  render () {
    const { children, className, ...reset } = this.props
    const cls = classNames('weui-tab', className)
    return (
      <View className={cls} {...reset}>
        {children}
      </View>
    )
  }
}
