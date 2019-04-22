import { StyleProp, ViewStyle } from 'react-native'

export type Node = {
  type: 'node' | 'text';
  name?: string;
  attrs?: any;
  children?: Node[];
  text: string;
}

export interface RichTextProps {
  style?: StyleProp<ViewStyle>;
  nodes: Node[] | string;
}
