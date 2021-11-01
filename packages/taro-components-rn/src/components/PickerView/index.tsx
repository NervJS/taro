import * as React from 'react'
import AntPickerView from '@ant-design/react-native/lib/picker-view'
import { noop } from '../../utils'
import { PickerViewProps } from './PropsType'

export default class _Picker extends React.Component<PickerViewProps> {
  static defaultProps = {
    data: [],
    value: []
  }

  onChange = (val: Record<string, any>): void => {
    const { onChange = noop } = this.props
    onChange({ detail: { value: val } })
  }

  handleChildren = (children: React.ReactChild[]): any[] => {
    return children.map((child: any, index: number) => {
      return {
        label: this.getLabelFromChildren(child),
        value: index
      }
    })
  }

  joinString = (data: string | any[] | React.ReactElement): string => {
    return (Array.isArray(data) ? data : [data]).join('')
  }

  getLabelFromChildren = (child: React.ReactElement): string => {
    return child.props && child.props.children ? this.getLabelFromChildren(child.props.children) : this.joinString(child)
  }

  getDataFromChildren = (children: React.ReactNode): any[] => {
    return (Array.isArray(children) ? children : [children]).map((child: any) => {
      return this.handleChildren(child.props && child.props.children ? child.props.children : [child])
    })
  }

  render(): JSX.Element | null {
    const { data, value, children, ...restProps } = this.props
    if (!children) return null
    return (
      <AntPickerView
        {...restProps}
        cols={1}
        value={value}
        data={data.length > 0 ? data : this.getDataFromChildren(children)}
        onChange={this.onChange}
        cascade={false}

      />
    )
  }
}
