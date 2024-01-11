import "@testing-library/jest-dom";
import { render, within } from "@testing-library/react";
import ProductRating from "../ProductRating";

jest.mock("@/utils/text", () => ({
  PRODUCT_RATING_TEXT: {
    title: "test section",
    getShortDescription: jest
      .fn()
      .mockReturnValue("1234 out of 1234 test stars"),
  },
}));

describe("ProductRating", () => {
  it.each([
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
  ])(
    "renders the correct number of stars based on the rating",
    (rating, total) => {
      const { getAllByTestId } = render(
        <ProductRating rating={rating} outOf={total} />
      );
      const stars = getAllByTestId("star-icon");
      const grayedOutStars = getAllByTestId("gray-star-icon");
      expect(stars).toHaveLength(rating);
      expect(grayedOutStars).toHaveLength(total - rating);
    }
  );

  it("doesn't render greyed out stars if the rating is max", () => {
    const { queryByTestId, getAllByTestId } = render(
      <ProductRating rating={10} outOf={10} />
    );
    const stars = getAllByTestId("star-icon");
    const grayedOutStar = queryByTestId("gray-star-icon");
    expect(grayedOutStar).toBeNull();
    expect(stars).toHaveLength(10);
  });

  it("doesn't render filled stars if the rating is 0", () => {
    const { queryByTestId, getAllByTestId } = render(
      <ProductRating rating={0} outOf={10} />
    );
    const star = queryByTestId("star-icon");
    const grayedOutStars = getAllByTestId("gray-star-icon");
    expect(grayedOutStars).toHaveLength(10);
    expect(star).toBeNull();
  });

  it("throws an error if the rating is greater than the total or less than 0", () => {
    expect(() => render(<ProductRating rating={-1} outOf={5} />)).toThrow();
    expect(() => render(<ProductRating rating={6} outOf={5} />)).toThrow();
    expect(() => render(<ProductRating rating={0} outOf={0} />)).toThrow();
    expect(() => render(<ProductRating rating={3} outOf={-2} />)).toThrow();
  });
});
