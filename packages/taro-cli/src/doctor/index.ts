import configValidator from './configValidator'
import eslintValidator from './eslintValidator'
import packageValidator from './packageValidator'
import recommandValidator from './recommandValidator'

export default {
  validators: [configValidator, packageValidator, recommandValidator, eslintValidator]
}
