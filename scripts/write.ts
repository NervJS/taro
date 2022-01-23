import * as fs from "fs"
import * as path from "path"

export default function writeFile (route: string, text: string = '') {
  if (!route || !text) return
  try {
    fs.writeFileSync(route, text, {})
  } catch (error) {
    const routepath = path.parse(route)
    fs.mkdirSync(routepath.dir, { recursive: true })
    fs.writeFileSync(route, text, {})
  }
}
