import React from 'react';
import PopupPicker from '../Popup';
import { PopupPickerProps } from '../PopupPickerTypes';
import { CascaderProps, CascaderValue } from './CascaderTypes';

export interface IPopupCascaderProps extends PopupPickerProps {
  cascader: React.ReactElement<CascaderProps>;
  onChange?: (date?: CascaderValue) => void;
}

class PopupCascader extends React.Component<IPopupCascaderProps, any> {
  static defaultProps = {
    pickerValueProp: 'value',
    pickerValueChangeProp: 'onChange',
  };

  onOk = (v: any) => {
    const { onChange, onOk } = this.props;
    if (onChange) {
      onChange(v);
    }
    if (onOk) {
      onOk(v);
    }
  };

  render() {
    return (
      <PopupPicker
        picker={this.props.cascader}
        {...this.props}
        onOk={this.onOk}
      />
    );
  }
}

export default PopupCascader;
