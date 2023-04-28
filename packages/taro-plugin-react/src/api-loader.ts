export default function (str: string) {
  return `import {
  useAddToFavorites,
  useDidHide,
  useDidShow,
  useError,
  useLaunch,
  useLoad,
  useOptionMenuClick,
  usePageNotFound,
  usePageScroll,
  usePullDownRefresh,
  usePullIntercept,
  useReachBottom,
  useReady,
  useResize,
  useRouter,
  useSaveExitState,
  useShareAppMessage,
  useShareTimeline,
  useTabItemTap,
  useTitleClick,
  useScope,
  useUnhandledRejection,
  useUnload
} from '@tarojs/plugin-framework-react/dist/runtime'
${str}

taro.useAddToFavorites = useAddToFavorites
taro.useDidHide = useDidHide
taro.useDidShow = useDidShow
taro.useError = useError
taro.useLaunch = useLaunch
taro.useLoad = useLoad
taro.useOptionMenuClick = useOptionMenuClick
taro.usePageNotFound = usePageNotFound
taro.usePageScroll = usePageScroll
taro.usePullDownRefresh = usePullDownRefresh
taro.usePullIntercept = usePullIntercept
taro.useReachBottom = useReachBottom
taro.useReady = useReady
taro.useResize = useResize
taro.useRouter = useRouter
taro.useSaveExitState = useSaveExitState
taro.useShareAppMessage = useShareAppMessage
taro.useShareTimeline = useShareTimeline
taro.useTabItemTap = useTabItemTap
taro.useTitleClick = useTitleClick
taro.useScope = useScope
taro.useUnhandledRejection = useUnhandledRejection
taro.useUnload = useUnload

export {
  useAddToFavorites,
  useDidHide,
  useDidShow,
  useError,
  useLaunch,
  useLoad,
  useOptionMenuClick,
  usePageNotFound,
  usePageScroll,
  usePullDownRefresh,
  usePullIntercept,
  useReachBottom,
  useReady,
  useResize,
  useRouter,
  useSaveExitState,
  useShareAppMessage,
  useShareTimeline,
  useTabItemTap,
  useTitleClick,
  useScope,
  useUnhandledRejection,
  useUnload
}
`
}
