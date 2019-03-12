export default function exportNameOnly () {
  const emptyMap = { mappings: '' }
  return {
    name: 'export-name-only',
    renderChunk (code, chunk, options) {
      chunk.exports.splice(chunk.exports.indexOf('default'), 1)
      return {
        code: `module.exports = new Set(${JSON.stringify(chunk.exports)})`,
        map: emptyMap
      }
    }
  }
}
