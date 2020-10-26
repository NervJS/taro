export default function exportNameOnly () {
  const emptyMap = { mappings: '' }
  return {
    name: 'export-name-only',
    renderChunk (code, chunk) {
      const pos = chunk.exports.indexOf('default')
      if (pos > -1) {
        chunk.exports.splice(pos, 1)
      }
      return {
        code: `module.exports = new Set(${JSON.stringify(chunk.exports)})`,
        map: emptyMap
      }
    }
  }
}
