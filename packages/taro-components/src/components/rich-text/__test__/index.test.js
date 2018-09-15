import Nerv from 'nervjs'
import { renderIntoDocument } from 'nerv-test-utils'
import RichText from '../index'

describe('RichText', () => {
  const state = {
    nodes: [
      {
        name: 'div',
        attrs: {
          class: 'div_class',
          style: 'color: red;'
        },
        children: []
      },
      {
        name: 'div',
        attrs: {
          class: 'div_class',
          style: 'color: blue;'
        },
        children: [
          {
            name: 'div',
            attrs: {
              class: '',
              style: ''
            },
            children: [
              {
                type: 'text',
                text: 'test'
              }
            ]
          }
        ]
      },
      {
        type: 'text',
        text: 'test'
      }
    ],
    string: '<span>string nodes: love</span>'
  }

  it('array', () => {
    const component = renderIntoDocument(<RichText nodes={state.nodes} />)
    const dom = Nerv.findDOMNode(component)
    const Children = dom.querySelectorAll('.div_class')
    expect(Children.length).toBe(2)
  })

  it('string', () => {
    const component = renderIntoDocument(<RichText nodes={state.string} />)
    const dom = Nerv.findDOMNode(component)
    const Children = dom.querySelectorAll('span')
    expect(Children.length).toBe(1)
  })
})
