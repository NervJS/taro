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
      srcurl: 'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-480p.flv',
      isShow: true,
      minCache: 1,
      maxCache: 3,
      min: 1,
      max: 3,
    }
  }
  handleInputChangeSrc = (e) => {
    this.setState({
      src: e.target.value,
    })
  }
  handleInputChangeMin = (e) => {
    this.setState({
      min: e.target.value,
    })
  }
  handleInputChangeMax = (e) => {
    this.setState({
      max: e.target.value,
    })
  }
  handleClickSrc = async () => {
    let srcurl = this.state.src
    await this.setState(
      {
        srcurl,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }
  handleClickMin = async () => {
    let minCache = this.state.min
    await this.setState(
      {
        minCache,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }
  handleClickMax = async () => {
    let maxCache = this.state.max
    await this.setState(
      {
        maxCache,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
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
              {this.state.isShow && (
                <LivePlayer
                  style={{ height: '300px', width: '300px', marginTop: '50px' }}
                  src={this.state.srcurl}
                  maxCache={this.state.maxCache}
                  minCache={this.state.minCache}
                  autoplay
                  muted={false}
                  orientation='vertical'
                  type='flv'
                  id='LivePlayer'
                  soundMode='speaker'
                  objectFit='contain'
                />
              )}
            </View>
            <View className='example-body'>
              {this.state.isShow && (
                <LivePlayer
                  style={{ height: '300px', width: '300px', marginTop: '100px' }}
                  src={this.state.srcurl}
                  maxCache={this.state.maxCache}
                  minCache={this.state.minCache}
                  autoplay={false}
                  muted
                  orientation='horizontal'
                  type='flv'
                  id='LivePlayer'
                  soundMode='speaker'
                  objectFit='fillCrop'
                />
              )}
            </View>
            src: <input type='text' name='username' onChange={this.handleInputChangeSrc} />{' '}
            <Button onClick={this.handleClickSrc}>确定</Button>
            最大缓冲区(数字类型): <input type='number' name='username' onChange={this.handleInputChangeMax} />{' '}
            <Button onClick={this.handleClickMax}>确定</Button>
            最小缓冲区(数字类型): <input type='number' name='username' onChange={this.handleInputChangeMin} />{' '}
            <Button onClick={this.handleClickMin}>确定</Button>
          </View>
        </View>
      </View>
    )
  }
}
