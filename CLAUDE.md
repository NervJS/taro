# Map 组件适配专项

本项目正在为 `@tarojs/taro-components-react` 中的 Map 组件适配腾讯地图（`tlbs-map-react`）。

## 目标

将 Taro 统一的 Map 组件 API 适配到 `tlbs-map-react`（基于腾讯位置服务 JavaScript API），实现跨平台统一的地图功能。

## 核心文件

| 文件 | 说明 |
|------|------|
| `packages/taro-components-react/src/components/map/index.tsx` | Map 组件主要实现 |
| `packages/taro-components-react/package.json` | 依赖配置 |

## 第三方依赖

### tlbs-map-react

- **npm**: `tlbs-map-react`
- **版本**: `^1.1.0`
- **GitHub**: https://github.com/Tencent/tlbs-map-react
- **文档**: https://mapapi.qq.com/web/tlbs-map-react/index.html
- **本地源码**: `/Users/zhengyanan18/Desktop/work-git/tlbs-map-react`（已切换到 1.1.0 对应代码，需要时可自行查阅）

### 主要组件

```tsx
import { TMap, MultiMarker, MultiPolyline } from 'tlbs-map-react'
```

| 组件 | 用途 |
|------|------|
| `TMap` | 地图主组件 |
| `MultiMarker` | 多标记点渲染 |
| `MultiPolyline` | 多路线渲染 |

## API 适配对照表

### TMap Options

| Taro Props | tlbs-map-react | 类型 | 默认值 |
|------------|---------------|------|-------|
| `latitude` / `longitude` | `options.center` | `{lat, lng}` | - |
| `scale` | `options.zoom` | `number` | 13 |
| `minScale` | `options.minZoom` | `number` | 3 |
| `maxScale` | `options.maxZoom` | `number` | 20 |
| `enableRotate` | `options.rotatable` | `boolean` | true |

### Markers

| Taro Props | tlbs-map-react | 说明 |
|------------|---------------|------|
| `id` | `id` | 标记点 ID |
| `latitude` | `position.lat` | 纬度 |
| `longitude` | `position.lng` | 经度 |
| `iconPath` | `src` | 图标路径 |
| `width` | `width` | 宽度（支持 number/string） |
| `height` | `height` | 高度（支持 number/string） |
| `rotate` | `rotation` | 旋转角度 0-360 |
| `alpha` | `opacity` | 透明度 0-1 |
| `zIndex` | `zIndex` | 显示层级 |

**样式结构**:
```tsx
styles: {
  'marker-{id}': {
    width: number,
    height: number,
    anchor: { x: number, y: number },  // 锚点位置
    src?: string,                       // iconPath
    rotation?: number,                  // rotate
    opacity?: number,                  // alpha
    zIndex?: number,
  }
}

geometries: [{
  id: string,
  styleId: string,
  position: { lat: number, lng: number },
}]
```

**锚点说明**: `anchor` 指定图标上哪个点与地图坐标对齐
- 底部中心: `{x: width / 2, y: height}` （当前默认）
- 中心点: `{x: width / 2, y: height / 2}`

### Polyline

| Taro Props | 腾讯地图 API | 说明 |
|------------|-------------|------|
| `points` | `paths` | 坐标点数组 |
| `color` | `color` | 线条颜色（hex/rgb/rgba） |
| `width` | `width` | 线条宽度（像素） |
| `dottedLine` | `dashArray` | 虚线数组 [10,10]虚线, [0,0]实线 |
| `arrowLine` | `showArrow` | 带箭头的线（待适配） |
| `arrowIconPath` | `arrowOptions` | 更换箭头图标（待适配） |
| `borderColor` | `borderColor` | 线的边框颜色（待适配） |
| `borderWidth` | `borderWidth` | 线的厚度（待适配） |

**注意**: Taro polyline 类型没有 `id` 属性，使用数组索引作为 id。

**坐标转换**: `points` 中每个点从 `{latitude, longitude}` 转为 `{lat, lng}`

**样式结构**:
```tsx
styles: {
  'polyline-{index}': {
    color: string,      // 线条颜色，支持 rgb(), rgba(), #RRGGBB
    width: number,      // 线条宽度（像素）
    dashArray: number[], // 虚线：[10, 10] 表示10像素实线+10像素空白
    borderColor: string, // 边线颜色
    borderWidth: number,  // 边线宽度
  }
}

geometries: [{
  id: string,  // 使用数组索引
  styleId: string,
  paths: [{ lat: number, lng: number }, ...],
}]
```

## 待适配功能

- [ ] `enable3D` - 3D 楼块效果
- [ ] `enableOverlooking` - 俯视功能
- [ ] `enableZoom` - 缩放控制
- [ ] `enableScroll` - 拖动控制
- [ ] `enableSatellite` - 卫星图
- [ ] `enableTraffic` - 实时路况
- [ ] `enableBuilding` - 建筑显示
- [ ] `enableAutoMaxOverlooking` - 最大俯视角
- [ ] `showCompass` - 指南针
- [ ] `showScale` - 比例尺
- [ ] `rotate` / `skew` - 地图旋转/倾斜
- [ ] `polygons` - 多边形
- [ ] `circles` - 圆形
- [ ] `callout` - 气泡窗口
- [ ] `label` - 标签
- [ ] 地图事件（onTap, onMarkerTap, onPolylineTap 等）

## 参考实现

- **原生 H5 Map**: `packages/taro-components/src/components/map/map.tsx`
- **Taro Map 类型定义**: `packages/taro-components/types/Map.d.ts`
- **腾讯地图 JS API**: https://lbs.qq.com/javascript_gl/guide-polyline.html

## 开发规范

### 1. 属性转换模式

```tsx
// 每个标记点独立生成 styleId，避免样式冲突
const styleId = `marker-${markerId}`

// 可选属性使用条件展开
...(typeof m.rotate === 'number' && { rotation: m.rotate })
```

### 2. 坐标转换

```tsx
// Taro 使用 {latitude, longitude}
// tlbs-map-react 使用 {lat, lng}
{ lat: point.latitude, lng: point.longitude }
```

### 3. 尺寸解析

```tsx
const parseSize = (size: number | string | undefined): number => {
  if (typeof size === 'number') return size
  if (typeof size === 'string') {
    const parsed = parseInt(size, 10)
    return isNaN(parsed) ? 20 : parsed
  }
  return 20
}
```

### 4. 组件渲染条件

```tsx
// 使用数组长度判断，而非直接判断 undefined
{normalizedMarkers.length > 0 ? (
  <MultiMarker styles={markerStyles} geometries={markerGeometries} />
) : null}
```

## Commit 规范

本项目遵循 Taro 仓库的 commit 规范，提交时请使用 `feat(components-react):` 前缀。

```
feat(components-react): map 支持 polyline 渲染
fix(components-react): map 修复 anchor 锚点计算错误
```
