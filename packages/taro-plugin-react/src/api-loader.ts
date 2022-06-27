export default function (str) {
  return `import {
  useDidShow,
  useDidHide,
  usePullDownRefresh,
  useReachBottom,
  usePageScroll,
  useResize,
  useShareAppMessage,
  useTabItemTap,
  useTitleClick,
  useOptionMenuClick,
  usePullIntercept,
  useShareTimeline,
  useAddToFavorites,
  useReady,
  useRouter,
  useScope
} from '@tarojs/plugin-framework-react/dist/runtime'
${str}

taro.useDidShow = useDidShow
taro.useDidHide = useDidHide
taro.usePullDownRefresh = usePullDownRefresh
taro.useReachBottom = useReachBottom
taro.usePageScroll = usePageScroll
taro.useResize = useResize
taro.useShareAppMessage = useShareAppMessage
taro.useTabItemTap = useTabItemTap
taro.useTitleClick = useTitleClick
taro.useOptionMenuClick = useOptionMenuClick
taro.usePullIntercept = usePullIntercept
taro.useShareTimeline = useShareTimeline
taro.useAddToFavorites = useAddToFavorites
taro.useReady = useReady
taro.useRouter = useRouter
taro.useScope = useScope

export {
  useDidShow,
  useDidHide,
  usePullDownRefresh,
  useReachBottom,
  usePageScroll,
  useResize,
  useShareAppMessage,
  useTabItemTap,
  useTitleClick,
  useOptionMenuClick,
  usePullIntercept,
  useShareTimeline,
  useAddToFavorites,
  useReady,
  useRouter,
  useScope
}
`
}
