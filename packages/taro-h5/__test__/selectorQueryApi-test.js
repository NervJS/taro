/* eslint-disable */
import * as Taro from '../src/api'

describe('selectorQuery', () => {
  beforeAll(() => {
    Element.prototype.getBoundingClientRect = jest.fn(() => {
      return {
        left: 50,
        right: 150,
        top: 100,
        bottom: 200,
        width: 100,
        height: 100
      }
    })
  })

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('should get single element\'s boundingClientRect', done => {
    document.body.innerHTML = '<div id="box__a" data-url="xxx">box1</div>'
    const query = Taro.createSelectorQuery()
    query.select('#box__a').boundingClientRect(rect => {
      expect(rect).toEqual({
        id: 'box__a',
        dataset: {
          url: 'xxx'
        },
        left: 50,
        right: 150,
        top: 100,
        bottom: 200,
        width: 100,
        height: 100
      })
      done()
    }).exec()
  })

  test('should get multi elements\'s boundingClientRect', done => {
    document.body.innerHTML = `
      <div id="box__a" class="box" data-url="xyz">box1</div>
      <div id="box__b" class="box" data-url="xxx" data-key="uzi">box1</div>
    `
    const query = Taro.createSelectorQuery()
    query.selectAll('.box').boundingClientRect(rect => {
      expect(rect).toEqual([{
        id: 'box__a',
        dataset: {
          url: 'xyz'
        },
        left: 50,
        right: 150,
        top: 100,
        bottom: 200,
        width: 100,
        height: 100
      }, {
        id: 'box__b',
        dataset: {
          url: 'xxx',
          key: 'uzi'
        },
        left: 50,
        right: 150,
        top: 100,
        bottom: 200,
        width: 100,
        height: 100
      }])
      done()
    }).exec()
  })

  test('should get viewport\'s boundingClientRect', done => {
    const viewport = document.querySelector('html')
    const clientWidth = 375
    const clientHeight = 690
    Object.defineProperties(viewport, {
      clientWidth: { value: clientWidth },
      clientHeight: { value: clientHeight }
    })

    const query = Taro.createSelectorQuery()
    query.selectViewport().boundingClientRect(rect => {
      expect(rect).toEqual({
        id: '',
        dataset: {},
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: clientWidth,
        height: clientHeight
      })
      done()
    }).exec()
  })

  test('should get scrollOffset', done => {
    document.body.innerHTML = '<div class="box" >box1</div>'
    const box = document.querySelector('.box')
    const scrollLeft = 188
    const scrollTop = 233
    box.scrollLeft = scrollLeft
    box.scrollTop = scrollTop
    const query = Taro.createSelectorQuery()
    query.select('.box').scrollOffset(res => {
      expect(res).toEqual({
        id: '',
        dataset: {},
        scrollLeft,
        scrollTop
      })
      done()
    }).exec()
  })

  test('should get dom detail from field', done => {
    document.body.innerHTML = '<div id="box__a" data-url="xxx" scroll-x="50" upper-threshold="77">box1</div>'
    const query = Taro.createSelectorQuery()
    query.select('#box__a').fields({
      rect: true,
      size: true,
      scrollOffset: true,
      properties: ['scroll-x', 'threshold'],
      computedStyle: ['display']
    },rect => {
      expect(rect).toEqual({
        left: 50,
        right: 150,
        top: 100,
        bottom: 200,
        width: 100,
        height: 100,
        scrollLeft: 0,
        scrollTop: 0,
        'scroll-x': '50',
        display: 'block'
      })
      done()
    }).exec()
  })

  test('should exec all', done => {
    document.body.innerHTML = `
      <div id="box__a" class="box" data-url="xyz">box1</div>
      <div id="box__b" class="box" data-url="xxx" data-key="uzi">box1</div>
    `
    const query = Taro.createSelectorQuery()
    query.select('#box__a').boundingClientRect()
    query.select('#box__b').boundingClientRect()
    query.exec(res => {
      expect(res).toEqual([{
        id: 'box__a',
        dataset: {
          url: 'xyz'
        },
        left: 50,
        right: 150,
        top: 100,
        bottom: 200,
        width: 100,
        height: 100
      }, {
        id: 'box__b',
        dataset: {
          url: 'xxx',
          key: 'uzi'
        },
        left: 50,
        right: 150,
        top: 100,
        bottom: 200,
        width: 100,
        height: 100
      }])
      done()
    })
  })
})
