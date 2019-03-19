import { allCSS2RNProps } from "react-native-known-styling-properties";
import { utils } from "stylelint";
import {
  isCustomProperty,
  isExportBlock,
  isStandardSyntaxDeclaration,
  isStandardSyntaxProperty,
  isString,
  kebabCase,
  namespace,
  optionsMatches
} from "../../utils";

export const ruleName = namespace("css-property-no-unknown");

export const messages = utils.ruleMessages(ruleName, {
  rejected: property => `无效的 React Native 样式属性 "${property}"`
});

const props = allCSS2RNProps.map(kebabCase);

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

      if (isExportBlock(decl.parent)) {
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
