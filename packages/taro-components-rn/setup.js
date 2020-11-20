import 'react-native'
import 'jest-enzyme'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
// const jsdom = require('jsdom')
// const { JSDOM } = jsdom

// const dom = new JSDOM('')
// const { window } = dom
// global.document = window.document
// global.window = window.defaultView
// Object.keys(document.defaultView).forEach((property) => {
//   if (typeof global[property] === 'undefined') {
//     global[property] = document.defaultView[property];
//   }
// })

configure({ adapter: new Adapter() })
