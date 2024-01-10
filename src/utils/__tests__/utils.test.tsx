import {
  classNames,
  compareClassNames,
  getUniqueClassNameValues,
  stripTrailingClassNameValue,
} from "@/utils";

describe("stripTrailingClassNameValue", () => {
  it.each([
    ["mx-auto", "mx"],
    ["max-w-7xl", "max-w"],
    ["sm:px-6", "sm:px"],
    ["lg:px-8", "lg:px"],
    ["px-4", "px"],
    ["focus:outline-none", "focus:outline"],
    ["focus:outline", "focus:outline"],
    /*** doesn't strip complex values ***/
    [
      "px-[calc(theme(spacing[3.5])-1px)]",
      "px-[calc(theme(spacing[3.5])-1px)]",
    ],
    [
      "sm:px-[calc(theme(spacing.3)-1px)]",
      "sm:px-[calc(theme(spacing.3)-1px)]",
    ],
    ["[&>[data-slot=icon]]:-mx-0.5", "[&>[data-slot=icon]]:-mx-0.5"],
    ["dark:bg-[--btn-bg]", "dark:bg-[--btn-bg]"],
    [
      "dark:data-[hover]:[--btn-icon:theme(colors.zinc.400)]",
      "dark:data-[hover]:[--btn-icon:theme(colors.zinc.400)]",
    ],
    ["before:bg-[--btn-bg]", "before:bg-[--btn-bg]"],
  ])("should strip trailing value from class name", (className, expected) => {
    const result = stripTrailingClassNameValue(className);
    expect(result).toEqual(expected);
  });
});

describe("compareClassNames", () => {
  it.each<[string, string, boolean]>([
    ["mx-auto", "mx-w", true],
    ["max-w-7xl", "max-w-3xl", true],
    ["sm:px-6", "sm:px-8", true],
    ["lg:px-8", "lg:px-4", true],
    ["lg:px-8", "sm:px-8", false],
    ["px-4", "md:px-8", false],
    ["focus:outline-none", "focus:outline", true],
    [
      "px-[calc(theme(spacing[3.5])-1px)]",
      "px-[calc(theme(spacing[3.5])-1px)]",
      true,
    ],
    [
      "px-[calc(theme(spacing[3.6])-1px)]",
      "px-[calc(theme(spacing[3.5])-1px)]",
      false,
    ],
    [
      "sm:px-[calc(theme(spacing.3)-1px)]",
      "sm:px-[calc(theme(spacing.3)-2px)]",
      false,
    ],
    ["[&>[data-slot=icon]]:-mx-0.5", "[&>[data-slot=icon]]:-mx-0.5", true],
    ["dark:bg-[--btn-bg]", "dark:bg-[--btn-bg]", true],
    [
      "dark:data-[hover]:[--btn-icon:theme(colors.zinc.400)]",
      "dark:data-[hover]:[--btn-icon:theme(colors.zinc.400)]",
      true,
    ],
    ["before:bg-[--btn-bg]", "before:bg-[--btn-bg]", true],
    ["before:bg-[--btn-sm]", "before:bg-[--btn-bg]", false],
  ])("should strip trailing value from class name", (c1, c2, expected) => {
    const result = compareClassNames(c1, c2);
    if (result !== expected) {
      console.log("Failed to match:", c1, c2, expected, result);
    }
    expect(result).toEqual(expected);
  });
});

describe("classNames", () => {
  it("should return a string of the class names with duplicates removed", () => {
    const classNamesValues = [
      0,
      "relative isolate inline-flex items-center justify-center gap-x-2 rounded-lg border text-base/8 font-semibold",
      "isolate inline-flex items-center justify-between gap-x-4 rounded-lg border text-base/6 font-semibold",
      "border-white",
      "",
      "border-transparent bg-[--btn-border]",
      true,
      "dark:bg-[--btn-bg]",
      7,
      "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-[--btn-bg]",
      "before:shadow",
      "dark:before:hidden",
      "dark:border-white/5",
      false,
      undefined,
      null,
      "after:absolute after:inset-0 after:-z-10 after:rounded-[calc(theme(borderRadius.lg)-1px)]",
      "after:shadow-[shadow:inset_0_1px_theme(colors.white/15%)]",
      "after:data-[active]:bg-[--btn-hover-overlay] after:data-[hover]:bg-[--btn-hover-overlay]",
      "dark:after:-inset-px dark:after:rounded-lg",
      "before:data-[disabled]:shadow-none after:data-[disabled]:shadow-none",
      "dark:text-white dark:[--btn-hover-overlay:theme(colors.white/5%)] dark:[--btn-bg:theme(colors.zinc.800)]",
      "dark:text-black dark:[--btn-hover-overlay:theme(colors.white/5%)] dark:[--btn-bg:theme(colors.zinc.800)]",
      "mx-auto max-w-3xl mx-auto px-4 max-w-7xl sm:px-6 lg:px-8 px-8",
    ];
    const expected = [
      "relative isolate inline-flex items-center justify-between gap-x-4 rounded-lg text-base/6 font-semibold",
      "border-transparent bg-[--btn-border]",
      "dark:bg-[--btn-bg]",
      "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-[--btn-bg]",
      "before:shadow",
      "dark:before:hidden",
      "dark:border-white/5",
      "after:absolute after:inset-0 after:-z-10 after:rounded-[calc(theme(borderRadius.lg)-1px)]",
      "after:shadow-[shadow:inset_0_1px_theme(colors.white/15%)]",
      "after:data-[active]:bg-[--btn-hover-overlay] after:data-[hover]:bg-[--btn-hover-overlay]",
      "dark:after:-inset-px dark:after:rounded-lg",
      "before:data-[disabled]:shadow-none after:data-[disabled]:shadow-none",
      "dark:text-black dark:[--btn-hover-overlay:theme(colors.white/5%)] dark:[--btn-bg:theme(colors.zinc.800)]",
      "mx-auto max-w-7xl sm:px-6 lg:px-8 px-8",
    ]
      .join(" ")
      .split(" ");
    const res = classNames(...(classNamesValues as any));
    const resArr = res.split(" ");
    resArr.forEach((c, i) => {
      expect(c).toEqual(expected[i]);
    });
    expect(resArr).toHaveLength(expected.length);
  });
});

// test getUniqueClassNameValues
describe("getUniqueClassNameValues", () => {
  it("should return a list of unique class names", () => {
    // expect unique class names to use strict equality when no compare function is provided
    expect(
      getUniqueClassNameValues(["mx-auto", "mx-w-3xl", "mx-auto", "mx-w-7xl"])
    ).toEqual(["mx-w-3xl", "mx-auto", "mx-w-7xl"]);
    // expect unique class names to be in expected order, last class name wins
    expect(
      getUniqueClassNameValues(
        ["px-0", "mx-auto", "mx-w-3xl", "mx-auto", "mx-w-7xl", "px-4", "px-8"],
        compareClassNames
      )
    ).toEqual(["mx-auto", "mx-w-7xl", "px-8"]);
  });
});
