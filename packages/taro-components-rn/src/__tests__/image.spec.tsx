import * as React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import ClickableImage from '../components/Image'

describe('<Image />', () => {
  it('should Image have src attribute', () => {
    const src = 'https://alo'
    const { getByTestId } = render(<ClickableImage src={src} />)
    const image = getByTestId('image')
    expect(image).toBeTruthy()
    expect(image).toHaveProp('source', { uri: src })
  })

  it('simulates onError events', () => {
    const onError = jest.fn()
    const { getByTestId } = render(
      <ClickableImage
        src='https://alo'
        onError={onError}
      />
    )
    const image = getByTestId('image')
    fireEvent(image, 'Error')
    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('simulates onLoad events of local image', () => {
    const onLoad = jest.fn()
    const { getByTestId } = render(
      <ClickableImage
        src={require('./1x1.png')}
        onLoad={onLoad}
      />
    )
    const image = getByTestId('image')
    fireEvent(image, 'Load')
    expect(onLoad).toHaveBeenCalled()
  })
})
