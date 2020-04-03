import { Component } from '@tarojs/taro-h5'

type Path = string

export type PageComponent<P=any, S=any> = new(
  props: P,
  context: any
) => Component<P, S>

export type ComponentLoader = () => Promise<{ default: PageComponent }>

export type WrappedPageComponent = new(props: any, context: any) => Component<{
  router: {
    matched: boolean;
    location: Location;
  };
}>

export interface RouteObj {
  path: Path;
  componentLoader: ComponentLoader;
  isIndex: boolean;
  isTabBar?: boolean;
  isRedirect?: boolean;
  key?: string;
}

export interface CustomRoutes {
  [key: string]: string;
}

export type Action = 'POP' | 'PUSH' | 'REPLACE'
export namespace History {
  export type Hash = string;
  export type Href = string;
  export type LocationDescriptor = Path | LocationDescriptorObject;
  export type LocationKey = string;
  export type LocationListener = (opts: {
    fromLocation: Location;
    toLocation: Location;
    action: Action;
  }) => void;
  export type LocationState = any;
  export type Path = string;
  export type Params = {
    [key: string]: string;
  }
  export type Pathname = string;
  export type Search = string;
  export type State = HistoryState;
  export type TransitionHook = (location: Location, callback: (result: any) => void) => any;
  export type TransitionPromptHook = (location: Location, action: Action) => string | false | void;
  export type UnregisterCallback = () => void;
}


export interface Location {
  path: History.Pathname;
  search: History.Search;
  hash: History.Hash;
  state: History.State;
  params: History.Params;
}

export type LocationDescriptorObject = Partial<Location>

export interface HistoryState {
  key: string;
}

export interface History {
  length: number;
  action: Action;
  location: Location;
  push(path: Path): void;
  // push(location: LocationDescriptorObject): void;
  replace(path: Path): void;
  // replace(location: LocationDescriptorObject): void;
  go(n: number): void;
  goBack(): void;
  goForward(): void;
  block(prompt?: boolean | string | History.TransitionPromptHook): History.UnregisterCallback;
  listen(listener: History.LocationListener): History.UnregisterCallback;
  createHref(location: LocationDescriptorObject): History.Href;
  // action: Action;
  // block: any;
  // createHref: any;
  // go: any;
  // goBack: any;
  // goForward: any;
  // length: number;
  // listen: any;
  // location: Location;
  // push: any;
  // replace: any;
}

type HexColor = string

interface ITabBarItem {
  pagePath: string // 是 页面路径，必须在 pages 中先定义
  text: string // 是 tab 上按钮文字
  iconPath?: string // 否 图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，不支持网络图片。当 position 为 top 时，不显示 icon。
  selectedIconPath?: string // 否 选中时的图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，不支持网络图片。当 position 为 top 时，不显示 icon。
}

export interface ITabBar {
  color: HexColor // 是  tab 上的文字默认颜色，仅支持十六进制颜色
  selectedColor: HexColor // 是  tab 上的文字选中时的颜色，仅支持十六进制颜色
  backgroundColor: HexColor // 是  tab 的背景色，仅支持十六进制颜色
  borderStyle?: 'black' | 'white' // 否 black tabbar 上边框的颜色， 仅支持 black / white
  list: ITabBarItem[] // 是 tab 的列表，详见 list 属性说明，最少 2 个、最多 5 个 tab
  position?: 'bottom' | 'top' // 否 bottom tabBar 的位置，仅支持 bottom / top
  custom?: boolean // 否 false 自定义 tabBar，见详情
}
