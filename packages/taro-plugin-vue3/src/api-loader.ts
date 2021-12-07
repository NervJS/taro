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
    setGlobalDataPlugin
  } from '@tarojs/plugin-framework-vue3/dist/runtime'
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
  Taro.setGlobalDataPlugin = setGlobalDataPlugin

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
    setGlobalDataPlugin
  }
  `
}
