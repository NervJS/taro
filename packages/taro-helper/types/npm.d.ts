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

declare type pluginFunction = (pluginName: string, content: string | null, file: string, config: object, root: string) => any;
export interface IInstallOptions {
    dev: boolean;
    peerDependencies?: boolean;
}
export declare const taroPluginPrefix = "@tarojs/plugin-";
export declare function resolveNpm(pluginName: string, root: any): Promise<string>;
export declare function resolveNpmSync(pluginName: string, root: any): string;
export declare function installNpmPkg(pkgList: string[] | string, options: IInstallOptions): any;
export declare const callPlugin: pluginFunction;
export declare const callPluginSync: pluginFunction;
export declare function getNpmPkgSync(npmName: string, root: string): any;
export declare function getNpmPkg(npmName: string, root: string): Promise<any>;
export {};
