import Taro from '@tarojs/taro'

export type IValueMap = { [key: string]: any };

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

export class Provider extends Taro.Component<any, {}> {}

export const PropTypes: {
  observableArray: React.Requireable<any>
  observableArrayOf: (type: React.Validator<any>) => React.Requireable<any>
  observableMap: React.Requireable<any>
  observableObject: React.Requireable<any>
  arrayOrObservableArray: React.Requireable<any>
  arrayOrObservableArrayOf: (type: React.Validator<any>) => React.Requireable<any>
  objectOrObservableObject: React.Requireable<any>
}