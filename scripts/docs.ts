import docsAPI, { writeApiDoc, writeDoc } from './output'

const verbose = process.argv.findIndex(e => /^[-]{2}verbose/ig.test(e)) > -1
const force = process.argv.findIndex(e => /^[-]{2}force/ig.test(e)) === -1

// docsAPI('packages/taro/types/api', 'docs/apis', ['packages/taro/types/api'], writeJson)
docsAPI('packages/taro/types/api', 'docs/apis', ['packages/taro/types/api'], writeApiDoc, verbose, force)
// docsAPI('packages/taro-components/types', 'docs/components', ['packages/taro-components/types'], writeJson, verbose, force)
docsAPI('packages/taro-components/types', 'docs/components', ['packages/taro-components/types'], writeDoc, verbose, force)

// writeFile(
//   path.resolve(__dirname, `taro-apis.md`),
//   splicing([
//     envMap.reduce((p, env) => `${p} ${env.label} |`, '| API |'),
//     envMap.reduce((p) => `${p} :---: |`, '| :---: |'),
//     ...taro_apis, ''
//   ]),
// )