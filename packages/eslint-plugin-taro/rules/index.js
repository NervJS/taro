const has = require('has')

const allRules = {
  // 'if-statement-in-map-loop': require('./if-statement-in-map-loop'),
  'manipulate-jsx-as-array': require('./manipulate-jsx-as-array'),
  // 'no-jsx-in-class-method': require('./no-jsx-in-class-method'),
  'no-spread-in-props': require('./no-spread-in-props'),
  // 'no-stateless-component': require('./no-stateless-component'),
  // 'jsx-handler-names': require('./jsx-handler-names'),
  'reserve-class-properties': require('./reserve-class-properties'),
  // 'function-naming': require('./function-naming'),
  'class-naming': require('./class-naming'),
  'props-reserve-keyword': require('./props-reserve-keyword'),
  'this-props-function': require('./this-props-function'),
  'render-props': require('./render-props'),
  'duplicate-name-of-state-and-props': require('./duplicate-name-of-state-and-props')
}

const transformerDisableRules = new Set([
  'this-props-function',
  'props-reserve-keyword'
])

function configureAsError (rules, isTransformer) {
  const result = {}
  for (const key in rules) {
    if (!has(rules, key)) {
      continue
    }
    if (isTransformer && transformerDisableRules.has(key)) {
      continue
    }
    result[`taro/${key}`] = 2
  }
  return result
}

const transformerRules = configureAsError(allRules, true)

const activeRules = configureAsError(allRules)

module.exports = {
  activeRules,
  allRules,
  transformerRules
}
