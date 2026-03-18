export default {
  // newBlended 模式需要至少一个页面，这里使用主入口组件作为页面
  pages: ['pages/index/index'],
  components: [
    // 子分包组件
    'pages/sub1/index',
    'pages/sub2/index',
  ],
  // 子分包独立模板配置
  subPackageIndie: {
    // 主入口分包根路径（runtime chunks 将生成到此目录）
    mainPackageRoot: 'pages/index/index',
    // 子组件分包根路径列表
    subPackageRoots: ['pages/sub1/index', 'pages/sub2/index'],
  },
}
