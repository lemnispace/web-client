export type RequireFields<T, K extends keyof T> = T & {
  [P in K]-?: NonNullable<T[P]>;
};

export type Nullable<T> = T | null;
