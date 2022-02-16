/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config.html for all the possible
// site configuration options.
const versions = require('./versions.json');


const siteConfigGithub = {
  title: 'Taro 文档' /* title for your website */,
  tagline: 'Taro 是一个开放式跨端跨框架解决方案，支持使用 React/Vue/Nerv 等框架来开发微信/京东/百度/支付宝/字节跳动/ QQ 小程序/H5/React Native 等应用。',
  url: 'https://nervjs.github.io' /* your website url */,
  baseUrl: process.env.BASE === 'taro' ? '/taro/' : '/' /* base url for your project */,
  onBrokenLinks: 'log',
  onBrokenMarkdownLinks: 'log',
  favicon: './img/favicon.ico',
  organizationName: 'nervjs',
  projectName: 'taro',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // sidebars file relative to website dir.
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/nervjs/taro/edit/docs/',
          lastVersion: "3.x",
          versions: {
            current: {
              label: `下个版本`
            }
          }
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/nervjs/taro/edit/blog/',
          blogSidebarCount: 'ALL',
          blogSidebarTitle: '全部'
        },
        theme: {
          customCss: require.resolve('./static/css/custom.css'),
        },
      })
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
  ({
    hideableSidebar: true,
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    algolia: {
      contextualSearch: true,
      apiKey: '3f32982103f4e75dadd86900d26a9315', /* (github.com)taro:57b9948bff42bc0dbc6c219556fbae35, (netlify)taro_new:820a8e12c97e870d4e0785d52858230c */
      indexName: 'taro-zone',
      searchParameters: {
        // facetFilters: [`version: ${versions[0]}`],
      },
    },
    navbar: {
      hideOnScroll: false,
      title: 'Taro',
      logo: {
        alt: 'Taro logo',
        src: 'img/logo-taro.png',
        srcDark: 'img/logo-taro.png'
      },
      items: [
        {
          type: 'docsVersionDropdown',
          position: 'left',
          dropdownActiveClassDisabled: true,
          dropdownItemsAfter: [
            {
              to: '/versions',
              label: '全部版本',
            },
          ],
        },
        {
          type: 'doc',
          docId: 'README',
          label: '文档',
          position: 'left'
        },
        {
          type: 'doc',
          docId: 'components-desc',
          label: '组件库',
          position: 'left',
        },
        {
          type: 'doc',
          docId: 'apis/about/desc',
          label: 'API',
          position: 'left',
        },
        {
          to: "docs/guide",
          activeBasePath: 'docs/guide',
          activeBaseRegex: 'docs/guide',
          label: '教程',
          position: 'left',
        },
        {
          to: 'blog',
          label: '博客',
          position: 'left',
        },
        {href: 'https://github.com/NervJS/taro/issues', label: '问题反馈', position: 'left'},
        {href: 'https://deco-preview.jd.com?from=taro-docs', label: '设计稿生成代码', position: 'left'},
        {
          label: '生态系统',
          position: 'right',
          items:[
            {href: 'https://github.com/NervJS/taro/discussions', label: '论坛'},
            {href: 'https://taro-ext.jd.com', label: '物料市场'},
            {to: 'showcase', label: '案例'},
            {href: 'https://nutui.jd.com/#/', label: 'NutUI'},
            {href: 'https://taro-ui.jd.com', label: 'Taro UI'},
            {href: 'https://taro.jd.com/jdmp/index.html', label: '京东小程序'},
          ]
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/nervjs/taro',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: '文档',
          items: [
            {
              label: '文档',
              to: '/docs/README',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Taro by O2 labs`,
    },

    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
    announcementBar: {
      id: 'support_us', // Any value that will identify this message.
      content:
        '<div class="top_tip" role="alert">由凹凸实验室倾力打造的「Deco 设计稿一键生成多端代码」预览版正式上线啦，欢迎<a target="_blank" href="https://deco-preview.jd.com?from=taro-docs">免费试用</a>！</div>',
      backgroundColor: '#f6ffed', // Defaults to `#fff`.
      textColor: '#333333', // Defaults to `#000`.
      isCloseable: true, // Defaults to `true`.
    }
  }),


  customFields: {
    versions
  },
  scripts: [
    {
      src: 'https://storage.jd.com/taro-resource/tongji.js',
      async: true
    },
    {
      src: 'https://storage.jd.com/taro-docs/taro-doc-hotjar.js',
      async: true
    },
    {
      src: 'https://storage.360buyimg.com/quark-platform/sdk/ling-distribute-sdk-h5.0.7.0.js',
      async: true
    },
  ],
  i18n: {
    defaultLocale: 'zh-cn',
    locales: ['zh-cn', 'en'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
      },
      'zh-cn':{
        label: '中文',
        direction: 'ltr',
      },
    },
  },



  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
}

const siteConfigTaroZone = {
  title: 'Taro 文档' /* title for your website */,
  tagline: 'Taro 是一个开放式跨端跨框架解决方案，支持使用 React/Vue/Nerv 等框架来开发微信/京东/百度/支付宝/字节跳动/ QQ 小程序/H5 等应用。',
  url: 'https://docs.taro.zone' /* your website url */,
  baseUrl: process.env.BASE === 'taro' ? '/taro/' : '/' /* base url for your project */,
  onBrokenLinks: 'log',
  onBrokenMarkdownLinks: 'log',
  favicon: './img/favicon.ico',
  organizationName: 'nervjs',
  projectName: 'taro',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // sidebars file relative to website dir.
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/nervjs/taro/edit/docs/',
          lastVersion: "3.x",
          versions: {
            current: {
              label: `下个版本`
            }
          }
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/nervjs/taro/edit/blog/',
          blogSidebarCount: 'ALL',
          blogSidebarTitle: '全部'
        },
        theme: {
          customCss: require.resolve('./static/css/custom.css'),
        },
      })
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      hideableSidebar: true,
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      algolia: {
        contextualSearch: true,
        apiKey: '3f32982103f4e75dadd86900d26a9315',
        indexName: 'taro-zone',
        searchParameters: {
          // facetFilters: [`version:VERSIONS`],
        },
      },
      prism: {
        theme: require('prism-react-renderer/themes/github'),
        darkTheme: require('prism-react-renderer/themes/dracula'),
      },
      navbar: {
        hideOnScroll: false,
        title: 'Taro',
        logo: {
          alt: 'Taro logo',
          src: 'img/logo-taro.png',
          srcDark: 'img/logo-taro.png'
        },
        items: [
          {
            type: 'docsVersionDropdown',
            position: 'left',
            dropdownActiveClassDisabled: true,
            dropdownItemsAfter: [
              {
                to: 'versions',
                label: '全部版本',
                type: 'doc',
                docId:'version'
              },
            ],
          },
          {
            type: 'doc',
            docId: 'README',
            label: '文档',
            position: 'left'
          },
          {
            type: 'doc',
            docId: 'components-desc',
            label: '组件库',
            position: 'left',
          },
          {
            type: 'doc',
            docId: 'apis/about/desc',
            label: 'API',
            position: 'left',
          },
          {
            to: 'docs/guide',
            activeBasePath: 'docs/guide',
            activeBaseRegex: 'docs/guide',
            label: '教程',
            position: 'left',
          },
          {
            to: 'blog',
            label: '博客',
            position: 'left',
          },
          {href: 'https://github.com/NervJS/taro/issues', label: '问题反馈', position: 'left'},
          {href: 'https://deco-preview.jd.com?from=taro-docs', label: '设计稿生成代码', position: 'left'},
          {
            label: '生态系统',
            position: 'right',
            items:[
              {href: 'https://github.com/NervJS/taro/discussions', label: '论坛'},
              {href: 'https://taro-ext.jd.com', label: '物料市场'},
              {to: 'showcase', label: '案例'},
              {href: 'https://nutui.jd.com/#/', label: 'NutUI'},
              {href: 'https://taro-ui.jd.com', label: 'Taro UI'},
              {href: 'https://taro.jd.com/jdmp/index.html', label: '京东小程序'},
            ]
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/nervjs/taro',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },

      footer: {
        style: 'dark',
        links: [
          {
            title: '文档',
            items: [
              {
                label: '文档',
                to: '/docs/README',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Taro by O2 labs`,
      },

      announcementBar: {
        id: 'support_us', // Any value that will identify this message.
        content:
          '<div class="top_tip" role="alert">由凹凸实验室倾力打造的「Deco 设计稿一键生成多端代码」预览版正式上线啦，欢迎<a target="_blank" href="https://deco-preview.jd.com?from=taro-docs">免费试用</a>！</div>',
        backgroundColor: '#f6ffed', // Defaults to `#fff`.
        textColor: '#333333', // Defaults to `#000`.
        isCloseable: true, // Defaults to `true`.
      }
    }),

  customFields: {
    versions
  },
  scripts: [
    {
      src: 'https://storage.jd.com/taro-resource/tongji.js',
      async: true
    },
    {
      src: 'https://storage.jd.com/taro-docs/taro-doc-hotjar.js',
      async: true
    },
    {
      src: 'https://storage.360buyimg.com/quark-platform/sdk/ling-distribute-sdk-h5.0.7.0.js',
      async: true
    },
  ],

  i18n: {
    defaultLocale: 'zh-cn',
    locales: ['zh-cn', 'en'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
      },
      'zh-cn':{
        label: '中文',
        direction: 'ltr',
      },
    },
  },

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
}

const siteConfig = process.env.BASE == 'zone' ? siteConfigTaroZone : siteConfigGithub
module.exports = siteConfig
