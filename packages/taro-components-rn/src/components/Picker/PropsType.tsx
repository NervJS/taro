/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import React from 'react'

export type OnChangeEvent<T, E> = { detail: { value: T } & E }
interface CommonProps<T, E = Record<string, unknown>> {
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

export type MultiSelectorOnColumnChangeEvent = { detail: { column: number; value: number } }
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

export interface DateState {
  pValue: string | Date;
  value: string | Date;
}

export interface RegionState {
  pvalue: string[] | undefined;
  value: string[] | undefined;
}

export interface SelectorState {
  pRange: any[] | undefined;
  range: any[];
  value: number;
  preValue: React.ReactText[] | undefined;
}

export interface MultiSelectorState {
  cols: number;
  pRange: any[];
  pValue: any[];
  range: any[];
  value: any[];
}

type RegionOnChangeEventExtra = { code: string[]; postcode?: string[] }
export interface RegionProps extends CommonProps<string[], RegionOnChangeEventExtra> {
  customItem?: string;
  regionData?: RegionObj[];
}

export interface RegionObj {
  value: string
  code: string
  postcode?: string
  children?: RegionObj[]
}
