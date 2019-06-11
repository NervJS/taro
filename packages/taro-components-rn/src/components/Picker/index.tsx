/**
 * All:
 *   ✔ value
 *   ✔ onChange
 *   ✔ onCancel
 * Selector:
 *   ✔ range
 *   ✔ rangeKey
 *   ✔ disabled
 * MultiSelector:
 *   ✔ range
 *   ✔ rangeKey
 *   ✔ disabled
 *   ✔ onColumnChange
 * Time:
 *   ✔ start
 *   ✔ end
 *   ✔ disabled
 * Date:
 *   ✔ start
 *   ✔ end
 *   ✘ fields
 *   ✔ disabled
 * Region:
 *   ✔ customItem
 *   ✔ disabled
 *
 * @hint Picker 里面嵌套的子组件要支持绑定 onPress 事件才能弹出选择框
 */

import * as React from 'react'

import Selector from './selector'
import MultiSelector from './multiSelector'
import TimeSelector from './time'
import DateSelector from './date'
import RegionSelector from './region'

export default class _Picker extends React.Component<any> {
  static defaultProps = {
    mode: 'selector',
  }

  render () {
    const {
      mode,
    } = this.props

    if (mode === 'selector') {
      return <Selector {...this.props} />
    } else if (mode === 'multiSelector') {
      return <MultiSelector {...this.props} />
    } else if (mode === 'time') {
      return <TimeSelector {...this.props} />
    } else if (mode === 'date') {
      return <DateSelector {...this.props} />
    } else if (mode === 'region') {
      return <RegionSelector {...this.props} />
    } else {
      return null
    }
  }
}
