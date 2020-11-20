// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import { shallow } from 'enzyme'
import * as sinon from 'sinon'
import ClickableImage, { _Image } from '../src/components/image'

describe('<Image />', () => {
  it('should Image have src attribute', () => {
    const src = 'https://alo'
    const wrapper = shallow(<ClickableImage src={src} />)
    const wrapperImage = wrapper.find(_Image)
    expect(wrapperImage).not.toBeUndefined()
    expect(wrapperImage.props().src).toBe(src)
  })

  it('simulates onError events', () => {
    const onError = sinon.spy()
    const wrapper = shallow(
      <ClickableImage
        src='https://alo'
        onError={onError}
      />
    )
    const wrapperImage = wrapper.find(_Image)
    // eslint-disable-next-line
    // @ts-ignore
    wrapperImage.props().onError()
    expect(onError.callCount).toBe(1)
  })

  it('simulates onLoad events', () => {
    const onLoad = sinon.spy()
    const wrapper = shallow(
      <ClickableImage
        src='https://placehold.it/1x1'
        onLoad={onLoad}
      />
    )
    const wrapperImage = wrapper.find(_Image)
    // eslint-disable-next-line
    // @ts-ignore
    wrapperImage.props().onLoad()
    expect(onLoad.callCount).toBe(1)
  })

  it('simulates onLoad events of local image', () => {
    const onLoad = sinon.spy()
    const wrapper = shallow(
      <ClickableImage
        src={require('./1x1.png')}
        onLoad={onLoad}
      />
    )
    const wrapperImage = wrapper.find(_Image)
    // eslint-disable-next-line
    // @ts-ignore
    wrapperImage.props().onLoad()
    expect(onLoad.callCount).toBe(1)
  })
})
