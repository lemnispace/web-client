import React, { useId } from "react";

interface LinearGradientIconProps {
  // children must be svg element
  children: React.ReactElement;
  fromColor: string;
  toColor: string;
  direction?:
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
}

const GradientIcon = React.forwardRef<SVGSVGElement, LinearGradientIconProps>(
  function GradientIcon(
    { children, fromColor, toColor, direction = "top-left" },
    ref
  ) {
    const getGradientDirection = () => {
      switch (direction) {
        case "left":
          return { x1: "0%", y1: "0%", x2: "100%", y2: "0%" };
        case "right":
          return { x1: "100%", y1: "0%", x2: "0%", y2: "0%" };
        case "top":
          return { x1: "0%", y1: "0%", x2: "0%", y2: "100%" };
        case "bottom":
          return { x1: "0%", y1: "100%", x2: "0%", y2: "0%" };
        case "top-right":
          return { x1: "0%", y1: "0%", x2: "100%", y2: "100%" };
        case "bottom-left":
          return { x1: "100%", y1: "100%", x2: "0%", y2: "0%" };
        case "bottom-right":
          return { x1: "100%", y1: "0%", x2: "0%", y2: "100%" };
        default:
          return { x1: "0%", y1: "0%", x2: "100%", y2: "100%" }; // top-left
      }
    };

    const gradientId = useId();
    const { x1, y1, x2, y2 } = getGradientDirection();

    return (
      <svg {...children.props} ref={ref}>
        <defs>
          <linearGradient id={gradientId} x1={x1} y1={y1} x2={x2} y2={y2}>
            <stop
              offset="0%"
              style={{ stopColor: fromColor, stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: toColor, stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>

        {React.cloneElement(
          children,
          {
            ...children.props,
            style: { ...children.props?.style, stroke: `url(#${gradientId})` },
          },
          children.props?.children
        )}
      </svg>
    );
  }
);

export default GradientIcon;
