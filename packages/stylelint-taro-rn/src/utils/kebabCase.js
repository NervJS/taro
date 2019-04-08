export const kebabCase = string =>
  string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
