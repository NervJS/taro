import { StyleProp, ViewStyle } from 'react-native'

export type EventOnChange = {
  detail: {
    value: boolean;
  };
}

export interface SwitchState {
  checked: boolean;
}

export interface ContainerProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface PanelProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export type TabbarItem = {
  selectedIconPath: string;
  iconPath: string;
  text: string;
}

export interface TabbarState {
  list: TabbarItem[];
  isShow: boolean;
  selectedIndex: number;
}

export type TabbarConf = {
  list: any[];
  borderStyle?: 'black' | 'white';
  backgroundColor?: string;
  selectedColor?: string;
  color?: string;
}

export interface TabbarProps {
  conf: TabbarConf;
  homePage: string;
  onClick?: (...args: any[]) => void;
}
