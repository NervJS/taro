export default function (str) {
  return `import {
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
  useTitleClick,
  useScope
} from '@tarojs/plugin-framework-react/dist/runtime'
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
taro.useScope = useScope

export {
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
  useScope
}
`
}
