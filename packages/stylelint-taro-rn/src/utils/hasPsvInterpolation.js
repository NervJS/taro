/**
 * Check whether a string has postcss-simple-vars interpolation
 */
module.exports = function(string /*: string */) /*: boolean */ {
  if (/\$\(.+?\)/.test(string)) {
    return true;
  }

  return false;
};
