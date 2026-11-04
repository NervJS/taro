// async-only 模式：省略 mainPackageRoot，让 sub1、sub2 直接成为已声明分包页面。
// 业务主包可以为空，但必须有已声明的分包页面。
export default {
  pages: [],
  subPackages: [
    { root: 'pages/sub1', pages: ['index'] },
    { root: 'pages/sub2', pages: ['index'] },
  ],
  // async-only 模式下 subPackageRoots 保存异步归属规则；
  // 匹配到的消费者页面集合决定动态 import 的 chunk 落到哪个异步分包目录。
  subPackageIndie: [
    {
      subPackageRoots: [
        {
          // 仅 sub1 消费的动态模块 → pages/sub1-async
          path: 'pages/sub1/index',
          asyncSubPackage: { asyncRoot: 'pages/sub1-async' },
        },
        {
          // 仅 sub2 消费的动态模块 → pages/sub2-async
          path: 'pages/sub2/index',
          asyncSubPackage: { asyncRoot: 'pages/sub2-async' },
        },
        {
          // sub1 和 sub2 共同消费的动态模块 → 共享异步分包；
          // 多个物理目标时 maxSize 必填，超预算自动装箱到下一个目录。
          path: /^pages\/sub\d+\/index$/,
          asyncSubPackage: {
            asyncRoot: ['pages/shared-async', 'pages/shared-async-2'],
            maxSize: 1500000,
          },
        },
      ],
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
