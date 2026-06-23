# Solid 运行时

## reconciler

基于 `solid/universal` 的 Solid 渲染器，连接 `@tarojs/runtime` 的 DOM 实例，相当于小程序版的 `solid-js/web`，暴露的 API 也和 `solid-js/web` 保持一致。

- render
- effect
- memo
- createComponent
- createElement
- createTextNode
- insertNode
- insert
- spread
- setProp
- mergeProps

需要新增 babel-presets-solid 插件配置，用于转换 SolidJS 的 JSX 语法。

```js
module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true,
    }],
    ['babel-preset-solid', {
      // 指向 SolidJS 的 reconciler
      moduleName: '@tarojs/plugin-framework-react/dist/runtime/reconciler',
      generate: 'universal',
    }]
  ]
}
```

## 附录 1: [可能无法转换/兼容 SolidJS 的 React API 列表](https://github.com/solidjs-community/solid-codemod/issues/2)

### react

- cloneElement - Probably Element.cloneNode, but this highly depends on the usage and only works for DOM nodes not components.
- createFactory
- isValidElement - the lack of VDOM makes this impossible, however, instanceof Element can be a valid workaround in some cases.
- createRef - we can probably create a library shim such that this one exists and still returns the object, but we can convert those ref property usages into a callback assignment e.g. (el) => ref.current = el.
- forwardRef - Can be removed or provide a library shim, which ever works.
- memo - There's already a memo function in SolidJS but it behaves differently. We can remove this during compilation since it is totally unnecessary.
- useReducer - provide a library shim
- useRef - we can remove this and change VariableDeclaration, but that also requires current property accesses.
- useLayoutEffect - I'm not sure if createRenderEffect can replace this.
- useImperativeHandle - library shim
- useCallback - can be removed
- useDebugValue - statement can be removed.
- useDeferredValue - Now this one is highly different from createDeferred. We'll probably need Ryan's consultation.
- Mutable Sources - library shim
- useInsertionEffect - I'm not sure what this is, but I believe it is discussed in the <style> guide for React in the working group
- useSyncExternalStore - library shim
- Fragment - library shim, but I think I've suggested Ryan to add this one into the SolidJS core.

### react-dom

- findDOMNode
- unmountComponentAtNode - This one's impossible.
- flushSync - not sure what this is for, probably for flushing updates.
- unstable_renderSubtreeIntoContainer - I think this one was used in React Server Components, but given we don't have VDOM, this one's impossible.
- unstable_scheduleHydration
- unstable_flushControlled

## 附录 2: React 与 SolidJS 写法差异

> 参考：[solid-reactor](https://github.com/yellowsink/solid-reactor)

### API

- `useState` => `createSignal`
- `useEffect` => `createEffect`
  - attempting to recreate the "run on every rerender" behaviour
- `useReducer` => `createSignal` + a function
- `useRef` => `{ current: <value> }` + a variable
  - convert (useRef-returned only) refs in `ref={myRef}` to `ref={myRef.current}`.

### 样式

- camelCase(`marginRight`) => kebab-case(`margin-right`)

React.useRef => createSignal
React.createRef => createSignal
React.useLayoutEffect => [createRenderEffect, onCleanup]
React.useMemo => createMemo
ReactDOM.unstable_batchedUpdates => batch

React.Component => renderer.createComponent
ReactDOM.render => renderer.render
h => React.createElement => renderer.createElement

ReactDOM.findDOMNode

createRoot
createContext
useContext
