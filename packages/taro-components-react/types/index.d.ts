
declare module 'swiper/bundle' {
  import Swiper from 'swiper'

  export = Swiper
}

declare module '@tarojs/components-react' {
  export * from '@tarojs/components'
}

declare module '*/hooks' {
  import * as React from 'react'

  export const useState: typeof React.useState
  export const useCallback: typeof React.useCallback
  export const useEffect: typeof React.useEffect
  export const useMemo: typeof React.useMemo
  export const useRef: typeof React.useRef
  export const createContext: typeof React.createContext
  export const useContext: typeof React.useContext
  export const memo: typeof React.memo
  export const forwardRef: typeof React.forwardRef
  export const useImperativeHandle: typeof React.useImperativeHandle
}
