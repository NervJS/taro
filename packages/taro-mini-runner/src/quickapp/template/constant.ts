
interface Location {
  line: number;
  column: number;
}

export interface NodeType {
  attributes: object;
  children: object[];
  isSelfClosing: boolean;
  location: Location;
  name: string;
  parent?: object;
}
