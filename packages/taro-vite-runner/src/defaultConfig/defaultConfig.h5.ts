import { FONT_LIMIT, IMAGE_LIMIT, MEDIA_LIMIT } from '@tarojs/runner-utils'

import type { ViteH5BuildConfig } from '@tarojs/taro/types/compile/viteCompilerContext'

const platform = 'h5'

const defaultConfig: Partial<ViteH5BuildConfig> = {
  staticDirectory: 'static',
  sourceRoot: 'src',
  outputRoot: 'dist',
  output: {
    chunkFileNames: 'js/[name].[hash].js'
  },
  imageUrlLoaderOption: {
    limit: IMAGE_LIMIT
  },
  fontUrlLoaderOption: {
    limit: FONT_LIMIT
  },
  mediaUrlLoaderOption: {
    limit: MEDIA_LIMIT
  },
  postcss: {
    url: {
      enable: true,
      config: {
        url: 'rebase'
      }
    },
    autoprefixer: {
      enable: true,
      config: {
        flexbox: 'no-2009'
      }
    },
    pxtransform: {
      enable: true,
      config: {
        platform
      }
    },
    htmltransform: {
      enable: true,
      config: {
        platform,
        removeCursorStyle: false
      }
    }
  }
}

export default defaultConfig
