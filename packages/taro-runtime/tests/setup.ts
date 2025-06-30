// Vitest setup file
process.env.TARO_ENV = 'weapp'
process.env.TARO_PLATFORM = 'mini'

// Define globals for Vitest
;(global as any).ENABLE_INNER_HTML = true
;(global as any).ENABLE_ADJACENT_HTML = true
;(global as any).ENABLE_SIZE_APIS = true
;(global as any).ENABLE_TEMPLATE_CONTENT = true
;(global as any).ENABLE_MUTATION_OBSERVER = true
;(global as any).ENABLE_CLONE_NODE = true
;(global as any).ENABLE_CONTAINS = true

export {}
