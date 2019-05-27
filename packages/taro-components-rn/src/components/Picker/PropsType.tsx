import React from 'react';

export type OnChangeEvent<T, E> = { detail: { value: T } & E }
interface CommonProps<T, E = {}> {
  children?: React.ReactNode;
  mode?: 'selector' | 'multiSelector' | 'time' | 'date' | 'region';
  value?: T;
  onChange?: (event: OnChangeEvent<T, E>) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

export interface SelectorProps extends CommonProps<number> {
  range?: any[];
  rangeKey?: string;
}

export type MultiSelectorOnColumnChangeEvent = { detail: { column: number, value: number } }
export interface MultiSelectorProps extends CommonProps<number[]> {
  range?: any[][];
  rangeKey?: string;
  onColumnChange?: (event: MultiSelectorOnColumnChangeEvent) => void;
}

export interface TimeProps extends CommonProps<string> {
  start?: string;
  end?: string;
}

export interface DateProps extends CommonProps<string> {
  start?: string;
  end?: string;
  fields?: 'year' | 'month' | 'day';
}

type RegionOnChangeEventExtra = { code: string[]; postcode?: string[] }
export interface RegionProps extends CommonProps<string[], RegionOnChangeEventExtra> {
  customItem?: string;
}
