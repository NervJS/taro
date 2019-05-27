import { createPlugin } from "stylelint";
import { namespace } from "./utils";
import rules from "./rules";

const rulesPlugins = Object.keys(rules).map(ruleName => {
  return createPlugin(namespace(ruleName), rules[ruleName]);
});

export default rulesPlugins;
