/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

// import { Scaner } from '../src/html/scaner'
// import { parser } from '../src/html/oparser'
import '../dom-external/inner-html/html'

import { parser } from '../dom-external/inner-html/parser'
import { Scaner } from '../dom-external/inner-html/scaner'
import { options } from '../options'
import { isElement } from '../utils'

const runtime = require('../../dist/runtime.esm')

const document = runtime.document

// 测试还没写完，先跳过
describe.skip('html', () => {
  test('tt', () => {
    const s = '<h1 style="color:red" class="fork">This is a Heading</h1>'
    // const tokens = new Scaner(s).scan()
    // debugger
    // const html = parser(tokens)

    parser(s)
  })
})

describe('html with <style>', () => {
  it('tag selector', () => {
    const html = `
      <style>
        span {
          color: red;
          font-size: 10;
        }
      </style>
      <div class="parent">
        <span></span>
        <span></span>
      </div>
    `
    const res = parser(html, document)
    const el0 = res[0].children[0]
    const el1 = res[0].children[0]
    expect(el0.style.cssText).toBe('color: red; font-size: 10;')
    expect(el1.style.cssText).toBe('color: red; font-size: 10;')
  })

  it('id selector', () => {
    const html = `
      <style>
        #foo {
          color: red;
          font-size: 10;
          transition: color ease-in 300ms;
          border: 1px solid red;
        }
      </style>
      <div class="parent">
        <div></div>
        <div id="foo"></div>
      </div>
    `
    const res = parser(html, document)
    const el = res[0].children[1]
    expect(el.style.cssText).toBe('color: red; font-size: 10; transition: color ease-in 300ms; border: 1px solid red;')
  })

  it('class selector', () => {
    const html = `
      <style>
        .parent {
          background: red
        }
        .item {
          font-weight: bold;
        }
        .child-1 {
          color: red;
          font-size: 10;
        }
        .item.child-2 {
          margin: 10px;
        }
      </style>
      <div class="parent" style="border: 1px;padding: 10px;">
        <div class="item child-1"></div>
        <div class="item child-2"></div>
      </div>
    `
    const res = parser(html, document)
    const el0 = res[0]
    const el1 = res[0].children[0]
    const el2 = res[0].children[1]
    expect(el0.style.cssText).toBe('background: red; border: 1px; padding: 10px;')
    expect(el1.style.cssText).toBe('font-weight: bold; color: red; font-size: 10;')
    expect(el2.style.cssText).toBe('font-weight: bold; margin: 10px;')
  })

  it('attributes selector', () => {
    const html = `
      <style>
        [name="title"]   {
          color: red;
        }
        [name="body"][content='hello-world'] {
          font-size: 10;
        }
      </style>
      <div>
        <div name="title"></div>
        <div name="body" content="hello-world"></div>
      </div>
    `
    const res = parser(html, document)
    const el0 = res[0].children[0]
    const el1 = res[0].children[1]
    expect(el0.style.cssText).toBe('color: red;')
    expect(el1.style.cssText).toBe('font-size: 10;')
  })

  it('attributes selector with space', () => {
    const html = `
      <style>
        [    name = "title"]   {
          color: red;
        }
        [name = "body"][content = 'hello-world'] {
          font-size: 10;
        }
      </style>
      <div>
        <div name="title"></div>
        <div name="body" content="hello-world"></div>
      </div>
    `
    const res = parser(html, document)
    const el0 = res[0].children[0]
    const el1 = res[0].children[1]
    expect(el0.style.cssText).toBe('color: red;')
    expect(el1.style.cssText).toBe('font-size: 10;')
  })

  it('combination', () => {
    const html = `
      <style>
        div[name="top"].wrapper#foo.title.fixed[size="large"] {
          background: red
        }
      </style>
      <div id="foo" class="wrapper title fixed" name="top" size="large"></div>
    `
    const res = parser(html, document)
    const el0 = res[0]
    expect(el0.style.cssText).toBe('background: red;')
  })

  it('selector list', () => {
    const html = `
      <style>
        .item.child-1, #foo {
          color: red;
        }
      </style>
      <div class="parent">
        <div class="item child-1"></div>
        <div class="item child-2"></div>
        <div id="foo"></div>
      </div>
    `
    const res = parser(html, document)
    const el0 = res[0].children[0]
    const el1 = res[0].children[2]
    expect(el0.style.cssText).toBe('color: red;')
    expect(el1.style.cssText).toBe('color: red;')
  })

  it('descendant combinator', () => {
    const html = `
      <style>
        div.parent span.item {
          background: red
        }
        .parent .inner[name='title'] {
          color: blue;
        }
        .ul .li {
          width: 100%;
        }
      </style>
      <div class="parent" id="body">
        <span class="item child-1"></span>
        <div class="item child-2">
          <div name='title' class='inner'></div>
        </div>
        <div class='ul'>
          <div class="li"></div>
          <div class="li"></div>
        </div>
      </div>
      <div>
        <div name='title' class='inner'></div>
        <div class="li"></div>
      </div>
    `
    const res = parser(html, document).filter(isElement)
    const el0 = res[0].children[0]
    const el1 = res[0].children[1]
    const el2 = res[0].children[1].children[0]
    const el3 = res[1].children[0]
    const el4 = res[0].children[2].children[0]
    const el5 = res[0].children[2].children[1]
    const el6 = res[1].children[1]
    expect(el0.style.cssText).toBe('background: red;')
    expect(el1.style.cssText).toBe('')
    expect(el2.style.cssText).toBe('color: blue;')
    expect(el3.style.cssText).toBe('')
    expect(el4.style.cssText).toBe('width: 100%;')
    expect(el5.style.cssText).toBe('width: 100%;')
    expect(el6.style.cssText).toBe('')
  })

  it('child combinator', () => {
    const html = `
      <style>
        .ul>.li {
          width: 100%;
        }
        .inner .ul  >   .li {
          color: red;
        }
      </style>
      <div class='ul'>
        <div class="li"></div>
        <div class='inner'>
          <div class="li">
            <div class='ul'>
              <div class="li"></div>
            </div>
          </div>
        </div>
        <div>
          <div class="ul li">
            <div class='li'></div>
          </div>
        </div>
      </div>
    `
    const res = parser(html, document).filter(isElement)
    const el1 = res[0].children[0]
    const el2 = res[0].children[1].children[0]
    const el3 = res[0].children[1].children[0].children[0].children[0]
    const el4 = res[0].children[2].children[0].children[0]
    expect(el1.style.cssText).toBe('width: 100%;')
    expect(el2.style.cssText).toBe('')
    expect(el3.style.cssText).toBe('width: 100%; color: red;')
    expect(el4.style.cssText).toBe('width: 100%;')
  })

  it('adjacent sibling combinator', () => {
    const html = `
      <style>
        .first+.li.second #inner {
          width: 100%;
        }
        .first + .third {
          color: red;
        }
        .second + .third {
          color: blue;
        }
      </style>
      <div class='ul'>
        <div class="li first"></div>
        <div class='li second'>
          <div id='inner'></div>
        </div>
        <div class='li third'></div>
      </div>
    `
    const res = parser(html, document).filter(isElement)
    const el1 = res[0].children[0]
    const el2 = res[0].children[1]
    const el3 = res[0].children[1].children[0]
    const el4 = res[0].children[2]
    expect(el1.style.cssText).toBe('')
    expect(el2.style.cssText).toBe('')
    expect(el3.style.cssText).toBe('width: 100%;')
    expect(el4.style.cssText).toBe('color: blue;')
  })

  it('general sibling combinator', () => {
    const html = `
      <style>
        .third ~ .second {
          font-size: 10px;
        }
        .first ~ .third {
          color: red;
        }
        .first~.li.third #inner {
          width: 100%;
        }
      </style>
      <div class='ul'>
        <div class="li first"></div>
        <div class='li second'></div>
        <div class='li third'>
          <div id='inner'></div>
        </div>
      </div>
    `
    const res = parser(html, document).filter(isElement)
    const el1 = res[0].children[0]
    const el2 = res[0].children[1]
    const el3 = res[0].children[2]
    const el4 = res[0].children[2].children[0]
    expect(el1.style.cssText).toBe('')
    expect(el2.style.cssText).toBe('')
    expect(el3.style.cssText).toBe('color: red;')
    expect(el4.style.cssText).toBe('width: 100%;')
  })
  it('enter', () => {
    const html = `
      <style>
        span {
          color: red;
          font-size: 10;
        }
      </style>
      <div class="parent">
        <span>测试换行\nxxxx</span>
        <span>测试换行xxxx</span>
      </div>
    `
    const res = parser(html, document)
    const el0 = res[0].children[0]
    const el1 = res[0].children[1]
    expect(el0.style.cssText).toBe('color: red; font-size: 10;')
    expect(el0.childNodes[0]._value).toBe('测试换行\nxxxx')
    expect(el1.style.cssText).toBe('color: red; font-size: 10;')
    expect(el1.childNodes[0]._value).toBe('测试换行xxxx')
  })
})

