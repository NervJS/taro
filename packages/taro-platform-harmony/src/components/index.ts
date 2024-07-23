import { singleQuote } from '@tarojs/shared'

export const components = {
  Checkbox: {
    'group-id': '',
    cn: ''
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
  },
  Switch: {
    showtext: 'false',
    texton: singleQuote('On'),
    textoff: singleQuote('Off')
  },
  Textarea: {
    headericon: '',
    showcounter: 'false',
    menuoptions: '[]',
    softkeyboardenabled: 'true',
    bindtranslate: '',
    bindshare: '',
    bindsearch: '',
    bindoptionselect: '',
    bindselectchange: ''
  },
  Progress: {
    'active-color': singleQuote('#09BB07'),
    'background-color': singleQuote('#EBEBEB'),
    type: singleQuote('horizontal'),
    'font-size': singleQuote('25px'),
    secondarypercent: '0',
    clockwise: 'true'
  },
  Slider: {
    showsteps: 'false',
    showtips: 'false'
  },
  Input: {
    'placeholder-color': singleQuote('#99000000')
  },
  Video: {
    speed: '1',
    bindloadedmetadata: '',
    bindprogress: '',
    bindtap: ''
  },
  Image: {
    alt: ''
  },
  Radio: {
    'group-id': ''
  },
  Picker: {
    selected: '',
    hours: '',
    containsecond: 'false',
    vibrate: 'true',
    lunar: 'false',
    lunarswitch: 'false'
  },
  PickerView: {
    mode: '',
    range: '',
    selected: '',
    hours: '',
    indicatorprefix: '',
    indicatorsuffix: '',
    containsecond: 'false',
    vibrate: 'true',
    lunar: 'false',
    lunarswitch: 'false',
    bindcolumnchange: '',
    cn: ''
  }
}
