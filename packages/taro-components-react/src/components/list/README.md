# List 虚拟列表组件（分组吸顶/双层虚拟滚动）

高性能分组吸顶虚拟滚动列表，支持 StickySection/StickyHeader/ListItem 结构，分组头部吸顶、分组+item双层虚拟滚动、动态高度、极致性能，样式通过 className 绑定，风格与 Taro 官方组件一致。

## 主要特性
- 支持分组（StickySection）、分组头部吸顶（StickyHeader）、分组内容（ListItem）结构
- 分组+item双层虚拟滚动，极致性能
- 支持动态高度（header/item 渲染后自动测量）
- 支持 space、cacheCount、upper/lowerThresholdCount、onScroll/onScrollToUpper/onScrollToLower 等所有官方能力
- 样式全部通过 className 绑定，支持自定义覆盖

## 主要 className
- `.taro-list-container`：List 容器
- `.taro-list-sticky-header`：吸顶头部
- `.taro-list-section-header`：分组头部
- `.taro-list-section-item`：分组内 item

## 主要参数属性
| 属性 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| stickyHeader | 是否启用分组头部吸顶 | boolean | false |
| space | ListItem 之间的间距 | number \| string | 0 |
| cacheCount | 可视区外缓存渲染的分组/条目数 | number | 2 |
| upperThresholdCount | 距顶部多少分组触发 onScrollToUpper | number | 0 |
| lowerThresholdCount | 距底部多少分组触发 onScrollToLower | number | 0 |
| showScrollbar | 是否显示滚动条 | boolean | true |
| scrollY | 是否纵向滚动 | boolean | true |
| scrollX | 是否横向滚动 | boolean | false |
| height | 容器高度 | number \| string | 400 |
| width | 容器宽度 | number \| string | '100%' |
| onScroll | 滚动事件 | (e) => void | - |
| onScrollToUpper | 触顶事件 | () => void | - |
| onScrollToLower | 触底事件 | () => void | - |
| children | StickySection/StickyHeader/ListItem 结构 | ReactNode | - |

## Props 类型
详见 index.tsx 顶部 ListProps 注释，完全对齐 Taro 官方文档。

## 用法示例
```tsx
import List from './List'
import StickySection from './StickySection'
import StickyHeader from './StickyHeader'
import ListItem from './ListItem'

<List
  stickyHeader
  space={8}
  height={400}
  cacheCount={2}
  onScroll={...}
  onScrollToUpper={...}
  onScrollToLower={...}
>
  <StickySection>
    <StickyHeader>分组1头部</StickyHeader>
    <ListItem>分组1-Item1</ListItem>
    <ListItem>分组1-Item2</ListItem>
  </StickySection>
  <StickySection>
    <StickyHeader>分组2头部</StickyHeader>
    <ListItem>分组2-Item1</ListItem>
    ...
  </StickySection>
</List>
```

## 样式自定义
可通过覆盖 `.taro-list-*` className 或引入自定义 scss 文件实现主题化、风格扩展。

## 兼容性
- 支持 H5/小程序/鸿蒙等多端，性能极佳。
- 结构、API、样式风格与 Taro 官方组件完全一致。 