import { FONT_LIMIT, IMAGE_LIMIT, MEDIA_LIMIT } from '@tarojs/runner-utils'

import type { ViteMiniBuildConfig } from '@tarojs/taro/types/compile/viteCompilerContext'

const platform = 'mini'

const defaultConfig: Partial<ViteMiniBuildConfig> = {
  sourceRoot: 'src',
  outputRoot: 'dist',
  output: {
    chunkFileNames: '[name].js',
  },
  fileType: {
    style: '.wxss',
    config: '.json',
    script: '.js',
    templ: '.wxml'
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
