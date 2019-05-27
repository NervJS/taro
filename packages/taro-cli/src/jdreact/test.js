var fs = require('fs-extra')
var path = require('path')
var klaw = require('klaw')

// console.log(__dirname)

let nm = path.join(__dirname, 'node_modules')

console.log(nm)

const filterFunc = item => {
  const basename = path.basename(item)
  return ((basename === '.' || basename[0] !== '.') && !item.startsWith('/Users/chengshuai/Work/taro/packages/taro-cli'))
}

klaw('../../src', {filter: filterFunc})
  .on('data', item => console.log(item))
