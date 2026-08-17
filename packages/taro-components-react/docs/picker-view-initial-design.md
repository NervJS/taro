# 实现 picker-view / picker-view-column 组件

## Context

`taro-components-react` 目前只有弹窗式 `Picker`（`components/picker/`），缺少微信 `picker-view` 对应的**内联滚动选择器**。微信 `picker-view` 是嵌入页面、无弹窗、列间无联动的滚动选择器，内部只放 `picker-view-column`。

当前 barrel `src/index.react.ts:56` 的 `PickerView`/`PickerViewColumn` 来自 stencil 产物（`@tarojs/components/lib/react`），需用 React 原生实现替换，与现有 React `Picker` 风格统一、复用其滚动机制。

**目标**：接口兼容小程序（`PickerView.d.ts` 全部 props），能力可超集（额外暴露 `itemHeight`/`visibleItems`）。不做 mode、不做列间联动，每列独立交互。

## 核心设计：动态高度模型（与 picker 的本质区别）

- **picker**：容器高度固定 = `34px × 7 = 238px`，留白固定 `PICKER_BLANK_ITEMS=3`
- **picker-view**：容器高度**由用户 `style="height:..."` 决定**（官方示例 `height: 300px`），留白必须动态算

主模型（对齐小程序）：
- `itemHeight` ← ref 量 indicator 的 `offsetHeight`（默认 34px）
- `paddingVertical = (容器高度 - itemHeight) / 2` —— 让首尾项能滚到中心
- 滚动定位 `scrollTop = index × itemHeight`，反推 `index = Math.round(scrollTop / itemHeight)`

扩展能力（超集 props）：
- `itemHeight?: number` —— 显式指定，优先级高于 indicatorStyle 解析
- `visibleItems?: number` —— 显式指定时容器高度 = `itemHeight × visibleItems`

## 目标文件结构

```
components/picker-view/
├── index.ts                  # barrel: export { PickerView, PickerViewColumn }
├── picker-view.tsx           # 容器组件
├── picker-view-column.tsx    # 单列组件
└── style/
    └── index.scss            # 样式（复用 picker/style/variable.scss 变量）

utils/picker-scale.ts         # 【新】共享的平台缩放判断方法
```

## 任务 1：共享平台缩放判断 → `utils/picker-scale.ts`

**只共享 1 个方法**：`resolveUseMeasuredScale()`（`picker-group.tsx:73-92`）

从 picker-group **移动**到 `utils/picker-scale.ts`，picker-group 改为 `import`。新文件加注释：
```ts
/**
 * 供 picker 系列组件专用，未涉及 designAppVersion 17 的修改所以不做判断
 */
```

该方法内部依赖的 `MIN_DESIGN_APP_VERSION = 16` 也一并放入此文件（作为该方法的内部常量）。

**不共享**（各组件各自实现）：
- 常量：`PICKER_LINE_HEIGHT`、`PICKER_VISIBLE_ITEMS`、`PICKER_BLANK_ITEMS` — picker-group 保留原样
- 计算函数：`calculateLengthScaleRatio()`、`setTargetScrollTopWithScale()`、`getSelectedIndex()`、`calculateItemHeight()` — picker-group 保留原样，picker-view-column 自己写适合 children 模式的版本
- 其他 picker 专有：`requestAccessibilityFocusOnView`、`usePickerItemScrollIntoView`、`PickerGroupProps`、`getIndicatorStyle`

picker-group 改动：仅删除 `resolveUseMeasuredScale` 和 `MIN_DESIGN_APP_VERSION` 的定义，改为 `import { resolveUseMeasuredScale } from '../../utils/picker-scale'`。零行为变化。

## 任务 2：`picker-view-column.tsx`

参考 picker-group 滚动机制，但渲染用户 children：
- `React.Children.toArray(children)` 过滤有效节点 → itemCount
- 每个 child 包固定高度容器 `<View style={{ height: itemHeight, overflow: 'hidden' }}>`（决策 #3）
- 滚动用 `index × itemHeight`，参考 `picker-group.tsx:232-261` 的 100ms debounce `handleScrollEnd`
- **三重滚动隔离**（参考 picker-group）：
  - `isTouchingRef`：用户触摸中屏蔽外部 value 更新（`picker-group.tsx:190`）
  - `syncScrollFromPropsRef`：编程式滚动后 400ms 内抑制 onChange 上报，防止 ScrollView 异步 onScrollEnd 导致死循环（`picker-group.tsx:185, 218-225`）
  - `selectedIndexPropRef`：跟踪最新 prop 值，scroll 位置已匹配 prop 时跳过上报（`picker-group.tsx:183-184`）
- `onTouchStart` → 上报 pickStart；debounce 结束 → 上报 index + pickEnd（决策 #5）
- **`getSelectedIndex` 缩放公式**（不能简化为 `Math.round(scrollTop/itemHeight)`）：
  - `useMeasuredScale=false` 或 harmony：`Math.round(scrollTop / itemHeight)`
  - `useMeasuredScale=true` 且非 harmony：`Math.round(scrollTop / lengthScaleRatio / itemHeight)`
