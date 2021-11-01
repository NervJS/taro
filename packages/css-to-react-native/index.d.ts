export default function transform(css: string, options?: {
  parseMediaQueries?: boolean;
  scalable?: boolean;
}): { [selector: string]: unknown; }

export declare function transformCSS(rules: Array<any[]>, shorthandBlacklist?: Array<{ [key: string]: any }>): { [key: string]: any };
