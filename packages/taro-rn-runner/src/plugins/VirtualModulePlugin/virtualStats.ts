/**
 * Used to cache a stats object for the virtual file.
 * Extracted from the `mock-fs` package.
 *
 * @author Tim Schaub http://tschaub.net/
 * @link https://github.com/tschaub/mock-fs/blob/master/lib/binding.js
 * @link https://github.com/tschaub/mock-fs/blob/master/license.md
 */

import * as constants from 'constants'

export default class VirtualStats {
  mode: number
  /**
   * Create a new stats object.
   * @param {Object} config Stats properties.
   * @constructor
   */
  constructor (config) {
    for (const key in config) {
      if (!config.hasOwnProperty(key)) {
        continue
      }
      this[key] = config[key]
    }
  }

  /**
   * Check if mode indicates property.
   * @param {number} property Property to check.
   * @return {boolean} Property matches mode.
   */
  _checkModeProperty(property) {
    return ((this.mode & constants.S_IFMT) === property)
  }


  /**
   * @return {Boolean} Is a directory.
   */
  isDirectory() {
    return this._checkModeProperty(constants.S_IFDIR)
  }


  /**
   * @return {Boolean} Is a regular file.
   */
  isFile() {
    return this._checkModeProperty(constants.S_IFREG)
  }


  /**
   * @return {Boolean} Is a block device.
   */
  isBlockDevice() {
    return this._checkModeProperty(constants.S_IFBLK)
  }


  /**
   * @return {Boolean} Is a character device.
   */
  isCharacterDevice() {
    return this._checkModeProperty(constants.S_IFCHR)
  }


  /**
   * @return {Boolean} Is a symbolic link.
   */
  isSymbolicLink() {
    return this._checkModeProperty(constants.S_IFLNK)
  }


  /**
   * @return {Boolean} Is a named pipe.
   */
  isFIFO() {
    return this._checkModeProperty(constants.S_IFIFO)
  }


  /**
   * @return {Boolean} Is a socket.
   */
  isSocket() {
    return this._checkModeProperty(constants.S_IFSOCK)
  }
}
