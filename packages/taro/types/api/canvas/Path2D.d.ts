// https://stackoverflow.com/questions/34109921/using-path2d-in-a-typescript-project-is-not-resolved
// Class
interface Path2D {
	addPath(path: Path2D, transform?: SVGMatrix);
	closePath(): void;
	moveTo(x: number, y: number): void;
	lineTo(x: number, y: number): void;
	bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
	quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
	arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
	arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
	/*ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;*/
	rect(x: number, y: number, w: number, h: number): void;
}

// Constructor
interface Path2DConstructor {
	new (): Path2D;
	new (d: string): Path2D;
	new (path: Path2D, fillRule?: string): Path2D;
	prototype: Path2D;
}
declare var Path2D: Path2DConstructor;

// Extend CanvasRenderingContext2D
interface CanvasRenderingContext2D {
	fill(path: Path2D): void;
	stroke(path: Path2D): void;
	clip(path: Path2D, fillRule?: string): void;
}
