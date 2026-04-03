# MapContext 方案 F（Window 桥接）评估

## 结论

方案 F 整体可行，建议作为主线实施。  
核心思路"`components-react` 侧构造 `MapContextImpl`，`taro-h5` 侧只通过运行时对象拿 `Taro.MapContext` 接口"符合当前包分层。

- 架构合理性：8/10
- 工程风险：中等（主要在时序和兼容）
- 建议：可推进，但先补关键修正再落地

---

## 现状对照（仓库当前实现）

### 1) `taro-h5` 仍未支持 `createMapContext`

文件：`packages/taro-h5/src/api/media/map.ts`

当前为 `temporarilyNotSupport('createMapContext')`，说明方案里将其改为真正实现是必要步骤。

### 2) `components-react` 当前自己实现了 `createMapContext`

文件：`packages/taro-components-react/src/components/map/createMapContext.ts`

当前逻辑是通过 `getMapInstance(mapId)` 获取地图实例并 `new MapContextImpl(mapInstance)` 返回。

### 3) `Map` 组件仍在临时导出 `createMapContext`

文件：`packages/taro-components-react/src/components/map/index.tsx`

存在注释“临时导出，后续需要调整”，与方案中“职责回归 taro-h5”方向一致。

---

## 方案优势

1. **分层清晰**  
   `TMap` 相关类型和实现留在 `components-react`，`taro-h5` 只暴露统一 API。

2. **避免错误依赖扩散**  
   不要求 `taro-h5` 引入 `tmap-gl-types`，保持框架层中立。

3. **实现成本可控**  
   基于现有 `registerMapInstance/unregisterMapInstance` 生命周期扩展即可。

4. **多实例天然支持**  
   `Map<string, ...>` 结构可覆盖多地图实例场景。

---

## 关键风险与改进建议（按优先级）

### 高优先级 1：时序问题（Dummy 固化对象风险）

**问题**：如果 `createMapContext` 在地图初始化前调用并返回固定 dummy 对象，业务方缓存后会“永久失效”。

**建议**：改为“惰性代理（lazy resolve）”：
- `createMapContext(mapId)` 返回代理对象；
- 每次调用方法时动态从 `window.__TARO_MAP_CONTEXTS__` 按 `mapId` 取最新实例；
- 未就绪时再返回 fail/warn，避免早取导致永久失败。

---

### 高优先级 2：兼容性问题（直接删除导出可能破坏存量）

**问题**：直接删除 `components-react` 的 `createMapContext` 导出可能引发现有调用 break。

**建议**：
- 过渡期保留导出并标记 deprecated；
- 内部转调 `Taro.createMapContext`（或短期保留旧实现）；
- 经过一个版本周期后再移除。

---

### 中优先级 3：非浏览器环境安全

**问题**：直接访问 `window` 在 SSR/预渲染场景会报错。

**建议**：
- 所有读写 `window.__TARO_MAP_CONTEXTS__` 逻辑加 `typeof window !== 'undefined'` 防护；
- 在非浏览器端返回可预期降级行为（warning + fail）。

---

### 中优先级 4：接口维护成本

**问题**：手写完整 `createDummyContext()` 方法列表，后续 `Taro.MapContext` 类型变化时易漏改。

**建议**：
- 统一兜底实现（如 `Proxy`）减少样板代码；
- 或抽取公共失败处理器，避免重复维护几十个方法。

---

## 推荐落地顺序

1. 在 `MapContext.ts` 增加 window 注册/清理（保持现有调用方式不变）。
2. 在 `taro-h5/src/api/media/map.ts` 实现 `createMapContext`（含 window 防护 + 惰性解析）。
3. 保留 `components-react` 导出作为兼容层，并加 deprecated 标识。
4. 增加/完善测试（基础功能、多实例、异常路径）。
5. 观察一版后，再决定是否删除兼容导出。

---

## 验收清单（建议）

- `Taro.createMapContext(id)` 在地图初始化后可获取可用上下文；
- 初始化前调用不会导致“永久 dummy”；
- 多地图实例隔离无串用；
- 组件卸载后注册表及时清理；
- SSR/非浏览器环境不抛异常；
- `taro-h5` 不新增 `tmap-gl-types` 依赖；
- 类型检查与构建通过。

---

## 总体判断

方案 F 是当前约束下的最优方向。  
只要修正“时序（惰性代理）+ 兼容（过渡导出）+ 环境防护（window guard）”这三类问题，基本可以稳定落地。
