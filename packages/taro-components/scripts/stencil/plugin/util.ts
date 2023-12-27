import * as path from 'path'
import { LegacyAsyncImporter, LegacyImporterResult } from 'sass'

import * as d from './declarations'

import type { LegacyOptions } from 'sass/types/legacy/options'

/**
 * Determine if the Sass plugin should be applied, based on the provided `fileName`
 *
 * @param fileName the name of a file to potentially transform
 * @returns `true` if the name of the file ends with a sass extension (.scss, .sass), case insensitive. `false`
 * otherwise
 */
export function usePlugin (fileName: string): boolean {
  if (typeof fileName === 'string') {
    return /(\.scss|\.sass)$/i.test(fileName)
  }
  return false
}

/**
 * Build a list of options to provide to Sass' `render` API.
 * @param opts the options provided to the plugin within a Stencil configuration file
 * @param sourceText the source text of the file to transform
 * @param fileName the name of the file to transform
 * @param context the runtime context being used by the plugin
 * @returns the generated/normalized plugin options
 */
export function getRenderOptions (
  opts: d.PluginOptions,
  sourceText: string,
  fileName: string,
  context: d.PluginCtx,
): LegacyOptions<'async'> {
  // Create a copy of the original sass config, so we don't modify the one provided.
  // Explicitly add `data` (as it's a required field) to be the source text
  const renderOpts: LegacyOptions<'async'> = { ...opts, data: sourceText }

  // activate indented syntax if the file extension is .sass.
  // this needs to be set prior to injecting global sass (as the syntax affects the import terminator)
  renderOpts.indentedSyntax = /(\.sass)$/i.test(fileName)

  // create a copy of the original path config, so we don't modify the one provided
  renderOpts.includePaths = Array.isArray(opts.includePaths) ? opts.includePaths.slice() : []
  // add the directory of the source file to includePaths
  renderOpts.includePaths.push(path.dirname(fileName))
  // ensure each of the includePaths is an absolute path
  renderOpts.includePaths = renderOpts.includePaths.map((includePath) => {
    if (path.isAbsolute(includePath)) {
      return includePath
    }
    // if it's a relative path then resolve it with the project's root directory
    return path.resolve(context.config.rootDir!, includePath)
  })

  // create a copy of the original global config of paths to inject, so we don't modify the one provided.
  // this is a Stencil-specific configuration, and not a part of the Sass API.
  const injectGlobalPaths: string[] = Array.isArray(opts.injectGlobalPaths) ? opts.injectGlobalPaths.slice() : []

  if (injectGlobalPaths.length > 0) {
    // Automatically inject each of these paths into the source text.
    // This is accomplished by prepending the global stylesheets to the file being processed.
    const injectText = injectGlobalPaths
      .map((injectGlobalPath) => {
        if (!path.isAbsolute(injectGlobalPath)) {
          // convert any relative paths to absolute paths relative to the project root
          if (context.sys && typeof context.sys.normalizePath === 'function') {
            // context.sys.normalizePath added in stencil 1.11.0
            injectGlobalPath = context.sys.normalizePath(path.join(context.config.rootDir!, injectGlobalPath))
          } else {
            // TODO, eventually remove normalizePath() from @stencil/sass
            injectGlobalPath = normalizePath(path.join(context.config.rootDir!, injectGlobalPath))
          }
        }

        const importTerminator = renderOpts.indentedSyntax ? '\n' : ';'

        return `@import "${injectGlobalPath}"${importTerminator}`
      })
      .join('')

    renderOpts.data = injectText + renderOpts.data
  }

  // remove non-standard sass option
  delete (renderOpts as any).injectGlobalPaths

  // the "file" config option is not valid here
  delete renderOpts.file

  if (context.sys && typeof context.sys.resolveModuleId === 'function') {
    const importers: LegacyAsyncImporter[] = []
    if (typeof renderOpts.importer === 'function') {
      importers.push(renderOpts.importer)
    } else if (Array.isArray(renderOpts.importer)) {
      importers.push(...renderOpts.importer)
    }

    /**
     * Create a handler for loading files when a `@use` or `@import` rule is encountered for loading a path prefixed
     * with a tilde (~). Such imports indicate that the module should be resolved from the `node_modules` directory.
     * @param url the path to the module to load
     * @param _prev Unused - typically, this is a string identifying the stylesheet that contained the @use or @import.
     * @param done a callback to return the path to the resolved path
     */
    const importer: LegacyAsyncImporter = (
      url: string,
      _prev: string,
      done: (data: LegacyImporterResult) => void,
    ): void => {
      if (typeof url === 'string') {
        if (url.startsWith('~')) {
          try {
            const m = getModuleId(url)

            if (m.moduleId) {
              context.sys
                .resolveModuleId?.({
                  moduleId: m.moduleId,
                  containingFile: m.filePath,
                })
                .then((resolved: d.ResolveModuleIdResults) => {
                  if (resolved.pkgDirPath) {
                    const resolvedPath = path.join(resolved.pkgDirPath, m.filePath!)
                    done({
                      file: context.sys.normalizePath(resolvedPath),
                    })
                  } else {
                    done(null)
                  }
                })
                .catch((err) => {
                  done(err)
                })

              return
            }
          } catch (e) {
            done(e)
          }
        }
      }
      done(null)
    }
    importers.push(importer)

    renderOpts.importer = importers
  }

  return renderOpts
}

/**
 * Replaces the extension with the provided file name with 'css'.
 *
 * If the file does not have an extension, no transformation will be applied.
 *
 * @param fileName the name of the file whose extension should be replaced
 * @returns the updated filename, using 'css' as the file extension
 */
export function createResultsId (fileName: string): string {
  // create what the new path is post transform (.css)
  const pathParts = fileName.split('.')
  pathParts[pathParts.length - 1] = 'css'
  return pathParts.join('.')
}

export function normalizePath (str: string) {
  // Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
  // https://github.com/sindresorhus/slash MIT
  // By Sindre Sorhus
  if (typeof str !== 'string') {
    throw new Error(`invalid path to normalize`)
  }
  str = str.trim()

  if (EXTENDED_PATH_REGEX.test(str) || NON_ASCII_REGEX.test(str)) {
    return str
  }

  str = str.replace(SLASH_REGEX, '/')

  // always remove the trailing /
  // this makes our file cache look ups consistent
  if (str.charAt(str.length - 1) === '/') {
    const colonIndex = str.indexOf(':')
    if (colonIndex > -1) {
      if (colonIndex < str.length - 2) {
        str = str.substring(0, str.length - 1)
      }
    } else if (str.length > 1) {
      str = str.substring(0, str.length - 1)
    }
  }

  return str
}

/**
 * Split an import path into a module ID and file path
 * @param orgImport the import path to split
 * @returns a module id and the filepath under that module id
 */
export function getModuleId (orgImport: string): { moduleId?: string, filePath?: string } {
  if (orgImport.startsWith('~')) {
    orgImport = orgImport.substring(1)
  }
  const split = orgImport.split('/')
  const m: ReturnType<typeof getModuleId> = {}

  if (orgImport.startsWith('@') && split.length > 1) {
    // we have a scoped package, it's module includes the word following the first slash
    m.moduleId = split.slice(0, 2).join('/')
    m.filePath = split.slice(2).join('/')
  } else {
    m.moduleId = split[0]
    m.filePath = split.slice(1).join('/')
  }

  return m
}

const EXTENDED_PATH_REGEX = /^\\\\\?\\/
const NON_ASCII_REGEX = /[^\x00-\x80]+/ // eslint-disable-line no-control-regex
const SLASH_REGEX = /\\/g
