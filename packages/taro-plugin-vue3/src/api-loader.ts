export default function (str) {
  return `import {
  useAddToFavorites,
  useDidHide,
  useDidShow,
  setGlobalDataPlugin,
  useLoad,
  useOptionMenuClick,
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
  useUnload
} from '@tarojs/plugin-framework-vue3/dist/runtime'
${str}

taro.useAddToFavorites = useAddToFavorites
taro.useDidHide = useDidHide
taro.useDidShow = useDidShow
taro.setGlobalDataPlugin = setGlobalDataPlugin
taro.useLoad = useLoad
taro.useOptionMenuClick = useOptionMenuClick
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
taro.useUnload = useUnload

export {
  useAddToFavorites,
  useDidHide,
  useDidShow,
  setGlobalDataPlugin,
  useLoad,
  useOptionMenuClick,
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
  useUnload
}
`
}
