import Taro from '@tarojs/taro'

namespace Router {
  export interface Location {
    path: string;
    search: string;
    hash: string;
    state: {
      key: string;
    };
    params: {
      [key: string]: string;
    };
  }
  export interface RouterParams {
    path: string;
    scene: number;
    params: {
      [key: string]: string;
    };
    shareTicket: string;
    referrerInfo: Object;
  }
}

interface TaroH5 {
  _$router: Router.Location
  $router: Router.RouterParams
}

const TaroH5: (TaroH5 & typeof Taro) = {} as any
export default TaroH5
