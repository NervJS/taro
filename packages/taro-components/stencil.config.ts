import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'

export const config: Config = {
  namespace: 'taro-components',
  globalStyle: './node_modules/weui/dist/style/weui.css',
  plugins: [
    sass()
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: './loader'
    }
  ],
  excludeSrc: ['/test/', '**/.spec.', '/types/', '*.d.ts']
}
