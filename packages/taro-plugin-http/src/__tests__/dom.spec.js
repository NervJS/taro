describe('DOM', () => {
  process.env.FRAMEWORK = 'nerv'
  const runtime = require('../../dist/runtime')
  const document = runtime.document
  global.document = runtime.document
  
  describe('document', () => {

    it('document setCookie', async () => {
      expect(document.cookie).toBe('')
      document.cookie = 'aaa=1111-2222-33-444-abcdefgasd; path=/; expires=Mon, 18 Jan 2038 19:14:07 GMT; secure;'
      document.cookie = 'bbb=23123-aswe-4a7a-a740-f55dfd296b1d; path=/; expires=Mon, 18 Jan 2038 19:14:07 GMT'
      document.cookie = 'ccc=69asd3d81234668942; path=/; expires=Mon, 18 Jan 2038 19:14:07 GMT'
      expect(document.cookie).toBe(
        'aaa=1111-2222-33-444-abcdefgasd; bbb=23123-aswe-4a7a-a740-f55dfd296b1d; ccc=69asd3d81234668942'
      )
    })
    
  })
})
