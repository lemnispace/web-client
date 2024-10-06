import { CurrencyCode } from "@/lib/shopify/types/shopifyCurrencyCodes";
import { formatPrice, sanitizeHtml, toKebabCase } from "../formatters";

describe("formatPrice", () => {
  it("should format the price with the currency sign", () => {
    expect(formatPrice(10, CurrencyCode.USD)).toBe("$10.00");
    expect(formatPrice(20.5, CurrencyCode.EUR)).toBe("€20.50");
    expect(formatPrice("30", CurrencyCode.GBP)).toBe("£30.00");
  });
});

describe("sanitizeHtml", () => {
  it("should sanitize the given HTML string", () => {
    const html = "<script>alert('Hello, World!');</script>";
    const sanitizedHtml = sanitizeHtml(html);
    expect(sanitizedHtml).toBe("");
  });

  it("should preserve safe HTML tags", () => {
    const html = "<p>Hello, <strong>World!</strong></p>";
    const sanitizedHtml = sanitizeHtml(html);
    expect(sanitizedHtml).toBe("<p>Hello, <strong>World!</strong></p>");
  });
});

test("toKebabCase", () => {
  expect(toKebabCase("HelloWorld")).toBe("hello-world");
  expect(toKebabCase("helloWorld")).toBe("hello-world");
  expect(toKebabCase("hello world")).toBe("hello-world");
  expect(toKebabCase("hello   world")).toBe("hello-world");
  expect(toKebabCase("hello   World")).toBe("hello-world");
  expect(toKebabCase("hello   World  ")).toBe("hello-world");
  expect(toKebabCase("  hello   World  ")).toBe("hello-world");
  expect(toKebabCase("  hello   World  ")).toBe("hello-world");
  expect(toKebabCase("  hello   World  ")).toBe("hello-world");
  expect(toKebabCase("  hello   World  ")).toBe("hello-world");
  expect(toKebabCase("  hello   World  ")).toBe("hello-world");
  expect(toKebabCase("  hello   World  ")).toBe("hello-world");
  expect(toKebabCase("  hello   World  ")).toBe("hello-world");
  expect(toKebabCase("  hello   World  ")).toBe("hello-world");
  expect(toKebabCase("  hello   World  ")).toBe("hello-world");
  expect(toKebabCase("  hello   World  ")).toBe("hello-world");
  expect(toKebabCase("  hello   World  ")).toBe("hello-world");
  expect(toKebabCase("  hello   World  ")).toBe("hello-world");
  expect(toKebabCase("  hello   World  ")).toBe("hello-world");
  expect(toKebabCase("  hello   World  ")).toBe("hello-world");
  expect(toKebabCase("  hello   World  ")).toBe("hello-world");
  expect(toKebabCase("  hello   World  ")).toBe("hello-world");
  expect(toKebabCase("  hello   World  ")).toBe("hello-world");
  expect(toKebabCase("  hello   World  ")).toBe("hello-world");
  // no effect on snake_case
  expect(toKebabCase("hello_world")).toBe("hello_world");
});
