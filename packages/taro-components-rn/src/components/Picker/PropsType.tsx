import { PickerDateProps, PickerMultiSelectorProps, PickerSelectorProps, PickerTimeProps, PickerRegionProps } from '@tarojs/components/types/Picker'

export interface BaseState<T> {
  /** 表示当前选中的值 */
  value: T;
  /** 表示上一次选中的值 */
  pValue: T;
}

export type SelectorProps = Partial<PickerSelectorProps>

export interface SelectorState extends BaseState<number | string> {
  pRange: any[] | undefined;
  range: any[];
}

export type TimeProps = Partial<PickerTimeProps>
export type TimeState = BaseState<string|Date>

export type DateProps = Partial<PickerDateProps>
export type DateState = BaseState<string | Date>

export interface RegionProps extends Partial<PickerRegionProps> {
  customItem?: string;
  regionData?: RegionObj[];
}
export type RegionState = BaseState<string[]>
export interface RegionObj {
  value: string
  code: string
  postcode?: string
  children?: RegionObj[]
}

export interface MultiSelectorProps extends Partial<PickerMultiSelectorProps> {
  value: number[]
}
export interface MultiSelectorState extends BaseState<any[]> {
  cols: number;
  pRange: any[];
  range: any[];
}
