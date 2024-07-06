import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { useImgSrc } from "../useImgSrc";

const MockComponent = (props: {
  handleUpdateRef: Record<"current", any>;
  initialSrc: any;
}) => {
  const [src, updateImgSrc] = useImgSrc(props.initialSrc);
  props.handleUpdateRef.current = updateImgSrc;
  return <div>{src}</div>;
};

describe("useImgSrc", () => {
  const initialImgSrc = "initial-image.jpg";
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should return the initial image source", () => {
    const updateSrcRef = {
      current: null,
    };
    const { getByText } = render(
      <MockComponent
        handleUpdateRef={updateSrcRef}
        initialSrc={initialImgSrc}
      />
    );
    expect(getByText(initialImgSrc)).toBeInTheDocument();
  });

  it("should update the image source when the initial image changes", () => {
    const updateSrcRef = {
      current: null,
    };
    const { getByText, queryByText, rerender } = render(
      <MockComponent
        handleUpdateRef={updateSrcRef}
        initialSrc={initialImgSrc}
      />
    );
    expect(getByText(initialImgSrc)).toBeInTheDocument();

    rerender(
      <MockComponent
        handleUpdateRef={updateSrcRef}
        initialSrc="something-new"
      />
    );

    expect(getByText("something-new")).toBeInTheDocument();
    expect(queryByText(initialImgSrc)).toBeNull();
  });

  it("should be able to handle Uint8Array data", () => {
    global.URL.createObjectURL = jest.fn(() => "generated-url");
    global.URL.revokeObjectURL = jest.fn();
    const updateSrcRef: { current: null | ((update: any) => void) } = {
      current: null,
    };
    const data = new Uint8Array([72, 101, 108, 108, 111, 33]);

    const { getByText } = render(
      <MockComponent
        handleUpdateRef={updateSrcRef}
        initialSrc={initialImgSrc}
      />
    );
    expect(getByText(initialImgSrc)).toBeInTheDocument();

    act(() => {
      updateSrcRef.current!(data);
    });
    expect(global.URL.revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(getByText("generated-url")).toBeInTheDocument();
  });

  it("should be able to handle ArrayBuffer data", () => {
    global.URL.createObjectURL = jest.fn(() => "generated-url");
    global.URL.revokeObjectURL = jest.fn();
    const updateSrcRef: { current: null | ((update: any) => void) } = {
      current: null,
    };
    const arrayBuffer = new Uint8Array([72, 101, 108, 108, 111, 33]).buffer;

    const { getByText } = render(
      <MockComponent handleUpdateRef={updateSrcRef} initialSrc={arrayBuffer} />
    );
    expect(getByText("generated-url")).toBeInTheDocument();
  });

  it("should be able to handle Blob data", () => {
    global.URL.createObjectURL = jest.fn(() => "generated-url");
    global.URL.revokeObjectURL = jest.fn();
    const updateSrcRef: { current: null | ((update: any) => void) } = {
      current: null,
    };
    const blob = new Blob(["image data"], { type: "image/jpeg" });

    const { getByText } = render(
      <MockComponent handleUpdateRef={updateSrcRef} initialSrc={blob} />
    );
    expect(getByText("generated-url")).toBeInTheDocument();
  });

  it("should be able to handle URL data", () => {
    const updateSrcRef: { current: null | ((update: any) => void) } = {
      current: null,
    };
    const url = new URL("https://test-example.com");
    const { getByText } = render(
      <MockComponent handleUpdateRef={updateSrcRef} initialSrc={url} />
    );
    expect(getByText("https://test-example.com/")).toBeInTheDocument();
  });

  it("should be able to handle ImageData data", () => {
    class MockImageData {
      data: any;
      constructor(data: any) {
        this.data = data;
      }
    }
    global.URL.createObjectURL = jest.fn(() => "generated-url");
    global.URL.revokeObjectURL = jest.fn();
    global.ImageData = global.ImageData || (MockImageData as any);
    const updateSrcRef: { current: null | ((update: any) => void) } = {
      current: null,
    };
    const imageData = new ImageData(100, 100);
    const { getByText } = render(
      <MockComponent handleUpdateRef={updateSrcRef} initialSrc={imageData} />
    );
    expect(getByText("generated-url")).toBeInTheDocument();
  });

  it("should throw an error for invalid image source", () => {
    const originalError = console.error;
    console.error = jest.fn();
    global.URL.createObjectURL = jest.fn(() => "generated-url");
    global.URL.revokeObjectURL = jest.fn();
    const updateSrcRef: { current: null | ((update: any) => void) } = {
      current: null,
    };

    const { getByText, rerender } = render(
      <MockComponent handleUpdateRef={updateSrcRef} initialSrc={"hello"} />
    );
    expect(getByText("hello")).toBeInTheDocument();
    expect(() => {
      rerender(
        <MockComponent
          handleUpdateRef={updateSrcRef}
          initialSrc={null as any}
        />
      );
    }).toThrow("Invalid image source");
    console.error = originalError;
  });
});
