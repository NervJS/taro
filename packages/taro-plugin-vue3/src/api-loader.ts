export default function (str) {
  return `import {
  setGlobalDataPlugin,
  useAddToFavorites,
  useDidHide,
  useDidShow,
  useOptionMenuClick,
  usePageScroll,
  usePullDownRefresh,
  usePullIntercept,
  useReachBottom,
  useReady,
  useResize,
  useRouter,
  useShareAppMessage,
  useShareTimeline,
  useTabItemTap,
  useTitleClick
} from '@tarojs/plugin-framework-vue3/dist/runtime'
${str}

taro.useAddToFavorites = useAddToFavorites
taro.useDidHide = useDidHide
taro.useDidShow = useDidShow
taro.useOptionMenuClick = useOptionMenuClick
taro.usePageScroll = usePageScroll
taro.usePullDownRefresh = usePullDownRefresh
taro.usePullIntercept = usePullIntercept
taro.useReachBottom = useReachBottom
taro.useReady = useReady
taro.useResize = useResize
taro.useRouter = useRouter
taro.useShareAppMessage = useShareAppMessage
taro.useShareTimeline = useShareTimeline
taro.useTabItemTap = useTabItemTap
taro.useTitleClick = useTitleClick
taro.setGlobalDataPlugin = setGlobalDataPlugin

export {
  setGlobalDataPlugin,
  useAddToFavorites,
  useDidHide,
  useDidShow,
  useOptionMenuClick,
  usePageScroll,
  usePullDownRefresh,
  usePullIntercept,
  useReachBottom,
  useReady,
  useResize,
  useRouter,
  useShareAppMessage,
  useShareTimeline,
  useTabItemTap,
  useTitleClick
}
`
}
