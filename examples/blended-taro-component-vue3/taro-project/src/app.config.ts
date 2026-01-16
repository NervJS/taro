// @ts-ignore
const isH5 = process.env.TARO_PLATFORM === 'web'
const components = isH5 ? [
  'components/picker/index'
] : [
  'pages/detail/index',
  'components/picker/index',
  'components/article/index'
]

export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/detail/index'
  ],
  components: components,
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
