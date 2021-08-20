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

import path from 'path'
import less from 'less'
import makeLessImport from '../utils/lessImport'

interface SourceMapOption {
  sourceMapURL?: string;
  sourceMapBasepath?: string;
  sourceMapRootpath?: string;
  outputSourceFiles?: boolean;
  sourceMapFileInline?: boolean;
}
// http://lesscss.org/usage/#less-options
export interface Options {
  sourceMap?: SourceMapOption;
  /** Filename of the main file to be passed to less.render() */
  filename?: string;
  /** The locations for less looking for files in @import rules */
  paths?: string[];
  /** True, if run the less parser and just reports errors without any output. */
  lint?: boolean;
  /** Pre-load global Less.js plugins */
  plugins?: Plugin[];
  /** @deprecated If true, compress using less built-in compression. */
  compress?: boolean;
  strictImports?: boolean;
  /** If true, allow imports from insecure https hosts. */
  insecure?: boolean;
  depends?: boolean;
  maxLineLen?: number;
  /** @deprecated If false, No color in compiling. */
  color?: boolean;
  /** @deprecated False by default. */
  ieCompat?: boolean;
  /** @deprecated If true, enable evaluation of JavaScript inline in `.less` files. */
  javascriptEnabled?: boolean;
  /** Whether output file information and line numbers in compiled CSS code. */
  dumpLineNumbers?: 'comment' | string;
  /** Add a path to every generated import and url in output css files. */
  rootpath?: string;
  /** Math mode options for avoiding symbol conficts on math expressions. */
  math?: 'always' | 'strict' | 'parens-division' | 'parens' | 'strict-legacy' | number;
  /** If true, stops any warnings from being shown. */
  silent?: boolean;
  /** Without this option, Less attempts to guess at the output unit when it does maths. */
  strictUnits?: boolean;
  /** Defines a variable that can be referenced by the file. */
  globalVars?: {
    [key: string]: string,
  };
  /** Puts Var declaration at the end of base file. */
  modifyVars?: {
    [key: string]: string,
  };
  /** Read files synchronously in Node.js */
  syncImport?: boolean;
}

export interface Config {
  alias?: Record<string, string>
  options: Options
  additionalData?: string | ((string) => string)
}

function renderToCSS (src, filename, options = {} as any) {
  // default plugins
  const plugins = [makeLessImport(options)]
  // default paths set current filePath
  const paths = [path.dirname(path.resolve(process.cwd(), filename))]
  return new Promise((resolve, reject) => {
    less
      .render(src, {
        ...options,
        filename,
        plugins: plugins.concat(options.plugins || []),
        paths: paths.concat(options.paths || [])
      }, (err, output) => {
        if (err) {
          return reject(err.message)
        }
        resolve(output.css)
      })
  })
}

export default function transform (src: string, filename: string, config: Config) {
  let data = src

  if (typeof config.additionalData !== 'undefined') {
    data =
      typeof config.additionalData === 'function'
        ? `${config.additionalData(data)}`
        : `${config.additionalData}\n${data}`
  }
  return renderToCSS(data, filename, { ...config.options, alias: config.alias })
    .then((css: string) => {
      return css
    })
}
