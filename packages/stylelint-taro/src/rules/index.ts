import declarationPropertyValueAllowedList from './declaration-property-value-allowed-list/index.ts'
import noNestedSelectors from './no-nested-selectors/index.ts'
import propertyAllowedList from './property-allowed-list/index.ts'

const rules = {
  'no-nested-selectors': noNestedSelectors,
  'property-allowed-list': propertyAllowedList,
  'declaration-property-value-allowed-list': declarationPropertyValueAllowedList,
}

export default rules
