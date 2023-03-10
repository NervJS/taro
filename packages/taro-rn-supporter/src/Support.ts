/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import resolveReactNativePath from '@react-native-community/cli-config/build/resolveReactNativePath'
import { findProjectRoot } from '@react-native-community/cli-tools'
import * as os from 'os'
import * as path from 'path'

import { ConditionalFileStore } from './conditional-file-store'
import { assetExts } from './defaults'
import { getReactNativeVersion, handleFile, handleTaroFile, searchReactNativeModule } from './taroResolver'
import { TerminalReporter } from './terminal-reporter'
import { getProjectConfig, getRNConfig } from './utils'

const reactNativePath: string = resolveReactNativePath(findProjectRoot())

interface Options {
  fromRunner?: boolean // taro rn-runner内部调用，默认为 true
  qr?: boolean // 是否展示二维码，默认为 true
}

process.env.TARO_ENV = 'rn'

export function getTransformer (opt: Options = {}) {
  const transformerPath = (opt.fromRunner ?? true) ? './taroTransformer' : './transformer'
  const transform:any = {
    allowOptionalDependencies: true,
    asyncRequireModulePath: require.resolve('metro-runtime/src/modules/asyncRequire'),
    dynamicDepsInPackages: 'reject',
    babelTransformerPath: require.resolve(transformerPath),
    assetRegistryPath: require.resolve('react-native/Libraries/Image/AssetRegistry', {
      paths: [process.cwd()]
    }),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true
      }
    })
  }
  if(process.env.PUBLIC_PATH) {
    transform.publicPath = process.env.PUBLIC_PATH
  }
  return transform
}

export function getResolver (opt: Options = {}) {
  const rnConfig = getRNConfig()
  const handleEntryFile = (opt.fromRunner ?? true) ? handleTaroFile : handleFile
  const resolver: any = {
    sourceExts: ['ts', 'tsx', 'js', 'jsx', 'scss', 'sass', 'less', 'css', 'pcss', 'json', 'styl', 'cjs', 'svgx'],
    resolveRequest: handleEntryFile,
    resolverMainFields: ['react-native', 'browser', 'main'],
  }
  if (rnConfig.enableSvgTransform) {
    resolver.assetExts = assetExts.filter(ext => ext !== 'svg')
    resolver.sourceExts.push('svg')
  }
  // 兼容0.60
  const rnVersion = getReactNativeVersion()
  if (rnVersion && (rnVersion.major === 0) && (rnVersion.minor === 60)) {
    resolver.resolveRequest = (context, moduleName, platform) => {
      const res = handleEntryFile(context, moduleName, platform)
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

export function getMetroConfig (opt: Options = {}) {
  const config = getProjectConfig()
  const rnConfig = getRNConfig()
  const entry = rnConfig?.entry || 'app'
  const cacheStore = new ConditionalFileStore<any>({
    root: path.join(os.tmpdir(), 'metro-cache')
  }, entry)
  const reporter = new TerminalReporter(config.sourceRoot || 'src', cacheStore, opt.qr, entry)
  return {
    transformer: getTransformer(opt),
    resolver: getResolver(opt),
    serializer: {
      // We can include multiple copies of InitializeCore here because metro will
      // only add ones that are already part of the bundle
      getModulesRunBeforeMainModule: () => [
        require.resolve(
          path.join(reactNativePath, 'Libraries/Core/InitializeCore')
        )
      ],
      getPolyfills: () =>
        require(path.join(reactNativePath, 'rn-get-polyfills'))()
    },
    cacheStores: [cacheStore],
    reporter,
    server: {
      enhanceMiddleware: (Middleware, Server) => {
        reporter.metroServerInstance = Server
        return Middleware
      }
    }
  }
}
