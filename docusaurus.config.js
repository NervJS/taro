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
  baseUrl: process.env.BASE === 'taro' ? '/taro/' : '/' /* base url for your project */,
  favicon: './img/favicon.ico',
  tagline: 'Taro 是一个开放式跨端跨框架解决方案，支持使用 React/Vue/Nerv 等框架来开发微信/京东/百度/支付宝/字节跳动/ QQ 小程序/H5/React Native 等应用。',
  title: 'Taro 文档' /* title for your website */,
  url: 'https://nervjs.github.io' /* your website url */,
  themes: ['@docusaurus/theme-live-codeblock'],
  organizationName: 'nervjs',
  projectName: 'taro',
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
  ],
  themeConfig: {
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
        {href: 'https://github.com/NervJS/taro/discussions', label: '论坛', position: 'left'},
        {href: 'https://taro-ui.jd.com', label: 'Taro UI', position: 'right'},
        {href: 'https://taro-ext.jd.com', label: '物料市场', position: 'right'},
        {to: 'showcase', label: '案例', position: 'right'},
        {href: 'https://taro.jd.com/jdmp/index.html', label: '京东小程序', position: 'right'},
        {
          href: 'https://github.com/nervjs/taro',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    }
    // announcementBar: {
    //   id: 'support_us', // Any value that will identify this message.
    //   content:
    //     '<div class="top_tip" role="alert">感谢大家的支持</div>',
    //   backgroundColor: '#ffba00', // Defaults to `#fff`.
    //   textColor: '#091E42', // Defaults to `#000`.
    //   isCloseable: true, // Defaults to `true`.
    // }

  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
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
          blogSidebarCount: 5,
          blogSidebarTitle: '最近更新'
        },
        // For top-level user or org sites, the organization is still the same.
        // e.g., for the https://JoelMarcey.github.io site, it would be set like...
        //   organizationName: 'JoelMarcey'


        /* path to images for header/footer */
        headerIcon: 'img/logo-taro.png',
        footerIcon: 'img/logo-taro.png',
        favicon: 'img/favicon.ico',

        /* colors for website */
        colors: {
          primaryColor: '#0000c2',
          secondaryColor: '#4a72ea'
        },

        /* custom fonts for website */
        /* fonts: {
          myFont: [
            "Times New Roman",
            "Serif"
          ],
          myOtherFont: [
            "-apple-system",
            "system-ui"
          ]
        }, */

        // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
        copyright: 'Copyright © ' + new Date().getFullYear() + ' ltp11',

        theme: {
          customCss: require.resolve('./static/css/custom.css'),
        },

        /* On page navigation for the current documentation page */
        onPageNav: 'separate',

        /* Open Graph and Twitter card images */
        ogImage: 'img/logo-taro.png',
        twitterImage: 'img/logo-taro.png',

        scrollToTop: true,
        docsSideNavCollapsible: true,
      }
    ],
  ]

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
}

const siteConfigTaroZone = {
  baseUrl: process.env.BASE === 'taro' ? '/taro/' : '/' /* base url for your project */,
  favicon: './img/favicon.ico',
  tagline: 'Taro 是一个开放式跨端跨框架解决方案，支持使用 React/Vue/Nerv 等框架来开发微信/京东/百度/支付宝/字节跳动/ QQ 小程序/H5 等应用。',
  title: 'Taro 文档' /* title for your website */,
  url: 'https://docs.taro.zone' /* your website url */,
  themes: ['@docusaurus/theme-live-codeblock'],
  organizationName: 'nervjs',
  projectName: 'taro',
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
    }
  ],
  themeConfig: {
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
        {
          to: 'showcase',
          label: '案例',
          position: 'left',
        },
        {href: 'https://taro-ui.taro.zone', label: 'Taro UI', position: 'right'},
        {href: 'https://taro-ext.jd.com', label: '物料市场', position: 'right'},
        {href: 'https://taro-club.jd.com', label: '论坛', position: 'right'},
        {href: 'https://taro.jd.com/jdmp/index.html', label: '京东小程序', position: 'right'},
        {
          href: 'https://github.com/nervjs/taro',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    }
    // announcementBar: {
    //   id: 'support_us', // Any value that will identify this message.
    //   content:
    //     '<div class="top_tip" role="alert">谢谢大家的支持！</div>',
    //   backgroundColor: '#ffba00', // Defaults to `#fff`.
    //   textColor: '#091E42', // Defaults to `#000`.
    //   isCloseable: true, // Defaults to `true`.
    // }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
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
          blogSidebarCount: 5,
          blogSidebarTitle: '最近更新'
        },
        // For top-level user or org sites, the organization is still the same.
        // e.g., for the https://JoelMarcey.github.io site, it would be set like...
        //   organizationName: 'JoelMarcey'


        /* path to images for header/footer */
        headerIcon: 'img/logo-taro.png',
        footerIcon: 'img/logo-taro.png',
        favicon: 'img/favicon.ico',

        /* colors for website */
        colors: {
          primaryColor: '#0000c2',
          secondaryColor: '#4a72ea'
        },

        /* custom fonts for website */
        /* fonts: {
          myFont: [
            "Times New Roman",
            "Serif"
          ],
          myOtherFont: [
            "-apple-system",
            "system-ui"
          ]
        }, */

        // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
        copyright: 'Copyright © ' + new Date().getFullYear() + ' ltp11',

        theme: {
          customCss: require.resolve('./static/css/custom.css'),
        },

        /* On page navigation for the current documentation page */
        onPageNav: 'separate',

        /* Open Graph and Twitter card images */
        ogImage: 'img/logo-taro.png',
        twitterImage: 'img/logo-taro.png',

        scrollToTop: true,
        docsSideNavCollapsible: true,
      }
    ],
  ],

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
}

const siteConfig = process.env.BASE == 'zone' ? siteConfigTaroZone : siteConfigGithub
module.exports = siteConfig
