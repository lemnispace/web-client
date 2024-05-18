import { toFloat, toInt } from "../parsers";

describe("toInt", () => {
  test.each([
    ["10", 10],
    ["100", 100],
    ["hello", undefined],
    ["3.14", 3],
    ["", undefined],
    [0, 0],
    [10, 10],
    ["0", 0],
    ["0.5", 0],
    [NaN, undefined],
    [Infinity, undefined],
    [-Infinity, undefined],
    [null, undefined],
    [BigInt(10), 10],
    ["0xedcba9876543210", 0], // behaves like parseInt
    [0xedcba9876543210, 1070935975390360000], // behaves like parseInt
    ["45.3sadfsfsasfasbss", 45], // behaves like parseInt
    ["-45.3sadfsfsasfasbss", -45], // behaves like parseInt
    ["-45.3", -45],
    ["dsf4", undefined], // behaves like parseInt
  ])(
    "should convert %p to a an integer if it's valid, undefined otherwise",
    (value, expected) => {
      expect(toInt(value as any)).toBe(expected);
    }
  );
});

describe("toFloat", () => {
  test.each([
    ["3.14", 3.14],
    ["2.718", 2.718],
    ["hello", undefined],
    ["10", 10.0],
    ["", undefined],
    [0, 0],
    [10.43, 10.43],
    ["0", 0],
    ["0.0", 0],
    ["0.5", 0.5],
    [NaN, undefined],
    [Infinity, undefined],
    [-Infinity, undefined],
    [null, undefined],
    [BigInt(10), 10.0],
    ["0xedcba9876543210", 0], // behaves like parseFloat
    [0xedcba9876543210, 1070935975390360000], // behaves like parseFloat
    ["45.3sadfsfsasfasbss", 45.3], // behaves like parseFloat
    ["-45.3sadfsfsasfasbss", -45.3], // behaves like parseFloat
    ["-45.3", -45.3],
    ["dsf4", undefined], // behaves like parseFloat
  ])(
    "should convert %p to a float if it's valid, undefined otherwise",
    (value, expected) => {
      expect(toFloat(value as any)).toBe(expected);
    }
  );
});
