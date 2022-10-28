export default {
  pages: ['pages/index/index'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  plugins: {
    testPlugin: {
      version: 'dev',
      provider: 'xxx',
      export: 'index',
    },
  },
  subpackages: [
    {
      root: 'packageA',
      pages: ['detail/index', 'my/index'],
      plugins: {
        testSubPackagePlugin: {
          version: 'dev',
          provider: 'xxx',
          export: 'index',
        },
      },
    },
  ],
}
