describe('Class', () => {
  const runtime = require('../../dist/runtime.esm')
  const document = runtime.document
  global.document = runtime.document
  global.window = runtime.window
  global.navigator = runtime.navigator

  describe('attribute', () => {
    it('setAttribute: class', () => {
      const div = document.createElement('div')
      div.className = 'test'
      expect(div.className).toBe('test')
      div.className = 'test1 test2'
      expect(div.className).toBe('test1 test2')
    })
  
    it('removeAttribute: class', () => {
      const div = document.createElement('div')
      div.className = 'test'
      div.removeAttribute('class')
      expect(div.className).toBe('')
    })
  })

  describe('classList', () => {
    it('get value', ()  => {
      const div = document.createElement('div')
      expect(div.classList.value).toBe('')
      div.classList.add('test1')
      expect(div.classList.value).toBe('test1')
      div.classList.add('test2')
      expect(div.classList.value).toBe('test1 test2')
    })

    it('get init value', () => {
      const div = document.createElement('div')
      div.className = 'test1 test2'
      expect(div.classList.value).toBe('test1 test2')
    })

    it('get length', ()  => {
      const div = document.createElement('div')
      div.classList.add('test1')
      expect(div.classList.length).toBe(1)
      div.classList.add('test2')
      expect(div.classList.length).toBe(2)
    })

    it('trigger add function', () => {
      const div = document.createElement('div')
      div.classList.add('test1')
      expect(div.className).toBe('test1')
      div.classList.add('test1')
      expect(div.className).toBe('test1')
      div.classList.add('test2')
      expect(div.className).toBe('test1 test2')
    })
  
    it('trigger remove function', () => {
      const div = document.createElement('div')
      div.classList.add('test1')
      div.classList.add('test2')
      div.classList.remove('test2')
      expect(div.className).toBe('test1')
      div.classList.remove('test3')
      expect(div.className).toBe('test1')
      div.classList.remove('test1')
      expect(div.className).toBe('')
    })
  
    it('trigger toggle function', () => {
      const div = document.createElement('div')
      div.classList.toggle('test')
      expect(div.className).toBe('test')
      div.classList.toggle('test')
      expect(div.className).toBe('')
    })

    it('trigger replace function', () => {
      const div = document.createElement('div')
      div.classList.add('test1')
      div.classList.add('test2')
      div.classList.replace('test1', 'test3')
      expect(div.className).toBe('test3 test2')
      div.classList.replace('test4', 'test5')
      expect(div.className).toBe('test3 test2')
    })
  
    it('trigger contains function', () => {
      const div = document.createElement('div')
      div.classList.add('test1')
      div.classList.add('test2')
      expect(div.classList.contains('test1')).toBe(true)
      expect(div.classList.contains('test3')).toBe(false)
    })

    it('trigger toString function', () => {
      const div = document.createElement('div')
      div.classList.add('test1')
      div.classList.add('test2')
      expect(div.classList.toString()).toBe('test1 test2')
    })
  })
})
