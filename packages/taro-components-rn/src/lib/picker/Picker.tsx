import React from 'react';
import NativePicker from './NativePicker';
import { PickerProps } from './PickerTypes';

const Item: any = NativePicker.Item;

class Picker extends React.Component<PickerProps, {}> {
  static defaultProps = {
    children: [],
  };

  static Item: any = () => {};

  getValue() {
    if ('selectedValue' in this.props) {
      return this.props.selectedValue;
    }
    const children: any = React.Children.toArray(this.props.children);
    return children && children[0] && children[0].props.value;
  }

  shouldComponentUpdate(nextProps: any) {
    return (
      this.props.selectedValue !== nextProps.selectedValue ||
      this.props.children !== nextProps.children
    );
  }

  render() {
    const children = React.Children.map(this.props.children, (c: any) => {
      return (
        <Item
          label={c.props.children + ''}
          value={c.props.value}
          key={c.key}
        />
      );
    });
    return <NativePicker {...this.props}>{children}</NativePicker>;
  }
}

export default Picker;
