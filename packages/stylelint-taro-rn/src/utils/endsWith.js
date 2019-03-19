export const endsWith = (str, suffix) =>
  str.indexOf(suffix, str.length - suffix.length) !== -1;
