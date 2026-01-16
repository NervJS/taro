/* eslint-disable no-console */
const { parseDependencyTree } = require('dpdm')
const { peerDependencies } = require('./package.json')

const hiddenDependenciesMap = {
  '@ant-design/react-native/lib/picker': ['@react-native-picker/picker']
}

const componentReg = /^src\/components\/(\w+)\/index.tsx$/

function parseDependencyCircular(dep = [], tree = {}) {
  dep.forEach(d => {
    const item = tree[d.id]
    if (item) {
      dep = dep.concat(parseDependencyCircular(item, tree))
    }
  })
  return dep
}

parseDependencyTree('./src/index.ts', {}).then((tree) => {
  const result = {}
  Object.keys(tree).map(key => {
    const match = key.match(componentReg)
    if (match) {
      const name = match[1]
      parseDependencyCircular(tree[key], tree).map(dependency => {
        const dep = dependency.id
        if (dep) {
          [...Object.keys(peerDependencies), ...Object.keys(hiddenDependenciesMap)].forEach(value => {
            if (dep.match(`node_modules/${value}`)) {
              result[name] = result[name] || new Set()
              if (hiddenDependenciesMap[value]) {
                hiddenDependenciesMap[value].forEach(value => {
                  const showName = peerDependencies[value] ? `${value}@${peerDependencies[value]}` : value
                  result[name].add(showName)
                })
              } else {
                const showName = peerDependencies[value] ? `${value}@${peerDependencies[value]}` : value
                result[name].add(showName)
              }
            }
          })
        }
      })
    }
  })
  console.log(result)
})
