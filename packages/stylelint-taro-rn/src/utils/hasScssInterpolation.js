/**
 * Check whether a string has scss interpolation
 */
module.exports = function(string /*: string */) /*: boolean */ {
  if (/#{.+?}/.test(string)) {
    return true;
  }

  return false;
};
