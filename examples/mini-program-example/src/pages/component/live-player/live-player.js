import './live-player.scss'
import React from 'react'
import { View, LivePlayer, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Header from '../../../components/head/head'
import ComponentState from '../../../components/component_state/component_state'

export default class PageView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      src: '',
      srcurl: 'https://hls-xjhsy.sobeylive.com/xjwlmqapp2019/211_q_live170191539951308.flv',
      isShow: true,
      minCacheOne: 5,
      minCacheTwo: -1,
      minCacheThree: 0.2,
      minCacheFour: -0.2,
      maxCacheOne: 8,
      maxCacheTwo: 3,
      maxCacheThree: 3,
      maxCacheFour: 3,
      maxOne: 3,
      maxTwo: 3,
      maxThree: 3,
      maxFour: 3,
      iscache: false,
    }
  }
  handleInputChangeSrc = (e) => {
    this.setState({
      src: e.target.value,
    })
  }
  handleInputChangeMaxOne = (e) => {
    this.setState({
      maxOne: e.target.value,
    })
  }
  handleInputChangeMaxTwo = (e) => {
    this.setState({
      maxTwo: e.target.value,
    })
  }
  handleInputChangeMaxThree = (e) => {
    this.setState({
      maxThree: e.target.value,
    })
  }
  handleInputChangeMaxFour = (e) => {
    this.setState({
      maxFour: e.target.value,
    })
  }
  handleClickSrc = async () => {
    let srcurl = this.state.src
    await this.setState({
      srcurl,
    })
  }
  handleClickMaxOne = async () => {
    let maxCacheOne = this.state.maxOne
    await this.setState({
      maxCacheOne,
    })
  }
  handleClickMaxTwo = async () => {
    let maxCacheTwo = this.state.maxTwo
    await this.setState({
      maxCacheTwo,
    })
  }
  handleClickMaxThree = async () => {
    let maxCacheThree = this.state.maxThree
    await this.setState({
      maxCacheThree,
    })
  }
  handleClickMaxFour = async () => {
    let maxCacheFour = this.state.maxFour
    await this.setState({
      maxCacheFour,
    })
  }
  hendleFullScreenChange(e) {
    console.log('hendleFullScreenChange', e)
  }
  updates = async () => {
    let iscache = !this.state.iscache
    await this.setState({
      iscache,
    })
  }
  render() {
    return (
      <View className='components-page'>
        <View className='components-page__header'>
          <Header title='lvie-player'></Header>
          <ComponentState platform='H5' rate='10'>
            {' '}
          </ComponentState>
        </View>
        <View className='components-page__body' style={{ marginTop: '50px' }}>
          <View className='components-page__body-example example'>
            <View className='example-body'>
              live min:5,max:8
              {this.state.isShow && (
                <LivePlayer
                  style={{ height: '300px', width: '300px', marginTop: '50px' }}
                  src={this.state.srcurl}
                  maxCache={this.state.maxCacheOne}
                  minCache={this.state.minCacheOne}
                  autoplay
                  muted={false}
                  orientation='vertical'
                  mode='live'
                  id='LivePlayer'
                  soundMode='speaker'
                  iscache={this.state.iscache}
                  objectFit='contain'
                  onLeavePictureInPicture={this.handlePlay}
                />
              )}
            </View>
            最大缓冲区(数字类型): <input type='number' name='username' onChange={this.handleInputChangeMaxOne} />{' '}
            <Button onClick={this.handleClickMaxOne}>确定</Button>
            <View className='example-body'>
              live min:-1,max:3
              {this.state.isShow && (
                <LivePlayer
                  style={{ height: '300px', width: '300px', marginTop: '50px' }}
                  src={this.state.srcurl}
                  maxCache={this.state.maxCacheTwo}
                  minCache={this.state.minCacheTwo}
                  autoplay
                  muted={false}
                  orientation='horizontal'
                  mode='live'
                  id='LivePlayer'
                  soundMode='speaker'
                  iscache={this.state.iscache}
                  objectFit='contain'
                  onLeavePictureInPicture={this.handlePlay}
                />
              )}
            </View>
            最大缓冲区(数字类型): <input type='number' name='username' onChange={this.handleInputChangeMaxTwo} />{' '}
            <Button onClick={this.handleClickMaxTwo}>确定</Button>
            <View className='example-body'>
              RTC min:0.2,max:0.8
              {this.state.isShow && (
                <LivePlayer
                  style={{ height: '300px', width: '300px', marginTop: '50px' }}
                  src={this.state.srcurl}
                  maxCache={this.state.maxCacheThree}
                  minCache={this.state.minCacheThree}
                  autoplay
                  muted={false}
                  orientation='horizontal'
                  mode='RTC'
                  id='LivePlayer'
                  soundMode='speaker'
                  iscache={this.state.iscache}
                  objectFit='contain'
                  onLeavePictureInPicture={this.handlePlay}
                />
              )}
            </View>
            最大缓冲区(数字类型): <input type='number' name='username' onChange={this.handleInputChangeMaxThree} />{' '}
            <Button onClick={this.handleClickMaxThree}>确定</Button>
            <View className='example-body'>
              RTC min:-0.2,max:0.8 onFullScreenChange
              {this.state.isShow && (
                <LivePlayer
                  style={{ height: '300px', width: '300px', marginTop: '100px' }}
                  src={this.state.srcurl}
                  maxCache={this.state.maxCacheFour}
                  minCache={this.state.minCacheFour}
                  autoplay={false}
                  muted
                  orientation='horizontal'
                  id='LivePlayer'
                  soundMode='speaker'
                  objectFit='fillCrop'
                  iscache={this.state.iscache}
                  mode='RTC'
                  onFullScreenChange={this.hendleFullScreenChange}
                />
              )}
            </View>
            最大缓冲区(数字类型): <input type='number' name='username' onChange={this.handleInputChangeMaxFour} />{' '}
            <Button onClick={this.handleClickMaxFour}>确定</Button>
            <Button onClick={this.updates}>显示缓冲秒数</Button>
            src: <input type='text' name='username' onChange={this.handleInputChangeSrc} />{' '}
            <Button onClick={this.handleClickSrc}>确定</Button>
          </View>
        </View>
      </View>
    )
  }
}
