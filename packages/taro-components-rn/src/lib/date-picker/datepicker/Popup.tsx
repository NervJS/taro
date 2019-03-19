import React from 'react';
import PopupPicker from '../../picker/Popup';
import { PopupPickerProps } from '../../picker/PopupPickerTypes';
import DatePickerProps from './DatePickerProps';

export interface PopupDatePickerProps extends PopupPickerProps {
  datePicker: React.ReactElement<DatePickerProps>;
  onChange?: (date?: any) => void;
  date?: any;
}

class PopupDatePicker extends React.Component<PopupDatePickerProps, any> {
  static defaultProps = {
    pickerValueProp: 'date',
    pickerValueChangeProp: 'onDateChange',
  };

  onOk = (v: any) => {
    const { onChange, onOk } = this.props;
    if (onChange) {
      onChange(v);
    }
    if (onOk) {
      onOk(v);
    }
  }

  render() {
    return (<PopupPicker
      picker={this.props.datePicker}
      value={this.props.date}
      {...this.props}
      onOk={this.onOk}
    />);
  }
}

export default PopupDatePicker;
