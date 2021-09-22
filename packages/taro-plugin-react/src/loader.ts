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

  Taro.useDidShow = useDidShow
  Taro.useDidHide = useDidHide
  Taro.usePullDownRefresh = usePullDownRefresh
  Taro.useReachBottom = useReachBottom
  Taro.usePageScroll = usePageScroll
  Taro.useResize = useResize
  Taro.useShareAppMessage = useShareAppMessage
  Taro.useTabItemTap = useTabItemTap
  Taro.useTitleClick = useTitleClick
  Taro.useOptionMenuClick = useOptionMenuClick
  Taro.usePullIntercept = usePullIntercept
  Taro.useShareTimeline = useShareTimeline
  Taro.useAddToFavorites = useAddToFavorites
  Taro.useReady = useReady
  Taro.useRouter = useRouter
  Taro.useScope = useScope

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
