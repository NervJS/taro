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

describe('MutationObserver', () => {
  const runtime = require('../../dist/runtime.esm')
  const document = runtime.document
  const MutationObserver = runtime.MutationObserver

  let observer
  const mutations = []

  beforeEach(() => {
    observer = new MutationObserver((ms) => {
      mutations.push(...ms)
      observer.disconnect()
    })
  })

  afterEach(() => {
    mutations.splice(0, mutations.length)
    if (observer) observer.disconnect()
  })

  describe('should observe appendChild mutations', () => {
    it('first node', async () => {
      expect.assertions(2)
      const target = document.createElement('div')
      const child = document.createElement('div')

      observer.observe(target, { childList: true })
      target.appendChild(child)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(mutations).toEqual([{
          target: target,
          type: 'childList',
          previousSibling: null,
          nextSibling: null,
          removedNodes: [],
          addedNodes: [child]
        }])
      })
    })

    it('sibling node', async () => {
      expect.assertions(2)
      const target = document.createElement('div')
      const sibling = document.createElement('div')
      const child = document.createElement('view')

      target.appendChild(sibling)
      observer.observe(target, { childList: true })
      target.appendChild(child)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(mutations).toEqual([{
          target: target,
          type: 'childList',
          previousSibling: sibling,
          nextSibling: null,
          removedNodes: [],
          addedNodes: [child]
        }])
      })
    })

    it('tree depth > 1', async () => {
      expect.assertions(2)
      const target = document.createElement('div')
      const div = document.createElement('div')
      const child = document.createElement('view')

      target.appendChild(child)
      observer.observe(target, { childList: true, subtree: true })
      child.appendChild(div)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(mutations).toEqual([{
          target: child,
          type: 'childList',
          previousSibling: null,
          nextSibling: null,
          removedNodes: [],
          addedNodes: [div]
        }])
      })
    })
  })

  describe('should observe replaceChild mutation', () => {
    it('only one node', async () => {
      expect.assertions(3)
      const target = document.createElement('div')
      const div = document.createElement('div')
      const view = document.createElement('view')

      target.appendChild(view)
      observer.observe(target, { childList: true })
      target.replaceChild(div, view)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(target.childNodes.length).toBe(1)
        expect(mutations).toEqual([{
          target: target,
          type: 'childList',
          previousSibling: null,
          nextSibling: null,
          addedNodes: [div],
          removedNodes: [view]
        }])
      })
    })

    it('multi nodes - replace first node with new node', async () => {
      expect.assertions(3)
      const target = document.createElement('div')
      const first = document.createElement('div')
      const last = document.createElement('view')
      const newNode = document.createElement('view')

      target.appendChild(first)
      target.appendChild(last)
      observer.observe(target, { childList: true })
      target.replaceChild(newNode, first)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(target.childNodes.length).toBe(2)
        expect(mutations).toEqual([{
          target: target,
          type: 'childList',
          previousSibling: null,
          nextSibling: last,
          addedNodes: [newNode],
          removedNodes: [first]
        }])
      })
    })

    it('multi nodes - replace last node with new node', async () => {
      expect.assertions(3)
      const target = document.createElement('div')
      const first = document.createElement('div')
      const last = document.createElement('view')
      const newNode = document.createElement('view')

      target.appendChild(first)
      target.appendChild(last)
      observer.observe(target, { childList: true })
      target.replaceChild(newNode, last)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(target.childNodes.length).toBe(2)
        expect(mutations).toEqual([{
          target: target,
          type: 'childList',
          previousSibling: first,
          nextSibling: null,
          addedNodes: [newNode],
          removedNodes: [last]
        }])
      })
    })

    it('multi nodes - remove sibling node', async () => {
      expect.assertions(3)
      const target = document.createElement('div')
      const first = document.createElement('div')
      const last = document.createElement('view')

      target.appendChild(first)
      target.appendChild(last)
      observer.observe(target, { childList: true })
      target.replaceChild(first, last)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(target.childNodes.length).toBe(1)
        expect(mutations).toEqual([
          {
            target: target,
            type: 'childList',
            previousSibling: null,
            nextSibling: null,
            addedNodes: [first],
            removedNodes: [last]
          }
        ])
      })
    })
  })

  describe('should observe removeChild mutations', () => {
    it('first node', async () => {
      expect.assertions(3)
      const target = document.createElement('div')
      const first = document.createElement('div')

      target.appendChild(first)
      observer.observe(target, { childList: true })
      target.removeChild(first)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(target.childNodes.length).toBe(0)
        expect(mutations).toEqual([
          {
            target: target,
            type: 'childList',
            previousSibling: null,
            nextSibling: null,
            removedNodes: [first]
          }
        ])
      })
    })
    it('sibling node', async () => {
      expect.assertions(3)
      const target = document.createElement('div')
      const first = document.createElement('div')
      const last = document.createElement('view')

      target.appendChild(first)
      target.appendChild(last)
      observer.observe(target, { childList: true })
      target.removeChild(first)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(target.childNodes.length).toBe(1)
        expect(mutations).toEqual([
          {
            target: target,
            type: 'childList',
            previousSibling: null,
            nextSibling: last,
            removedNodes: [first]
          }
        ])
      })
    })
    it('multi sibling nodes', async () => {
      expect.assertions(3)
      const target = document.createElement('div')
      const first = document.createElement('div')
      const second = document.createElement('view')
      const last = document.createElement('view')

      target.appendChild(first)
      target.appendChild(second)
      target.appendChild(last)
      observer.observe(target, { childList: true })
      target.removeChild(second)
      target.removeChild(last)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(2)
        expect(target.childNodes.length).toBe(1)
        expect(mutations).toEqual([
          {
            target: target,
            type: 'childList',
            previousSibling: first,
            nextSibling: last,
            removedNodes: [second]
          },
          {
            target: target,
            type: 'childList',
            previousSibling: first,
            nextSibling: null,
            removedNodes: [last]
          }
        ])
      })
    })
    it('tree depth > 1', async () => {
      expect.assertions(3)
      const target = document.createElement('div')
      const div = document.createElement('div')
      const view = document.createElement('view')

      target.appendChild(div)
      div.appendChild(view)
      observer.observe(target, { childList: true, subtree: true })
      div.removeChild(view)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(target.childNodes.length).toBe(1)
        expect(mutations).toEqual([
          {
            target: div,
            type: 'childList',
            previousSibling: null,
            nextSibling: null,
            removedNodes: [view]
          }
        ])
      })
    })
  })

  describe('should observe attribute mutations', () => {
    describe('classList', () => {
      it('add a single class value', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        target.appendChild(el)
        observer.observe(target, { attributes: true, subtree: true })
        el.classList.add('bar')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'class',
              oldValue: null
            }
          ])
        })
      })

      it('add a single class value to existing values', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')
        el.classList.add('foo')

        target.appendChild(el)
        observer.observe(target, { attributes: true, subtree: true })
        el.classList.add('bar')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'class',
              oldValue: null
            }
          ])
        })
      })

      it('add multiple class values', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        target.appendChild(el)
        observer.observe(target, { attributes: true, attributeOldValue: true, subtree: true })
        el.classList.add('foo')
        el.classList.add('bar')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(2)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'class',
              oldValue: ''
            },
            {
              target: el,
              type: 'attributes',
              attributeName: 'class',
              oldValue: 'foo'
            }
          ])
        })
      })

      it('add multiple class values to existing values', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')
        el.classList.add('foo')

        target.appendChild(el)
        observer.observe(target, { attributes: true, attributeOldValue: true, subtree: true })
        el.classList.add('bar')
        el.classList.add('baz')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(2)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'class',
              oldValue: 'foo'
            },
            {
              target: el,
              type: 'attributes',
              attributeName: 'class',
              oldValue: 'foo bar'
            }
          ])
        })
      })

      it('replace single existing class value', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')
        el.classList.add('foo')

        target.appendChild(el)
        observer.observe(target, { attributes: true, subtree: true })
        el.classList.replace('foo', 'bar')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'class',
              oldValue: null
            }
          ])
        })
      })

      it('replace multiple existing class values', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')
        el.classList.add('foo')
        el.classList.add('bar')
        el.classList.add('baz')

        target.appendChild(el)
        observer.observe(target, { attributes: true, attributeOldValue: true, subtree: true })
        el.classList.replace('foo', 'bar')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'class',
              oldValue: 'foo bar baz'
            }
          ])
        })
      })

      it('toggle to remove', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')
        el.className = 'foo'

        target.appendChild(el)
        observer.observe(target, { attributes: true, attributeOldValue: true, subtree: true })
        el.classList.toggle('foo')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'class',
              oldValue: 'foo'
            }
          ])
        })
      })

      it('toggle to add', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')
        el.className = 'foo'

        target.appendChild(el)
        observer.observe(target, { attributes: true, attributeOldValue: true, subtree: true })
        el.classList.toggle('bar')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'class',
              oldValue: 'foo'
            }
          ])
        })
      })
    })

    describe('style', () => {
      it('add a single style value', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        target.appendChild(el)
        observer.observe(target, { attributes: true, subtree: true })
        el.style.width = '10px'

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'style',
              oldValue: null
            }
          ])
        })
      })

      it('add multiple style values', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        el.style.width = '10px'
        target.appendChild(el)
        observer.observe(target, { attributes: true, attributeOldValue: true, subtree: true })
        el.style.height = '12px'

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'style',
              oldValue: 'width: 10px;'
            }
          ])
        })
      })

      it('add single style value via setProperty', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        target.appendChild(el)
        observer.observe(target, { attributes: true, subtree: true })
        el.style.setProperty('width', '12px')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'style',
              oldValue: null
            }
          ])
        })
      })

      it('add multiple style values via setProperty', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        target.appendChild(el)
        el.style.setProperty('width', '10px')
        observer.observe(target, { attributes: true, subtree: true })
        el.style.setProperty('height', '12px')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'style',
              oldValue: null
            }
          ])
        })
      })

      it('add single style value via cssText', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        target.appendChild(el)
        observer.observe(target, { attributes: true, subtree: true })
        el.style.cssText = 'width: 10px'

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'style',
              oldValue: null
            }
          ])
        })
      })

      it('add multi style values via cssText', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        target.appendChild(el)
        observer.observe(target, { attributes: true, subtree: true })
        el.style.cssText = 'width: 10px; height: 12px'

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'style',
              oldValue: null
            }
          ])
        })
      })

      it('remove singe style value', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        target.appendChild(el)
        el.style.width = '10px'
        observer.observe(target, { attributes: true, subtree: true })
        el.style.width = ''

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'style',
              oldValue: null
            }
          ])
        })
      })

      it('remove singe style value via setProperty', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        target.appendChild(el)
        el.style.setProperty('width', '10px')
        observer.observe(target, { attributes: true, subtree: true })
        el.style.setProperty('width', '')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'style',
              oldValue: null
            }
          ])
        })
      })

      it('remove singe style value via removeProperty', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        target.appendChild(el)
        el.style.setProperty('width', '10px')
        observer.observe(target, { attributes: true, subtree: true })
        el.style.removeProperty('width')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'style',
              oldValue: null
            }
          ])
        })
      })

      it('remove singe style value via cssText', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        target.appendChild(el)
        el.style.cssText = 'width: 10px'
        observer.observe(target, { attributes: true, subtree: true })
        el.style.cssText = ''

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'style',
              oldValue: null
            }
          ])
        })
      })

      it('replace singe style value', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        target.appendChild(el)
        el.style.width = '10px'
        observer.observe(target, { attributes: true, subtree: true })
        el.style.width = '12px'

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'style',
              oldValue: null
            }
          ])
        })
      })

      it('replace multiple style values', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        target.appendChild(el)
        el.style.width = '10px'
        el.style.height = '12px'
        observer.observe(target, { attributes: true, attributeOldValue: true, subtree: true })
        el.style.width = '14px'

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'style',
              oldValue: 'width: 10px; height: 12px;'
            }
          ])
        })
      })

      it('replace singe style value setProperty', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        target.appendChild(el)
        el.style.setProperty('width', '10px')
        observer.observe(target, { attributes: true, attributeOldValue: true, subtree: true })
        el.style.setProperty('width', '12px')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'style',
              oldValue: 'width: 10px;'
            }
          ])
        })
      })

      // the implementation should be improved
      // to observe cssText change in just one mutation
      it('replace multiple style values via cssText', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        target.appendChild(el)
        el.style.cssText = 'width: 10px; height: 12px'
        observer.observe(target, { attributes: true, attributeOldValue: true, subtree: true })
        el.style.cssText = 'width: 12px; height: 14px'

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'style',
              oldValue: 'width: 10px; height: 12px;'
            }
          ])
        })
      })
    })

    describe('attributes', () => {
      it('set new attribute', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        target.appendChild(el)
        observer.observe(target, { attributes: true, attributeOldValue: true, subtree: true })
        el.setAttribute('data-foo', 'bar')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'data-foo',
              oldValue: ''
            }
          ])
        })
      })

      it('overwrite attribute', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        el.setAttribute('data-foo', 'bar')
        target.appendChild(el)
        observer.observe(target, { attributes: true, attributeOldValue: true, subtree: true })
        el.setAttribute('data-foo', 'baz')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'data-foo',
              oldValue: 'bar'
            }
          ])
        })
      })

      it('remove attribute', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        el.setAttribute('data-foo', 'bar')
        target.appendChild(el)
        observer.observe(target, { attributes: true, attributeOldValue: true, subtree: true })
        el.removeAttribute('data-foo')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 'attributes',
              attributeName: 'data-foo',
              oldValue: 'bar'
            }
          ])
        })
      })
    })
  })

  describe('should observe characterData mutations', () => {
    it('set textContent', async () => {
      expect.assertions(2)
      const target = document.createElement('div')
      const el = document.createTextNode('original text')

      target.appendChild(el)
      observer.observe(target, { characterData: true, characterDataOldValue: true, subtree: true })
      el.textContent = 'new text'

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(mutations).toEqual([
          {
            target: el,
            type: 'characterData',
            oldValue: 'original text'
          }
        ])
      })
    })
  })
})
