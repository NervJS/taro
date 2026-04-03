# Taro Map组件现状调研报告

> 调研时间: 2026-03-18
> 调研目的: 为H5端Map组件底层切换腾讯地图做前置调研

---

## 一、H5端Map组件现状

### 1.1 底层实现

| 项目 | 内容 |
|------|------|
| **当前使用** | 百度地图GL版 (BMapGL) |
| **文件位置** | `packages/taro-components/src/components/map/map.tsx` |
| **技术栈** | Stencil.js + 百度地图JavaScript API GL版 |
| **代码行数** | ~1545行 |

### 1.2 属性实现情况

#### 已实现的属性

| 属性 | 状态 | 说明 |
|------|------|------|
| `latitude`/`longitude` | ✅ | 中心经纬度 |
| `scale` | ✅ | 缩放级别 |
| `minScale`/`maxScale` | ✅ | 最小/最大缩放 |
| `markers` | ✅ | 标记点（基础功能） |
| `polyline` | ✅ | 路线 |
| `circles` | ✅ | 圆形覆盖物 |
| `polygons` | ✅ | 多边形 |
| `rotate` | ✅ | 旋转角度 |
| `skew` | ✅ | 倾斜角度 |
| `showCompass` | ✅ | 指南针 |
| `showScale` | ✅ | 比例尺 |
| `enableOverlooking` | ✅ | 俯视 |
| `enableZoom` | ✅ | 缩放控制 |
| `enableScroll` | ✅ | 拖动控制 |
| `enableRotate` | ✅ | 旋转控制 |
| `enableSatellite` | ✅ | 卫星图 |
| `enableTraffic` | ✅ | 实时路况 |
| `enableBuilding` | ✅ | 建筑物显示 |
| `enable3D` | ✅ | 3D楼块 |
| `enableAutoMaxOverlooking` | ✅ | 最大俯视角 |
| `subkey`/`layerStyle` | ✅ | 个性化地图 |

#### 未实现的属性

| 属性 | 状态 | 说明 |
|------|------|------|
| `showLocation` | ❌ | 显示带有方向的当前定位点 |
| `enablePoi` | ❌ | 是否展示POI点 |
| `setting` | ❌ | 统一设置地图配置 |
| `includePoints` | ❌ | 缩放视野以包含所有给定的坐标点 |
| `covers` | ❌ | 即将移除，用markers替代 |
| `controls` | ❌ | 即将废弃，用cover-view替代 |

### 1.3 事件实现情况

| 事件 | 状态 | 说明 |
|------|------|------|
| `onTap` | ✅ | 点击地图 |
| `onMarkerTap` | ⚠️ | 部分实现（通过title模拟） |
| `onCalloutTap` | ⚠️ | 部分实现 |
| `onLabelTap` | ❌ | 未实现 |
| `onControlTap` | ❌ | 未实现 |
| `onRegionChange` | ❌ | 未实现 |
| `onUpdated` | ❌ | 未实现 |
| `onPoiTap` | ❌ | 未实现 |
| `onAnchorPointTap` | ❌ | 未实现 |
| `onError` | ❌ | 未实现 |
| `onAbilitySuccess` | ❌ | 未实现 |
| `onAbilityFailed` | ❌ | 未实现 |
| `onAuthSuccess` | ❌ | 未实现 |
| `onInterpolatePoint` | ❌ | 未实现 |
| `onCallOutTap` | ❌ | 未实现 |
| `onPanelTap` | ❌ | 未实现（支付宝特有） |
| `onInitComplete` | ❌ | 未实现（支付宝特有） |

### 1.4 MapContext 方法实现情况

组件内部已实现但未暴露的方法：

