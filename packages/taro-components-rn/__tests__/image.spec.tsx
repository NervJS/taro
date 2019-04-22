import * as React from 'react'
// import { View } from 'react-native'
import { shallow } from 'enzyme'
import * as sinon from 'sinon'
import { _Image } from '../src/components/image'
// import renderer from 'react-test-renderer'

describe('<Image />', () => {
  // it('renders correctly', () => {
  //   const mockOnErrorCallback = jest.fn()
  //   const tree = renderer.create(
  //     <_Image
  //       src='https://alo'
  //       onError={() => {
  //         mockOnErrorCallback()
  //       }}
  //     />
  //   ).toJSON()
  //   // expect(mockOnErrorCallback.mock.calls.length).toBe(1)
  //   expect(tree).toMatchSnapshot()
  // })

  it('simulates onError events', () => {
    const onError = sinon.spy()
    const wrapper = shallow(
      <_Image
        src='https://alo'
        onError={onError}
      />
    )
    wrapper.at(0).props().onError()
    expect(onError).toHaveProperty('callCount', 1)
  })

  it('simulates onLoad events', () => {
    const onLoad = sinon.spy((event) => {
      expect(event).toHaveProperty('detail.width')
      expect(event).toHaveProperty('detail.height')
    })
    const wrapper = shallow(
      <_Image
        src='https://placehold.it/1x1'
        onLoad={onLoad}
      />
    )
    wrapper.at(0).props().onLoad()
    expect(onLoad).toHaveProperty('callCount', 1)
  })

  it('simulates onLoad events of local image', () => {
    const onLoad = sinon.spy((event) => {
      expect(event).toHaveProperty('detail.width')
      expect(event).toHaveProperty('detail.height')
    })
    const wrapper = shallow(
      <_Image
        src={require('./1x1.png')}
        onLoad={onLoad}
      />
    )
    wrapper.at(0).props().onLoad()
    expect(onLoad).toHaveProperty('callCount', 1)
  })

  it('test invalid mode', () => {
    const wrapper = shallow(
      <_Image
        src='https://placehold.it/1x1'
        // @ts-ignore
        mode="miao"
      />
    )
    expect(wrapper.get(0)).toHaveProperty('props.resizeMode', 'stretch')
  })

  it('test local image', () => {
    const wrapper = shallow(
      <_Image
        src={require('./1x1.png')}
      />
    )
    expect(wrapper.get(0)).toMatchObject({
      props: {
        // source={[Function anonymous]} ???
        source: expect.anything()
      }
    })
  })
})
