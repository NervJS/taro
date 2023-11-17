// 设置是否打开调试开关
export * from './setEnableDebug'

// 获取实时日志管理器对象
export * from './getRealtimeLogManager'

// 获取日志管理器对象
export * from './getLogManager'

/**
 * 向调试面板中打印日志。console 是一个全局对象，可以直接访问。
 * 
 * @canUse console
 * @__class [debug, error, group, groupEnd, info, log, warn]
 */