| 方法 | 状态 | 说明 |
|------|------|------|
| `getCenterLocation` | ✅ | 获取当前地图中心的经纬度 |
| `setLocMarkerIcon` | ✅ | 设置定位点图标 |
| `translateMarker` | ✅ | 平移marker，带动画 |
| `moveAlong` | ✅ | 沿指定路径移动marker |
| `includePoints` | ✅ | 缩放视野展示所有经纬度 |
| `getRegion` | ✅ | 获取当前地图的视野范围 |
| `getRotate` | ✅ | 获取当前地图的旋转角 |
| `getSkew` | ✅ | 获取当前地图的倾斜角 |
| `getScale` | ✅ | 获取当前地图的缩放级别 |
| `setCenterOffset` | ✅ | 设置地图中心点偏移 |
| `addGroundOverlay` | ✅ | 创建自定义图片图层 |
| `updateGroundOverlay` | ✅ | 更新自定义图片图层 |
| `removeGroundOverlay` | ✅ | 移除自定义图片图层 |
| `setBoundary` | ✅ | 限制地图的显示范围 |
| `addMarkers` | ✅ | 添加marker |
| `removeMarkers` | ✅ | 移除marker |

未实现的方法：

| 方法 | 状态 | 说明 |
|------|------|------|
| `moveToLocation` | ❌ | 将地图中心移置当前定位点 |
| `addCustomLayer` | ❌ | 添加个性化图层 |
| `removeCustomLayer` | ❌ | 移除个性化图层 |
| `addVisualLayer` | ❌ | 添加可视化图层 |
| `removeVisualLayer` | ❌ | 移除可视化图层 |
| `addArc` | ❌ | 添加弧线 |
| `removeArc` | ❌ | 删除弧线 |
| `initMarkerCluster` | ❌ | 初始化点聚合配置 |
| `on` | ❌ | 监听地图事件 |
| `toScreenLocation` | ❌ | 获取经纬度对应的屏幕坐标 |
| `fromScreenLocation` | ❌ | 获取屏幕上的点对应的经纬度 |
| `openMapApp` | ❌ | 拉起地图APP选择导航 |

### 1.5 H5端API层现状

```typescript
// packages/taro-h5/src/api/media/map.ts
import { temporarilyNotSupport } from '../../utils'

// 地图
export const createMapContext = /* @__PURE__ */ temporarilyNotSupport('createMapContext')
```

**问题**: H5端`createMapContext`标记为"暂不支持"，但组件内部已实现大部分方法，只是没有通过API层暴露。

### 1.6 已知实现问题

1. **硬编码的AK**: 百度地图AK硬编码在代码中（`Mb1FLBD3gfnY6bup4v6zEWh6MXwsZ9eo`）
2. **marker点击事件**: 使用Hammer.js模拟，精确度不够
3. **callout实现**: 使用InfoWindow模拟，样式与小程序不一致
4. **坐标转换**: 缺少BD09到GCJ02的转换
5. **TypeScript支持**: 类型定义不完整
6. **代码注释**: 多处标注"问题"，如polyline、circles等

---

## 二、微信小程序端Map组件情况

### 2.1 类型定义位置

| 文件 | 说明 |
|------|------|
| `packages/taro/types/api/media/map.d.ts` | Taro类型定义 |
| `node_modules/miniapp-types/dist/types/weapp/map.d.ts` | 微信小程序原生类型 |

### 2.2 完整属性列表

微信小程序支持的所有属性（@supported weapp）：

```
✅ longitude           - 中心经度
✅ latitude            - 中心纬度
✅ scale               - 缩放级别(3-20)
✅ min-scale           - 最小缩放级别
✅ max-scale           - 最大缩放级别
✅ markers             - 标记点
⚠️ covers              - 即将移除，请使用markers
✅ polyline            - 路线
✅ circles             - 圆
⚠️ controls            - 即将废弃，建议使用cover-view
✅ include-points      - 缩放视野以包含所有给定的坐标点
✅ show-location       - 显示带有方向的当前定位点
✅ polygons            - 多边形
✅ subkey              - 个性化地图使用的key
✅ layer-style         - 个性化地图配置的style
✅ rotate              - 旋转角度(0~360)
✅ skew                - 倾斜角度(0~40)
✅ enable-3D           - 展示3D楼块
✅ show-compass        - 显示指南针
✅ show-scale          - 显示比例尺
✅ enable-overlooking  - 开启俯视
✅ enable-auto-max-overlooking - 开启最大俯视角(45度拓展到75度)
✅ enable-zoom         - 是否支持缩放
✅ enable-scroll       - 是否支持拖动
✅ enable-rotate       - 是否支持旋转
✅ enable-satellite    - 是否开启卫星图
✅ enable-traffic      - 是否开启实时路况
✅ enable-poi          - 是否展示POI点
✅ enable-building     - 是否展示建筑物
✅ setting             - 配置项(setting对象统一设置)
```

