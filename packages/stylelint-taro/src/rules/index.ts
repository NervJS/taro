import declarationPropertyValueAllowedList from './declaration-property-value-allowed-list'
import noNestedSelectors from './no-nested-selectors'
import propertyAllowedList from './property-allowed-list'

const rules = {
  'no-nested-selectors': noNestedSelectors,
  'property-allowed-list': propertyAllowedList,
  'declaration-property-value-allowed-list': declarationPropertyValueAllowedList,
}

export default rules