describe('html with tag should be skipped', () => {
  it('scanSkipTag should skip script', () => {
    const s = '<script type="text/javascript"> </script><div></div>'
    const tokens = new Scaner(s).scan()
    expect(tokens[1].content).toBe('script')
  })
  it('html should be rendered successfully', () => {
    const s = '<script type="text/javascript"> </script><div>hello world</div>'
    const res = parser(s, document)
    expect(res[0].props.class).toBe('h5-script')
    expect(res[1].childNodes[0]._value).toBe('hello world')
  })
})

describe('sort style', () => {
  it('cssText should be sort', () => {
    const html = `
      <style>
        #id {
          color: blue;
        }
        .class {
          font-size: 12px;
        }
        div {
          color: red;
          font-size: 14px;
        }
      </style>
      <div id="id" class="class"></div>
    `
    const res = parser(html, document)
    const node = res[0]

    expect(node.style.cssText).toBe('color: blue; font-size: 12px;')
  })

  describe('html with transformText', () => {
    it('transformText function works', () => {
      options.html.transformText = taroText => {
        taroText._value = 'c'
        return taroText
      }
      const html = '<span>a</span>'
      const res = parser(html, document)
      const node = res[0]
      expect(node.childNodes[0]._value).toBe('c')
    })
  })
})
