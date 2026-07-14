/**
 * @tarojs/project-graph
 *
 * Taro 工具链的统一项目理解层：把一个 Taro 项目解析成结构化、可查询、可增量
 * 更新的内存图，供 taro-pilot / doctor / IDE / MCP 等共用同一份事实。
 *
 * 对标 @vue/language-core 在 Vue 生态的底层地位（对标生态位，不复刻其规模）。
 *
 * 公共 API 面：schema 类型 + 查询契约（含唯一创建入口 createProjectGraph）。
 * config 解析等实现细节（config-parser 等）不对外导出，仅供包内任务使用。
 */

export * from './query'
export * from './schema'
