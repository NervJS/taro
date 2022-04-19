export function convertStyle (style?: string): Record<string, string> | undefined {
  if (style) {
    const regex = /([\w-]*)\s*:\s*([^;]*)/g
    const properties: Record<string, string> = {}
    let match
    while ((match = regex.exec(style))) properties[`${match[1]}`] = match[2].trim()
    return properties
  }
}
