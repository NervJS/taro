import * as React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import { CheckboxGroupProps } from '../CheckboxGroup/PropsType'
import { InputProps } from '../Input/PropsType'
import { MultiSelectorProps } from '../Picker/PropsType'
import { RadioGroupProps } from '../RadioGroup/PropsType'
import { SliderProps } from '../Slider/PropsType'
import { SwitchProps } from '../Switch/PropsType'
import { TextareaProps } from '../Textarea/PropsType'

export type FormValues = {
  [key: string]: any
}

export type EventOnSubmit = {
  detail: {
    value: any
  }
}

export interface FormProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  onSubmit?: (evt: EventOnSubmit) => void
  onReset?: () => void
}

export interface FormComponentMap {
  '_Input': InputProps & FormProps
  '_Textarea': TextareaProps & FormProps
  '_CheckboxGroup': CheckboxGroupProps & FormProps
  '_RadioGroup': RadioGroupProps & FormProps
  '_Switch': SwitchProps & FormProps
  '_Slider': SliderProps & FormProps
  '_Picker': MultiSelectorProps & FormProps
}
