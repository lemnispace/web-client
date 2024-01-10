import clsx from "clsx";

export function stripTrailingClassNameValue(value: string) {
  // ignore if no trailing value
  if (!value.includes("-")) return value;
  // ignore complex values
  if (value.includes("-[") || value.startsWith("[")) return value;
  return value.split("-").slice(0, -1).join("-");
}

export function getUniqueClassNameValues<T>(
  values: T[],
  compare?: (a: T, b: T) => boolean
) {
  const c = compare ?? ((a: T, b: T) => a === b);
  return values.reduceRight((acc: T[], value: T) => {
    if (!acc.some((item) => c(item, value))) {
      acc.unshift(value);
    }
    return acc;
  }, []);
}

export function compareClassNames(a: string, b: string) {
  return stripTrailingClassNameValue(a) === stripTrailingClassNameValue(b);
}

/**
 * Takes a list of class names and returns a string of unique class names.
 * Class names are considered unique if they have the same prefix (ex: "mx-auto" and "mx-4" have the same prefix "mx").
 * @param classNames
 * @returns a single string of unique class names
 */
export function classNames(
  ...classNames: (string | undefined | boolean)[]
): string {
  const cls = classNames
    .filter((c) => typeof c === "string")
    .filter(Boolean) as string[];
  const newClassNames = getUniqueClassNameValues(
    cls.flatMap((c) => c.split(" ")),
    compareClassNames
  );
  return clsx(newClassNames);
}
