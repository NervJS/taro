import React from 'react';
import AntDatePickerProps from './datepicker/DatePickerProps';
export interface DatePickerPropsType extends AntDatePickerProps {
  value?: Date;
  mode?: 'datetime' | 'date' | 'year' | 'month' | 'time';
  minDate?: Date;
  maxDate?: Date;
  onChange?: (value: Date) => void;
  onValueChange?: (vals: any, index: number) => void;
  visible?: boolean;
  use12Hours?: boolean;
  onDismiss?: () => void;
  locale?: {
    okText: string;
    dismissText: string;
    extra: string;
    DatePickerLocale: {
      year: string;
      month: string;
      day: string;
      hour: string;
      minute: string;
      am?: string;
      pm?: string;
    };
  };
  minuteStep?: number;
  disabled?: boolean;
  format?: string | ((value: Date) => string);
  extra?: string;
  children?: React.ReactNode;
  dismissText?: React.ReactNode;
  okText?: React.ReactNode;
  title?: React.ReactNode;
}
