// Note: 避免 Vue 自定义类型造成全局类型污染，此处使用过 any 替代 App 类型
export type PluginInstallFunction = (app: any, ...options: any[]) => any
export type VuePlugin = (PluginInstallFunction & {
  install?: PluginInstallFunction
}) | {
  install: PluginInstallFunction
}
