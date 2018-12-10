const has = require('has')

const allRules = {
  'if-statement-in-map-loop': require('./if-statement-in-map-loop'),
  'manipulate-jsx-as-array': require('./manipulate-jsx-as-array'),
  'no-anonymous-function-in-props': require('./no-anonymous-function-in-props'),
  'no-jsx-in-class-method': require('./no-jsx-in-class-method'),
  'no-spread-in-props': require('./no-spread-in-props'),
  'no-stateless-component': require('./no-stateless-component'),
  'jsx-handler-names': require('./jsx-handler-names'),
  'reserve-class-properties': require('./reserve-class-properties'),
  'function-naming': require('./function-naming'),
  'class-naming': require('./class-naming'),
  'props-reserve-keyword': require('./props-reserve-keyword'),
  'this-props-function': require('./this-props-function'),
  'switch-jsx': require('./switch-jsx'),
  'render-props': require('./render-props')
}

function configureAsError (rules) {
  const result = {}
  for (const key in rules) {
    if (!has(rules, key)) {
      continue
    }
    result[`taro/${key}`] = 2
  }
  return result
}

const activeRules = configureAsError(allRules)

module.exports = {
  activeRules,
  allRules
}
