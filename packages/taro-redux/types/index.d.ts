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
