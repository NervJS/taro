import * as assert from 'assert'
import React from 'react'
// import simulant from 'simulant'
import * as sinon from 'sinon'

import { Video } from '../h5/react'
import { mount } from './test-tools'
import { waitForChange } from './utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Video', () => {
  /**
   * @type {HTMLElement}
   */
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  afterEach(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('props', async () => {
    const app = (
      <Video
        src='http://storage.jd.com/cjj-pub-images/bear.mp4'
        controls={false}
        onError={ev => {
          // puppeteer 1.20.0 依赖的 Chromium 貌似由于同源策略播放不了视频
          // 停止冒泡，防止 Jasmine 监听到 onError 事件导致用例直接失败
          ev.stopPropagation()
        }}
      />
    )
    const wrapper = await mount(app, scratch)
    const video = wrapper.find('video')
    const centerPlayBtnCls = '.taro-video-cover-play-button'
    const controlsCls = '.taro-video-controls'

    assert(video instanceof HTMLVideoElement)
    assert(video.style['object-fit'] === 'contain')
    assert(video.autoplay === false)
    assert(video.loop === false)
    assert(video.muted === false)
    assert(video.poster === '')
    assert(wrapper.find(controlsCls) === null)
    assert(wrapper.find(centerPlayBtnCls) instanceof HTMLDivElement)

    const objectFit = 'fill'
    const poster = 'http://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg'

    await wrapper.setProps({
      objectFit,
      autoplay: true,
      loop: true,
      muted: true,
      control: true,
      poster,
      showCenterPlayBtn: false
    })

    assert(video.style['object-fit'] === objectFit)
    assert(video.autoplay === true)
    assert(video.loop === true)
    assert(video.muted === true)
    assert(video.poster === '')
    assert(wrapper.find(centerPlayBtnCls) === null)

    await wrapper.setProps({
      controls: true
    })

    assert(wrapper.find(controlsCls) instanceof HTMLDivElement)
    assert(video.poster === poster)
  })

  it('should set initial time', async () => {
    const initialTime = 10
    const app = (
      <Video
        src='http://storage.jd.com/cjj-pub-images/bear.mp4'
        initialTime={initialTime}
        onError={ev => ev.stopPropagation()}
      />
    )
    const wrapper = await mount(app, scratch)
    const video = wrapper.find('video')

    assert(video.currentTime === initialTime)
  })

  it('should toggle full screen', async () => {
    const onFullScreenChange = sinon.spy()
    const app = (
      <Video
        src='http://storage.jd.com/cjj-pub-images/bear.mp4'
        onFullScreenChange={e => onFullScreenChange(e.detail)}
        onError={ev => ev.stopPropagation()}
      />
    )
    const wrapper = await mount(app, scratch)
    const { node } = wrapper
    const video = wrapper.find('video.taro-video-video')
    const fullscreenBtn = wrapper.find('.taro-video-fullscreen')
    video.requestFullscreen = sinon.fake()

    assert(fullscreenBtn.classList.contains('taro-nodevideo-type-fullscreen') === false)
    fullscreenBtn.click()
    await waitForChange(node)

    assert(fullscreenBtn.classList.contains('taro-video-type-fullscreen') === true)
    assert(onFullScreenChange.calledOnceWith({
      fullScreen: true,
      direction: 'vertical'
    }))
    assert(video.requestFullscreen.calledOnceWith({
      navigationUI: 'auto'
    }))

    fullscreenBtn.click()
    await waitForChange(node)

    assert(fullscreenBtn.classList.contains('taro-video-type-fullscreen') === false)
    assert(onFullScreenChange.callCount === 2)
    assert(onFullScreenChange.calledWith({
      fullScreen: false,
      direction: 'vertical'
    }))
    assert(video.requestFullscreen.callCount === 1)
  })

  it('should play', async () => {
    const ref = React.createRef()
    const app = (
      <Video
        ref={ref}
        src='http://storage.jd.com/cjj-pub-images/bear.mp4'
        onError={ev => ev.stopPropagation()}
      />
    )
    const wrapper = await mount(app, scratch)
    const video = wrapper.find('video.taro-video-video')
    video.play = sinon.fake()
    ref.current.play()
    const { node } = wrapper
    await waitForChange(node)

    assert(video.play.callCount === 1)
  })

  it('should pause', async () => {
    const ref = React.createRef()
    const app = (
      <Video
        ref={ref}
        src='http://storage.jd.com/cjj-pub-images/bear.mp4'
        onError={ev => ev.stopPropagation()}
      />
    )
    const wrapper = await mount(app, scratch)
    const video = wrapper.find('video.taro-video-video')
    video.pause = sinon.fake()
    ref.current.pause()
    const { node } = wrapper
    await waitForChange(node)

    assert(video.pause.callCount === 1)
  })

  it('should seek and stop', async () => {
    const ref = React.createRef()
    const app = (
      <Video
        ref={ref}
        src='http://storage.jd.com/cjj-pub-images/bear.mp4'
        onError={ev => ev.stopPropagation()}
      />
    )
    const wrapper = await mount(app, scratch)
    const video = wrapper.find('video.taro-video-video')
    ref.current.seek(233)
    const { node } = wrapper
    await waitForChange(node)

    assert(video.currentTime === 233)
    video.pause = sinon.fake()
    ref.current.stop()
    await waitForChange(node)

    assert(video.currentTime === 0)
    assert(video.pause.callCount === 1)
  })

  it('should be controlled by bar', async () => {
    const app = (
      <Video
        src='http://storage.jd.com/cjj-pub-images/bear.mp4'
        onError={ev => ev.stopPropagation()}
      />
    )
    const wrapper = await mount(app, scratch)
    const controlBar = wrapper.find('.taro-video-controls')
    let currentTime = wrapper.find('.taro-video-current-time')
    let progress = wrapper.find('.taro-video-progress-container')
    let duration = wrapper.find('.taro-video-duration')
    let playBtn = wrapper.find('.taro-video-control-button-play')
    let muteBtn = wrapper.find('.taro-video-mute')
    let danmuBtn = wrapper.find('.taro-video-danmu-button')
    let fullscreenBtn = wrapper.find('.taro-video-fullscreen')

    assert(currentTime instanceof HTMLDivElement)
    assert(progress instanceof HTMLDivElement)
    assert(duration instanceof HTMLDivElement)
    assert(fullscreenBtn instanceof HTMLDivElement)
    assert(playBtn instanceof HTMLDivElement)
    assert(muteBtn === null)
    assert(danmuBtn === null)

    const video = wrapper.find('video.taro-video-video')
    video.play = sinon.fake()
    const { node } = wrapper
    playBtn.click()
    await waitForChange(node)
    assert(video.play.callCount === 1)

    await wrapper.setProps({
      showProgress: false,
      showFullscreenBtn: false,
      showPlayBtn: false,
      showMuteBtn: true,
      danmuBtn: true
    })
    await waitForChange(controlBar)

    currentTime = wrapper.find('.taro-video-current-time')
    progress = wrapper.find('.taro-video-progress-container')
    duration = wrapper.find('.taro-video-duration')
    playBtn = wrapper.find('.taro-video-control-button-play')
    muteBtn = wrapper.find('.taro-video-mute')
    danmuBtn = wrapper.find('.taro-video-danmu-button')
    fullscreenBtn = wrapper.find('.taro-video-fullscreen')

    assert(currentTime === null)
    assert(progress === null)
    assert(duration === null)
    assert(fullscreenBtn === null)
    assert(playBtn === null)
    assert(muteBtn instanceof HTMLDivElement)
    assert(danmuBtn instanceof HTMLDivElement)
  })

  it('danmu', async () => {
    const danmuList = [
      {
        text: '第 1s 出现的弹幕',
        color: 'rgb(255, 0, 0)',
        time: 1
      },
      {
        text: '第 3s 出现的弹幕',
        color: 'rgb(255, 0, 255)',
        time: 3
      }
    ]
    const app = (
      <Video
        src='http://storage.jd.com/cjj-pub-images/bear.mp4'
        enableDanmu={true}
        danmuList={danmuList}
        onError={ev => ev.stopPropagation()}
      />
    )
    const wrapper = await mount(app, scratch)
    const danmu = wrapper.find('taro-video-danmu')

    danmu.tick(2)
    await waitForChange(danmu)

    assert(danmu.children.length === 1)
    assert(danmu.children[0].textContent === danmuList[0].text)
    assert(danmu.children[0].style.color === danmuList[0].color)

    danmu.tick(4)
    await waitForChange(danmu)

    assert(danmu.children.length === 2)
    assert(danmu.children[1].textContent === danmuList[1].text)
    assert(danmu.children[1].style.color === danmuList[1].color)
  })
})
