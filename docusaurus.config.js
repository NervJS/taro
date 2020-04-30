/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config.html for all the possible
// site configuration options.
const versions = require('./versions.json');


const siteConfig = {
  baseUrl: '/' /* base url for your project */,
  favicon: './img/favicon.ico',
  tagline: '多端统一开发框架，支持用 React 的开发方式编写一次代码，生成能运行在微信/百度/字节跳动/支付宝/QQ小程序、快应用、H5、React Native 等平台的应用。',
  title: 'Taro 文档' /* title for your website */,
  url: 'https://taro.jd.com' /* your website url */,
  themes: ['@docusaurus/theme-live-codeblock'],
  organizationName: 'nervjs',
  projectName: 'taro',
  customFields: {
    versions
  },
  themeConfig: {
    scrollToTop: true,
    disableDarkMode: true,
    algolia: {
      apiKey: '57b9948bff42bc0dbc6c219556fbae35',
      indexName: 'taro',
      algoliaOptions: {
        facetFilters: [`version:${versions[0]}`],
      },
    },
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
    navbar: {
      title: 'Taro',
      logo: {
        alt: 'Taro logo',
        src: 'img/logo-taro.png',
      },
      links: [
        {
          to: 'versions',
          label: `v${versions[0]}`,
          position: 'left',
          version: 'true'
        },
        {
          to: 'docs/README',
          activeBasePath: 'docs',
          label: '文档',
          position: 'left',
        },
        {
          to: 'docs/components-desc',
          activeBasePath: 'docs/components',
          label: '组件库',
          position: 'left',
        },
        {
          to: 'docs/apis/about/desc',
          activeBasePath: 'docs/api',
          label: 'API',
          position: 'left',
        },
        {
          to: 'blog',
          label: '博客',
          position: 'left',
        },
        {href: 'https://taro-ui.jd.com', label: 'Taro-UI', position: 'right'},
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
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // sidebars file relative to website dir.
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/nervjs/taro/edit/docs/'
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/nervjs/taro/edit/blog/',
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

module.exports = siteConfig
