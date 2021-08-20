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

/**
 *
 * Based on original code from: https://github.com/qiu8310/minapp/blob/master/packages/minapp-wx/typing/wx.d.ts
 * Lincenced under MIT license: https://github.com/qiu8310/minapp/issues/69
 *
 */
declare namespace Taro {
  /** 自定义业务数据监控上报接口。
   *
   * **使用说明**
   * 使用前，需要在「小程序管理后台-运维中心-性能监控-业务数据监控」中新建监控事件，配置监控描述与告警类型。每一个监控事件对应唯一的监控ID，开发者最多可以创建128个监控事件。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.reportMonitor('1', 1)
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/report/wx.reportMonitor.html
   */
  function reportMonitor(
    /** 监控ID，在「小程序管理后台」新建数据指标后获得 */
    name: string,
    /** 上报数值，经处理后会在「小程序管理后台」上展示每分钟的上报总量 */
    value: number,
  ): void
}
