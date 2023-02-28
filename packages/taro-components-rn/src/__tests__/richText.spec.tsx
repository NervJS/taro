import * as React from 'react'
import { render } from '@testing-library/react-native'
import RichText from '../components/RichText'

describe('RichText', () => {
  it('RichText render', () => {
    const nodes: any = [
      {
        name: 'div',
        type: 'node',
        attrs: {
          class: 'div_class',
          style: 'line-height:60px;color:white;font-size:60px;'
        },
        children: [
          {
            type: 'text',
            text: 'Hello World!'
          }
        ]
      }
    ]
    const tree = render(<RichText nodes={nodes} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
