import arrayTreeFilter from 'array-tree-filter';
import React from 'react';
import MultiPicker from '../MultiPicker';
import Picker from '../Picker';
import { CascaderProps } from './CascaderTypes';

class Cascader extends React.Component<CascaderProps, any> {
  static defaultProps = {
    cols: 3,
    data: [],
    disabled: false,
  };

  state = {
    value: this.getValue(
      this.props.data,
      this.props.defaultValue || this.props.value,
    ),
  };

  componentWillReceiveProps(nextProps: { data: any; value: any }) {
    if ('value' in nextProps) {
      this.setState({
        value: this.getValue(nextProps.data, nextProps.value),
      });
    }
  }

  onValueChange = (value: any, index: any) => {
    const children = arrayTreeFilter(this.props.data, (c, level) => {
      return level <= index && c.value === value[level];
    });
    let data = children[index];
    let i;
    for (
      i = index + 1;
      data && data.children && data.children.length && i < this.props.cols!;
      i++
    ) {
      data = data.children[0];
      value[i] = data.value;
    }
    value.length = i;
    if (!('value' in this.props)) {
      this.setState({
        value,
      });
    }
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  getValue(d: any, val: any) {
    let data = d || this.props.data;
    let value = val || this.props.value || this.props.defaultValue;
    if (!value || !value.length || value.indexOf(undefined) > -1) {
      value = [];
      for (let i = 0; i < this.props.cols!; i++) {
        if (data && data.length) {
          value[i] = data[0].value;
          data = data[0].children;
        }
      }
    }
    return value;
  }

  getCols() {
    const {
      data,
      cols,
      disabled,
      pickerItemStyle,
      indicatorStyle,
    } = this.props;
    const value = this.state.value;
    const childrenTree = arrayTreeFilter(data, (c, level) => {
      return c.value === value[level];
    }).map(c => c.children);

    // in case the users data is async get when select change
    const needPad = cols! - childrenTree.length;
    if (needPad > 0) {
      for (let i = 0; i < needPad; i++) {
        childrenTree.push([]);
      }
    }
    childrenTree.length = cols! - 1;
    childrenTree.unshift(data);
    return childrenTree.map((children: any[] = [], level) => (
      <Picker
        key={level}
        style={{ flex: 1 }}
        disabled={disabled}
        itemStyle={pickerItemStyle}
        indicatorStyle={indicatorStyle}
      >
        {children.map(item => (
          <Picker.Item value={item.value} key={item.value}>
            {item.label}
          </Picker.Item>
        ))}
      </Picker>
    ));
  }

  render() {
    const props = this.props;
    const { rootNativeProps, style } = props;
    const cols = this.getCols();

    return (
      <MultiPicker
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
          },
          style,
        ]}
        selectedValue={this.state.value}
        rootNativeProps={rootNativeProps}
        onValueChange={this.onValueChange}
        onScrollChange={props.onScrollChange}
      >
        {cols}
      </MultiPicker>
    );
  }
}

export default Cascader;
