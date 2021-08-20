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

export interface AnimatedValueProps {
  x: number;
  y: number;
}

export interface MovableAreaProps {
  // movable-view 的移动方向，属性值有all、vertical、horizontal、none
  direction: 'all' | 'vertical' | 'horizontal' | 'none';
  // 定义 x 轴方向的偏移，如果 x 的值不在可移动范围内，会自动移动到可移动范围；改变 x 的值会触发动画
  x?: string | number;
  // 定义 y 轴方向的偏移，如果 y 的值不在可移动范围内，会自动移动到可移动范围；改变 y 的值会触发动画
  y?: string | number;
  onDragStart: () => void;
  onDragEnd: () => void;
  animation: boolean;
  onMove: (value: AnimatedValueProps) => void;
  disabled?: boolean;
  style?: Record<string, any>;
  children: any;
  width?: number;
  height?: number;
}
