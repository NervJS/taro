import { Features, transform } from 'lightningcss'
import { render } from 'sass'

import * as d from './declarations'
import { loadDiagnostic } from './diagnostics'
import { createResultsId, getRenderOptions, usePlugin } from './util'

import type { LegacyException, LegacyResult } from 'sass'

/**
 * The entrypoint of the Stencil Sass plugin
 *
 * This function creates & configures the plugin to be used by consuming Stencil projects
 *
 * For configuration details, please see the [GitHub README](https://github.com/ionic-team/stencil-sass).
 *
 * @param opts options to configure the plugin
 * @return the configured plugin
 */
export default function sassPlugin (opts: d.PluginOptions = {}): d.Plugin {
  return {
    name: 'sass',
    pluginType: 'css',
    /**
     * Performs the Sass file compilation
     * @param sourceText the contents of the Sass file to compile
     * @param fileName the name of the Sass file to compile
     * @param context a runtime context supplied by Stencil, providing access to the current configuration, an
     * in-memory FS, etc.
     * @returns the results of the Sass file compilation
     */
    transform (sourceText: string, fileName: string, context: d.PluginCtx): Promise<d.PluginTransformResults> {
      if (
        !usePlugin(fileName)
        || typeof sourceText !== 'string'
      ) {
        // @ts-ignore
        return null
      }

      const renderOpts = getRenderOptions(opts, sourceText, fileName, context)
      const results: d.PluginTransformResults = {
        id: createResultsId(fileName),
        dependencies: [],
      }

      if (sourceText.trim() === '') {
        results.code = ''
        return Promise.resolve(results)
      }

      return new Promise<d.PluginTransformResults>((resolve) => {
        try {
          // invoke sass' compiler at this point
          render(renderOpts, (err?: LegacyException, sassResult?: LegacyResult): void => {
            if (err) {
              loadDiagnostic(context, err, fileName)
              results.code = `/**  sass error${err && err.message ? ': ' + err.message : ''}  **/`
              resolve(results)
            } else if (sassResult) {
              results.dependencies = Array.from(sassResult.stats.includedFiles)
              results.code = sassResult.css.toString()
              results.code = transform({
                filename: fileName,
                code: Buffer.from(results.code),
                minify: true,
                sourceMap: false,
                include: Features.HexAlphaColors,
              }).code.toString()

              // write this css content to memory only so it can be referenced
              // later by other plugins (autoprefixer)
              // but no need to actually write to disk
              context.fs.writeFile(results.id!, results.code!, { inMemoryOnly: true }).then(() => {
                resolve(results)
              })
            }
          })
        } catch (e) {
          // who knows, just good to play it safe here
          const diagnostic: d.Diagnostic = {
            level: 'error',
            type: 'css',
            language: 'scss',
            header: 'sass error',
            messageText: e,
            lines: [],
          }
          context.diagnostics.push(diagnostic)

          results.code = `/**  sass error${e && e.message ? ': ' + e.message : ''}  **/`
          resolve(results)
        }
      })
    },
  }
}