### 2.3 完整事件列表

| 事件 | 说明 |
|------|------|
| `bindtap` | 点击地图时触发 |
| `bindmarkertap` | 点击标记点时触发，e.detail = {markerId} |
| `bindlabeltap` | 点击label时触发，e.detail = {markerId} |
| `bindcontroltap` | 点击控件时触发，e.detail = {controlId} |
| `bindcallouttap` | 点击标记点对应的气泡时触发 |
| `bindupdated` | 在地图渲染更新完成时触发 |
| `bindregionchange` | 视野发生变化时触发 |
| `bindpoitap` | 点击地图poi点时触发，e.detail = {name, longitude, latitude} |
| `bindanchorpointtap` | 点击定位标时触发，e.detail = {longitude, latitude} |

### 2.4 MapContext 完整API

Taro声明的所有方法（@supported weapp, tt）：

```typescript
interface MapContext {
  getCenterLocation(option?)  // 获取当前地图中心的经纬度
  setLocMarkerIcon(option?)   // 设置定位点图标
  moveToLocation(option)      // 将地图中心移置当前定位点
  translateMarker(option)     // 平移marker，带动画
  moveAlong(object)           // 沿指定路径移动marker
  includePoints(option)       // 缩放视野展示所有经纬度
  getRegion(option?)          // 获取当前地图的视野范围
  getRotate(option?)          // 获取当前地图的旋转角
  getSkew(option?)            // 获取当前地图的倾斜角
  getScale(option?)           // 获取当前地图的缩放级别
  setCenterOffset(option)     // 设置地图中心点偏移
  removeCustomLayer(option)   // 移除个性化图层
  addCustomLayer(option)      // 添加个性化图层
  addGroundOverlay(option)    // 创建自定义图片图层
  addVisualLayer(option)      // 添加可视化图层
  removeVisualLayer(option)   // 移除可视化图层
  addArc(option)              // 添加弧线
  removeArc(option)           // 删除弧线
  setBoundary(option)         // 限制地图的显示范围
  updateGroundOverlay(option) // 更新自定义图片图层
  removeGroundOverlay(option) // 移除自定义图片图层
  toScreenLocation(option)    // 获取经纬度对应的屏幕坐标
  fromScreenLocation(option)  // 获取屏幕上的点对应的经纬度
  openMapApp(option)          // 拉起地图APP选择导航
  addMarkers(option)          // 添加marker
  removeMarkers(option)       // 移除marker
  initMarkerCluster(option?)  // 初始化点聚合的配置
  on(event, callback)         // 监听地图事件
}
```

---

## 三、H5端与微信小程序端差异对比

### 3.1 核心差异

| 维度 | H5端(百度地图) | 微信小程序 |
|------|----------------|------------|
| **底层地图引擎** | 百度地图GL版 | 腾讯地图(微信内置) |
| **坐标系** | BD09 | GCJ02 |
| **API暴露方式** | 组件内部方法，未暴露 | 完整的MapContext API |
| `createMapContext` | ❌ 标记为不支持 | ✅ 完整支持 |

### 3.2 功能对齐情况汇总

| 类别 | H5已实现 | H5未实现 | 微信小程序总数 |
|------|----------|----------|----------------|
| **属性** | 20个 | 6个 | 26个 |
| **事件** | 3个 | 12个 | 15个 |
| **MapContext方法** | 16个 | 13个 | 29个 |

### 3.3 详细差异清单

#### 属性差异

```diff
+ showLocation          // H5未实现：显示带有方向的当前定位点
+ enablePoi            // H5未实现：是否展示POI点
+ setting              // H5未实现：统一设置地图配置
+ includePoints        // H5未实现：缩放视野以包含所有给定的坐标点
```

#### 事件差异

```diff
+ onMarkerTap          // H5未完整实现：点击标记点
+ onLabelTap           // H5未实现：点击label
+ onControlTap         // H5未实现：点击控件
+ onRegionChange       // H5未实现：视野变化
+ onUpdated            // H5未实现：渲染更新完成
+ onPoiTap             // H5未实现：点击POI点
+ onAnchorPointTap     // H5未实现：点击定位标
+ onError              // H5未实现：组件错误
```

