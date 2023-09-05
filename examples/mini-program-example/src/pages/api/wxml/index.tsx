import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Canvas, ScrollView, Text } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * WXML
 * @returns
 */

class Welcome extends React.Component {
  handleClickWelcome() {
    TestConsole.consoleTest('SelectorQuery.in')
    console.log("Taro.createSelectorQuery().in(this)->select('#welcome').boundingClientRect(callback).exec()")

    Taro.createSelectorQuery()
      .in(process.env.TARO_ENV === 'weapp' ? Taro.getCurrentInstance().page! : this)
      .select('#welcome')
      .boundingClientRect((res) => {
        console.log('callback boundingClientRect:', res)
      })
      .exec()
  }
  render() {
    return (
      <Button id='welcome' className='test-style' onClick={this.handleClickWelcome}>
        自定义组件id: #welcome
      </Button>
    )
  }
}

class SelectorQueryTest extends React.Component {
  state = {
    list: [
      {
        id: 'createSelectorQuery',
        func: () => {
          TestConsole.consoleTest('Taro.createSelectorQuery')
          const query = Taro.createSelectorQuery()
          console.log('Taro.createSelectorQuery:', query)
        },
      },
      {
        id: 'SelectorQuery.select',
        func: () => {
          TestConsole.consoleTest('SelectorQuery.select')
          console.log("Taro.createSelectorQuery()->select('#welcome')")
          const query = Taro.createSelectorQuery().select('#welcome')
          console.log('SelectorQuery.select:', query)
        },
      },
      {
        id: 'SelectorQuery.selectAll',
        func: () => {
          TestConsole.consoleTest('NodesRef.selectAll')
          console.log("Taro.createSelectorQuery()->.selectAll('.test-view')")
          const query = Taro.createSelectorQuery().selectAll('.test-view')
          console.log('SelectorQuery.selectAll:', query)
        },
      },
      {
        id: 'SelectorQuery.selectViewport',
        func: () => {
          TestConsole.consoleTest('SelectorQuery.selectViewport')
          console.log('Taro.createSelectorQuery()->.selectViewport()')
          const query = Taro.createSelectorQuery().selectViewport()
          console.log('SelectorQuery.selectViewport:', query)
        },
      },
      {
        id: 'NodesRef.boundingClientRect',
        func: (apiIndex) => {
          TestConsole.consoleTest('NodesRef.boundingClientRect')
          console.log("Taro.createSelectorQuery()->select('#welcome').boundingClientRect(callback).exec()")
          Taro.createSelectorQuery()
            .select('#welcome')
            .boundingClientRect((res) => {
              TestConsole.consoleOnCallback.call(this, res, 'NodesRef.boundingClientRect', apiIndex)
            })
            .exec()
        },
      },
      {
        id: 'NodesRef.context',
        func: (apiIndex) => {
          TestConsole.consoleTest('NodesRef.context')
          console.log("Taro.createSelectorQuery()->select('#mycanvas').context(callback).exec()")
          Taro.createSelectorQuery()
            .select('#mycanvas')
            .context((res) => {
              TestConsole.consoleOnCallback.call(this, res, 'NodesRef.context', apiIndex)
            })
            .exec()
        },
      },
      {
        id: 'NodesRef.fields',
        inputData: {
          id: true,
          dataset: true,
          rect: true,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('NodesRef.fields')
          console.log("Taro.createSelectorQuery()->select('#button0').fields(data, callback).exec()")
          Taro.createSelectorQuery()
            .select('#button0')
            .fields(data, (res) => {
              TestConsole.consoleOnCallback.call(this, res, 'NodesRef.fields', apiIndex)
            })
            .exec((res) => {
              TestConsole.consoleOnCallback.call(this, res, 'exec', apiIndex)
            })
        },
      },
      {
        id: 'NodesRef.scrollOffset',
        func: (apiIndex) => {
          TestConsole.consoleTest('NodesRef.scrollOffset')

          console.log("Taro.createSelectorQuery()->select('#scrollview').scrollOffset(callback).exec()")
          Taro.createSelectorQuery()
            .select('#scrollview')
            .scrollOffset((res) => {
              TestConsole.consoleOnCallback.call(this, res, 'NodesRef.scrollOffset', apiIndex)
            })
            .exec()

          console.log('Taro.createSelectorQuery()->selectViewport().scrollOffset(callback).exec()')
          Taro.createSelectorQuery()
            .selectViewport()
            .scrollOffset((res) => {
              TestConsole.consoleOnCallback.call(this, res, 'NodesRef.scrollOffset', apiIndex)
            })
            .exec()
        },
      },
      {
        id: 'NodesRef.node',
        func: (apiIndex) => {
          TestConsole.consoleTest('NodesRef.node')
          console.log("Taro.createSelectorQuery()->select('#mycanvas')).node(callback).exec()")
          Taro.createSelectorQuery()
            .select('#mycanvas')
            .node((res) => {
              TestConsole.consoleOnCallback.call(this, res, 'NodesRef.node', apiIndex)
            })
            .exec()
        },
      },
    ],
  }

