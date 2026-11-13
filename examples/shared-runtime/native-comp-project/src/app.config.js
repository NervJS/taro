// native-components 模式：只声明 components,不含 pages 字段。
// BuildNativePlugin.getPages (webpack5-runner/src/plugins/BuildNativePlugin.ts) 读 components,
// 不读 pages;此时 pages 字段可以完全省略,不会触发 MiniPlugin 的 "全局配置缺少 pages 字段" 报错
// (走的是 BuildNativePlugin 分支而非 MiniPlugin)。
export default {
  components: [
    'components/counter/index',
  ],
}
