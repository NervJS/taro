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

import { IProjectConfig } from '@tarojs/taro/types/compile';
interface IConfigOptions {
    appPath: string;
}
export default class Config {
    appPath: string;
    configPath: string;
    initialConfig: IProjectConfig;
    isInitSuccess: boolean;
    constructor(opts: IConfigOptions);
    init(): void;
    getConfigWithNamed(platform: any, useConfigName: any): any;
}
export {};
