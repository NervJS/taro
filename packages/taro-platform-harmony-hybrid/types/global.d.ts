declare type TFunc = (...args: any[]) => any
declare module '*.json' {
  const value: Record<string, any>
  export default value
}
declare var requireNapi: NodeRequire
