/**
 * @flow
 */

import * as React from 'react'
import {
  View,
  Picker,
  Platform,
} from 'react-native'
import MultiSelector from './MultiSelector'
// Latest updated at 2017-12-26.
// @todo Dynamic data.
import { provinces, cities, districts } from './regions'

const regionParts = [provinces, cities, districts]

type Props = {
  value?: Array,
}
type State = {
  range: Array<Object>,
  value: Array,
  customItem?: string,
  onChange?: Function,
}

class _PickerRegion extends React.Component<Props, State> {
  // eslint-disable-next-line no-useless-constructor
  constructor (props: Props) {
    super(props)
    const { customItem } = this.props
    if (customItem) {
      provinces.unshift(customItem)
      Object.values(cities).map((item) => item.unshift(customItem))
      Object.values(districts).map((item) => item.unshift(customItem))
    }
    const result = this.getRangeFromProps(this.props)
    this.state = {
      range: result.range,
      value: result.value,
    }
  }

  getRangeFromProps = ({ value }: Props) => {
    const [ valFirst, valSecond, valThird ] = value
    let selectIndexOfFirst = 0
    let selectIndexOfSecond = 0
    let selectIndexOfThird = 0
    // Get indexes by provided region values.
    if (valFirst) {
      provinces.forEach((item, index) => {
        if (item.name === valFirst) {
          selectIndexOfFirst = index
          if (valSecond) {
            (cities[item.code] || []).map((item, index) => {
              if (item.name === valSecond) {
                selectIndexOfSecond = index
                if (valThird) {
                  (districts[item.code] || []).map((item, index) => {
                    if (item.name === valThird) {
                      selectIndexOfThird = index
                    }
                  })
                }
              }
            })
          }
        }
      })
    }
    const citiesList = cities[provinces[selectIndexOfFirst].code] || []
    const selectedCityItem = citiesList[selectIndexOfSecond]
    const districtsList = (selectedCityItem && districts[selectedCityItem.code]) || []
    return {
      range: [provinces, citiesList, districtsList],
      value: [selectIndexOfFirst, selectIndexOfSecond, selectIndexOfThird]
    }
  }

  picker: any

  static defaultProps = {
    value: [],
  }

  // Pass to next ref
  toggleDialog = (isShow: boolean) => {
    this.picker.toggleDialog(isShow)
  }

  onColumnChange = ({ detail: { column, value }}) => {
    if (column === 2) return
    const nextColumnIndex = column + 1
    const newListForAdjacentColumn = regionParts[nextColumnIndex][value.code] || []
    this.state.range[nextColumnIndex] = newListForAdjacentColumn
    this.state.value[nextColumnIndex] = 0
    if (nextColumnIndex === 1) {
      const nextColumnFirstItem = newListForAdjacentColumn[0]
      this.state.range[2] = (nextColumnFirstItem && regionParts[2][nextColumnFirstItem.code]) || []
      this.state.value[2] = 0
    }
    this.setState({
      range: [...this.state.range],
      value: [...this.state.value],
    })
  }

  onChange = ({ detail: { value } }) => {
    const { onChange } = this.props
    const { range } = this.state
    const newValue = value.map((rowIndex, columnIndex) => {
      const item = (range[columnIndex] || [])[rowIndex]
      return item && item.name
    })
    onChange && onChange({ detail: { value: newValue } })
  }

  render () {
    // const {
    //   range,
    //   value,
    // } = this.props
    const {
      range,
      value,
    } = this.state

    return (
      <MultiSelector
        {...this.props}
        range={range}
        rangeKey="name"
        value={value}
        onColumnChange={this.onColumnChange}
        onChange={this.onChange}
        ref={(picker) => { this.picker = picker }}
      />
    )
  }
}

export default _PickerRegion
