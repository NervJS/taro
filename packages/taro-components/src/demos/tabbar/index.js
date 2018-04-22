import Nerv from 'nervjs'
import * as Taro from '../../components/index'

export default class Tabbar extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  render () {
    const __tabs = {
      color: '#666',
      selectedColor: 'red',
      // backgroundColor: '#efefef',
      borderStyle: 'white',
      list: [
        {
          text: 'Index',
          iconPath: '//jdc.jd.com/img/100x100',
          selectedIconPath: '//jdc.jd.com/img/100x100',
          pagePath: 'pages/index/index'
        },
        {
          text: 'Hello',
          iconPath: '//jdc.jd.com/img/100x100',
          selectedIconPath: '//jdc.jd.com/img/100x100',
          pagePath: 'pages/hello/hello'
        },
        {
          text: 'Hello',
          iconPath: '//jdc.jd.com/img/100x100',
          selectedIconPath: '//jdc.jd.com/img/100x100',
          pagePath: 'pages/hello/hello'
        },
        {
          text: 'Hello',
          pagePath: 'pages/hello/hello'
        }
      ]
    }
    return <Taro.Tabbar conf={__tabs} />
  }
}
