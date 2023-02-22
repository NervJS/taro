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

export interface AnimatedValueProps {
  x: number;
  y: number;
}

interface onChangeEventDetail {
  /** X 坐标 */
  x: number

  /** Y 坐标 */
  y: number

  /** 事件 */
  source: string
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
  onChange?: (e: onChangeEventDetail) => void;
  animation: boolean;
  onMove: (value: AnimatedValueProps) => void;
  disabled?: boolean;
  style?: Record<string, any>;
  layout: {
    width: number;
    height: number;
  };
  children?: React.ReactNode;
}
