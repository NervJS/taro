
const isH5 = process.env.TARO_PLATFORM === 'web'
const components = isH5 ? [
  'components/picker/index'
] : [
  'pages/detail/index',
  'components/picker/index',
  'components/article/index'
]

export default {
  pages: [
    'pages/index/index',
    'pages/detail/index',
  ],
  components
}
