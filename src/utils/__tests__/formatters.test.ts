import { formatPrice, sanitizeHtml } from "../formatters";

describe("formatPrice", () => {
  it("should format the price with the currency sign", () => {
    expect(formatPrice(10, "USD")).toBe("$10.00");
    expect(formatPrice(20.5, "EUR")).toBe("€20.50");
    expect(formatPrice("30", "GBP")).toBe("£30.00");
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
