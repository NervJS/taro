export default {
  "plugins": [],
  "themes": [],
  "customFields": {},
  "themeConfig": {},
  "baseUrl": "/taro/next/",
  "favicon": "./img/favicon.ico",
  "tagline": "多端统一开发框架，支持用 React 的开发方式编写一次代码，生成能运行在微信/百度/字节跳动/支付宝/QQ小程序、快应用、H5、React Native 等平台的应用。",
  "title": "Taro",
  "url": "https://taro.jd.com",
  "presets": [
    [
      "@docusaurus/preset-classic",
      {
        "docs": {
          "path": "../docs",
          "sidebarPath": "/Users/yuche/Developer/taro-docs/website/sidebars.json"
        },
        "editUrl": "https://github.com/nervjs/taro/edit/master/docs/",
        "title": "Taro",
        "tagline": "多端统一开发框架，支持用 React 的开发方式编写一次代码，生成能运行在微信/百度/字节跳动/支付宝/QQ小程序、快应用、H5、React Native 等平台的应用。",
        "url": "https://taro.jd.com",
        "projectName": "taro",
        "organizationName": "NervJS",
        "headerLinks": [
          {
            "doc": "README",
            "label": "文档"
          },
          {
            "doc": "components-desc",
            "label": "组件库"
          },
          {
            "doc": "apis/about/desc",
            "label": "API"
          },
          {
            "search": true
          },
          {
            "href": "https://taro-ui.jd.com",
            "label": "Taro-UI"
          },
          {
            "href": "https://taro-ext.jd.com",
            "label": "物料市场"
          },
          {
            "href": "https://taro-club.jd.com",
            "label": "论坛"
          },
          {
            "href": "https://github.com/NervJS/taro",
            "label": "GitHub"
          }
        ],
        "algolia": {
          "apiKey": "57b9948bff42bc0dbc6c219556fbae35",
          "indexName": "taro"
        },
        "users": [
          {
            "caption": "",
            "image": "img/logo-taro.png",
            "infoLink": "https://taro.jd.com",
            "pinned": true
          }
        ],
        "headerIcon": "img/logo-taro.png",
        "footerIcon": "img/logo-taro.png",
        "favicon": "img/favicon.ico",
        "colors": {
          "primaryColor": "#0000c2",
          "secondaryColor": "#4a72ea"
        },
        "copyright": "Copyright © 2020 ltp11",
        "highlight": {
          "defaultLang": "javascript",
          "theme": "vs",
          "themeUrl": "https://storage.jd.com/taro-resource/vs.min.css"
        },
        "usePrism": true,
        "scripts": [
          "https://storage.jd.com/taro-docs/buttons.js",
          {
            "src": "https://storage.jd.com/taro-resource/tongji.js",
            "async": true
          },
          {
            "src": "https://storage.jd.com/taro-docs/taro-doc-hotjar.js",
            "async": true
          }
        ],
        "onPageNav": "separate",
        "ogImage": "img/logo-taro.png",
        "twitterImage": "img/logo-taro.png",
        "scrollToTop": true,
        "docsSideNavCollapsible": true
      }
    ]
  ]
};