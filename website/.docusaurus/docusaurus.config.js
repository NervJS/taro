export default {
  "plugins": [],
  "themes": [
    "@docusaurus/theme-live-codeblock"
  ],
  "customFields": {},
  "themeConfig": {
    "disableDarkMode": true,
    "algolia": {
      "apiKey": "57b9948bff42bc0dbc6c219556fbae35",
      "indexName": "taro"
    },
    "prism": {
      "theme": {
        "plain": {
          "color": "#393A34",
          "backgroundColor": "#f6f8fa"
        },
        "styles": [
          {
            "types": [
              "comment",
              "prolog",
              "doctype",
              "cdata"
            ],
            "style": {
              "color": "#999988",
              "fontStyle": "italic"
            }
          },
          {
            "types": [
              "namespace"
            ],
            "style": {
              "opacity": 0.7
            }
          },
          {
            "types": [
              "string",
              "attr-value"
            ],
            "style": {
              "color": "#e3116c"
            }
          },
          {
            "types": [
              "punctuation",
              "operator"
            ],
            "style": {
              "color": "#393A34"
            }
          },
          {
            "types": [
              "entity",
              "url",
              "symbol",
              "number",
              "boolean",
              "variable",
              "constant",
              "property",
              "regex",
              "inserted"
            ],
            "style": {
              "color": "#36acaa"
            }
          },
          {
            "types": [
              "atrule",
              "keyword",
              "attr-name",
              "selector"
            ],
            "style": {
              "color": "#00a4db"
            }
          },
          {
            "types": [
              "function",
              "deleted",
              "tag"
            ],
            "style": {
              "color": "#d73a49"
            }
          },
          {
            "types": [
              "function-variable"
            ],
            "style": {
              "color": "#6f42c1"
            }
          },
          {
            "types": [
              "tag",
              "selector",
              "keyword"
            ],
            "style": {
              "color": "#00009f"
            }
          }
        ]
      },
      "darkTheme": {
        "plain": {
          "color": "#F8F8F2",
          "backgroundColor": "#282A36"
        },
        "styles": [
          {
            "types": [
              "prolog",
              "constant",
              "builtin"
            ],
            "style": {
              "color": "rgb(189, 147, 249)"
            }
          },
          {
            "types": [
              "inserted",
              "function"
            ],
            "style": {
              "color": "rgb(80, 250, 123)"
            }
          },
          {
            "types": [
              "deleted"
            ],
            "style": {
              "color": "rgb(255, 85, 85)"
            }
          },
          {
            "types": [
              "changed"
            ],
            "style": {
              "color": "rgb(255, 184, 108)"
            }
          },
          {
            "types": [
              "punctuation",
              "symbol"
            ],
            "style": {
              "color": "rgb(248, 248, 242)"
            }
          },
          {
            "types": [
              "string",
              "char",
              "tag",
              "selector"
            ],
            "style": {
              "color": "rgb(255, 121, 198)"
            }
          },
          {
            "types": [
              "keyword",
              "variable"
            ],
            "style": {
              "color": "rgb(189, 147, 249)",
              "fontStyle": "italic"
            }
          },
          {
            "types": [
              "comment"
            ],
            "style": {
              "color": "rgb(98, 114, 164)"
            }
          },
          {
            "types": [
              "attr-name"
            ],
            "style": {
              "color": "rgb(241, 250, 140)"
            }
          }
        ]
      }
    },
    "navbar": {
      "title": "Taro",
      "logo": {
        "alt": "Taro logo",
        "src": "img/logo-taro.png"
      },
      "links": [
        {
          "to": "docs/README",
          "activeBasePath": "docs",
          "label": "文档",
          "position": "left"
        },
        {
          "to": "docs/components-desc",
          "activeBasePath": "docs/components",
          "label": "组件库",
          "position": "left"
        },
        {
          "to": "docs/apis/about/desc",
          "activeBasePath": "docs/api",
          "label": "API",
          "position": "left"
        },
        {
          "href": "https://taro-ui.jd.com",
          "label": "Taro-UI",
          "position": "right"
        },
        {
          "href": "https://taro-ext.jd.com",
          "label": "物料市场",
          "position": "right"
        },
        {
          "href": "https://taro-club.jd.com",
          "label": "论坛",
          "position": "right"
        }
      ]
    }
  },
  "baseUrl": "/",
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
          "sidebarPath": "/Users/yuche/Developer/taro-docs/website/sidebars.js"
        },
        "editUrl": "https://github.com/nervjs/taro/edit/master/docs/",
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
        "theme": {
          "customCss": "/Users/yuche/Developer/taro-docs/website/static/css/custom.css"
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