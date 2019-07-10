/**
 * 实现参考链接:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/issues/9951
 *
 * ComponentClass 使用react, 保持和 taro-component 组件库一致
 * 也可以在 Taro 中重新声明
 *
 */
import { ComponentClass } from 'react';
import {
    Component,
} from '@tarojs/taro';

import {
    Action,
    AnyAction,
    Store,
    Dispatch
} from 'redux';

export type InferableComponentEnhancerWithProps<IInjectedProps, INeedsProps> =
    <IComponent extends ComponentClass<IInjectedProps & INeedsProps>>(component: IComponent) => IComponent

export interface IConnect {
  <IStateProps = {}, IDispatchProps = {}, IOwnProps = {}, IStore = any>(
      mapStateToProps?: MapStateToPropsParam<IStateProps, IOwnProps, IStore>,
      mapDispatchToProps?: MapDispatchToPropsParam<IDispatchProps, IOwnProps>,
  ): InferableComponentEnhancerWithProps<IStateProps & IDispatchProps, IOwnProps>
}

export const connect: IConnect

interface MapStateToProps<TStateProps, TOwnProps, State> {
    (state: State, ownProps: TOwnProps): TStateProps;
}

interface MapStateToPropsFactory<TStateProps, TOwnProps, State> {
    (initialState: State, ownProps: TOwnProps): MapStateToProps<TStateProps, TOwnProps, State>;
}

type MapStateToPropsParam<TStateProps, TOwnProps, State> = MapStateToPropsFactory<TStateProps, TOwnProps, State> | MapStateToProps<TStateProps, TOwnProps, State> | null | undefined;

interface MapDispatchToPropsFunction<TDispatchProps, TOwnProps> {
    (dispatch: Dispatch<AnyAction | any>, ownProps: TOwnProps): TDispatchProps;
}

type MapDispatchToProps<TDispatchProps, TOwnProps> =
    MapDispatchToPropsFunction<TDispatchProps, TOwnProps> | TDispatchProps;

interface MapDispatchToPropsFactory<TDispatchProps, TOwnProps> {
    (dispatch: Dispatch<AnyAction | any>, ownProps: TOwnProps): MapDispatchToProps<TDispatchProps, TOwnProps>;
}

type MapDispatchToPropsParam<TDispatchProps, TOwnProps> = MapDispatchToPropsFactory<TDispatchProps, TOwnProps> | MapDispatchToProps<TDispatchProps, TOwnProps>;

interface MergeProps<TStateProps, TDispatchProps, TOwnProps, TMergedProps> {
    (stateProps: TStateProps, dispatchProps: TDispatchProps, ownProps: TOwnProps): TMergedProps;
}

export interface ProviderProps<A extends Action = AnyAction> {
    store: Store<any, A>;
}

export class Provider<A extends Action = AnyAction> extends Component<ProviderProps<A>, any> { }


/**
 * A hook to access the redux store's state. This hook takes a selector function
 * as an argument. The selector is called with the store state.
 *
 * This hook takes an optional equality comparison function as the second parameter
 * that allows you to customize the way the selected state is compared to determine
 * whether the component needs to be re-rendered.
 *
 * If you do not want to have to specify the root state type for whenever you use
 * this hook with an inline selector you can use the `TypedUseSelectorHook` interface
 * to create a version of this hook that is properly typed for your root state.
 *
 * @param selector the selector function
 * @param equalityFn the function that will be used to determine equality
 *
 * @returns the selected state
 *
 * @example
 *
 * import React from 'react'
 * import { useSelector } from 'react-redux'
 * import { RootState } from './store'
 *
 * export const CounterComponent = () => {
 *   const counter = useSelector((state: RootState) => state.counter)
 *   return <div>{counter}</div>
 * }
 */
export function useSelector<TState, TSelected>(
    selector: (state: TState) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean
): TSelected;

/**
 * A hook to access the redux store.
 *
 * @returns the redux store
 *
 * @example
 *
 * import React from 'react'
 * import { useStore } from 'react-redux'
 *
 * export const ExampleComponent = () => {
 *   const store = useStore()
 *   return <div>{store.getState()}</div>
 * }
 */
export function useStore<S = any, A extends Action = AnyAction>(): Store<S, A>;

/**
 * A hook to access the redux `dispatch` function.
 *
 * Note for `redux-thunk` users: the return type of the returned `dispatch` functions for thunks is incorrect.
 * However, it is possible to get a correctly typed `dispatch` function by creating your own custom hook typed
 * from the store's dispatch function like this: `const useThunkDispatch = () => useDispatch<typeof store.dispatch>();`
 *
 * @returns redux store's `dispatch` function
 *
 * @example
 *
 * import React, { useCallback } from 'react'
 * import { useDispatch } from 'react-redux'
 *
 * export const CounterComponent = ({ value }) => {
 *   const dispatch = useDispatch()
 *   return (
 *     <div>
 *       <span>{value}</span>
 *       <button onClick={() => dispatch({ type: 'increase-counter' })}>
 *         Increase counter
 *       </button>
 *     </div>
 *   )
 * }
 */
// NOTE: the first overload below and note above can be removed if redux-thunk typings add an overload for
// the Dispatch function (see also this PR: https://github.com/reduxjs/redux-thunk/pull/247)
export function useDispatch<TDispatch = Dispatch<any>>(): TDispatch;
export function useDispatch<A extends Action = AnyAction>(): Dispatch<A>;
