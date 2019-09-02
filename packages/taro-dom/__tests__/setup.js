import { createDocument } from '../src/document'

const doc = createDocument()

global.window = {}

global.window.document = doc
global.document = doc
global.navigator = {
  userAgent: ''
}
