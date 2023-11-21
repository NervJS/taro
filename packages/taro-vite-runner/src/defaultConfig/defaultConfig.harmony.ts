import { FONT_LIMIT, IMAGE_LIMIT, MEDIA_LIMIT } from '@tarojs/runner-utils'
import { ViteHarmonyBuildConfig } from '@tarojs/taro/types/compile/viteCompilerContext'

const platform = 'harmony'

const defaultConfig: Partial<ViteHarmonyBuildConfig> = {
  sourceRoot: 'src',
  fileType: {
    style: '.css',
    config: '.json',
    script: '.ets',
    templ: '.hml'
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
      enable: false,
      config: {
        flexbox: 'no-2009'
      }
    },
    pxtransform: {
      enable: false,
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
