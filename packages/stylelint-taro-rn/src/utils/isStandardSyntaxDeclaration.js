/**
 * Check whether a declaration is standard
 */
export function isStandardSyntaxDeclaration(decl /*: Object */) /*: boolean */ {
  const prop = decl.prop;
  const parent = decl.parent;

  // Declarations belong in a declaration block

  if (parent.type === "root") {
    return false;
  }

  // Sass var (e.g. $var: x), nested list (e.g. $list: (x)) or nested map (e.g. $map: (key:value))
  if (prop[0] === "$") {
    return false;
  }

  // Less var (e.g. @var: x), but exclude variable interpolation (e.g. @{var})
  if (prop[0] === "@" && prop[1] !== "{") {
    return false;
  }

  // Sass nested properties (e.g. border: { style: solid; color: red; })
  if (
    parent.selector &&
    parent.selector[parent.selector.length - 1] === ":" &&
    parent.selector.substring(0, 2) !== "--"
  ) {
    return false;
  }

  return true;
}
