declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}

declare module '@tarojs/components/lib/solid' {
  export * from '@tarojs/components'
}

declare module '@tarojs/components/lib/react' {
  export * from '@tarojs/components'
}
