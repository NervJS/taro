// eslint-disable-next-line
const fs = require('fs')
// eslint-disable-next-line
const path = require('path')
// eslint-disable-next-line
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default

const code = fs.readFileSync(path.resolve(__dirname, '../src/api/index.ts')).toString()
console.log('run: generate native api list to taro-rn/apiList.js\n')
console.log('apis is:', code)
const ast = parser.parse(code, { sourceType: 'module', plugins: ['typescript'] })
const apiList = []

traverse(ast, {
  ExportNamedDeclaration(ast) {
    ast.node.specifiers.forEach(spec => apiList.push(spec.local.name))
  }
})

const output = `// 由 getApiList.js 脚本生成, 不要进行手动修改\nmodule.exports = ${JSON.stringify(apiList, null, 2).replace(/"/g, "'")}\n`
fs.writeFileSync(path.resolve(__dirname, '../apiList.js'), output)

console.log('done: generate native api list to taro-rn/apiList.js\n')
