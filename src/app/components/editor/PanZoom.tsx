"use client";
import useMediaQuery from "@/utils/hooks/useMediaQuery";
import React, { useEffect, useRef } from "react";
import {
  ReactZoomPanPinchContentRef,
  ReactZoomPanPinchProps,
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";

interface PanZoomProps
  extends Omit<ReactZoomPanPinchProps, "pinch" | "initialScale"> {
  children: React.ReactElement;
  wrapperStyle?: React.CSSProperties;
  controlsRef?: React.MutableRefObject<ReactZoomPanPinchContentRef | null>;
}

const getInitialScale = (
  wrapper: HTMLElement,
  child: HTMLElement,
  defaultScale = 1
) => {
  const PADDING = 40;
  const childBounds = child.getBoundingClientRect();
  const wrapperBounds = wrapper.getBoundingClientRect();
  const scaleX = (wrapperBounds.width - PADDING) / childBounds.width;
  const scaleY = (wrapperBounds.height - PADDING) / childBounds.height;
  // ensures no negative scale
  return Math.min(scaleX, scaleY, defaultScale);
};

const PanZoom: React.FC<PanZoomProps> = ({
  children,
  wheel,
  panning,
  doubleClick,
  zoomAnimation,
  alignmentAnimation,
  velocityAnimation,
  wrapperStyle,
  disabled,
  controlsRef,
  ...props
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const childRef = useRef<HTMLElement | null>(null);

  const handleInit = (ref: ReactZoomPanPinchRef) => {
    if (controlsRef) {
      controlsRef.current = ref;
    }

    if (childRef.current && ref.instance.wrapperComponent) {
      const scale = getInitialScale(
        ref.instance.wrapperComponent,
        childRef.current
      );
      ref.zoomToElement(childRef.current, scale, 0);
    }
  };

  useEffect(() => {
    if (isMobile && controlsRef?.current) {
      controlsRef.current.resetTransform();
    }
  }, [isMobile, controlsRef]);

  // Clone the child element and pass the ref
  const childWithRef =
    children && React.cloneElement(children, { ref: childRef });

  return (
    <TransformWrapper
      centerOnInit
      limitToBounds
      minScale={0.25}
      maxScale={3}
      initialScale={1}
      disabled={isMobile || disabled}
      {...props}
      onInit={handleInit}
      wheel={{
        step: 0.1,
        smoothStep: 0.002,
        activationKeys: ["Control", "Alt", "Meta", "Shift"],
        ...wheel,
      }}
      panning={{
        velocityDisabled: true,
        activationKeys: ["Control", "Alt", "Meta", "Shift"],
        ...panning,
      }}
      pinch={{ disabled: true }}
      doubleClick={{ disabled: true, ...doubleClick }}
      zoomAnimation={{
        disabled: false,
        size: 0.3,
        animationTime: 200,
        ...zoomAnimation,
      }}
      alignmentAnimation={{
        disabled: false,
        sizeX: 100,
        sizeY: 100,
        animationTime: 200,
        ...alignmentAnimation,
      }}
      velocityAnimation={{ disabled: true, ...velocityAnimation }}
    >
      <TransformComponent
        wrapperStyle={{
          width: "100%",
          height: "100%",
          maxHeight: "100%",
          overflow: isMobile ? "auto" : "hidden",
          ...wrapperStyle,
        }}
      >
        {childWithRef}
      </TransformComponent>
    </TransformWrapper>
  );
};

export default PanZoom;