- `immediateChange=true`：touchend 时刻用上述公式报最近项，**同时跳过 debounce 路径的 onChange**（一次手势只触发一次 change）（决策 #8）
- `immediateChange=false`（默认）：仅 debounce 结束后报 onChange
- 越界 clamp：`>=count`→末项，`<0`→0（决策 #4）
- 从 `utils/picker-scale` 导入 `resolveUseMeasuredScale`（判断是否启用平台缩放）
- 自行实现 `calculateLengthScaleRatio`、`setTargetScrollTopWithScale`、`getSelectedIndex` 的对应逻辑（各组件各自写计算部分）

**itemHeight 确定流程**（由 picker-view 容器负责，column 只消费）：
- column 接收父组件通过 cloneElement 注入的 `itemHeight`，兜底 34px
- 量测逻辑在 picker-view.tsx 中（见任务 3）

内部接收的 props（非小程序对外 API，仅父子通信）：`itemHeight`、`paddingVertical`、`selectedIndex`、`columnId`、`immediateChange`、上报回调。

## 任务 3：`picker-view.tsx`

容器，管理 value 数组：
- **itemHeight 确定**：优先用 `itemHeight` prop；其次渲染 indicator 后 `useLayoutEffect` 量 `indicatorRef.offsetHeight`；兜底 34px
- 受控/非受控：有 `value`→受控；无则用 `defaultValue` 初始化，后续内部 state（决策 #1）
- `value` deep 比较用 `JSON.stringify`（参考 `picker/index.tsx:401`）
- 按列收集 index → `onChange({ detail: { value } })`
- children 数量变化 → clamp 越界 + 触发 onChange（决策 #9）
- 列数变化 → 截断/补零 + 触发 onChange（决策 #10）
- 非 picker-view-column 直接子节点 → 开发环境 `console.warn` + 过滤（决策 #14）
- **父子通信**：`React.Children.map` 遍历子节点 + `React.cloneElement` 注入内部 props（itemHeight、paddingVertical、selectedIndex、columnId、immediateChange、回调）。因为已规定直接子级必须是 PickerViewColumn，cloneElement 足够。
- 渲染 indicator（选中框）+ mask（渐变蒙层），把 itemHeight/paddingVertical 下发给每列

## 任务 4：`style/index.scss`

- 复用 `picker/style/variable.scss` 的颜色 / z-index 变量
- `.taro-picker-view__indicator`（选中框，支持 `indicatorClass`）
- `.taro-picker-view__mask`（渐变蒙层，支持 `maskClass`）
- `indicatorStyle` / `maskStyle` 通过 inline style 注入

## 任务 5：barrel export

`src/index.react.ts:56` 由：
```ts
export { PickerView, PickerViewColumn } from '@tarojs/components/lib/react'
```
改为：
```ts
export { PickerView, PickerViewColumn } from './components/picker-view'
```

## Props 接口（对齐 `taro-components/types/PickerView.d.ts`）

**PickerView**：

| Prop | 类型 | 来源 |
|------|------|------|
| `value` | `number[]` | 小程序 |
| `defaultValue` | `number[]` | 小程序 |
| `indicatorStyle` / `indicatorClass` | `string` | 小程序 |
| `maskStyle` / `maskClass` | `string` | 小程序 |
| `immediateChange` | `boolean`（默认 false） | 小程序 |
| `onChange` / `onPickStart` / `onPickEnd` | `CommonEventFunction` | 小程序 |
| `title` | `string` | 小程序（swan） |
| `ariaLabel` | `string` | 小程序（qq） |
| `itemHeight` / `visibleItems` | `number` | **扩展（超集）** |

继承 `StandardProps`（`id`、`className`、`style` 等），剩余 props spread 到根元素。

**PickerViewColumn**：继承 `StandardProps`（`id`、`className`、`style` 等），剩余 props spread 到根元素。无额外专有 props，children 由父组件包裹定高容器后渲染。

## 无障碍（第一版）

- 不做主动聚焦（不实现 `requestAccessibilityFocusOnView` 那套逻辑）
- 保留滚动聚焦：滚动停止吸附后，选中项自然获得焦点（依赖 ScrollView 原生行为）
- picker-view-column 每个 child 容器加 `aria-role="option"`
- picker-view-column 根容器加 `role="listbox"`
- 选中项标记 `aria-selected="true"`

## 10 个已确认决策点

1. `defaultValue`：有 value→受控；无则 defaultValue 初始化；都无→全 0
2. indicator 高度：ref 量 `offsetHeight`，兼容任意 CSS 单位
3. 子节点高度：每项包固定高度容器，保证 `index×itemHeight` 计算可靠
4. value 越界：`>=count`→末项，`<0`→0，数组短→补 0，长→忽略
5. onPickStart/End：每列独立透传，不去重
6. 滚动锁定：按列锁定（各列独立 isTouchingRef）
7. 平台缩放：仅共享 `resolveUseMeasuredScale` 判断方法，计算各自实现
8. immediateChange=true：touchend 用 getSelectedIndex 缩放公式报最近项（含 lengthScaleRatio 路径），同时跳过 debounce 路径
9. 动态增减 children：clamp + 触发 onChange
10. 动态增减列：截断/补零 + 触发 onChange

## 验证

1. **类型检查**：`cd packages/taro-components-react && npx tsc --noEmit`
2. **构建**：`pnpm build`（确认 barrel 替换无报错）
3. **行为**：用 `PickerView.d.ts:64-135` 官方三列日期示例验证滚动、选中、onChange、indicatorStyle 高度生效、受控 value 跳转
4. **回归**：确认抽取 utils 后，原 Picker 的 selector/multiSelector/time/date/region 5 种 mode 仍正常
