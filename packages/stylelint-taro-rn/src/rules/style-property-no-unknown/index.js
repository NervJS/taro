import { utils } from "stylelint";
import { allProps } from "react-native-known-styling-properties";
import {
  kebabCase,
  namespace,
  isString,
  isCustomProperty,
  isStandardSyntaxProperty,
  isStandardSyntaxDeclaration,
  optionsMatches
} from "../../utils";

export const ruleName = namespace("style-property-no-unknown");

export const messages = utils.ruleMessages(ruleName, {
  rejected: property => `无效的 React Native 样式属性 "${property}"`
});

const props = allProps.map(kebabCase);

export default function(actual, options) {
  return function(root, result) {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual
      },
      {
        actual: options,
        possible: {
          ignoreProperties: [isString]
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    root.walkDecls(decl => {
      const prop = decl.prop;

      if (!isStandardSyntaxProperty(prop)) {
        return;
      }

      if (!isStandardSyntaxDeclaration(decl)) {
        return;
      }

      if (isCustomProperty(prop)) {
        return;
      }

      if (optionsMatches(options, "ignoreProperties", prop)) {
        return;
      }

      if (props.indexOf(prop.toLowerCase()) !== -1) {
        return;
      }

      utils.report({
        message: messages.rejected(prop),
        node: decl,
        result,
        ruleName
      });
    });
  };
}
