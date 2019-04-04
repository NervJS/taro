/**
 * Check whether a property is a custom one
 */
export function isCustomProperty(property /*: string */) /*: boolean */ {
  return property.slice(0, 2) === "--";
}
