/// <reference path="taro.lifecycle.d.ts" />
/// <reference path="taro.component.d.ts" />

declare namespace Taro {
  // React Hooks
  // ----------------------------------------------------------------------
  // based on the code in https://github.com/facebook/react/pull/13968
  // Unlike the class component setState, the updates are not allowed to be partial
  type SetStateAction<S> = S | ((prevState: S) => S)
  // this technically does accept a second argument, but it's already under a deprecation warning
  // and it's not even released so probably better to not define it.
  type Dispatch<A> = (value: A) => void
  // Unlike redux, the actions _can_ be anything
  type Reducer<S, A> = (prevState: S, action: A) => S
  // types used to try and prevent the compiler from reducing S
  // to a supertype common with the second argument to useReducer()
  type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never
  type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never
  // The identity check is done with the SameValue algorithm (Object.is), which is stricter than ===
  // TODO (TypeScript 3.0): ReadonlyArray<unknown>
  type DependencyList = ReadonlyArray<any>
  // NOTE: callbacks are _only_ allowed to return either void, or a destructor.
  // The destructor is itself only allowed to return void.
  type EffectCallback = () => (void | (() => void | undefined))
  interface MutableRefObject<T> {
      current: T
  }
  /**
   * Returns a stateful value, and a function to update it.
   *
   * @version 16.8.0
   * @see https://reactjs.org/docs/hooks-reference.html#usestate
   */
  function useState<S> (initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>]
  // convenience overload when first argument is ommitted
  /**
   * Returns a stateful value, and a function to update it.
   *
   * @version 16.8.0
   * @see https://reactjs.org/docs/hooks-reference.html#usestate
   */
  function useState<S = undefined> (): [S | undefined, Dispatch<SetStateAction<S | undefined>>]
  /**
   * An alternative to `useState`.
   *
   * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
   * multiple sub-values. It also lets you optimize performance for components that trigger deep
   * updates because you can pass `dispatch` down instead of callbacks.
   *
   * @version 16.8.0
   * @see https://reactjs.org/docs/hooks-reference.html#usereducer
   */
  // overload where "I" may be a subset of ReducerState<R>; used to provide autocompletion.
  // If "I" matches ReducerState<R> exactly then the last overload will allow initializer to be ommitted.
  // the last overload effectively behaves as if the identity function (x => x) is the initializer.
  function useReducer<R extends Reducer<any, any>, I> (
      reducer: R,
      initializerArg: I & ReducerState<R>,
      initializer: (arg: I & ReducerState<R>) => ReducerState<R>
  ): [ReducerState<R>, Dispatch<ReducerAction<R>>]
  /**
   * An alternative to `useState`.
   *
   * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
   * multiple sub-values. It also lets you optimize performance for components that trigger deep
   * updates because you can pass `dispatch` down instead of callbacks.
   *
   * @version 16.8.0
   * @see https://reactjs.org/docs/hooks-reference.html#usereducer
   */
  // overload for free "I"; all goes as long as initializer converts it into "ReducerState<R>".
  function useReducer<R extends Reducer<any, any>, I> (
      reducer: R,
      initializerArg: I,
      initializer: (arg: I) => ReducerState<R>
  ): [ReducerState<R>, Dispatch<ReducerAction<R>>]
  /**
   * An alternative to `useState`.
   *
   * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
   * multiple sub-values. It also lets you optimize performance for components that trigger deep
   * updates because you can pass `dispatch` down instead of callbacks.
   *
   * @version 16.8.0
   * @see https://reactjs.org/docs/hooks-reference.html#usereducer
   */
  // I'm not sure if I keep this 2-ary or if I make it (2,3)-ary; it's currently (2,3)-ary.
  // The Flow types do have an overload for 3-ary invocation with undefined initializer.
  // NOTE: without the ReducerState indirection, TypeScript would reduce S to be the most common
  // supertype between the reducer's return type and the initialState (or the initializer's return type),
  // which would prevent autocompletion from ever working.
  // TODO: double-check if this weird overload logic is necessary. It is possible it's either a bug
  // in older versions, or a regression in newer versions of the typescript completion service.
  function useReducer<R extends Reducer<any, any>> (
      reducer: R,
      initialState: ReducerState<R>,
      initializer?: undefined
  ): [ReducerState<R>, Dispatch<ReducerAction<R>>]
  /**
   * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
   * (`initialValue`). The returned object will persist for the full lifetime of the component.
   *
   * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
   * value around similar to how you’d use instance fields in classes.
   *
   * @version 16.8.0
   * @see https://reactjs.org/docs/hooks-reference.html#useref
   */
  // TODO (TypeScript 3.0): <T extends unknown>
  function useRef<T> (initialValue: T): MutableRefObject<T>
  interface RefObject<T> {
      readonly current: T | null
  }
  function createRef<T>(): RefObject<T>;
  // convenience overload for refs given as a ref prop as they typically start with a null value
  /**
   * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
   * (`initialValue`). The returned object will persist for the full lifetime of the component.
   *
   * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
   * value around similar to how you’d use instance fields in classes.
   *
   * Usage note: if you need the result of useRef to be directly mutable, include `| null` in the type
   * of the generic argument.
   *
   * @version 16.8.0
   * @see https://reactjs.org/docs/hooks-reference.html#useref
   */
  // TODO (TypeScript 3.0): <T extends unknown>
  function useRef<T> (initialValue: T | null): RefObject<T>
  // convenience overload for potentially undefined initialValue / call with 0 arguments
  // has a default to stop it from defaulting to {} instead
  /**
   * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
   * (`initialValue`). The returned object will persist for the full lifetime of the component.
   *
   * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
   * value around similar to how you’d use instance fields in classes.
   *
   * @version 16.8.0
   * @see https://reactjs.org/docs/hooks-reference.html#useref
   */
  // TODO (TypeScript 3.0): <T extends unknown>
  function useRef<T = undefined> (): MutableRefObject<T | undefined>
  /**
   * The signature is identical to `useEffect`, but it fires synchronously after all DOM mutations.
   * Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside
   * `useLayoutEffect` will be flushed synchronously, before the browser has a chance to paint.
   *
   * Prefer the standard `useEffect` when possible to avoid blocking visual updates.
   *
   * If you’re migrating code from a class component, `useLayoutEffect` fires in the same phase as
   * `componentDidMount` and `componentDidUpdate`.
   *
   * @version 16.8.0
   * @see https://reactjs.org/docs/hooks-reference.html#uselayouteffect
   */
  function useLayoutEffect (effect: EffectCallback, deps?: DependencyList): void
  /**
   * Accepts a function that contains imperative, possibly effectful code.
   *
   * @param effect Imperative function that can return a cleanup function
   * @param deps If present, effect will only activate if the values in the list change.
   *
   * @version 16.8.0
   * @see https://reactjs.org/docs/hooks-reference.html#useeffect
   */
  function useEffect (effect: EffectCallback, deps?: DependencyList): void
  // NOTE: this does not accept strings, but this will have to be fixed by removing strings from type Ref<T>
  /**
   * `useImperativeHandle` customizes the instance value that is exposed to parent components when using
   * `ref`. As always, imperative code using refs should be avoided in most cases.
   *
   * `useImperativeHandle` should be used with `React.forwardRef`.
   *
   * @version 16.8.0
   * @see https://reactjs.org/docs/hooks-reference.html#useimperativehandle
   */
  type Ref<T> =
    | string
    | { bivarianceHack (instance: T | null): any }['bivarianceHack']
  function useImperativeHandle<T, R extends T> (ref: Ref<T> | undefined, init: () => R, deps?: DependencyList): void
  // I made 'inputs' required here and in useMemo as there's no point to memoizing without the memoization key
  // useCallback(X) is identical to just using X, useMemo(() => Y) is identical to just using Y.
  /**
   * `useCallback` will return a memoized version of the callback that only changes if one of the `inputs`
   * has changed.
   *
   * @version 16.8.0
   * @see https://reactjs.org/docs/hooks-reference.html#usecallback
   */
  // TODO (TypeScript 3.0): <T extends (...args: never[]) => unknown>
  function useCallback<T extends (...args: any[]) => any> (callback: T, deps: DependencyList): T
  /**
   * `useMemo` will only recompute the memoized value when one of the `deps` has changed.
   *
   * Usage note: if calling `useMemo` with a referentially stable function, also give it as the input in
   * the second argument.
   * @example
   * ```ts
   * function expensive () { ... }
   * function Component () {
   *   const expensiveResult = useMemo(expensive, [expensive])
   *   return ...
   * }
   * ```
   *
   * @version 16.8.0
   * @see https://reactjs.org/docs/hooks-reference.html#usememo
   */
  // allow undefined, but don't make it optional as that is very likely a mistake
  function useMemo<T> (factory: () => T, deps: DependencyList | undefined): T
  // NOTE: only the Context object itself can get a displayName
  // https://github.com/facebook/react-devtools/blob/e0b854e4c/backend/attachRendererFiber.js#L310-L325
  // type Provider<T> = ProviderExoticComponent<ProviderProps<T>>;
  // type Consumer<T> = ExoticComponent<ConsumerProps<T>>;
  interface Context<T> {
    Provider: ComponentClass<{ value: T }>;
    // Consumer: Consumer<T>;
    displayName?: string;
  }
  function createContext<T>(
      defaultValue: T
  ): Context<T>;
  // This will technically work if you give a Consumer<T> or Provider<T> but it's deprecated and warns
  /**
   * Accepts a context object (the value returned from `React.createContext`) and returns the current
   * context value, as given by the nearest context provider for the given context.
   *
   * @version 16.8.0
   * @see https://reactjs.org/docs/hooks-reference.html#usecontext
   */
  function useContext<T>(context: Context<T>/*, (not public API) observedBits?: number|boolean */): T;
  /**
   * 页面展示时的回调
   */
  function useDidShow (callback: () => any)
  /**
   * 页面隐藏时的回调
   */
  function useDidHide (callback: () => any)
  /**
   * 监听用户下拉刷新事件
   */
  function usePullDownRefresh (callback: () => any)
  /**
   * 监听用户上拉触底事件
   */
  function useReachBottom (callback: () => any)
  /**
   * 监听用户滑动页面事件
   */
  function usePageScroll (callback: (obj: PageScrollObject) => any)
  /**
   * 小程序屏幕旋转时触发
   */
  function useResize (callback: (obj: any) => any)
  /**
   * 监听用户点击页面内转发按钮（button 组件 open-type="share"）或右上角菜单“转发”按钮的行为，并自定义转发内容
   */
  function useShareAppMessage (callback: (obj: ShareAppMessageObject) => any)
  /**
   * 点击 tab 时触发
   */
  function useTabItemTap (callback: (obj: TabItemTapObject) => any)
  /**
   * 获取页面传入路由相关参数
   */
  function useRouter (): RouterInfo
  /**
   * 获取小程序原生作用域
   * 等同于类组件时 this.$scope
   */
  function useScope (): any
}
