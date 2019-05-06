export default function transform(css: string, options?: {
	parseMediaQueries?: boolean;
}): { [selector: string]: unknown; };
