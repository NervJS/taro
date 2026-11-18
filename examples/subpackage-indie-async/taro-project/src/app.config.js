// 顶层 asyncSubPackages 按源码模块指定动态 import 产物的输出目录，
// 不依赖 subPackageIndie 是否存在。
export default {
  pages: [],
  subPackages: [
    { root: 'pages/sub1', pages: ['index'] },
    { root: 'pages/sub2', pages: ['index'] },
  ],
  // test 匹配 sourceRoot 相对路径，root 为 outputRoot 相对目录。
  asyncSubPackages: [
    { test: 'pages/sub1/OnlySub1', root: 'pages/sub1-async' },
    { test: 'pages/sub2/OnlySub2', root: 'pages/sub2-async' },
    { test: 'components/SharedBySub1Sub2', root: 'pages/shared-async' },
    {
      test: 'components/heavy-content/index',
      root: 'pages/heavy-async',
      priority: 10,
    },
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Async SubPackage 示例',
    navigationBarTextStyle: 'black',
  },
  lazyCodeLoading: 'requiredComponents',
}
