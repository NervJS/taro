import { singleQuote } from '@tarojs/shared'

export const components = {
  Checkbox: {
    'group-id': ''
  },
  Span: {},
  Tabs: {
    index: '0',
    vertical: 'false',
    bindchange: ''
  },
  TabBar: {
    mode: singleQuote('scrollable')
  },
  TabContent: {
    scrollable: 'true'
  },
  List: {
    scrollpage: 'false',
    cachedcount: '0',
    scrollbar: 'off',
    scrolleffect: singleQuote('spring'),
    indexer: 'false',
    indexercircle: '',
    indexermulti: 'false',
    indexerbubble: 'true',
    divider: 'false',
    shapemode: singleQuote('default'),
    itemscale: 'true',
    itemcenter: 'false',
    updateeffect: 'false',
    chainanimation: 'false',
    scrollvibrate: 'true',
    initialindex: '0',
    initialoffset: '0',
    selected: '',
    bindindexerchange: '',
    bindscroll: '',
    bindscrollbottom: '',
    bindscrolltop: '',
    bindscrollend: '',
    bindscrolltouchup: '',
    bindrequestitem: ''
  },
  ListItem: {
    type: singleQuote('default'),
    primary: 'false',
    section: '',
    sticky: singleQuote('none'),
    stickyradius: singleQuote('1000px'),
    clickeffect: 'true',
    bindsticky: ''
  }
}
