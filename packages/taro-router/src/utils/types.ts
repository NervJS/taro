import { Component } from '@tarojs/taro-h5'

type Path = string

export type PageComponent = new(
  props: any,
  context: any
) => Component<any, any>

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
  key?: string;
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
  pathname: History.Pathname;
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