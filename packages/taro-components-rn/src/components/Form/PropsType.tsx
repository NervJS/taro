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

import * as React from 'react'
import { ViewStyle, StyleProp } from 'react-native'
import { InputProps } from '../Input/PropsType'
import { TextareaProps } from '../Textarea/PropsType'
import { CheckboxGroupProps } from '../CheckboxGroup/PropsType'
import { RadioGroupProps } from '../RadioGroup/PropsType'
import { SwitchProps } from '../Switch/PropsType'
import { SliderProps } from '../Slider/PropsType'
import { MultiSelectorProps } from '../Picker/PropsType'
export type FormValues = {
  [key: string]: any;
}

export type EventOnSubmit = {
  detail: {
    value: any;
  };
}

export interface FormProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onSubmit?: (evt: EventOnSubmit) => void;
  onReset?: () => void;
}

export interface FormComponentMap {
  '_Input': InputProps & FormProps;
  '_Textarea': TextareaProps & FormProps;
  '_CheckboxGroup': CheckboxGroupProps & FormProps;
  '_RadioGroup': RadioGroupProps & FormProps;
  '_Switch': SwitchProps & FormProps;
  '_Slider': SliderProps & FormProps;
  '_Picker': MultiSelectorProps & FormProps;
}
