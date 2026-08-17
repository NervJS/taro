export default {
  navigationStyle: 'custom',
  usingComponents: {
    // 引用子分包中的组件
    list: '../sub1/index',
    detail: '../sub2/index',
  },
  // 异步加载占位符 - 跨分包引用必须配置
  componentPlaceholder: {
    list: 'view',
    detail: 'view',
  },
}
