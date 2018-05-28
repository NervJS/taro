const has = require('has')

const allRules = {
  'custom-component-children': require('./custom-component-children'),
  'if-statement-in-map-loop': require('./if-statement-in-map-loop'),
  'manipulate-jsx-as-array': require('./manipulate-jsx-as-array'),
  'no-anonymous-function-in-props': require('./no-anonymous-function-in-props'),
  'no-jsx-in-class-method': require('./no-jsx-in-class-method'),
  'no-jsx-in-props': require('./no-jsx-in-props'),
  'no-ref': require('./no-ref'),
  'no-spread-in-props': require('./no-spread-in-props'),
  'no-stateless-component': require('./no-stateless-component')
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
