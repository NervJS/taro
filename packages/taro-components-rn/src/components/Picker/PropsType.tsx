/*
 *  MIT License
 *
 *  Copyright (c) 2018 O2Team
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

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