#### MapContext方法差异

```diff
+ moveToLocation       // H5未实现：移动到当前定位点
+ addCustomLayer       // H5未实现：添加个性化图层
+ removeCustomLayer    // H5未实现：移除个性化图层
+ addVisualLayer       // H5未实现：添加可视化图层
+ removeVisualLayer    // H5未实现：移除可视化图层
+ addArc               // H5未实现：添加弧线
+ removeArc            // H5未实现：删除弧线
+ initMarkerCluster    // H5未实现：点聚合
+ on                   // H5未实现：事件监听
+ toScreenLocation     // H5未实现：经纬度转屏幕坐标
+ fromScreenLocation   // H5未实现：屏幕坐标转经纬度
+ openMapApp           // H5未实现：拉起地图APP
```

---

## 四、切换腾讯地图的建议

### 4.1 技术方案

如果要将H5端Map底层从百度地图切换为腾讯地图：

1. **坐标系统一**
   - 腾讯地图使用GCJ02坐标系
   - 与微信小程序一致，无需坐标转换

2. **API差异**
   - 腾讯地图JavaScript API与百度地图API有差异
   - 需要重新封装适配层

3. **个性化地图**
   - 腾讯地图的个性化地图配置与百度地图不同
   - 需要重新设计配置方式

4. **性能测试**
   - 腾讯地图在H5端的性能表现需要测试
   - 特别关注marker数量较多时的表现

### 4.2 实现建议

#### 阶段一：基础功能对齐
- [ ] 替换地图引擎为腾讯地图
- [ ] 实现所有基础属性
- [ ] 实现基础事件（tap、markertap等）
- [ ] 暴露createMapContext API

#### 阶段二：高级功能对齐
- [ ] 实现MapContext所有方法
- [ ] 实现高级覆盖物（弧线、自定义图层等）
- [ ] 实现点聚合功能
- [ ] 实现事件监听机制

#### 阶段三：优化与完善
- [ ] 性能优化
- [ ] TypeScript类型完善
- [ ] 单元测试覆盖
- [ ] 文档更新

### 4.3 风险提示

1. **坐标系兼容性**: 现有用户数据可能使用BD09坐标，需要转换
2. **API兼容性**: 腾讯地图API与百度地图API差异较大
3. **个性化地图**: 现有用户的个性化地图配置可能不兼容
4. **性能差异**: 腾讯地图在H5端的性能表现需要验证

---

## 五、相关文件清单

### H5端Map组件

| 文件路径 | 说明 |
|----------|------|
| `packages/taro-components/src/components/map/map.tsx` | Map组件主实现 |
| `packages/taro-components/src/components/map/style/map.scss` | 样式文件 |
| `packages/taro-components/src/components/map/readme.md` | 组件文档 |
| `packages/taro-components/__tests__/map.spec.tsx` | 单元测试 |
| `packages/taro-h5/src/api/media/map.ts` | H5 API层 |

### 类型定义

| 文件路径 | 说明 |
|----------|------|
| `packages/taro-components/types/Map.d.ts` | Map组件Props类型 |
| `packages/taro/types/api/media/map.d.ts` | MapContext类型定义 |

### 示例代码

| 文件路径 | 说明 |
|----------|------|
| `examples/mini-program-example/src/pages/component/map/map.js` | 小程序示例 |
| `examples/mini-program-example/src/pages/api/media/map/index.tsx` | API示例 |

---

## 六、总结

当前H5端Map组件基于百度地图GL版实现，实现了约70%的小程序Map功能，但存在以下主要问题：

1. **API层未暴露**: `createMapContext`标记为不支持，组件内部方法无法使用
2. **事件不完善**: 大部分事件未实现或实现不完整
3. **坐标系不一致**: 百度地图使用BD09，小程序使用GCJ02
4. **代码质量问题**: 存在硬编码、模拟实现等问题

切换腾讯地图可以解决坐标系不一致的问题，但需要重新实现大部分功能，工作量较大。

---

*文档生成时间: 2026-03-18*
