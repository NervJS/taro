import React from 'react'

export type OnChangeEvent<T, E> = { detail: { value: T } & E }
export interface PickerViewProps<T, E = Record<string, unknown>> {
  children?: React.ReactNode;
  mode?: 'selector' | 'multiSelector' | 'time' | 'date' | 'region';
  value?: number[];
  onChange?: (event: OnChangeEvent<T, E>) => void;
  onCancel?: () => void;
  disabled?: boolean;
  itemStyle?: Record<string, unknown>;
  indicatorStyle?: Record<string, unknown>;
}
