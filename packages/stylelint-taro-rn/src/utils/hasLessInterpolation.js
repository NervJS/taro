/**
 * Check whether a string has less interpolation
 *
 * @param {string} string
 * @return {boolean} If `true`, a string has less interpolation
 */
module.exports = function(string /*: string */) /*: boolean */ {
  if (/@{.+?}/.test(string)) {
    return true;
  }

  return false;
};
