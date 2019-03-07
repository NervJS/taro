/**
 * @flow
 */

import * as React from 'react'
import {
  Picker,
} from 'react-native'
import Dialog from './Dialog'

type Props = {
  range: Array<any>,
  rangeKey?: string,
  value: Array<number>,
  onChange?: Function,
  disabled?: boolean,
  onCancel?: Function,
  onColumnChange?: Function,
}
type State = {
  isShowDialog: boolean,
  formattedRange: Array<any>,
  selectedIndex: Array<number>,
}

class _PickerMultiSelector extends React.Component<Props, State> {
  // eslint-disable-next-line no-useless-constructor
  constructor (props: Props) {
    super(props)
  }

  formatRange = (props: Props) => {
    const { range = [] } = props
    return range.map((subItem) => {
      return subItem instanceof Array ? subItem : []
    })
  }

  props: Props
  state: State = {
    isShowDialog: false,
    // @todo To be reset onCancel by whether initial props or later props?
    formattedRange: this.formatRange(this.props),
    selectedIndex: this.props.value,
  }
  confirmSelectedIndex: Array<number> = []
  changingColumn: number = 0

  static defaultProps = {
    range: [],
    value: [],
  }

  toggleDialog = (isShow: boolean) => {
    this.setState({ isShowDialog: isShow })
  }

  onValueChange = (columnIndex: number, itemValue: any, itemIndex: number) => {
    this.changingColumn = columnIndex
    // itemValue always be string
    const { onColumnChange } = this.props
    const { selectedIndex } = this.state
    onColumnChange && onColumnChange({
      detail: {
        column: columnIndex,
        // value: formattedRange[columnIndex][itemIndex]
        value: itemIndex
      }
    })
    selectedIndex[columnIndex] = itemIndex
    this.setState({ selectedIndex: [...selectedIndex] })
  }

  onCancel = () => {
    const { onCancel } = this.props
    onCancel && onCancel()
    this.toggleDialog(false)
    // Reset
    this.setState({
      // formattedRange: this.formatRange(this.props),
      selectedIndex: [...this.confirmSelectedIndex]
    })
  }

  onConfirm = () => {
    const { onChange } = this.props
    const { formattedRange, selectedIndex } = this.state
    const value = formattedRange.map((item, columnIndex) => {
      return selectedIndex[columnIndex] || 0
    })
    this.confirmSelectedIndex = [...selectedIndex]
    this.toggleDialog(false)
    onChange && onChange({ detail: { value } })
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps: Props) {
    if (nextProps.range !== this.props.range) {
      let { selectedIndex } = this.state
      selectedIndex = selectedIndex.map((item, index) => {
        return index > this.changingColumn ? 0 : item
      })
      this.setState({
        formattedRange: this.formatRange(nextProps),
        // @todo How to reset next column without recording changing item?
        selectedIndex,
      })
    }
  }

  render () {
    const {
      rangeKey,
      disabled,
    } = this.props
    const {
      isShowDialog,
      formattedRange,
      selectedIndex,
    } = this.state

    return (
      <Dialog
        show={!!isShowDialog}
        onCancel={this.onCancel}
        onConfirm={this.onConfirm}
      >
        {formattedRange.map((columnItem, columnIndex) => {
          const selectedValue = columnItem[selectedIndex[columnIndex] || 0]
          // Because the selectedValue, which would be used to pick item, would be convert to string.
          const stringifySelectedValue = typeof selectedValue === 'object' ? JSON.stringify(selectedValue) : selectedValue
          return (
            <Picker
              selectedValue={stringifySelectedValue}
              onValueChange={(itemValue, itemIndex) => { this.onValueChange(columnIndex, itemValue, itemIndex) }}
              enabled={!disabled}
              key={`TARO-RN-PICKER-SELECTOR-${columnIndex}`}
              style={{ flex: 1 }}>
              {columnItem.map((item, index) => {
                const label = item instanceof Object ? item[rangeKey] : item
                return (
                  <Picker.Item
                    label={label}
                    value={item instanceof Object ? JSON.stringify(item) : item}
                    key={`TARO-RN-PICKER-SELECTOR-ITEM-${index}`}
                  />
                )
              })}
            </Picker>
          )
        })}
      </Dialog>
    )
  }
}

export default _PickerMultiSelector
