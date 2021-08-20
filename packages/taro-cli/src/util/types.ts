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

export interface IInstallOptions {
  dev: boolean;
  peerDependencies?: boolean;
}

export interface INpmConfig {
  dir: string;
  name: string;
}

export interface IResolvedCache {
  [key: string]: {
    main: string;
    files: string[];
  };
}

export interface IPrettierConfig {
  printWidth?: number;
  tabWidth?: number;
  useTabs?: boolean;
  semi?: boolean;
  singleQuote?: boolean;
  jsxSingleQuote?: boolean;
  trailingComma?: 'none' | 'es5' | 'all';
  bracketSpacing?: boolean;
  jsxBracketSameLine?: boolean;
  arrowParens?: 'avoid' | 'always';
  rangeStart?: number;
  rangeEnd?: number;
  parser?:
  | 'babel'
  | 'babylon'
  | 'flow'
  | 'typescript'
  | 'css'
  | 'scss'
  | 'less'
  | 'json'
  | 'json5'
  | 'json-stringify'
  | 'graphql'
  | 'markdown'
  | 'mdx'
  | 'html'
  | 'vue'
  | 'angular'
  | 'yaml';
  filepath?: string;
  requirePragma?: boolean;
  insertPragma?: boolean;
  proseWrap?: 'always' | 'never' | 'preserve';
  htmlWhitespaceSensitivity?: 'css' | 'strict' | 'ignore';
  endOfLine?: 'auto' | 'lf' | 'crlf' | 'cr';
}

export interface IBuildOptions {
  type?: string,
  watch?: boolean,
  platform?: string,
  port?: number,
  release?: boolean,
  envHasBeenSet?: boolean,
  page?: string,
  component?: string,
  uiIndex?: string
}

export interface IMiniAppBuildConfig {
  adapter: string,
  watch?: boolean,
  envHasBeenSet?: boolean,
  port?: number,
  release?: boolean,
  page?: string,
  component?: string
}

export interface IOption {
  [key: string]: any;
}
