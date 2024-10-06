export type Edge<T> = {
  cursor: string;
  node: T;
};

export type Edges<T> = {
  edges: T[];
};
