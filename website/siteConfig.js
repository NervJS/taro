/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config.html for all the possible
// site configuration options.

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: '',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/docusaurus.svg'.
    image: 'img/logo-taro.png',
    infoLink: 'https://taro.jd.com',
    pinned: true
  }
]

const siteConfig = {
  editUrl: 'https://github.com/nervjs/taro/edit/master/docs/',
  title: 'Taro' /* title for your website */,
  tagline: '多端统一开发框架，支持用 React 的开发方式编写一次代码，生成能运行在微信/百度/字节跳动/支付宝/QQ小程序、快应用、H5、React Native 等平台的应用。',
  url: 'https://taro.jd.com' /* your website url */,
  baseUrl: '/taro/' /* base url for your project */,
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'taro',
  organizationName: 'NervJS',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'README', label: '文档'},
    {doc: 'components-desc', label: '组件库'},
    {doc: 'apis/about/desc', label: 'API'},
    {search: true},
    {href: 'https://taro-ui.jd.com', label: 'Taro-UI'},
    {href: 'https://taro-ext.jd.com', label: '物料市场'},
    {href: 'https://taro-club.jd.com', label: '论坛'}
  ],

  algolia: {
    apiKey: '57b9948bff42bc0dbc6c219556fbae35',
    indexName: 'taro'
  },

  // If you have users set above, you add it here:
  users,

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

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    // theme: 'tomorrow-night',
    theme: 'Vs'
  },

  usePrism: true,

  // Add custom scripts here that would be placed in <script> tags
  scripts: [
    'http://storage.jd.com/taro-docs/buttons.js',
    'https://jdc.jd.com/demo/talenttest/js/url.js',
    {
      src: 'https://storage.jd.com/taro-resource/tongji.js',
      async: true
    },
    {
      src: 'https://storage.jd.com/taro-docs/taro-doc-hotjar.js',
      async: true
    }
  ],

  /* On page navigation for the current documentation page */
  onPageNav: 'separate',

  /* Open Graph and Twitter card images */
  ogImage: 'img/logo-taro.png',
  twitterImage: 'img/logo-taro.png',

  scrollToTop: true,
  docsSideNavCollapsible: true

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
}

module.exports = siteConfig
