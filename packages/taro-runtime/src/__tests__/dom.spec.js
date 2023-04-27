describe('DOM', () => {
  process.env.FRAMEWORK = 'nerv'
  const runtime = require('../../dist/runtime.esm')
  const document = runtime.document
  global.document = runtime.document
  global.window = runtime.window
  global.navigator = runtime.navigator
  // eslint-disable-next-line no-use-before-define
  const React = require('react')
  const ReactDOM = require('@tarojs/react')

  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  describe('node', () => {
    it('childeNodes 有任何类型', () => {
      const container = document.createElement('container')
      const div = document.createElement('div')
      const text = document.createTextNode('text')
      container.appendChild(div)
      container.appendChild(text)
      expect(container.childNodes.length).toBe(2)
    })

    it('nextSibling', () => {
      const container = document.createElement('container')
      const div = document.createElement('div')
      const text = document.createTextNode('text')
      container.appendChild(div)
      container.appendChild(text)
      expect(div.nextSibling).toBe(text)
      expect(text.nextSibling).toBe(null)
    })

    it('previousSibling', () => {
      const container = document.createElement('container')
      const div = document.createElement('div')
      const text = document.createTextNode('text')
      container.appendChild(div)
      container.appendChild(text)
      expect(div.previousSibling).toBe(null)
      expect(text.previousSibling).toBe(div)
    })

    it('insertBefore', () => {
      const container = document.createElement('container')
      const div = document.createElement('div')
      const text = document.createTextNode('text')
      const div2 = document.createElement('div')
      container.appendChild(div)
      container.insertBefore(text, div)
      container.insertBefore(div2)
      expect(text.nextSibling).toBe(div)
      expect(div.previousSibling).toBe(text)
      expect(div2.nextSibling).toBe(null)
      expect(div.nextSibling).toBe(div2)
    })

    it('appendChild', () => {
      const container = document.createElement('container')
      const div = document.createElement('div')
      const text = document.createTextNode('text')
      container.appendChild(div)
      container.appendChild(text)
      expect(div.previousSibling).toBe(null)
      expect(text.previousSibling).toBe(div)
    })

    it('replaceChild', () => {
      const container = document.createElement('container')
      const div = document.createElement('div')
      const text = document.createTextNode('text')
      container.appendChild(div)
      container.appendChild(text)
      const div2 = document.createElement('div')
      container.replaceChild(div2, div)
      expect(container.childNodes.length).toBe(2)
      expect(text.previousSibling).toBe(div2)
      expect(div.parentNode).toBe(null)
    })

    it('removeChild', () => {
      const container = document.createElement('container')
      const div = document.createElement('div')
      const text = document.createTextNode('text')
      container.appendChild(div)
      container.appendChild(text)
      container.removeChild(div)
      expect(div.parentNode).toBe(null)
      expect(container.childNodes.length).toBe(1)
    })

    it('firstChild', () => {
      const container = document.createElement('container')
      const div = document.createElement('div')
      const text = document.createTextNode('text')
      container.appendChild(div)
      container.appendChild(text)
      expect(container.firstChild).toBe(div)
      container.textContent = ''
      expect(container.firstChild).toBe(null)
    })

    it('lastChild', () => {
      const container = document.createElement('container')
      const div = document.createElement('div')
      const text = document.createTextNode('text')
      container.appendChild(div)
      container.appendChild(text)
      expect(container.lastChild).toBe(text)
      container.textContent = ''
      expect(container.lastChild).toBe(null)
    })

    it('hasChildNodes', () => {
      const container = document.createElement('container')
      const div = document.createElement('div')
      const text = document.createTextNode('text')
      container.appendChild(div)
      container.appendChild(text)
      expect(container.hasChildNodes()).toBe(true)
      container.textContent = ''
      expect(container.hasChildNodes()).toBe(false)
    })

    it('insertAdjacentHTML', () => {
      const container = document.createElement('container')
      const div = document.createElement('div')
      const text = document.createTextNode('text')
      container.appendChild(div)
      container.firstChild.appendChild(text)

      const divBeforeInsert = container.firstChild
      divBeforeInsert.insertAdjacentHTML('beforebegin', '<view />')
      divBeforeInsert.insertAdjacentHTML('afterbegin', '<button />')
      divBeforeInsert.insertAdjacentHTML('beforeend', '<input />')
      divBeforeInsert.insertAdjacentHTML('afterend', '<image />')

      expect(container.childNodes.length).toBe(3)
      expect(container.childNodes[0].nodeName).toBe('view')
      expect(container.childNodes[1].nodeName).toBe('div')
      expect(container.childNodes[2].nodeName).toBe('image')

      const divAfterInsert = container.childNodes[1]
      expect(divAfterInsert.childNodes.length).toBe(3)
      expect(divAfterInsert.firstChild.nodeName).toBe('button')
      expect(divAfterInsert.lastChild.nodeName).toBe('input')
    })
  })

  describe('text', () => {
    it('nodeValue', () => {
      const t = document.createTextNode('t1')
      expect(t.nodeValue).toBe('t1')
      t.textContent = 't2'
      expect(t.nodeValue).toBe('t2')
    })

    it('textContext', () => {
      const t = document.createTextNode('t1')
      expect(t.textContent).toBe('t1')
      t.nodeValue = 't2'
      expect(t.textContent).toBe('t2')
    })

    it('nodeType', () => {
      const t = document.createTextNode('t1')
      expect(t.nodeType).toBe(3)
    })
  })

  describe('element', () => {
    it('tagName 是大写', () => {
      const node = document.createElement('div')
      expect(node.tagName).toBe('DIV')
    })

    it('id 和 className 可以直接设置', () => {
      const node = document.createElement('div')
      node.className = 'className'
      node.id = 'id'
      expect(node.getAttribute('class')).toBe('className')
      expect(node.getAttribute('id')).toBe('id')
    })

    it('children 只包括 Element', () => {
      const container = document.createElement('container')
      const div = document.createElement('div')
      const text = document.createTextNode('text')
      container.appendChild(div)
      container.appendChild(text)
      expect(container.children.length).toBe(1)
    })

    it('hasAttribute', () => {
      const div = document.createElement('div')
      div.setAttribute('readOnly', true)
      expect(div.hasAttribute('readOnly')).toBe(true)
    })

    it('hasAttributes', () => {
      const div = document.createElement('div')
      div.setAttribute('readOnly', true)
      expect(div.hasAttributes()).toBe(true)
    })

    it('focus', () => {
      const input = document.createElement('input')
      input.focus()
      expect(input.getAttribute('focus')).toBe(true)
    })

    it('blur', () => {
      const input = document.createElement('input')
      input.blur()
      expect(input.getAttribute('focus')).toBe(false)
    })

    it('setAttribute: style', () => {
      const div = document.createElement('div')
      div.setAttribute('style', 'color: red')
      expect(div.cssText).toBe('color: red;')
    })

    it('setAttribute: id', () => {
      const div = document.createElement('div')
      div.setAttribute('id', '10080')
      expect(div.getAttribute('id')).toBe('10080')
      div.props.id = '10080'
    })

    it('setAttribute: data-set', () => {
      const div = document.createElement('div')
      div.setAttribute('data-test', '10080')
      expect(div.getAttribute('data-test')).toBe('10080')
      expect(div.dataset.test).toBe('10080')
    })

    it('setAttribute: others', () => {
      const div = document.createElement('div')
      div.setAttribute('test', '10080')
      expect(div.getAttribute('test')).toBe('10080')
      div.props.test = '10080'
    })

    it('removeAttribute: style', () => {
      const div = document.createElement('div')
      div.setAttribute('style', 'color: red')
      div.removeAttribute('style')
      expect(div.cssText).toBe('')
    })

    it('removeAttribute: id', () => {
      const div = document.createElement('div')
      div.id = 'test'
      div.removeAttribute('id')
      expect(div.id).toBe('')
    })

    it('textContext', () => {
      function App () {
        return (
          <div>
            <div>
              <span> a </span>
            </div>
            b
            <span>c</span>
          </div>
        )
      }

      const div = document.createElement('div')
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(<App />, div)
      expect(div.textContent).toBe(' a bc')
    })

    it('创建 A 标签', () => {
      const a = document.createElement('a')

      expect(a.nodeName).toBe('a')
      expect(a.tagName).toBe('A')

      a.setAttribute('href', 'https://taro.com:8080/path/add?name=lizong')

      expect({
        href: a.href,
        protocol: a.protocol,
        host: a.host,
        search: a.search,
        hash: a.hash,
        hostname: a.hostname,
        port: a.port,
        pathname: a.pathname,
      }).toEqual({
        hash: '',
        host: 'taro.com:8080',
        hostname: 'taro.com',
        href: 'https://taro.com:8080/path/add?name=lizong',
        pathname: '/path/add',
        port: '8080',
        protocol: 'https:',
        search: '?name=lizong',
      })

      a.href = 'https://taro.com:9090/path/index#id3'

      expect({
        href: a.href,
        protocol: a.protocol,
        host: a.host,
        search: a.search,
        hash: a.hash,
        hostname: a.hostname,
        port: a.port,
        pathname: a.pathname,
      }).toEqual({
        hash: '#id3',
        host: 'taro.com:9090',
        hostname: 'taro.com',
        href: 'https://taro.com:9090/path/index#id3',
        pathname: '/path/index',
        port: '9090',
        protocol: 'https:',
        search: '',
      })
    })
  })
})
