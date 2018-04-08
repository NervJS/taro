import Nerv from 'nervjs'
import * as Taro from '../../components/index'
import Doc from '../../components/scroll-view/index.md'
export default class ScrollView extends Nerv.Component {
  constructor () {
    super(...arguments)
  }
  handleScroll (e) {
    console.log('scroll', e)
  }
  handleBindscrolltoupper () {
    console.log('bindscrolltoupper')
  }
  handleBindscrolltolower () {
    console.log('bindscrolltolower')
  }
  render () {
    return (
      <Taro.View>
        <Taro.View className='page'>
          <Taro.View className='page__header'>
            <Taro.View className='page__title'>
              <Taro.Text>scroll-view</Taro.Text>
            </Taro.View>
            <Taro.View className='page__desc'>
              <Taro.Text>可滚动视图区域</Taro.Text>
            </Taro.View>
          </Taro.View>
          <Taro.View className='page__con'>
            <Taro.View className='page__con__list'>
              <Taro.View className='page__con__title'>
                <Taro.Text>vertical scroll</Taro.Text>
              </Taro.View>
              <Taro.ScrollView
                scroll-y
                scroll-with-animation
                scroll-top='80'
                style='height: 200px;'
                lower-threshold='20'
                upperThreshold='20'
                bindscrolltoupper={this.handleBindscrolltoupper}
                onScroll={this.handleScroll}
              >
                <Taro.View style='height:100px;background-color:#FF6164;' />
                <Taro.View style='height:100px;background-color:#FFBE34;' />
                <Taro.View style='height:100px;background-color:#00BB2B;' />
              </Taro.ScrollView>
            </Taro.View>
            <Taro.View className='page__con__list'>
              <Taro.View className='page__con__title'>
                <Taro.Text>horizontal scroll</Taro.Text>
              </Taro.View>
              <Taro.ScrollView
                scroll-x
                scroll-left='30'
                style='white-space: nowrap;'
                bindscrolltolower={this.handleBindscrolltolower}
              >
                <Taro.View style='height:100px;background-color:#FF6164;display:inline-block;width:200px;' />
                <Taro.View style='height:100px;background-color:#FFBE34;display:inline-block;width: 200px;' />
                <Taro.View style='height:100px;background-color:#00BB2B;display:inline-block;width: 200px;' />
              </Taro.ScrollView>
            </Taro.View>
          </Taro.View>
        </Taro.View>
        <Taro.View className='markdown'>
          <Doc />
        </Taro.View>
      </Taro.View>
    )
  }
}
