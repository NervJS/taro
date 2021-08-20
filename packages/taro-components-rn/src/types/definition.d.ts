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

// import * as ReactNative from 'react-native';

// declare module 'react-native' {
//   interface ARTStatic {
//     Transform: any;
//   }
// }

declare module 'react-dom/server.browser' {
  import { ReactElement } from 'react'

  export const renderToStaticMarkup: (element: ReactElement) => string
}

// 修复第三方库的类型定义依赖DOM，但是DOM与react-native类型冲突
// begin
declare interface Touch {}

declare interface HTMLMediaElement {}

declare interface MediaTrackSettings {}
// end