  render() {
    const { list } = this.state
    return (
      <>
        <View style={{ fontSize: '30px', textAlign: 'center' }}>SelectorQuery测试</View>
        <Button id='button0' className='test-view'>
          id: #button0, class: test-view
        </Button>
        <Button id='button1' className='test-view'>
          id: #button1, class: test-view
        </Button>
        <Canvas id='mycanvas' type='2d' canvasId='canvas2D'>
          <View>id: #mycanvas</View>
        </Canvas>
        <Welcome />
        <ScrollView id='scrollview' className='scroll-view' scrollY>
          <View className='scroll-area'>
            <Text className='notice'>测试NodesRef.scrollOffset</Text>
          </View>
        </ScrollView>
        <View className='api-page'>
          <ButtonList buttonList={list} />
        </View>
      </>
    )
  }
}

class IntersectionObserverTest extends React.Component {
  state = {
    list: [
      {
        id: 'createIntersectionObserver',
        inputData: {
          initialRatio: 0,
          observeAll: true,
          thresholds: [],
        },
        func: (_, data) => {
          TestConsole.consoleTest('Taro.createIntersectionObserver')
          if (this.observer) {
            this.observer.disconnect()
            this.observer = undefined
          }
          this.observer = this.createIntersectionObserver(data)
          console.log('Taro.createIntersectionObserver', this.observer)
        },
      },
      {
        id: 'relativeTo',
        inputData: {
          left: 0,
        },
        func: (_, data) => {
          TestConsole.consoleTest('IntersectionObserver.relativeTo')
          if (this.observer) {
            this.observer.disconnect()
          }
          this.observer = this.createIntersectionObserver()
          this.observer.relativeTo('.scroll-view', data).observe('.ball', (res) => {
            console.log('IntersectionObserver.observe:', res)
            this.setState({
              appear: res.intersectionRatio > 0,
            })
          })
        },
      },
      {
        id: 'relativeToViewport',
        inputData: {
          left: 0,
        },
        func: (_, data) => {
          TestConsole.consoleTest('IntersectionObserver.relativeTo')
          if (this.observer) {
            this.observer.disconnect()
          }
          this.observer = this.createIntersectionObserver()
          this.observer.relativeToViewport(data).observe('.ball', (res) => {
            console.log('IntersectionObserver.observe:', res)
            this.setState({
              appear: res.intersectionRatio > 0,
            })
          })
        },
      },
      {
        id: 'disconnect',
        func: () => {
          TestConsole.consoleTest('IntersectionObserver.disconnect')
          if (this.observer) {
            this.observer.disconnect()
            this.observer = undefined
          }
          console.log('IntersectionObserver已断开')
        },
      },
    ],
    appear: false,
  }
  observer?: Taro.IntersectionObserver

  createIntersectionObserver(options?) {
    if (process.env.TARO_ENV === 'weapp') {
      return Taro.createIntersectionObserver(Taro.getCurrentInstance().page!, options)
    } else {
      return Taro.createIntersectionObserver(this, options)
    }
  }

  render() {
    const { list, appear } = this.state
    return (
      <View>
        <View style={{ fontSize: '30px', textAlign: 'center' }}>IntersectionObserver测试</View>
        <ScrollView className='scroll-view' scrollY>
          <View className='scroll-area' style={{ background: appear ? '#0f0' : '' }}>
            <Text className='notice'>先创建IntersectionObserver再滚动</Text>
            <View className='filling'></View>
            <View className='ball'></View>
          </View>
        </ScrollView>
        <View className='api-page'>
          <ButtonList buttonList={list} />
        </View>
      </View>
    )
  }
}

class MediaObserverTest extends React.Component {
  state = {
    list: [
      {
        id: 'createMediaQueryObserver',
        func: () => {
          TestConsole.consoleTest('Taro.createMediaQueryObserver')
          if (this.observer) {
            this.observer.disconnect()
            this.observer = undefined
          }
          this.observer = this.createMediaQueryObserver()
          console.log(this.observer)
        },
      },
      {
        id: 'observe',
        inputData: {
          orientation: 'portrait',
        },
        func: (_, data) => {
          TestConsole.consoleTest('MediaQueryObserver.observe')
          if (this.observer) {
            this.observer.disconnect()
          }
          this.observer = this.createMediaQueryObserver()
          this.observer.observe(data, (res) => {
            console.log('MediaQueryObserver.observe:', res)
          })
        },
      },
      {
        id: 'disconnect',
        func: () => {
          TestConsole.consoleTest('MediaQueryObserver.disconnect')
          if (this.observer) {
            this.observer.disconnect()
            this.observer = undefined
          }
          console.log('MediaQueryObserver已断开')
        },
      },
    ],
  }
  observer?: Taro.MediaQueryObserver

  createMediaQueryObserver() {
    if (process.env.TARO_ENV === 'weapp') {
      return Taro.getCurrentInstance().page!.createMediaQueryObserver!()
    } else {
      return Taro.createMediaQueryObserver()
    }
  }

  render() {
    const { list } = this.state
    return (
      <View>
        <View style={{ fontSize: '30px', textAlign: 'center' }}>MediaQueryObserver测试</View>
        <View className='api-page'>
          <ButtonList buttonList={list} />
        </View>
      </View>
    )
  }
}

export default class Index extends React.Component {
  render() {
    return (
      <View>
        <SelectorQueryTest />
        <IntersectionObserverTest />
        <MediaObserverTest />
      </View>
    )
  }
}
