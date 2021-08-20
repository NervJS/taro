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

import { getProjectConfig } from './utils'
import { handleFile, handleTaroFile, getReactNativeVersion, searchReactNativeModule } from './taroResolver'
interface Options{
  fromRunner: boolean // taro rn-runner内部调用
}
export class Supporter {
  fromRunner = false

  constructor (opt?: Options) {
    process.env.TARO_ENV = 'rn'
    getProjectConfig()
    if (opt?.fromRunner) {
      this.fromRunner = true
    }
  }

  getTransformer () {
    const transformerPath = this.fromRunner ? './taroTransformer' : './transformer'
    return {
      dynamicDepsInPackages: 'reject',
      babelTransformerPath: require.resolve(transformerPath),
      assetRegistryPath: require.resolve('react-native/Libraries/Image/AssetRegistry', {
        paths: [process.cwd()]
      }),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false
        }
      })
    }
  }

  getResolver () {
    const handleEntryFile = this.fromRunner ? handleTaroFile : handleFile
    const resolver: any = {
      sourceExts: ['ts', 'tsx', 'js', 'jsx', 'scss', 'sass', 'less', 'css', 'pcss', 'json', 'styl', 'cjs'],
      resolveRequest: handleEntryFile,
      resolverMainFields: ['react-native', 'browser', 'main']
    }
    // 兼容0.60
    const rnVersion = getReactNativeVersion()
    if (rnVersion && (rnVersion.major === 0) && (rnVersion.minor === 60)) {
      resolver.resolveRequest = (context, realModuleName, platform, moduleName) => {
        const res = handleEntryFile(context, realModuleName, platform, moduleName)
        if (res) {
          return res
        }
        if (/node_modules[\\/]react-native[\\/]/.test(context.originModulePath)) {
          const existingModule = searchReactNativeModule(moduleName, platform)
          if (existingModule) {
            return {
              filePath: existingModule,
              type: 'sourceFile'
            }
          }
        }
      }
    }
    return resolver
  }

  getMetroConfig () {
    return {
      transformer: this.getTransformer(),
      resolver: this.getResolver()
    }
  }
}
