import { h } from '@stencil/core'
import { AnyHTMLElement } from '@stencil/core/internal'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Video } from '../src/components/video/video'

describe('Video', () => {
  const videoUrl = 'http://storage.jd.com/cjj-pub-images/bear.mp4'
  let page: SpecPage

  it('props', async () => {
    // TODO
    page = await newSpecPage({
      components: [Video],
      template: () => (<taro-video-core
        src={videoUrl}
      />),
    })
    const video = page.root?.querySelector<AnyHTMLElement>('video.taro-video-video')
    // const centerPlayBtnCls = '.taro-video-cover-play-button'
    // const controlsCls = '.taro-video-controls'

    // expect(video).toBeInstanceOf(HTMLDivElement)
    expect(video?.style['object-fit']).toEqual('contain')
    // expect(video?.getAttribute('autoplay')).toEqual(false)
    // expect(video?.getAttribute('loop')).toEqual(false)
    // expect(video?.muted === false) // .toEqual(false)
    // expect(video?.poster === '') // .toEqual('')
    // console.log('video?.poster', video?.poster, '-', typeof video?.poster)
    // expect(page.root?.querySelector(controlsCls) === null)
    // // expect(page.root?.querySelector(centerPlayBtnCls)).toBeInstanceOf(HTMLDivElement)

    // const objectFit = 'fill'
    // const poster = 'http://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg'

    // page.root?.setAttribute('object-fit', objectFit)
    // page.root?.setAttribute('autoplay', 'true')
    // page.root?.setAttribute('loop', 'true')
    // page.root?.setAttribute('muted', 'true')
    // page.root?.setAttribute('control', 'true')
    // page.root?.setAttribute('poster', poster)
    // page.root?.setAttribute('showCenterPlayBtn', 'false')
    // await page.waitForChanges()

    // console.log('video?.autoplay', video?.autoplay)
    // expect(video?.style['object-fit']).toEqual(objectFit)
    // expect(video?.autoplay).toEqual(true)
    // expect(video?.loop).toEqual(true)
    // expect(video?.muted).toEqual(true)
    // expect(video?.poster).toEqual('true')
    // expect(page.root?.querySelector(centerPlayBtnCls)).toBeNull()

    // page.root?.setAttribute('controls', 'true')

    // // expect(page.root?.querySelector(controlsCls)).toBeInstanceOf(HTMLDivElement)
    // expect(video?.poster).toBe(poster)

    expect(page.root).toMatchSnapshot()
  })

  it('should set initial time', async () => {
    const initialTime = 10
    page = await newSpecPage({
      components: [Video],
      template: () => (<taro-video-core
        src={videoUrl}
        initialTime={initialTime}
      />),
    })
    const video = page.root?.querySelector<AnyHTMLElement>('video.taro-video-video')

    expect(video?.currentTime).toEqual(initialTime)

    expect(page.root).toMatchSnapshot()
  })

  it('should toggle full screen', async () => {
    // TODO
    const onFullScreenChange = jest.fn()
    page = await newSpecPage({
      components: [Video],
      template: () => (<taro-video-core
        src={videoUrl}
        onFullScreenChange={onFullScreenChange}
      />),
    })
    // const wrapper = await mount(app, scratch)
    // const { node } = wrapper
    // const video = wrapper.find('video.taro-video-video')
    // const fullscreenBtn = wrapper.find('.taro-video-fullscreen')
    // video.requestFullscreen = sinon.fake()

    // expect(fullscreenBtn.classList.contains('taro-nodevideo-type-fullscreen') === false)
    // fullscreenBtn.click()
    // await waitForChange(node)

    // expect(fullscreenBtn.classList.contains('taro-video-type-fullscreen') === true)
    // expect(onFullScreenChange.calledOnceWith({
    //   fullScreen: true,
    //   direction: 'vertical'
    // }))
    // expect(video.requestFullscreen.calledOnceWith({
    //   navigationUI: 'auto'
    // }))

    // fullscreenBtn.click()
    // await waitForChange(node)

    // expect(fullscreenBtn.classList.contains('taro-video-type-fullscreen') === false)
    // expect(onFullScreenChange.callCount === 2)
    // expect(onFullScreenChange.calledWith({
    //   fullScreen: false,
    //   direction: 'vertical'
    // }))
    // expect(video.requestFullscreen.callCount === 1)

    expect(page.root).toMatchSnapshot()
  })

  it('should play', async () => {
    page = await newSpecPage({
      components: [Video],
      template: () => (<taro-video-core
        src={videoUrl}
      />),
    })
    const video = page.root?.querySelector<AnyHTMLElement>('video.taro-video-video')
    if (video) {
      const play = jest.fn()
      video.play = play
      await video?.play()
      await page.waitForChanges()
  
      expect(play.mock.calls.length).toBe(1)

      expect(page.root).toMatchSnapshot()
    }
  })

  it('should pause', async () => {
    page = await newSpecPage({
      components: [Video],
      template: () => (<taro-video-core
        src={videoUrl}
      />),
    })
    const video = page.root?.querySelector<AnyHTMLElement>('video.taro-video-video')
    if (video) {
      const pause = jest.fn()
      video.pause = pause
      await video?.pause()
      await page.waitForChanges()
  
      expect(pause.mock.calls.length).toBe(1)

      expect(page.root).toMatchSnapshot()
    }
  })

  it('should seek and stop', async () => {
    // TODO
    page = await newSpecPage({
      components: [Video],
      template: () => (<taro-video-core
        src={videoUrl}
      />),
    })
    // const wrapper = await mount(app, scratch)
    // const video = wrapper.find('video.taro-video-video')
    // ref.current.seek(233)
    // const { node } = wrapper
    // await waitForChange(node)

    // expect(video.currentTime === 233)
    // video.pause = sinon.fake()
    // ref.current.stop()
    // await waitForChange(node)

    // expect(video.currentTime === 0)
    // expect(video.pause.callCount === 1)

    expect(page.root).toMatchSnapshot()
  })

  it('should be controlled by bar', async () => {
    // TODO
    page = await newSpecPage({
      components: [Video],
      template: () => (<taro-video-core
        src={videoUrl}
      />),
    })
    // const wrapper = await mount(app, scratch)
    // const controlBar = wrapper.find('.taro-video-controls')
    // let currentTime = wrapper.find('.taro-video-current-time')
    // let progress = wrapper.find('.taro-video-progress-container')
    // let duration = wrapper.find('.taro-video-duration')
    // let playBtn = wrapper.find('.taro-video-control-button-play')
    // let muteBtn = wrapper.find('.taro-video-mute')
    // let danmuBtn = wrapper.find('.taro-video-danmu-button')
    // let fullscreenBtn = wrapper.find('.taro-video-fullscreen')

    // expect(currentTime instanceof HTMLDivElement)
    // expect(progress instanceof HTMLDivElement)
    // expect(duration instanceof HTMLDivElement)
    // expect(fullscreenBtn instanceof HTMLDivElement)
    // expect(playBtn instanceof HTMLDivElement)
    // expect(muteBtn === null)
    // expect(danmuBtn === null)

    // const video = wrapper.find('video.taro-video-video')
    // video.play = sinon.fake()
    // const { node } = wrapper
    // playBtn.click()
    // await waitForChange(node)
    // expect(video.play.callCount === 1)

    // await wrapper.setProps({
    //   showProgress: false,
    //   showFullscreenBtn: false,
    //   showPlayBtn: false,
    //   showMuteBtn: true,
    //   danmuBtn: true
    // })
    // await waitForChange(controlBar)

    // currentTime = wrapper.find('.taro-video-current-time')
    // progress = wrapper.find('.taro-video-progress-container')
    // duration = wrapper.find('.taro-video-duration')
    // playBtn = wrapper.find('.taro-video-control-button-play')
    // muteBtn = wrapper.find('.taro-video-mute')
    // danmuBtn = wrapper.find('.taro-video-danmu-button')
    // fullscreenBtn = wrapper.find('.taro-video-fullscreen')

    // expect(currentTime === null)
    // expect(progress === null)
    // expect(duration === null)
    // expect(fullscreenBtn === null)
    // expect(playBtn === null)
    // expect(muteBtn instanceof HTMLDivElement)
    // expect(danmuBtn instanceof HTMLDivElement)

    expect(page.root).toMatchSnapshot()
  })

  it('danmu', async () => {
    // TODO
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
    page = await newSpecPage({
      components: [Video],
      template: () => (<taro-video-core
        src={videoUrl}
        enableDanmu={true}
        danmuList={danmuList}
      />),
    })
    // const wrapper = await mount(app, scratch)
    // const danmu = wrapper.find('taro-video-danmu')

    // danmu.tick(2)
    // await waitForChange(danmu)

    // expect(danmu.children.length === 1)
    // expect(danmu.children[0].textContent === danmuList[0].text)
    // expect(danmu.children[0].style.color === danmuList[0].color)

    // danmu.tick(4)
    // await waitForChange(danmu)

    // expect(danmu.children.length === 2)
    // expect(danmu.children[1].textContent === danmuList[1].text)
    // expect(danmu.children[1].style.color === danmuList[1].color)

    expect(page.root).toMatchSnapshot()
  })
})
