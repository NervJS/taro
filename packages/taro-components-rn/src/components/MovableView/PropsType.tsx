import { GestureResponderEvent } from 'react-native'

export interface AnimatedValueProps {
  x: number;
  y: number;
}

export interface MovableViewProps {
  // movable-view 的移动方向，属性值有all、vertical、horizontal、none
  direction: 'all' | 'vertical' | 'horizontal' | 'none';
  // 定义 x 轴方向的偏移，如果 x 的值不在可移动范围内，会自动移动到可移动范围；改变 x 的值会触发动画
  x?: string | number;
  // 定义 y 轴方向的偏移，如果 y 的值不在可移动范围内，会自动移动到可移动范围；改变 y 的值会触发动画
  y?: string | number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onChange?: (e: GestureResponderEvent) => void;
  animation: boolean;
  onMove: (value: AnimatedValueProps) => void;
  disabled?: boolean;
  style?: Record<string, any>;
  layout: {
    width: number;
    height: number;
  };
}
