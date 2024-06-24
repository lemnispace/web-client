"use client";
import useMediaQuery from "@/utils/hooks/useMediaQuery";
import { useEffect } from "react";
import {
  ReactZoomPanPinchContentRef,
  ReactZoomPanPinchProps,
  TransformComponent,
  TransformWrapper,
  useControls,
} from "react-zoom-pan-pinch";

interface PanZoomProps
  extends Omit<ReactZoomPanPinchProps, "pinch" | "initialScale"> {
  children: React.ReactNode;
  wrapperStyle?: React.CSSProperties;
  controlsRef?: React.MutableRefObject<ReactZoomPanPinchContentRef | null>;
}

interface PanZoomChildProps {
  children: React.ReactNode;
  wrapperStyle?: React.CSSProperties;
  controlsRef?: React.MutableRefObject<ReactZoomPanPinchContentRef | null>;
}

const PanZoomChild = ({ controlsRef, ...props }: PanZoomChildProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const controls = useControls();
  useEffect(() => {
    if (controlsRef) {
      controlsRef.current = controls;
    }
  }, [controlsRef, controls]);
  // zoom out on mobile
  useEffect(() => {
    if (isMobile) {
      controls.resetTransform();
    }
  }, [isMobile, controls]);

  return (
    <TransformComponent
      wrapperStyle={{
        width: "100%",
        height: "auto",
        maxHeight: "100%",
        overflow: isMobile ? "auto" : "hidden",
        ...props.wrapperStyle,
      }}
    >
      {props.children}
    </TransformComponent>
  );
};

const PanZoom = ({
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
}: PanZoomProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <TransformWrapper
      centerZoomedOut
      centerOnInit
      limitToBounds
      minScale={0.25}
      maxScale={3}
      disabled={isMobile || disabled}
      {...props}
      initialScale={1}
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
      pinch={{
        disabled: true,
      }}
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
      <PanZoomChild wrapperStyle={wrapperStyle} controlsRef={controlsRef}>
        {children}
      </PanZoomChild>
    </TransformWrapper>
  );
};
export default PanZoom;
