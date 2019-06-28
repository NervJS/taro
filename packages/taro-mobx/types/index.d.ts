import Taro from '@tarojs/taro'

export type IValueMap = { [key: string]: any };

export class Provider extends Taro.Component<any, {}> {};

export function onError(fn: (error: Error) => void);

export function isUsingStaticRendering(): boolean;

export function useStaticRendering(enable: boolean);
export function useLocalStore<TStore extends Record<string, any>, TSource extends object = any>(
  initializer: (source: TSource) => TStore,
  current?: TSource
): TStore;
export function useAsObservableSource<TSource>(current: TSource): TSource;

export function observer(component);
export function inject(...stores: string[]);
export function inject(fn: (stores: IValueMap, nextProps: IValueMap) => IValueMap);