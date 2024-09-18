export * from '@stencil/core/internal'

export interface PluginOptions {
  /**
   * Path to a file to compile.
   */
  file?: string

  /**
   * A string to pass to compile.
   *
   * It is recommended that you use `includePaths` in conjunction with this so that sass can find files when using the @import directive.
   */
  data?: string

  /**
   * Handles when the @import directive is encountered.
   *
   * A custom importer allows extension of the sass engine in both a synchronous and asynchronous manner.
   */
  importer?: Importer | Importer[]

  /**
   * Holds a collection of custom functions that may be invoked by the sass files being compiled.
   */
  functions?: { [key: string]: (...args: any[]) => any }

  /**
   * An array of paths that should be looked in to attempt to resolve your @import declarations.
   * When using `data`, it is recommended that you use this.
   */
  includePaths?: string[]

  /**
   * Used for Sass variables, mixins and functions files that do not contain any CSS.
   * This config is custom to `@stencil/sass`.
   */
  injectGlobalPaths?: string[]

  /**
   * Enable Sass Indented Syntax for parsing the data string or file.
   */
  indentedSyntax?: boolean

  /**
   * Used to determine whether to use space or tab character for indentation.
   */
  indentType?: 'space' | 'tab'

  /**
   * Used to determine the number of spaces or tabs to be used for indentation.
   */
  indentWidth?: number

  /**
   * Used to determine which sequence to use for line breaks.
   */
  linefeed?: 'cr' | 'crlf' | 'lf' | 'lfcr'

  /**
   * Disable the inclusion of source map information in the output file.
   */
  omitSourceMapUrl?: boolean

  /**
   * Specify the intended location of the output file.
   * Strongly recommended when outputting source maps so that they can properly refer back to their intended files.
   */
  outFile?: string

  /**
   * Determines the output format of the final CSS style.
   */
  outputStyle?: 'compressed' | 'expanded'

  /**
   * Enables the outputting of a source map.
   */
  sourceMap?: boolean | string

  /**
   * Includes the contents in the source map information.
   */
  sourceMapContents?: boolean

  /**
   * Embeds the source map as a data URI.
   */
  sourceMapEmbed?: boolean

  /**
   * The value will be emitted as `sourceRoot` in the source map information.
   */
  sourceMapRoot?: string
}

export type ImporterReturnType = { file: string } | { contents: string } | Error | null;

export type Importer = (
  url: string,
  prev: string,
  done: (data: ImporterReturnType) => void,
) => ImporterReturnType | void
