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

import Kernel from './Kernel';
import { IHook, ICommand, IPlatform } from '../src/utils/types';
export default class Plugin {
    id: string;
    path: string;
    ctx: Kernel;
    constructor(opts: any);
    register(hook: IHook): void;
    registerCommand(command: ICommand): void;
    registerPlatform(platform: IPlatform): void;
    registerMethod(...args: any[]): void;
}
