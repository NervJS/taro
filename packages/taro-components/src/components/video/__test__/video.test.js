import Nerv from 'nervjs'
import { renderIntoDocument } from 'nerv-test-utils'
import Video from '../index'

describe('Video', () => {
  const videoOpts = {
    src: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
    controls: true,
    autoplay: false,
    poster: 'http://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg',
    initialTime: 30,
    id: 'video',
    loop: false,
    muted: false
  }

  it('render Video', () => {
    const component = renderIntoDocument(
      <Video {...videoOpts} />)
    expect(component.props.autoplay).toBeFalsy()
    expect(component.props.controls).toBeTruthy()
    expect(component.props.loop).toBeFalsy()
    expect(component.props.muted).toBeFalsy()
  })
})
