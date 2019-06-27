import configValidator from './configValidator';
import packageValidator from './packageValidator';
import recommandValidator from './recommandValidator';
import eslintValidator from './eslintValidator';
import abilityXMLValidator from './abilityXMLValidator';

export default {
  validators: [
    configValidator,
    packageValidator,
    recommandValidator,
    eslintValidator,
    abilityXMLValidator
  ]
}
