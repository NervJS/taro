export const parseResponseHeaders = (rawHeaders: string) => {
  const headers: Record<string, string> = Object.create(null)
  for (const line of rawHeaders.split(/\r?\n/)) {
    const separator = line.indexOf(':')
    if (separator <= 0) continue
    headers[line.slice(0, separator).trim()] = line.slice(separator + 1).trim()
  }
  return headers
}
