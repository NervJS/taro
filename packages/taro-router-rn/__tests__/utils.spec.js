import { getNavigationOptions } from '../src/utils'

const window = {
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'grey',
  navigationBarTitleText: 'WeChat',
  navigationBarTextStyle: 'blue',
  enablePullDownRefresh: true,
  navigationStyle: 'custom'
}

describe('getNavigationOptions', () => {
  it('get navigationOptions', () => {
    expect(getNavigationOptions(window))
      .toEqual({'backgroundColor': 'grey', 'enablePullDownRefresh': true, 'headerTintColor': 'blue', 'navigationStyle': 'custom', 'title': 'WeChat'})
  })
  it('config is not object', () => {
    expect(() => {
      getNavigationOptions('')
    })
      .toThrow('window 必须是对象')
  })
})
