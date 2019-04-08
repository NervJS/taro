import { matchesStringOrRegExp } from "./matchesStringOrRegExp";

/**
 * Check if an options object's propertyName contains a user-defined string or
 * regex that matches the passed in input.
 */
export function optionsMatches(
  options /*: Object */,
  propertyName /*: string */,
  input /*: string */
) /*: boolean */ {
  return !!(
    options &&
    options[propertyName] &&
    typeof input === "string" &&
    matchesStringOrRegExp(input, options[propertyName])
  );
}
