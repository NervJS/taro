export function omit<
  T extends Record<string, unknown> = Record<string, any>,
  P extends string = ''
> (obj: T = ({} as T), fields: P[] = []): Omit<T, P> {
  const shallow = { ...obj }
  fields.forEach((key) => {
    delete shallow[key]
  })
  return shallow
}
