import Fuck from './wxParse'

import './wxParse.wxss'

Component({
  properties: {
    html: {
      type: String,
      value: '',
    }
  },
  ready () {
    Fuck.wxParse('wxParseData', 'html', this.properties.html, this)
  }
})
