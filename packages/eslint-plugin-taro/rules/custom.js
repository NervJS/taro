const has = require('has')

const allRules = {
  'custom-component-children': require('./custom/custom-component-children'),
  'if-statement-in-map-loop': require('./custom/if-statement-in-map-loop'),
  'manipulate-jsx-as-array': require('./custom/manipulate-jsx-as-array'),
  'no-anonymous-function-in-props': require('./custom/no-anonymous-function-in-props'),
  'no-jsx-in-class-method': require('./custom/no-jsx-in-class-method'),
  'no-jsx-in-props': require('./custom/no-jsx-in-props'),
  'no-ref': require('./custom/no-ref'),
  'no-spread-in-props': require('./custom/no-spread-in-props'),
  'no-stateless-component': require('./custom/no-stateless-component')
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
