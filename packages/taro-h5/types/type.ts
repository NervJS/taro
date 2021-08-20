/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

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
    referrerInfo: Record<string, any>;
  }
}

interface TaroH5 {
  _$router: Router.Location
  $router: Router.RouterParams
}

const TaroH5: (TaroH5 & typeof Taro) = {} as any
export default TaroH5
