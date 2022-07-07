/*
https://github.com/webpack/webpack/blob/main/declarations.d.ts

Copyright JS Foundation and other contributors

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/

declare module "webpack-sources" {
	export type MapOptions = { columns?: boolean; module?: boolean };

	export abstract class Source {
		size(): number;

		map(options?: MapOptions): Object;

		sourceAndMap(options?: MapOptions): {
			source: string | Buffer;
			map: Object;
		};

		updateHash(hash: any): void;

		source(): string | Buffer;

		buffer(): Buffer;
	}

	export class RawSource extends Source {
		constructor(source: string | Buffer, convertToString?: boolean);

		isBuffer(): boolean;
	}

	export class OriginalSource extends Source {
		constructor(source: string | Buffer, name: string);

		getName(): string;
	}

	export class ReplaceSource extends Source {
		constructor(source: Source, name?: string);

		replace(start: number, end: number, newValue: string, name?: string): void;
		insert(pos: number, newValue: string, name?: string): void;

		getName(): string;
		original(): string;
		getReplacements(): {
			start: number;
			end: number;
			content: string;
			insertIndex: number;
			name: string;
		}[];
	}

	export class SourceMapSource extends Source {
		constructor(
			source: string | Buffer,
			name: string,
			sourceMap: Object | string | Buffer,
			originalSource?: string | Buffer,
			innerSourceMap?: Object | string | Buffer,
			removeOriginalSource?: boolean
		);

		getArgsAsBuffers(): [
			Buffer,
			string,
			Buffer,
			Buffer | undefined,
			Buffer | undefined,
			boolean
		];
	}

	export class ConcatSource extends Source {
		constructor(...args: (string | Source)[]);

		getChildren(): Source[];

		add(item: string | Source): void;
		addAllSkipOptimizing(items: Source[]): void;
	}

	export class PrefixSource extends Source {
		constructor(prefix: string, source: string | Source);

		original(): Source;
		getPrefix(): string;
	}

	export class CachedSource extends Source {
		constructor(source: Source);
		constructor(source: Source | (() => Source), cachedData?: any);

		original(): Source;
		originalLazy(): Source | (() => Source);
		getCachedData(): any;
	}

	export class SizeOnlySource extends Source {
		constructor(size: number);
	}

	interface SourceLike {
		source(): string | Buffer;
	}

	export class CompatSource extends Source {
		constructor(sourceLike: SourceLike);

		static from(sourceLike: SourceLike): Source;
	}
}
