export type CssUrlReplacer = (
  url: string,
  importer?: string,
) => string | Promise<string>
