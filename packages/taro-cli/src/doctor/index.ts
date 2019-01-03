import configValidator from './configValidator';
import packageValidator from './packageValidator';
import recommandValidator from './recommandValidator';
import eslintValidator from './eslintValidator';

export default {
  validators: [
    configValidator,
    packageValidator,
    recommandValidator,
    eslintValidator
  ]
}
