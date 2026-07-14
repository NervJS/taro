/**
 * @tarojs/project-graph
 *
 * Taro 工具链的统一项目理解层：把一个 Taro 项目解析成结构化、可查询、可增量
 * 更新的内存图，供 taro-pilot / doctor / IDE / MCP 等共用同一份事实。
 *
 * 对标 @vue/language-core 在 Vue 生态的底层地位（对标生态位，不复刻其规模）。
 *
 * 任务 0：仅导出 schema 类型与查询 API 契约。解析与查询实现见后续任务。
 */

export * from './query'
export * from './schema'
