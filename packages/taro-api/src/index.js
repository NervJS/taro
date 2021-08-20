/*
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

/* eslint-disable camelcase */
import './polyfill'
import { getEnv, ENV_TYPE } from './env'
import Link from './interceptor'
import * as interceptors from './interceptor/interceptors'
import {
  Behavior,
  getPreload,
  getPxTransform,
  getInitPxTransform
} from './tools'
import {
  Current,
  getCurrentInstance,
  options,
  nextTick,
  eventCenter,
  Events,
  useDidShow,
  useDidHide,
  usePullDownRefresh,
  useReachBottom,
  usePageScroll,
  useResize,
  useShareAppMessage,
  useTabItemTap,
  useTitleClick,
  useOptionMenuClick,
  usePullIntercept,
  useShareTimeline,
  useAddToFavorites,
  useReady,
  useRouter
} from '@tarojs/runtime'

const Taro = {
  Behavior,
  getEnv,
  ENV_TYPE,
  Link,
  interceptors,
  Current,
  getCurrentInstance,
  options,
  nextTick,
  eventCenter,
  Events,
  useDidShow,
  useDidHide,
  usePullDownRefresh,
  useReachBottom,
  usePageScroll,
  useResize,
  useShareAppMessage,
  useTabItemTap,
  useTitleClick,
  useOptionMenuClick,
  usePullIntercept,
  useShareTimeline,
  useAddToFavorites,
  useReady,
  useRouter,
  getInitPxTransform
}

Taro.initPxTransform = getInitPxTransform(Taro)
Taro.preload = getPreload(Current)
Taro.pxTransform = getPxTransform(Taro)

export default Taro
