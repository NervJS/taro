const pages = new Map<string, any>()
export function setPageById (inst: any, id: string) {
  pages.set(id, inst)
}

export function getPageById (id: string): any {
  return pages.get(id)
}

export function removePageById (id: string) {
  pages.delete(id)
}
