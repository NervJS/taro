export const root = '/wxProject'

// js小程序demo
export const DEMO_JS_FILE_INFO = {
  '/project.config.json': `
    {}
  `,
  '/app.js': `App({})`,
  '/app.json': `
    {
      "pages":[
        "pages/index/index"
      ]
    }
  `,
  '/pages/index/index.js': `
    const app = getApp()
      Page({
      data: {
        motto: 'Hello World',
      },
      onLoad() {}
    })
  `,
  '/pages/index/index.json': `
    {
      "usingComponents": {}
    }
  `,
  '/pages/index/index.wxml': `
    <view>
      <text>{{motto}}</text>
    </view>
  `,
  '/pages/index/index.wxss': ``,
}

// js小程序demo（配置miniprogramRoot）
export const DEMO_JS_FILE_INFO_MINIPROGRANROOT = {
  '/project.config.json': `
    {
      "miniprogramRoot": "miniprogram/"
    }
  `,
  '/miniprogram/app.js': `App({})`,
  '/miniprogram/app.json': `
    {
      "pages":[
        "pages/index/index"
      ]
    }
  `,
  '/miniprogram/pages/index/index.js': `
    const app = getApp()
      Page({
      data: {
        motto: 'Hello World',
      },
      onLoad() {}
    })
  `,
  '/miniprogram/pages/index/index.json': `
    {
      "usingComponents": {}
    }
  `,
  '/miniprogram/pages/index/index.wxml': `
    <view>
      <text>{{motto}}</text>
    </view>
  `,
  '/miniprogram/pages/index/index.wxss': ``,
}

// js小程序demo（配置miniprogramRoot）
export const CONVERT_CONFIG_DATA = {
  '/convert.config.json': `
    {
      "external": ["./mps/*"]
    }
  `,
  '/app.js': `
    import { data } from './mps/index/index.js'
  `,
  '/mps/index/index.js': `
    const a = 1
  `,
}
