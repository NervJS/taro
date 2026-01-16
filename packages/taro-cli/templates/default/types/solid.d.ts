export { }

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      /** Note:如果需要定义自定义指令的类型，可以在这里做
       * 参考官网文档https://docs.solidjs.com/reference/jsx-attributes/use
       * model: [() => any, (v: any) => any]
       */
    }
  }
}
