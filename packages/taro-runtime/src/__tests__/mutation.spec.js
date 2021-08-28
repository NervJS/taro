
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
          type: 2,
          previousSibling: undefined,
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
          type: 2,
          previousSibling: sibling,
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
      observer.observe(target, { childList: true })
      child.appendChild(div)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(mutations).toEqual([{
          target: child,
          type: 2,
          previousSibling: undefined,
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
          type: 2,
          nextSibling: undefined,
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
          type: 2,
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
          type: 2,
          nextSibling: undefined,
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
        expect(mutations.length).toBe(2)
        expect(target.childNodes.length).toBe(1)
        expect(mutations).toEqual([
          {
            target: target,
            type: 2,
            removedNodes: [first]
          },
          {
            target: target,
            type: 2,
            nextSibling: undefined,
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
            type: 2,
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
            type: 2,
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
            type: 2,
            removedNodes: [second]
          },
          {
            target: target,
            type: 2,
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
      observer.observe(target, { childList: true })
      div.removeChild(view)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(target.childNodes.length).toBe(1)
        expect(mutations).toEqual([
          {
            target: div,
            type: 2,
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
        observer.observe(target)
        el.classList.add('bar')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'class',
              value: 'bar',
              oldValue: ''
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
        observer.observe(target)
        el.classList.add('bar')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'class',
              value: 'foo bar',
              oldValue: 'foo'
            }
          ])
        })
      })

      it('add multiple class values', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        target.appendChild(el)
        observer.observe(target)
        el.classList.add('foo')
        el.classList.add('bar')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(2)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'class',
              value: 'foo',
              oldValue: ''
            },
            {
              target: el,
              type: 0,
              attributeName: 'class',
              value: 'foo bar',
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
        observer.observe(target)
        el.classList.add('bar')
        el.classList.add('baz')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(2)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'class',
              value: 'foo bar',
              oldValue: 'foo'
            },
            {
              target: el,
              type: 0,
              attributeName: 'class',
              value: 'foo bar baz',
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
        observer.observe(target)
        el.classList.replace('foo', 'bar')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'class',
              value: 'bar',
              oldValue: 'foo'
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
        observer.observe(target)
        el.classList.replace('foo', 'bar')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'class',
              value: 'bar baz',
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
        observer.observe(target)
        el.classList.toggle('foo')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'class',
              value: '',
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
        observer.observe(target)
        el.classList.toggle('bar')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'class',
              value: 'foo bar',
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
        observer.observe(target)
        el.style.width = '10px'

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'style',
              value: 'width: 10px;',
              oldValue: ''
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
        observer.observe(target)
        el.style.height = '12px'

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'style',
              value: 'width: 10px; height: 12px;',
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
        observer.observe(target)
        el.style.setProperty('width', '12px')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'style',
              value: 'width: 12px;',
              oldValue: ''
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
        observer.observe(target)
        el.style.setProperty('height', '12px')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'style',
              value: 'width: 10px; height: 12px;',
              oldValue: 'width: 10px;'
            }
          ])
        })
      })

      it('add single style value via cssText', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        target.appendChild(el)
        observer.observe(target)
        el.style.cssText = 'width: 10px'

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'style',
              value: 'width: 10px;',
              oldValue: ''
            }
          ])
        })
      })

      it('add multi style values via cssText', async () => {
        expect.assertions(2)
        const target = document.createElement('div')
        const el = document.createElement('div')

        target.appendChild(el)
        observer.observe(target)
        el.style.cssText = 'width: 10px; height: 12px'

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(2)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'style',
              value: 'width: 10px;',
              oldValue: ''
            },
            {
              target: el,
              type: 0,
              attributeName: 'style',
              value: 'width: 10px; height: 12px;',
              oldValue: 'width: 10px;'
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
        observer.observe(target)
        el.style.width = ''

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'style',
              value: '',
              oldValue: 'width: 10px;'
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
        observer.observe(target)
        el.style.setProperty('width', '')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'style',
              value: '',
              oldValue: 'width: 10px;'
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
        observer.observe(target)
        el.style.removeProperty('width')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'style',
              value: '',
              oldValue: 'width: 10px;'
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
        observer.observe(target)
        el.style.cssText = ''

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'style',
              value: '',
              oldValue: 'width: 10px;'
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
        observer.observe(target)
        el.style.width = '12px'

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'style',
              value: 'width: 12px;',
              oldValue: 'width: 10px;'
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
        observer.observe(target)
        el.style.width = '14px'

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'style',
              value: 'width: 14px; height: 12px;',
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
        observer.observe(target)
        el.style.setProperty('width', '12px')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'style',
              value: 'width: 12px;',
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
        observer.observe(target)
        el.style.cssText = 'width: 12px; height: 14px'

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(4)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'style',
              value: 'height: 12px;',
              oldValue: 'width: 10px; height: 12px;'
            },
            {
              target: el,
              type: 0,
              attributeName: 'style',
              value: '',
              oldValue: 'height: 12px;'
            },
            {
              target: el,
              type: 0,
              attributeName: 'style',
              value: 'width: 12px;',
              oldValue: ''
            },
            {
              target: el,
              type: 0,
              attributeName: 'style',
              value: 'width: 12px; height: 14px;',
              oldValue: 'width: 12px;'
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
        observer.observe(target)
        el.setAttribute('data-foo', 'bar')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'data-foo',
              value: 'bar',
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
        observer.observe(target)
        el.setAttribute('data-foo', 'baz')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
              attributeName: 'data-foo',
              value: 'baz',
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
        observer.observe(target)
        el.removeAttribute('data-foo')

        return Promise.resolve().then(() => {
          expect(mutations.length).toBe(1)
          expect(mutations).toEqual([
            {
              target: el,
              type: 0,
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
      observer.observe(target)
      el.textContent = 'new text'

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(mutations).toEqual([
          {
            target: el,
            type: 1,
            value: 'new text',
            oldValue: 'original text'
          }
        ])
      })
    })
  })
})
