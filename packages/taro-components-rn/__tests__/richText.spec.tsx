// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import renderer from 'react-test-renderer'
import RichText from '../src/components/RichText'

describe('RichText', () => {
  it('RichText render', () => {
    const nodes: any = [
      {
        name: 'div',
        type: 'node',
        attrs: {
          class: 'div_class',
          style: `
            line-height: 60px;
            color: white;
            font-size: 60px;
          `
        },
        children: [
          {
            type: 'text',
            text: 'Hello World!'
          }
        ]
      }
    ]
    const tree = renderer.create(<RichText nodes={nodes} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
