"use client";
import { debounce } from "@/utils/debounce";
import useMediaQuery from "@/utils/hooks/useMediaQuery";
import React, { useCallback, useEffect, useRef } from "react";
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
  // ensures no negative scale and a maximum of scale 1
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
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  const calculateAndApplyScale = useCallback(() => {
    if (childRef.current && transformRef.current?.instance.wrapperComponent) {
      const scale = getInitialScale(
        transformRef.current.instance.wrapperComponent,
        childRef.current
      );

      transformRef.current.zoomToElement(childRef.current, scale, 0);
    }
  }, []);

  const handleInit = (ref: ReactZoomPanPinchRef) => {
    transformRef.current = ref;
    if (controlsRef) {
      controlsRef.current = ref;
    }
    calculateAndApplyScale();
  };

  useEffect(() => {
    if (isMobile && controlsRef?.current) {
      controlsRef.current.resetTransform();
    }
  }, [isMobile, controlsRef]);

  useEffect(() => {
    const debouncedHandleResize = debounce(() => {
      calculateAndApplyScale();
    }, 100);

    window.addEventListener("resize", debouncedHandleResize);
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [calculateAndApplyScale]);

  // Clone the child element and pass the ref
  const childWithRef =
    children && React.cloneElement(children, { ref: childRef });

  return (
    <TransformWrapper
      centerOnInit
      limitToBounds
      initialScale={1}
      minScale={0.25}
      maxScale={3}
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
        contentClass="flex items-center justify-center"
      >
        {childWithRef}
      </TransformComponent>
    </TransformWrapper>
  );
};

export default PanZoom;
