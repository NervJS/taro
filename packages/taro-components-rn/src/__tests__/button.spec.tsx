import * as React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import Button from '../components/Button'

describe('<Button />', () => {
  it('render default', () => {
    const { getByTestId, getAllByText, getByRole } = render(<Button>BUTTON</Button>)
    expect(getAllByText('BUTTON')).toHaveLength(1)
    expect(() => getByTestId('loading')).toThrow(
      'Unable to find an element with testID: loading'
    )
    expect(getByRole('button', { disabled: false })).toBeTruthy()
  })

  it('render loading button', () => {
    const { getByTestId, getByLabelText } = render(<Button loading />)
    expect(getByTestId('loading')).toHaveStyle({
      marginRight: 0
    })
    expect(getByLabelText('loading image')).toHaveProp('source', 1)
  })

  it('render loading & warn button with text', () => {
    const { getByTestId, getByLabelText } = render(<Button type='warn' loading >BUTTON</Button>)
    expect(getByTestId('loading')).toHaveStyle({
      marginRight: 5
    })
    expect(getByLabelText('loading image')).toHaveProp('source', 1)
  })

  it('disabled button', () => {
    const { getAllByA11yState } = render(<Button disabled />)
    expect(getAllByA11yState({ disabled: true })).toHaveLength(1)
  })

  it('mini size', () => {
    const { getByText, getByRole } = render(<Button size="mini">BUTTON</Button>)
    const text = getByText('BUTTON')
    const view = getByRole('button', { disabled: false })
    expect(view).toContainElement(text)
    expect(view).toHaveStyle({
      height: 30
    })
  })

  it('plain button', () => {
    const { getByA11yState } = render(<Button plain />)
    const view = getByA11yState({ disabled: false })
    expect(view).toHaveStyle({
      backgroundColor: 'transparent'
    })
  })

  it('plain and disabled button', () => {
    const { getByText } = render(<Button disabled plain>BUTTON</Button>)
    const text = getByText('BUTTON')
    expect(text).toHaveStyle({
      color: 'rgba(53,53,53,0.6)'
    })
  })

  it('type primary and disabled', () => {
    const { getByText } = render(<Button type="primary" disabled>BUTTON</Button>)
    const text = getByText('BUTTON')
    expect(text).toHaveStyle({
      color: 'rgba(255,255,255,0.6)'
    })
  })

  it('onClick', () => {
    const onClick = jest.fn()
    const { getByText } = render(<Button onClick={onClick}>BUTTON</Button>)
    fireEvent.press(getByText('BUTTON'))
    expect(onClick).toHaveBeenCalled()
  })
})
