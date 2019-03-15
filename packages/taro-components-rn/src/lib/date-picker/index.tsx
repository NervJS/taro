import PropTypes from 'prop-types';
import React from 'react';
import PickerStyles, { PickerStyle } from '../picker/style/index';
import { WithTheme, WithThemeStyles } from '../style';
// import { getComponentLocale } from '../_util/getLocale';
import AntDatePicker from './datepicker';
import PopupDatePicker from './datepicker/Popup';
import { DatePickerPropsType } from './PropsType';
import { formatProps } from './utils';

export interface DatePickerProps
  extends DatePickerPropsType,
    WithThemeStyles<PickerStyle> {
  triggerTypes?: string;
}

export default class DatePicker extends React.Component<DatePickerProps> {
  static defaultProps = {
    mode: 'datetime',
    triggerType: 'onPress',
    minuteStep: 1,
  };
  static contextTypes = {
    antLocale: PropTypes.object,
  };
  render() {
    const { children, value, itemStyle } = this.props;
    const locale = {
      okText: '确定',
      dismissText: '取消',
      extra: '请选择',
      DatePickerLocale: {
        year: '年',
        month: '月',
        day: '日',
        hour: '时',
        minute: '分',
        am: '上午',
        pm: '下午',
      },
    };

    const { okText, dismissText, extra, DatePickerLocale } = locale;

    const dataPicker = (
      <AntDatePicker
        minuteStep={this.props.minuteStep}
        locale={DatePickerLocale}
        mode={this.props.mode}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        defaultDate={value}
        onValueChange={this.props.onValueChange}
        itemStyle={itemStyle}
      />
    );

    return (
      <WithTheme styles={this.props.styles} themeStyles={PickerStyles}>
        {styles => (
          <PopupDatePicker
            datePicker={dataPicker}
            styles={styles}
            {...this.props as any}
            date={value}
            dismissText={this.props.dismissText || dismissText}
            okText={this.props.okText || okText}
          >
            {children &&
              React.isValidElement(children) &&
              React.cloneElement<object, any>(children as any, {
                extra: value
                  ? formatProps(this.props, value)
                  : this.props.extra || extra,
              })}
          </PopupDatePicker>
        )}
      </WithTheme>
    );
  }
}
