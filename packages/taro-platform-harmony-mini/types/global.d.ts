declare module '*.json' {
  const value: Record<string, any>
  export default value
}
declare type TFunc = (...args: any[]) => any
